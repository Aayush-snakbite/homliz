import { Property } from '@/types/property';
import { SavedProperty, PropertyEnquiry } from '@/types/tenant';
import { GORAKHPUR_PROPERTIES } from '@/data/properties';
import { ownerPropertiesService } from './ownerProperties';

const SAVED_PROPERTIES_KEY = 'homliz_saved_properties_v1';
const ENQUIRIES_KEY = 'homliz_enquiries_v1';

export const tenantDataService = {
  // Combine demo properties and custom owner properties
  getAllProperties(): Property[] {
    const customProps = ownerPropertiesService.getStoredProperties();
    const customIds = new Set(customProps.map((p) => p.id));
    const demoFiltered = GORAKHPUR_PROPERTIES.filter((p) => !customIds.has(p.id));
    return [...customProps, ...demoFiltered];
  },

  // Find a single property by ID across all sources
  getPropertyById(id: string): Property | null {
    const all = this.getAllProperties();
    return all.find((p) => p.id === id) || null;
  },

  // === SAVED / FAVORITE PROPERTIES ===

  getStoredSavedItems(): SavedProperty[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SAVED_PROPERTIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveStoredSavedItems(list: SavedProperty[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(list));
  },

  getSavedPropertyIds(userId: string): string[] {
    if (!userId) return [];
    const list = this.getStoredSavedItems();
    return list.filter((item) => item.userId === userId).map((item) => item.propertyId);
  },

  isPropertySaved(userId: string, propertyId: string): boolean {
    if (!userId || !propertyId) return false;
    const ids = this.getSavedPropertyIds(userId);
    return ids.includes(propertyId);
  },

  toggleSavedProperty(userId: string, propertyId: string): boolean {
    if (!userId || !propertyId) return false;

    const list = this.getStoredSavedItems();
    const existingIndex = list.findIndex(
      (item) => item.userId === userId && item.propertyId === propertyId
    );

    let isSaved = false;

    if (existingIndex !== -1) {
      list.splice(existingIndex, 1);
      isSaved = false;
    } else {
      const newItem: SavedProperty = {
        id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userId,
        propertyId,
        createdAt: new Date().toISOString(),
      };
      list.unshift(newItem);
      isSaved = true;
    }

    this.saveStoredSavedItems(list);
    return isSaved;
  },

  removeSavedProperty(userId: string, propertyId: string): void {
    if (!userId || !propertyId) return;
    const list = this.getStoredSavedItems();
    const updated = list.filter(
      (item) => !(item.userId === userId && item.propertyId === propertyId)
    );
    this.saveStoredSavedItems(updated);
  },

  getSavedProperties(userId: string): Property[] {
    if (!userId) return [];
    const savedIds = this.getSavedPropertyIds(userId);
    const allProps = this.getAllProperties();
    const map = new Map(allProps.map((p) => [p.id, p]));
    return savedIds.map((id) => map.get(id)).filter(Boolean) as Property[];
  },

  // === ENQUIRIES ===

  getStoredEnquiries(): PropertyEnquiry[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(ENQUIRIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveStoredEnquiries(list: PropertyEnquiry[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(list));
  },

  getTenantEnquiries(userId: string): PropertyEnquiry[] {
    if (!userId) return [];
    const list = this.getStoredEnquiries();
    return list
      .filter((e) => e.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addEnquiry(
    data: Omit<PropertyEnquiry, 'id' | 'status' | 'createdAt'>
  ): PropertyEnquiry {
    const newEnquiry: PropertyEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const current = this.getStoredEnquiries();
    const updated = [newEnquiry, ...current];
    this.saveStoredEnquiries(updated);

    return newEnquiry;
  },

  hasUserEnquired(userId: string, propertyId: string): boolean {
    if (!userId || !propertyId) return false;
    const list = this.getStoredEnquiries();
    return list.some((e) => e.userId === userId && e.propertyId === propertyId);
  },
};
