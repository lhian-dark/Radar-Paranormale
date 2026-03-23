'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

const MapComponent = dynamic(() => import('./MapInner'), { ssr: false });

interface Place {
  id: number | string;
  lat: number;
  lng: number;
  name: string;
  category: string;
  distanceKm: number;
  isUserPlace?: boolean;
}

interface RadarMapProps {
  userLat: number;
  userLng: number;
  places: Place[];
  onSelectPlace: (id: number | string) => void;
  onMapMove?: (lat: number, lng: number) => void;
  selectedId?: number | string | null;
  mapType?: 'street' | 'satellite';
  onToggleMapType?: () => void;
}

export default function RadarMap(props: RadarMapProps) {
  return <MapComponent {...props} />;
}
