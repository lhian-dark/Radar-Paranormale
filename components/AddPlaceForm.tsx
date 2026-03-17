'use client';

import { useState } from 'react';
import { addUserPlace } from '@/lib/appwrite';

interface Props {
  userLat: number;
  userLng: number;
  userId: string;
  userName: string;
  onSuccess: () => void;
  onClose: () => void;
}

const CATEGORIES = [
  { value: 'abbandonato', label: '👻 Edificio Abbandonato' },
  { value: 'castello', label: '🏰 Castello / Fortezza' },
  { value: 'cimitero', label: '⚰️ Cimitero' },
  { value: 'chiesa', label: '✝️ Chiesa Antica' },
  { value: 'rovine', label: '🏚️ Rovine' },
  { value: 'monastero', label: '⛪ Monastero' },
  { value: 'villa', label: '🏛️ Villa Storica' },
  { value: 'storico', label: '🔮 Luogo Misterioso' },
];

export default function AddPlaceForm({ userLat, userLng, userId, userName, onSuccess, onClose }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('abbandonato');
  const [proofUrl, setProofUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📡 Form inviato, preparo salvataggio...');
    
    if (!name.trim() || !description.trim()) {
      setError('Nome e descrizione sono obbligatori');
      return;
    }
    setSaving(true);
    setError('');
    
    try {
      const data = {
        name: name.trim(),
        description: description.trim().substring(0, 400),
        category,
        lat: userLat,
        lng: userLng,
        proofUrl: proofUrl.trim() || undefined,
        userId,
        userName,
        createdAt: new Date().toISOString(),
        views: 0,
      };
      
      console.log('📦 Dati che sto inviando ad Appwrite:', data);
      await addUserPlace(data);
      console.log('✅ Salvataggio completato con successo!');
      onSuccess();
    } catch (err: any) {
      console.error('❌ Errore durante il salvataggio:', err);
      // Mostriamo un errore più descrittivo
      const msg = err.message || 'Errore sconosciuto nel database';
      setError(`Errore Appwrite: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-4">
      <div className="bg-[#0f0a1e] border border-purple-800/60 rounded-2xl p-6 w-full max-w-lg shadow-2xl shadow-purple-900/40">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">🎥 Aggiungi Luogo Misterioso</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-3 text-sm text-purple-300 flex items-center gap-2">
            📡 Posizione attuale: <span className="font-mono text-xs">{userLat.toFixed(4)}, {userLng.toFixed(4)}</span>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-purple-400 mb-2">Nome del Luogo *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es: Villa Abbandonata del Bosco"
              maxLength={100}
              className="w-full bg-purple-950/30 border border-purple-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-purple-400 mb-2">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-purple-950/30 border border-purple-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-purple-400 mb-2">
              Descrizione del Mistero * <span className="text-gray-600 normal-case">({description.length}/400)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Racconta la storia di questo luogo, cosa hai visto o sentito..."
              rows={4}
              maxLength={400}
              className="w-full bg-purple-950/30 border border-purple-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-purple-400 mb-2">Prove / Link (opzionale)</label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-purple-950/30 border border-purple-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800/50 rounded-xl p-3 text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-900/50"
          >
            {saving ? '⏳ Salvataggio...' : '📡 Invia Segnalazione'}
          </button>
        </form>
      </div>
    </div>
  );
}
