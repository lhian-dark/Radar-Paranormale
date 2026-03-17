'use client';

import { useState, useEffect } from 'react';
import { getDiscoveryCache, setDiscoveryCache } from '@/lib/appwrite';

interface Props {
  placeName: string;
  onClose: () => void;
}

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export default function InvestigationPanel({ placeName, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInvestigazione();
  }, [placeName]);

  async function loadInvestigazione() {
    setLoading(true);
    setError('');
    try {
      // 1. Controlla Cache
      const cache = await getDiscoveryCache(placeName);
      if (cache) {
        setResults(JSON.parse(cache.results));
        setLoading(false);
        return;
      }

      // 2. Se non in cache, scansiona Google
      const res = await fetch(`/api/scan?q=${encodeURIComponent(placeName)}`);
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data.results);
      
      // 3. Salva in Cache per il futuro
      if (data.results.length > 0) {
        await setDiscoveryCache(placeName, JSON.stringify(data.results));
      }
    } catch (err: any) {
      setError(err.message || 'Errore nella scansione web.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#0f0015] border border-blue-900/40 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl shadow-blue-900/30">
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-blue-950/20">
          <div>
            <h2 className="text-xl font-bold text-white">🔎 Analisi Investigativa</h2>
            <p className="text-xs text-blue-400 font-mono mt-1">{placeName}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl">&times;</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="space-y-4 py-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-center text-blue-300 italic animate-pulse">Scansione record digitali in corso...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-950/30 border border-red-900/50 p-6 rounded-2xl text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={loadInvestigazione} className="text-xs bg-red-900/30 hover:bg-red-900/50 px-4 py-2 rounded-full border border-red-800/40">🔄 Riprova</button>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <p className="text-center py-20 text-gray-500">Nessuna traccia rilevata nelle cronache digitali.</p>
          )}

          {!loading && !error && results.map((r, i) => (
            <div key={i} className="group bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 transition-all">
              <h3 className="text-blue-200 font-bold mb-2 group-hover:text-blue-100">{r.title}</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed italic">"{r.snippet}"</p>
              <a 
                href={r.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-blue-500 hover:underline uppercase tracking-widest font-bold"
              >
                Fonte Originale &rarr;
              </a>
            </div>
          ))}
        </div>

        <footer className="p-4 bg-blue-950/10 text-center border-t border-white/5">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">Powered by Google Search & Paranormal Cache</p>
        </footer>
      </div>
    </div>
  );
}
