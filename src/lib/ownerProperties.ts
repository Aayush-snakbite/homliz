import { Property, OwnerPropertyStatus } from '@/types/property';
import { GORAKHPUR_PROPERTIES } from '@/data/properties';
import { IMAGES } from '@/lib/images';

const OWNER_STORAGE_KEY = 'homliz_owner_properties_v1';

export const isApprovedStatus = (status?: OwnerPropertyStatus): boolean => {
  if (!status) return true; // Legacy seed properties are approved by default
  const lower = status.toLowerCase();
  return lower === 'approved' || lower === 'published';
};

export const isPendingStatus = (status?: OwnerPropertyStatus): boolean => {
  if (!status) return false;
  const lower = status.toLowerCase();
  return lower === 'pending review' || lower === 'pending';
};

export const isRejectedStatus = (status?: OwnerPropertyStatus): boolean => {
  if (!status) return false;
  const lower = status.toLowerCase();
  return lower === 'rejected';
};

export const ownerPropertiesService = {
  // Get all custom owner properties stored in localStorage
  getStoredProperties(): Property[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(OWNER_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Save stored properties back to localStorage
  saveStoredProperties(list: Property[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(OWNER_STORAGE_KEY, JSON.stringify(list));
  },

  // Get properties belonging to a specific owner
  getOwnerProperties(ownerId: string): Property[] {
    const customProps = this.getStoredProperties().filter(
      (p) => p.ownerId === ownerId
    );

    // Initial demo properties assigned to Demo Owner if ownerId matches 'user-owner-202'
    const demoOwnerProps =
      ownerId === 'user-owner-202'
        ? GORAKHPUR_PROPERTIES.slice(0, 4).map((p) => ({
            ...p,
            ownerId: 'user-owner-202',
            status: (p.status || 'Approved') as Property['status'],
          }))
        : [];

    // Avoid duplicate IDs
    const customIds = new Set(customProps.map((p) => p.id));
    const filteredDemo = demoOwnerProps.filter((p) => !customIds.has(p.id));

    return [...customProps, ...filteredDemo];
  },

  // Find single owner property by ID
  getOwnerPropertyById(id: string, ownerId: string): Property | null {
    const all = this.getOwnerProperties(ownerId);
    return all.find((p) => p.id === id) || null;
  },

  // Add a brand new owner listing (starts as Pending Review)
  addOwnerProperty(
    propertyData: Omit<Property, 'id' | 'createdAt'>,
    ownerId: string
  ): Property {
    const newProperty: Property = {
      ...propertyData,
      id: `prop-owner-${Date.now()}`,
      ownerId,
      status: 'Pending Review',
      image: propertyData.image || IMAGES.properties.p1,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const currentList = this.getStoredProperties();
    const updated = [newProperty, ...currentList];
    this.saveStoredProperties(updated);

    return newProperty;
  },

  // Update existing owner listing (reverts status to Pending Review for re-moderation)
  updateOwnerProperty(
    id: string,
    updatedData: Partial<Property>,
    ownerId: string
  ): Property | null {
    const list = this.getStoredProperties();
    const index = list.findIndex((p) => p.id === id && p.ownerId === ownerId);

    if (index !== -1) {
      const updatedItem: Property = {
        ...list[index],
        ...updatedData,
        id,
        ownerId,
        status: 'Pending Review', // Rule: edited property reverts to Pending Review
        rejectionReason: undefined,
      };
      list[index] = updatedItem;
      this.saveStoredProperties(list);
      return updatedItem;
    }

    // If updating a demo property for owner 'user-owner-202' for the first time
    const demoMatch = GORAKHPUR_PROPERTIES.find((p) => p.id === id);
    if (demoMatch && ownerId === 'user-owner-202') {
      const newOverride: Property = {
        ...demoMatch,
        ...updatedData,
        id,
        ownerId,
        status: 'Pending Review',
        rejectionReason: undefined,
      };
      const updated = [newOverride, ...list];
      this.saveStoredProperties(updated);
      return newOverride;
    }

    return null;
  },

  // Admin moderation: Approve property
  approveProperty(id: string): Property | null {
    const list = this.getStoredProperties();
    const index = list.findIndex((p) => p.id === id);

    if (index !== -1) {
      list[index].status = 'Approved';
      delete list[index].rejectionReason;
      this.saveStoredProperties(list);
      return list[index];
    }

    // If approving a demo seed property that wasn't in custom list yet
    const demoMatch = GORAKHPUR_PROPERTIES.find((p) => p.id === id);
    if (demoMatch) {
      const override: Property = {
        ...demoMatch,
        status: 'Approved',
      };
      const updated = [override, ...list];
      this.saveStoredProperties(updated);
      return override;
    }

    return null;
  },

  // Admin moderation: Reject property
  rejectProperty(id: string, reason?: string): Property | null {
    const list = this.getStoredProperties();
    const index = list.findIndex((p) => p.id === id);

    if (index !== -1) {
      list[index].status = 'Rejected';
      if (reason) {
        list[index].rejectionReason = reason;
      }
      this.saveStoredProperties(list);
      return list[index];
    }

    // If rejecting a demo seed property
    const demoMatch = GORAKHPUR_PROPERTIES.find((p) => p.id === id);
    if (demoMatch) {
      const override: Property = {
        ...demoMatch,
        status: 'Rejected',
        rejectionReason: reason,
      };
      const updated = [override, ...list];
      this.saveStoredProperties(updated);
      return override;
    }

    return null;
  },
};
