# 🔮 Radar Paranormale

Un'applicazione gratuita e scalabile per scoprire luoghi paranormali, leggende e misteri vicino alla propria posizione.

## 🚀 Caratteristiche
- **🔍 Scansione Automatica**: Rileva luoghi entro 100km usando OpenStreetMap.
- **📄 Descrizioni Atmosferiche**: Generazione di storie basate sui dati storici.
- **🗺️ Mappa Interattiva**: Visualizzazione su mappa Leaflet con tema horror.
- **🎥 Community**: Gli utenti registrati possono aggiungere nuovi luoghi misteriosi.
- **🔑 Google Login**: Autenticazione 1-click sicura e gratuita.

## 🛠️ Setup Tecnico (Obbligatorio)

Questa app usa **Appwrite Cloud** come backend gratuito. Segui questi passi per farla funzionare:

### 1. Account Appwrite
1. Vai su [appwrite.io](https://appwrite.io) e crea un account gratuito.
2. Crea un nuovo progetto chiamato `RadarParanormale`.
3. In **Settings**, copia il `Project ID` e l'endpoint.

### 2. Database e Collection
1. Vai su **Database** -> **Create Database** (chiamalo `Misteri`).
2. Crea una Collection chiamata `Luoghi`.
3. In **Attributes**, aggiungi questi parametri:
   - `name` (string, size 255, required)
   - `description` (string, size 2000, required)
   - `category` (string, size 50, required)
   - `lat` (float, required)
   - `lng` (float, required)
   - `proofUrl` (string, size 1000, optional)
   - `userId` (string, size 255, required)
   - `userName` (string, size 255, required)
   - `createdAt` (string, size 50, required)
   - `views` (integer, default 0, optional)
4. In **Settings** della Collection, aggiungi i permessi:
   - Role: `Any` -> Permission: `Read`
   - Role: `Users` -> Permission: `Create`

### 3. Google OAuth
1. In Appwrite, vai su **Auth** -> **Methods** -> **Google**.
2. Segui le istruzioni per ottenere `Client ID` e `Secret` dalla Google Cloud Console.
3. Abilita il metodo.

### 4. Variabili d'Ambiente
Crea un file `.env.local` nella cartella `radar-paranormale/` usando come guida `.env.example` e inserisci i tuoi ID.

## 💻 Sviluppo Locale

```bash
cd radar-paranormale
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) col tuo browser.

## 🌍 Deploy (Vercel)
1. Carica il codice su GitHub.
2. Connetti la repository a Vercel.
3. Aggiungi le stesse variabili d'ambiente di `.env.local` nelle impostazioni di Vercel.
4. Fatto! L'app sarà online al tuo-url.vercel.app.
