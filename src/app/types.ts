export interface Event {
  id: number; // Ensure `id` is always defined as a number
  name: string;
  title?: string; // Optional for compatibility
  description?: string;
  date: string;
  location: string | {
    lat?: number; // Optional for new events
    lng?: number; // Optional for new events
    address?: string; // Optional for compatibility
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}