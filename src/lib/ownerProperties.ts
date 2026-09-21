import { Property } from '@/types/property';
import { GORAKHPUR_PROPERTIES } from '@/data/properties';
import { IMAGES } from '@/lib/images';

const OWNER_STORAGE_KEY = 'homliz_owner_properties_v1';

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
            status: (p.status || 'Published') as Property['status'],
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

  // Add a brand new owner listing
  addOwnerProperty(
    propertyData: Omit<Property, 'id' | 'createdAt'>,
    ownerId: string
  ): Property {
    const newProperty: Property = {
      ...propertyData,
      id: `prop-owner-${Date.now()}`,
      ownerId,
      status: propertyData.status || 'Pending Review',
      image: propertyData.image || IMAGES.properties.p1,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const currentList = this.getStoredProperties();
    const updated = [newProperty, ...currentList];
    this.saveStoredProperties(updated);

    return newProperty;
  },

  // Update existing owner listing
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
        status: (updatedData.status || demoMatch.status || 'Published') as Property['status'],
      };
      const updated = [newOverride, ...list];
      this.saveStoredProperties(updated);
      return newOverride;
    }

    return null;
  },
};
