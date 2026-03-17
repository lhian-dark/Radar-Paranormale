'use client';

import { getCategoryEmoji, getCategoryLabel } from '@/lib/descriptions';

interface Place {
  id: number | string;
  name: string;
  category: string;
  description: string;
  distanceKm: number;
  lat: number;
  lng: number;
  isUserPlace?: boolean;
  userName?: string;
  isFamous?: boolean;
}

interface Props {
  luoghi: Place[];
  selectedId?: number | string | null;
  onSelect: (id: number | string) => void;
  loading: boolean;
}

export default function LuoghiList({ luoghi, selectedId, onSelect, loading }: Props) {
  if (loading && luoghi.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-purple-950/30 rounded-xl p-6 border border-purple-900/30">
            <div className="h-4 bg-purple-900/50 rounded w-2/3 mb-3" />
            <div className="h-3 bg-purple-900/30 rounded w-full mb-2" />
            <div className="h-3 bg-purple-900/30 rounded w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  if (luoghi.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-50">
        <span className="text-6xl mb-4">🔮</span>
        <p className="text-purple-300 italic">Nessun luogo rilevato. Attivazione radar in corso...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {luoghi.map((p) => {
        const isSelected = p.id === selectedId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`text-left rounded-xl p-5 border transition-all duration-200 cursor-pointer group ${
              isSelected
                ? 'bg-purple-900/60 border-purple-500 shadow-lg shadow-purple-900/40'
                : 'bg-purple-950/30 border-purple-900/30 hover:border-purple-700/60 hover:bg-purple-900/30'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xl shrink-0">
                  {p.isFamous ? '💀' : getCategoryEmoji(p.category)}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-white truncate text-sm leading-tight">{p.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-purple-400">
                      {p.isFamous ? 'Mistero Celebre' : getCategoryLabel(p.category)}
                    </span>
                    {p.isFamous && (
                      <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded-full border border-red-700/50 animate-pulse uppercase tracking-wider font-bold">
                        Élite
                      </span>
                    )}
                    {p.isUserPlace && (
                      <span className="text-[10px] bg-amber-900/50 text-amber-400 px-2 py-0.5 rounded-full border border-amber-700/50">
                        👤 {p.userName || 'Utente'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs font-bold text-purple-300">📏 {p.distanceKm} km</div>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4">
              {p.description}
            </p>

            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-center py-2 bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 text-xs font-bold rounded-lg border border-purple-700/30 transition-all"
              >
                🗺️ Maps
              </a>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(p.name + ' leggende misteri')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-center py-2 bg-blue-900/40 hover:bg-blue-900/60 text-blue-200 text-xs font-bold rounded-lg border border-blue-700/30 transition-all"
              >
                🔎 Cerca Misteri
              </a>
            </div>
          </button>
        );
      })}
    </div>
  );
}
