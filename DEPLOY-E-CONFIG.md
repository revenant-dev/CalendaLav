# CalendaLav — note di deploy e configurazione (auth GIS, senza Firebase)

Questa versione **non usa più Firebase Authentication**. L'accesso e il token di
Google Drive passano entrambi da **Google Identity Services (GIS)**, con lo stesso
Client ID OAuth già presente nel progetto Google Cloud `calendalav`. Il token viene
conservato in `localStorage` e l'identità (email/nome) si legge da `userinfo`.

## 1) Cosa cambiare lato Google Cloud Console (OBBLIGATORIO)

Il punto critico è che l'origine da cui servi l'app sia tra le **origini JavaScript
autorizzate** del Client OAuth. Senza questo, GIS rifiuta la richiesta di token.

1. Vai su Google Cloud Console → progetto **calendalav** → *API e servizi* →
   *Credenziali* → il tuo **ID client OAuth 2.0** (quello che finisce in
   `...ujit4p7ud8beeuhcajvdo3s443lvn3po.apps.googleusercontent.com`).
2. In **Origini JavaScript autorizzate** aggiungi l'origine da cui testi, ad es.:
   - `https://<tuo-utente>.github.io`  ← per GitHub Pages (vale sia per pagina utente
     sia per project page in sottocartella: conta solo schema+host, non il percorso)
   - l'eventuale dominio di produzione (`https://calendalav.web.app`,
     `https://calendalav.firebaseapp.com`, o il tuo dominio custom) se non già presenti
   - `http://localhost:8080` (o la porta che usi) per le prove in locale
3. Gli **URI di reindirizzamento** NON servono per il token model di GIS: puoi lasciarli
   come sono.
4. **Schermata consenso OAuth**: gli scope richiesti ora sono
   `openid`, `email`, `profile` e `https://www.googleapis.com/auth/drive.file`
   (quest'ultimo era già in uso). `openid/email/profile` non sono sensibili.
   Se l'app è in modalità **Test**, assicurati che l'account con cui provi sia tra gli
   **utenti di test**.

## 2) Firebase

Non serve più nulla lato Firebase Authentication (non viene più usata). Il progetto
Firebase può restare com'è: se usi Firebase **solo** per l'hosting, continua a funzionare.
Le "Domini autorizzati" di Firebase Authentication diventano irrilevanti.
Puoi, se vuoi, disattivare il provider Google in Firebase Auth: non ha effetti sull'app.

## 3) Test su GitHub Pages

L'app è a percorsi relativi, quindi funziona anche in sottocartella.
- Opzione semplice: metti il **contenuto della cartella `public/`** nella radice del repo
  (o in `/docs`) e attiva Pages su quel percorso. L'app è tutta lì dentro.
- Ricorda di aver aggiunto `https://<tuo-utente>.github.io` tra le origini (punto 1).
- Il service worker è `CalendaLav-v4.4`: al primo caricamento dopo l'aggiornamento
  potrebbe servire un refresh per far subentrare la nuova cache.

## 4) Se vuoi ricompilare

- HTML: `node build.mjs` (minifica `src/index.html` → `public/index.html`).
- CSS: non modificato in questa versione; se cambi classi Tailwind, rigenera `app.css`
  con lo script `build:css` del `package.json`.

## 5) Rollback

Lo zip originale `CalendaLav__19_.zip` resta la versione con Firebase: se qualcosa non
va, puoi tornare a quella senza perdere dati (i dati sono nel file `CalendaLav-app.db`
sul Google Drive dell'utente e non vengono toccati da questa migrazione).
