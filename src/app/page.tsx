"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Event } from './types'; // Assuming you have a type definition for Event
import EventForm from './components/EventForm';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { eventSchema } from './models/eventModel';
import { collection, addDoc } from 'firebase/firestore';
import { z } from 'zod';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Map = dynamic(() => import('./components/Map'), { ssr: false });

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAddEvent = async (
    newEvent: Omit<Event, 'coordinates'>,
    mapEventDetails?: Event
  ) => {
    try {
      if (!mapEventDetails?.coordinates) {
        setError('Please select a location using the map search bar.');
        return;
      }

      // Merge location and coordinates from map's event details
      const eventWithLocationAndCoordinates = {
        ...newEvent,
        location: newEvent.location || mapEventDetails.location || 'Unknown Location',
        coordinates: mapEventDetails.coordinates,
      };

      // Validate the event data using Zod
      const validatedEvent = eventSchema.parse(eventWithLocationAndCoordinates);

      // Save the validated event to Firestore
      const docRef = await addDoc(collection(db, 'events'), validatedEvent);
      console.log('Event added with ID:', docRef.id);

      setEvents((prevEvents) => [
        ...prevEvents,
        { ...validatedEvent, id: typeof docRef.id === 'string' ? parseInt(docRef.id, 10) : docRef.id },
      ]);
      setError(null); // Clear any previous errors
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        console.error('Error adding event:', error);
      }
    }
  };
}
