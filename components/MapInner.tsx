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
  mapType?: 'street' | 'satellite';
  onToggleMapType?: () => void;
}

// Map events component to handle pans
function MapEvents({ onMapMove }: { onMapMove?: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      if (onMapMove) onMapMove(center.lat, center.lng);
    }
  });
  return null;
}

const userIcon = L.divIcon({
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

export default function MapInner({ userLat, userLng, places, onSelectPlace, onMapMove, selectedId, mapType = 'street', onToggleMapType }: Props) {
  return (
    <MapContainer
      center={[userLat, userLng]}
      zoom={10}
      style={{ width: '100%', height: '100%', borderRadius: '12px' }}
      zoomControl={true}
    >
      {mapType === 'street' ? (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      ) : (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
        />
      )}

      {/* Map Type Toggle Button */}
      <div className="leaflet-top leaflet-right" style={{ marginTop: '70px', marginRight: '10px' }}>
        <div className="leaflet-control leaflet-bar">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleMapType?.();
            }}
            title="Cambia vista"
            style={{
              backgroundColor: 'white',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              fontSize: '18px',
              borderRadius: '4px'
            }}
          >
            {mapType === 'street' ? '🛰️' : '🗺️'}
          </button>
        </div>
      </div>

      {/* User position */}
      <Marker position={[userLat, userLng]} icon={userIcon}>
        <Popup>
          <div className="text-black font-bold">📡 La tua posizione</div>
        </Popup>
      </Marker>


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

      <MapEvents onMapMove={onMapMove} />
    </MapContainer>
  );
}
