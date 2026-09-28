-- HOMLIZ Database Row Level Security (RLS) Policies Migration
-- Migration: 002_rls_policies.sql
-- Description: Enforces secure role-based access control (RLS) across all application tables.

-- ============================================================================
-- 1. SECURITY DEFINER HELPER FUNCTIONS (Avoids Recursive Policy Evaluation Loops)
-- ============================================================================

-- Safely lookup user role without triggering RLS policy recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Safely check if authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'::public.user_role
    );
$$;

-- Safely check if authenticated user is property owner or admin
CREATE OR REPLACE FUNCTION public.is_property_owner(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND (role = 'property_owner'::public.user_role OR role = 'admin'::public.user_role)
    );
$$;

-- ============================================================================
-- 2. POLICIES FOR PROFILES TABLE
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own_or_admin" ON public.profiles;

-- SELECT: Users can read their own profile, admins can read all profiles, or public can read approved property owners
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
FOR SELECT
USING (
    auth.uid() = id
    OR public.is_admin(auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.owner_id = profiles.id AND properties.status = 'approved'::public.property_status
    )
);

-- INSERT: User profile creation (strictly tenant role on client signup)
CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT
WITH CHECK (
    auth.uid() = id
    AND (
        role = 'tenant'::public.user_role
        OR public.is_admin(auth.uid())
    )
);

-- UPDATE: Users can update their own profile fields, but CANNOT escalate their role to admin/owner
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE
USING (
    auth.uid() = id OR public.is_admin(auth.uid())
)
WITH CHECK (
    (
        auth.uid() = id
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    )
    OR public.is_admin(auth.uid())
);

-- DELETE: Users can delete their own profile, or admin can delete
CREATE POLICY "profiles_delete_own_or_admin" ON public.profiles
FOR DELETE
USING (
    auth.uid() = id OR public.is_admin(auth.uid())
);

-- ============================================================================
-- 3. POLICIES FOR PROPERTIES TABLE
-- ============================================================================

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "properties_select_public_owner_admin" ON public.properties;
DROP POLICY IF EXISTS "properties_insert_owner_or_admin" ON public.properties;
DROP POLICY IF EXISTS "properties_update_owner_or_admin" ON public.properties;
DROP POLICY IF EXISTS "properties_delete_owner_or_admin" ON public.properties;

-- SELECT: Public can read APPROVED properties. Owners can read all their own properties. Admins read all.
CREATE POLICY "properties_select_public_owner_admin" ON public.properties
FOR SELECT
USING (
    status = 'approved'::public.property_status
    OR owner_id = auth.uid()
    OR public.is_admin(auth.uid())
);

-- INSERT: Property owners or admins can create properties. New owner listings default to pending.
CREATE POLICY "properties_insert_owner_or_admin" ON public.properties
FOR INSERT
WITH CHECK (
    auth.uid() = owner_id
    AND (public.is_property_owner(auth.uid()) OR public.is_admin(auth.uid()))
    AND (
        status = 'pending'::public.property_status
        OR public.is_admin(auth.uid())
    )
);

-- UPDATE: Owners can update their own property (edits automatically revert status to pending). Admins can update status.
CREATE POLICY "properties_update_owner_or_admin" ON public.properties
FOR UPDATE
USING (
    owner_id = auth.uid() OR public.is_admin(auth.uid())
)
WITH CHECK (
    (
        owner_id = auth.uid()
        AND (
            status = 'pending'::public.property_status
            OR public.is_admin(auth.uid())
        )
    )
    OR public.is_admin(auth.uid())
);

-- DELETE: Owner can delete their own property, or admin can delete
CREATE POLICY "properties_delete_owner_or_admin" ON public.properties
FOR DELETE
USING (
    owner_id = auth.uid() OR public.is_admin(auth.uid())
);

-- ============================================================================
-- 4. POLICIES FOR PROPERTY IMAGES TABLE
-- ============================================================================

ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "property_images_select" ON public.property_images;
DROP POLICY IF EXISTS "property_images_insert" ON public.property_images;
DROP POLICY IF EXISTS "property_images_update" ON public.property_images;
DROP POLICY IF EXISTS "property_images_delete" ON public.property_images;

-- SELECT: Images visible if property is approved, owned by user, or user is admin
CREATE POLICY "property_images_select" ON public.property_images
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = property_images.property_id
        AND (
            properties.status = 'approved'::public.property_status
            OR properties.owner_id = auth.uid()
            OR public.is_admin(auth.uid())
        )
    )
);

-- INSERT: Only property owner or admin can attach images to a property
CREATE POLICY "property_images_insert" ON public.property_images
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = property_images.property_id
        AND (properties.owner_id = auth.uid() OR public.is_admin(auth.uid()))
    )
);

-- UPDATE: Only property owner or admin can update images
CREATE POLICY "property_images_update" ON public.property_images
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = property_images.property_id
        AND (properties.owner_id = auth.uid() OR public.is_admin(auth.uid()))
    )
);

-- DELETE: Only property owner or admin can delete images
CREATE POLICY "property_images_delete" ON public.property_images
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = property_images.property_id
        AND (properties.owner_id = auth.uid() OR public.is_admin(auth.uid()))
    )
);

-- ============================================================================
-- 5. POLICIES FOR FAVORITES TABLE (Saved Properties Wishlist)
-- ============================================================================

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_select_own_or_admin" ON public.favorites;
DROP POLICY IF EXISTS "favorites_insert_own" ON public.favorites;
DROP POLICY IF EXISTS "favorites_delete_own" ON public.favorites;

-- SELECT: Users can view ONLY their own favorites (or admin)
CREATE POLICY "favorites_select_own_or_admin" ON public.favorites
FOR SELECT
USING (
    user_id = auth.uid() OR public.is_admin(auth.uid())
);

-- INSERT: Users can add ONLY their own favorites
CREATE POLICY "favorites_insert_own" ON public.favorites
FOR INSERT
WITH CHECK (
    user_id = auth.uid()
);

-- DELETE: Users can remove ONLY their own favorites
CREATE POLICY "favorites_delete_own" ON public.favorites
FOR DELETE
USING (
    user_id = auth.uid() OR public.is_admin(auth.uid())
);

-- ============================================================================
-- 6. POLICIES FOR ENQUIRIES TABLE
-- ============================================================================

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "enquiries_select_tenant_owner_admin" ON public.enquiries;
DROP POLICY IF EXISTS "enquiries_insert_tenant" ON public.enquiries;
DROP POLICY IF EXISTS "enquiries_update_owner_or_admin" ON public.enquiries;
DROP POLICY IF EXISTS "enquiries_delete_tenant_or_admin" ON public.enquiries;

-- SELECT: Tenant sees their own enquiries, Owner sees enquiries on their properties, Admin sees all
CREATE POLICY "enquiries_select_tenant_owner_admin" ON public.enquiries
FOR SELECT
USING (
    tenant_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = enquiries.property_id
        AND properties.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
);

-- INSERT: Authenticated users can submit enquiries for themselves (status defaults to pending)
CREATE POLICY "enquiries_insert_tenant" ON public.enquiries
FOR INSERT
WITH CHECK (
    tenant_id = auth.uid()
    AND status = 'pending'::public.enquiry_status
);

-- UPDATE: Property owners & admins can update status (e.g. contacted/closed). Tenants can update message.
CREATE POLICY "enquiries_update_owner_or_admin" ON public.enquiries
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = enquiries.property_id
        AND properties.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
    OR tenant_id = auth.uid()
)
WITH CHECK (
    (
        EXISTS (
            SELECT 1 FROM public.properties
            WHERE properties.id = enquiries.property_id
            AND properties.owner_id = auth.uid()
        )
        OR public.is_admin(auth.uid())
    )
    OR (
        tenant_id = auth.uid()
        AND status = (SELECT status FROM public.enquiries WHERE id = enquiries.id)
    )
);

-- DELETE: Tenant can delete their own enquiry, or admin can delete
CREATE POLICY "enquiries_delete_tenant_or_admin" ON public.enquiries
FOR DELETE
USING (
    tenant_id = auth.uid() OR public.is_admin(auth.uid())
);
