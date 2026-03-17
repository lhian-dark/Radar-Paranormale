'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import LuoghiList from '@/components/LuoghiList';
import AddPlaceForm from '@/components/AddPlaceForm';
import { loginGoogle, getSession, logout, getUserPlaces } from '@/lib/appwrite';
import { generateDescription } from '@/lib/descriptions';
import { MISTERI_FAMOSI } from '@/lib/data/misteri_famosi';

const RadarMap = dynamic(() => import('@/components/RadarMap'), { ssr: false });

interface Place {
  id: number | string;
  name: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  distanceKm: number;
  isUserPlace?: boolean;
  userName?: string;
  isFamous?: boolean;
}

type AppState = 'idle' | 'locating' | 'loading' | 'ready' | 'error';

export default function HomePage() {
  const [state, setState] = useState<AppState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [luoghi, setLuoghi] = useState<Place[]>([]);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Auth check
  useEffect(() => {
    getSession().then(setUser);
  }, []);

  // Auto-geolocate on load
  useEffect(() => {
    startLocating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLocating = useCallback(() => {
    setState('locating');
    setErrorMsg('');
    if (!navigator.geolocation) {
      setState('error');
      setErrorMsg('Geolocalizzazione non supportata dal browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserPos({ lat, lng });
        loadLuoghi(lat, lng);
      },
      (err) => {
        setState('error');
        setErrorMsg(
          err.code === 1
            ? 'Permesso GPS negato. Abilita la posizione nelle impostazioni del browser.'
            : 'Impossibile ottenere la posizione. Riprova.'
        );
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, []);

  const loadLuoghi = async (lat: number, lng: number) => {
    setState('loading');
    
    // 1. CALCOLO ISTANTANEO FAMOSI
    const famousLuoghi: Place[] = MISTERI_FAMOSI.map((p) => {
      const R = 6371;
      const dLat = ((p.lat - lat) * Math.PI) / 180;
      const dLng = ((p.lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((p.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const dist = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;

      return {
        id: `famous-${p.id}`,
        name: p.name,
        description: p.description,
        category: p.category,
        lat: p.lat,
        lng: p.lng,
        distanceKm: dist,
        isFamous: true,
      };
    }).filter(p => p.distanceKm <= 100);

    const initialPlaces = famousLuoghi.sort((a,b) => a.distanceKm - b.distanceKm);
    setLuoghi(initialPlaces);
    
    // DIAGNOSTICA IN CONSOLE
    console.log(`📡 RADAR SCAN: Found ${initialPlaces.length} Famous Mysteries nearby.`);
    if (initialPlaces.length > 0) {
      console.log(`🔝 Top 3 Famous:`, initialPlaces.slice(0, 3).map(p => p.name));
    }

    // 2. SCANSIONE IBRIDA ASINCRONA (OSM + User)
    try {
      const [osmRes, userPlacesData] = await Promise.all([
        fetch(`/api/luoghi?lat=${lat}&lng=${lng}&raggio=100`)
          .then(r => r.json())
          .catch(e => ({ error: e.message, luoghi: [] })),
        getUserPlaces(lat, lng, 100).catch(() => [])
      ]);

      const osmLuoghi: Place[] = ((osmRes as any)?.luoghi || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || generateDescription(p),
        category: p.category,
        lat: p.lat,
        lng: p.lng,
        distanceKm: p.distanceKm,
      }));

      const userLuoghi: Place[] = ((userPlacesData as any) || []).map((p: any) => {
        const R = 6371;
        const dLat = ((p.lat - lat) * Math.PI) / 180;
        const dLng = ((p.lng - lng) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat * Math.PI) / 180) * Math.cos((p.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
        const dist = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
        return {
          id: `user-${p.$id}`,
          name: p.name,
          description: p.description,
          category: p.category,
          lat: p.lat,
          lng: p.lng,
          distanceKm: dist,
          isUserPlace: true,
          userName: p.userName,
        };
      });

      console.log(`✅ SCAN FINISHED: OSM(${osmLuoghi.length}) User(${userLuoghi.length}) Elite(${initialPlaces.length})`);

      // Uniamo tutto assicurandoci che i Famosi (initialPlaces) siano INCLUSI
      const totalCombined = [...userLuoghi, ...initialPlaces, ...osmLuoghi]
        .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) // Rimuovi eventuali duplicati di ID
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 150); // Limite per non saturare la mappa

      setLuoghi(totalCombined);
      setState('ready');
    } catch (err) {
      console.error("❌ Hybrid scan failed:", err);
      // Fallback: mostriamo ciò che abbiamo (i famosi iniziali)
      setState('ready');
    }
  };

  const handleSelectPlace = (id: number | string) => {
    setSelectedId(id);
    // Scroll to item in list
    setTimeout(() => {
      const el = listRef.current?.querySelector(`[data-id="${id}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    if (userPos) loadLuoghi(userPos.lat, userPos.lng);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0008]">
      {/* HEADER */}
      <header className="shrink-0 border-b border-purple-900/50 bg-[#0f0015]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔮</span>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Radar Paranormale</h1>
            <p className="text-xs text-purple-400 hidden sm:block">
              {state === 'ready' 
                ? `🎯 ${luoghi.filter(p=>p.isFamous).length} Élite · 👻 ${luoghi.filter(p=>!p.isFamous && !p.isUserPlace).length} OSM · 🏳️ 100km` 
                : '📡 Scansione frequenze in corso...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                {user.prefs?.avatar && (
                  <img src={user.prefs.avatar} alt="" className="w-7 h-7 rounded-full border border-purple-600" />
                )}
                <span className="text-sm text-purple-300 max-w-[120px] truncate">{user.name}</span>
              </div>
              <button
                onClick={async () => { await logout(); setUser(null); }}
                className="text-xs text-purple-400 hover:text-white border border-purple-800/50 hover:border-purple-600 px-3 py-1.5 rounded-full transition-colors"
              >
                Esci
              </button>
            </>
          ) : (
            <button
              onClick={loginGoogle}
              className="flex items-center gap-2 text-sm bg-white hover:bg-gray-100 text-gray-800 font-semibold px-4 py-2 rounded-full transition-colors shadow"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Accedi con Google
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* MAP */}
        <div className="h-[45vh] md:h-full md:flex-1 relative bg-purple-950/20">
          {state === 'locating' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0a0008]/80">
              <div className="text-5xl mb-4 radar-pulse">📡</div>
              <p className="text-purple-300 text-lg italic animate-pulse">Acquisizione posizione...</p>
            </div>
          )}
          {state === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0a0008]/90 px-8 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-red-400 mb-4">{errorMsg}</p>
              <button
                onClick={startLocating}
                className="px-6 py-3 bg-purple-800 hover:bg-purple-700 text-white rounded-full font-bold transition-colors mb-3"
              >
                🔄 Riprova
              </button>
              <button
                onClick={() => {
                  const demoLat = 43.7167; // Toscana/Centro Italia
                  const demoLng = 10.6167;
                  setUserPos({ lat: demoLat, lng: demoLng });
                  loadLuoghi(demoLat, demoLng);
                }}
                className="text-xs text-purple-400 underline hover:text-purple-200 transition-colors"
              >
                Usa posizione predefinita per test (Toscana)
              </button>
            </div>
          )}
          {userPos && (
            <RadarMap
              userLat={userPos.lat}
              userLng={userPos.lng}
              places={luoghi}
              onSelectPlace={handleSelectPlace}
              selectedId={selectedId}
            />
          )}
        </div>

        {/* SIDEBAR */}
        <div className="flex flex-col md:w-96 md:border-l border-purple-900/40 overflow-hidden">
          {/* Sidebar header */}
          <div className="shrink-0 px-4 py-3 border-b border-purple-900/40 flex items-center justify-between bg-[#0f0015]/60">
            <div>
              <p className="text-sm font-semibold text-white">
                {state === 'loading' ? '⏳ Ricerca in corso...' : state === 'ready' ? `👻 ${luoghi.length} Luoghi Rilevati` : '🔮 Radar Paranormale'}
              </p>
              {userPos && (
                <p className="text-xs text-purple-500 font-mono">{userPos.lat.toFixed(3)}, {userPos.lng.toFixed(3)}</p>
              )}
            </div>
            {state !== 'idle' && state !== 'locating' && (
              <button
                onClick={startLocating}
                className="text-xs text-purple-400 hover:text-purple-200 border border-purple-800/50 px-3 py-1.5 rounded-full transition-colors"
              >
                🔄 Aggiorna
              </button>
            )}
          </div>

          {/* List */}
          <div ref={listRef} className="flex-1 overflow-y-auto">
            <LuoghiList
              luoghi={luoghi}
              selectedId={selectedId}
              onSelect={handleSelectPlace}
              loading={state === 'loading' || state === 'locating'}
            />
          </div>
        </div>
      </div>

      {/* FAB — Add place button */}
      {user && userPos && state === 'ready' && (
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl shadow-purple-900/60 transition-all hover:scale-105 active:scale-95"
        >
          🎥 Aggiungi luogo vicino
        </button>
      )}

      {!user && userPos && state === 'ready' && (
        <button
          onClick={loginGoogle}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-semibold px-5 py-3.5 rounded-full shadow-xl border border-purple-700/50 transition-all hover:scale-105"
        >
          👤 Accedi per aggiungere luoghi
        </button>
      )}

      {/* Add Place Modal */}
      {showAddForm && userPos && user && (
        <AddPlaceForm
          userLat={userPos.lat}
          userLng={userPos.lng}
          userId={user.$id}
          userName={user.name || 'Anonimo'}
          onSuccess={handleAddSuccess}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
