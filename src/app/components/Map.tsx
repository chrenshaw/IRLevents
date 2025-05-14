'use client'

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface Event {
  id: number;
  name: string;
  location: string;
  date: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function Map({ onPlaceSelected }: { onPlaceSelected: (event: Event) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [eventDetails, setEventDetails] = useState<Event | null>(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      console.log('Google Maps API Key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

      if (window.google) {
        setIsMapLoaded(true);
        return;
      }

      const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => setIsMapLoaded(true));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setIsMapLoaded(true);
      script.onerror = () => console.error('Failed to load Google Maps script');
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 39.3989, lng: -84.558 },
      zoom: 14,
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search for a location';
    input.style.position = 'absolute';
    input.style.top = '20px';
    input.style.left = '10px';
    input.style.zIndex = '5';
    input.style.padding = '10px';
    input.style.width = '300px';
    input.style.backgroundColor = 'white';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '4px';
    input.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    input.style.fontSize = '14px';
    input.style.color = 'black';
    input.style.fontWeight = 'bold';

    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    const marker = new window.google.maps.Marker({
      map,
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.warn('No details available for input: ' + place.name);
        return;
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      // Emit the selected place details to the parent component
      onPlaceSelected({
        id: Date.now(),
        name: place.name || 'Unknown Place',
        location: place.formatted_address || 'Unknown Address',
        date: new Date().toISOString(),
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      });

      const event = {
        id: Date.now(),
        name: place.name || 'Unknown Place',
        location: place.formatted_address || 'Unknown Address',
        date: new Date().toISOString(),
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      };

      setEventDetails(event);
    });

    if (eventDetails && marker) {
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><h3>${eventDetails.name}</h3><p>${eventDetails.location}</p><p>${eventDetails.date}</p></div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      marker.setPosition({
        lat: eventDetails.coordinates.lat,
        lng: eventDetails.coordinates.lng,
      });
      marker.setVisible(true);
    }
  }, [isMapLoaded, eventDetails]);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
}