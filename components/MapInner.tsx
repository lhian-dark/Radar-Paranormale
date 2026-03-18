'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

interface Place {
  id: number | string;
  lat: number;
  lng: number;
  name: string;
  category: string;
  distanceKm: number;
  isUserPlace?: boolean;
  isFamous?: boolean;
}

interface Props {
  userLat: number;
  userLng: number;
  places: Place[];
  onSelectPlace: (id: number | string) => void;
  onMapMove?: (lat: number, lng: number) => void;
  selectedId?: number | string | null;
}

function MapEvents({ onMapMove }: { onMapMove?: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      if (onMapMove) onMapMove(center.lat, center.lng);
    },
  });
  return null;
}

const userIcon = L.divIcon({
// ... (rest of the file follows)
  className: '',
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#a855f7;border:3px solid white;box-shadow:0 0 15px #a855f7;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const placeIcon = (isUser: boolean, isFamous: boolean, selected: boolean) =>
  L.divIcon({
    className: '',
    html: `<div style="
      font-size:${selected ? '28px' : '22px'};
      filter:drop-shadow(0 0 ${selected ? '10px' : '5px'} ${isFamous ? '#ff4d4d' : '#a855f7'});
      transition:all 0.2s;
      transform:${selected ? 'scale(1.3)' : 'scale(1)'};
    ">${isUser ? '📍' : isFamous ? '💀' : '👻'}</div>`,
    iconSize: [selected ? 36 : 28, selected ? 36 : 28],
    iconAnchor: [selected ? 18 : 14, selected ? 18 : 14],
  });

function FlyToSelected({ places, selectedId }: { places: Place[]; selectedId?: number | string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const p = places.find((p) => p.id === selectedId);
    if (p) map.flyTo([p.lat, p.lng], 14, { duration: 1 });
  }, [selectedId, places, map]);
  return null;
}

export default function MapInner({ userLat, userLng, places, onSelectPlace, onMapMove, selectedId }: Props) {
  return (
    <MapContainer
      center={[userLat, userLng]}
      zoom={10}
      style={{ width: '100%', height: '100%', borderRadius: '12px' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* User position */}
      <Marker position={[userLat, userLng]} icon={userIcon}>
        <Popup>
          <div className="text-black font-bold">📡 La tua posizione</div>
        </Popup>
      </Marker>

      {/* Range circle */}
      <Circle
        center={[userLat, userLng]}
        radius={100000}
        pathOptions={{ color: '#a855f7', fillColor: '#a855f7', fillOpacity: 0.04, weight: 1, dashArray: '6,6' }}
      />

      {/* Place markers */}
      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={placeIcon(!!p.isUserPlace, !!p.isFamous, p.id === selectedId)}
          eventHandlers={{ click: () => onSelectPlace(p.id) }}
        >
          <Popup>
            <div style={{ minWidth: 160 }}>
              <strong>{p.name}</strong>
              <br />
              <small style={{ color: '#666' }}>{p.distanceKm} km da te</small>
            </div>
          </Popup>
        </Marker>
      ))}

      <FlyToSelected places={places} selectedId={selectedId} />
      <MapEvents onMapMove={onMapMove} />
    </MapContainer>
  );
}
