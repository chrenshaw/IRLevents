'use client'

import { useState, useEffect } from 'react';

interface EventFormProps {
  onAddEvent: (event: {
    name: string;
    location: string;
    date: string;
  }) => void;
}

export default function EventForm({ onAddEvent }: EventFormProps) {
  // ...existing code...
}