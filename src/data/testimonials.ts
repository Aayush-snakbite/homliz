export interface Testimonial {
  id: string;
  name: string;
  role: string;
  locality: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  isDemo?: boolean;
}

export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Rajesh Srivastava',
    role: 'Property Owner',
    locality: 'Civil Lines, Gorakhpur',
    quote: 'HOMLIZ made it seamless to find a trustworthy tenant for my 3 BHK apartment in Civil Lines without dealing with unverified callers.',
    rating: 5,
    isDemo: true,
  },
  {
    id: 'test-2',
    name: 'Dr. Ananya Pandey',
    role: 'Tenant (Resident Doctor)',
    locality: 'Medical Road, Gorakhpur',
    quote: 'Finding a clean flat near BRD Medical College was so quick on HOMLIZ. The local filter for Gorakhpur saved me days of searching on foot.',
    rating: 5,
    isDemo: true,
  },
  {
    id: 'test-3',
    name: 'Vikas Agarwal',
    role: 'Retail Business Owner',
    locality: 'Golghar, Gorakhpur',
    quote: 'As a local retailer, getting exact commercial shop details with authentic photos in Golghar was refreshing. Highly recommended platform.',
    rating: 5,
    isDemo: true,
  },
];
