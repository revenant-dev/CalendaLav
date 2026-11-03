/**
 * CalendaLav - build di produzione
 * © 2026 Domenico Marzo. Tutti i diritti riservati.
 *
 * Cosa fa:
 *  1) legge ./src/index.html (la versione leggibile);
 *  2) minifica HTML, CSS e JS inline con html-minifier-terser (che usa terser);
 *  3) riscrive il banner di copyright in cima;
 *  4) salva il risultato in ./public/index.html (la cartella pubblicata da Firebase).
 *     Gli altri asset in ./public/ NON vengono toccati.
 *
 * NOTA: il JS NON viene più offuscato, solo minificato. La minificazione di
 * terser preserva i nomi top-level (toplevel:false) e le chiavi degli oggetti,
 * quindi i gestori inline (onclick=...) e gli oggetti passati a Google GSI/fetch
 * continuano a funzionare. Gli script type="module" vengono minificati in
 * modalità module (import/export preservati).
 *
 * Uso:
 *   1) metti la versione leggibile in ./src/index.html
 *   2) npm install
 *   3) npm run build   -> compila il CSS (build:css) e rigenera ./public/index.html
 *   4) firebase deploy
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { minify } from 'html-minifier-terser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src', 'index.html');        // sorgente leggibile
const OUT_DIR = path.join(__dirname, 'public');               // cartella pubblicata da Firebase
const OUT = path.join(OUT_DIR, 'index.html');                 // versione minificata (generata)

/* ====== CONFIGURAZIONE ====== */

// Banner di copyright reinserito in testa al file dopo la minificazione
// (la minificazione rimuove i commenti, quindi va riaggiunto qui).
const BANNER =
`<!--
 CalendaLav - © 2026 Domenico Marzo. Tutti i diritti riservati.
 Codice protetto da diritto d'autore. Copia/distribuzione/modifica non autorizzate vietate.
-->
`;

/* ====== BUILD ====== */

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error('ERRORE: manca ' + SRC + '\nMetti il tuo index.html dentro la cartella ./src/');
    process.exit(1);
  }

  const html = fs.readFileSync(SRC, 'utf8');

  // Minifica HTML + CSS inline + JS inline.
  // minifyJS:true -> html-minifier-terser passa ogni <script> a terser e per
  // gli script type="module" attiva automaticamente la modalità module.
  let out = await minify(html, {
    collapseWhitespace: true,
    conservativeCollapse: false,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true,
    minifyJS: {
      compress: true,
      mangle: { toplevel: false },   // NON rinominare i nomi globali (gestori inline, ecc.)
      format: { comments: false },
    },
    keepClosingSlash: true,
    sortAttributes: true,
    sortClassName: true,
  });

  out = BANNER + out;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT, out, 'utf8');

  const kb = (s) => (Buffer.byteLength(s, 'utf8') / 1024).toFixed(1) + ' KB';
  console.log('OK -> ' + OUT);
  console.log('Dimensione: ' + kb(out));
}

main().catch(err => { console.error(err); process.exit(1); });
