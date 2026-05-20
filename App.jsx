import { useState, useMemo, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, AreaChart, Area } from "recharts";

// ─── CONFIGURACIÓN GOOGLE SHEETS ─────────────────────────────────────────────
// La clave privada y credenciales van en variables de entorno en Netlify.
// Durante desarrollo local, podés pegarlas acá directamente (no subir a GitHub).
const SHEET_ID = import.meta.env.VITE_SHEET_ID || '10MaLFPqVkl3tggQ9DyNEGplw8ri4j9XPdIiP0W9eF1o';
const SHEET_NAME = 'Ventas';

// Helper: genera un JWT firmado con la clave de servicio y lo usa para obtener
// un access token de Google OAuth2. Todo corre en el browser, sin servidor.
async function getAccessToken() {
  const creds = {
    client_email: import.meta.env.VITE_CLIENT_EMAIL,
    private_key: (import.meta.env.VITE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  };
  if (!creds.client_email || !creds.private_key) {
    throw new Error('Credenciales no configuradas. Revisá las variables de entorno en Netlify.');
  }
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const b64 = obj => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  const unsigned = `${b64(header)}.${b64(payload)}`;

  // Import private key
  const pemBody = creds.private_key.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const keyData = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);

  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  const jwt = `${unsigned}.${sigB64}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('No se pudo obtener access token: ' + JSON.stringify(data));
  return data.access_token;
}

// Leer todas las ventas desde la Sheet
async function fetchVentasFromSheet() {
  const token = await getAccessToken();
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:P`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  if (!data.values || data.values.length < 2) return [];
  const [, ...rows] = data.values; // skip header
  return rows.map(r => ({
    n: parseInt(r[0]) || 0,
    f: r[1] || '',
    c: r[2] || '',
    sexo: r[3] || '',
    cat: r[4] || '',
    prov: r[5] || '',
    mp: r[6] || '',
    mc: r[7] || '',
    m: parseFloat(r[8]) || 0,
    conocio: r[9] || '',
    motivo: r[10] || '',
    primera: r[11] === 'true' ? true : r[11] === 'false' ? false : null,
    encargo: r[12] === 'true',
    seña: r[13] === 'true',
    telefono: r[14] || '',
    anulada: r[15] === 'true',
  })).filter(v => v.n > 0);
}

// Agregar una venta nueva al final de la Sheet
async function appendVentaToSheet(v) {
  const token = await getAccessToken();
  const row = [v.n, v.f, v.c, v.sexo||'', v.cat, v.prov||'', v.mp||'', v.mc||'', v.m, v.conocio||'', v.motivo||'', v.primera===null?'':String(v.primera), String(v.encargo||false), String(v.seña||false), v.telefono||'', String(v.anulada||false)];
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:P:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
    }
  );
  if (!res.ok) throw new Error('Error al guardar en Sheet: ' + await res.text());
  return true;
}

// ─── DATOS HISTÓRICOS (fallback mientras no hay Sheet conectada) ──────────────
const HISTORICO = [
  {n:2,f:"2022-06-28",c:"Ludmila Janik",sexo:"F",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"",m:3460,conocio:"",motivo:"",primera:null},
  {n:3,f:"2022-06-28",c:"Valentina Perosio",sexo:"F",cat:"Cerámica",prov:"",mp:"Efectivo",mc:"",m:6120,conocio:"",motivo:"",primera:null},
  {n:4,f:"2022-06-28",c:"Gina Crivelli",sexo:"F",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"",m:9180,conocio:"",motivo:"",primera:null},
  {n:5,f:"2022-07-07",c:"Coqui (Belalugosi bar)",sexo:"",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"",m:8650,conocio:"",motivo:"",primera:null},
  {n:6,f:"2022-07-14",c:"Santiago Bustos",sexo:"M",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"",m:1730,conocio:"",motivo:"",primera:null},
  {n:56,f:"2023-07-08",c:"Macu González",sexo:"F",cat:"Gráfica",prov:"",mp:"Efectivo",mc:"Feria",m:600,conocio:"",motivo:"",primera:null},
  {n:57,f:"2023-07-08",c:"Vale Reyna",sexo:"F",cat:"Gráfica",prov:"",mp:"Efectivo",mc:"Feria",m:600,conocio:"",motivo:"",primera:null},
  {n:58,f:"2023-07-08",c:"Nacho",sexo:"M",cat:"Gráfica",prov:"",mp:"Transferencia",mc:"Feria",m:600,conocio:"",motivo:"",primera:null},
  {n:59,f:"2023-07-08",c:"Cecilia Kesman",sexo:"F",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"Feria",m:3250,conocio:"",motivo:"",primera:null},
  {n:60,f:"2023-07-08",c:"Eugenio",sexo:"M",cat:"Perchero",prov:"",mp:"Transferencia",mc:"Feria",m:4800,conocio:"",motivo:"",primera:null},
  {n:61,f:"2023-07-08",c:"Lara",sexo:"F",cat:"Perchero",prov:"",mp:"Efectivo",mc:"Feria",m:4800,conocio:"",motivo:"",primera:null},
  {n:62,f:"2023-07-08",c:"Jezs Garcia",sexo:"",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"Feria",m:11300,conocio:"",motivo:"",primera:null},
  {n:63,f:"2023-07-09",c:"Anónimo",sexo:"",cat:"Cerámica",prov:"",mp:"Efectivo",mc:"Feria",m:6500,conocio:"",motivo:"",primera:null},
  {n:65,f:"2023-07-09",c:"Franco Gallardo",sexo:"M",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"Feria",m:7250,conocio:"",motivo:"",primera:null},
  {n:66,f:"2023-07-09",c:"Franco Sánchez",sexo:"M",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"Feria",m:7250,conocio:"",motivo:"",primera:null},
  {n:67,f:"2023-07-09",c:"Anónimo",sexo:"",cat:"Gráfica",prov:"",mp:"Efectivo",mc:"Feria",m:600,conocio:"",motivo:"",primera:null},
  {n:68,f:"2023-07-09",c:"Gino Bellido Belleti",sexo:"M",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"Feria",m:5600,conocio:"",motivo:"",primera:null},
  {n:69,f:"2023-07-09",c:"Papeldechicle",sexo:"",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"Feria",m:3250,conocio:"",motivo:"",primera:null},
  {n:70,f:"2023-07-09",c:"Anónimo",sexo:"",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"Feria",m:3250,conocio:"",motivo:"",primera:null},
  {n:71,f:"2023-07-09",c:"Maru Gaviglio",sexo:"F",cat:"Gráfica",prov:"",mp:"Efectivo",mc:"Feria",m:1200,conocio:"",motivo:"",primera:null},
  {n:72,f:"2023-07-09",c:"Juan Avila",sexo:"M",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"Feria",m:2800,conocio:"",motivo:"",primera:null},
  {n:73,f:"2023-07-10",c:"Nicolas Modesto Benitez",sexo:"M",cat:"Perchero",prov:"",mp:"Transferencia",mc:"",m:14400,conocio:"",motivo:"",primera:null},
  {n:74,f:"2023-07-17",c:"Alina",sexo:"F",cat:"Perchero",prov:"",mp:"Transferencia",mc:"",m:14350,conocio:"",motivo:"",primera:null},
  {n:75,f:"2023-08-01",c:"Daniel Castaño",sexo:"M",cat:"Perchero",prov:"",mp:"Transferencia",mc:"",m:4800,conocio:"",motivo:"",primera:null},
  {n:76,f:"2023-08-19",c:"Lorenzo Boveri",sexo:"M",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"",m:12000,conocio:"",motivo:"",primera:null},
  {n:77,f:"2023-08-21",c:"Anónimo",sexo:"",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"Feria",m:3800,conocio:"",motivo:"",primera:null},
  {n:79,f:"2023-08-21",c:"Anónimo",sexo:"",cat:"Gráfica",prov:"",mp:"Efectivo",mc:"Feria",m:1500,conocio:"",motivo:"",primera:null},
  {n:80,f:"2023-08-21",c:"Elisa",sexo:"F",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"Feria",m:15200,conocio:"",motivo:"",primera:null},
  {n:81,f:"2023-08-21",c:"Anónimo",sexo:"",cat:"Perchero",prov:"",mp:"Efectivo",mc:"Feria",m:9800,conocio:"",motivo:"",primera:null},
  {n:82,f:"2023-08-22",c:"Germán Baigorrí",sexo:"M",cat:"Cerámica",prov:"Córdoba",mp:"Transferencia",mc:"",m:9800,conocio:"",motivo:"",primera:null},
  {n:83,f:"2023-08-25",c:"Florencia Arias",sexo:"F",cat:"Perchero",prov:"Córdoba",mp:"Transferencia",mc:"",m:34500,conocio:"",motivo:"",primera:null},
  {n:84,f:"2023-08-31",c:"Leandro",sexo:"M",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"",m:15750,conocio:"",motivo:"",primera:null},
  {n:85,f:"2023-10-20",c:"Ismael Martínez",sexo:"M",cat:"Perchero",prov:"Salta",mp:"Transferencia",mc:"",m:5580,conocio:"",motivo:"",primera:null},
  {n:86,f:"2023-10-29",c:"Cecilia Pescara",sexo:"F",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"",m:7380,conocio:"",motivo:"",primera:null},
  {n:87,f:"2023-11-25",c:"Marisol Vitale",sexo:"F",cat:"Perchero",prov:"Córdoba",mp:"Transferencia",mc:"",m:12564,conocio:"",motivo:"",primera:null},
  {n:88,f:"2023-12-01",c:"Isondy Medina",sexo:"F",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"",m:10000,conocio:"",motivo:"",primera:null},
  {n:89,f:"2023-12-02",c:"Iinaki Sanz",sexo:"M",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"",m:8000,conocio:"",motivo:"",primera:null},
  {n:90,f:"2023-12-13",c:"Jezs García",sexo:"",cat:"Perchero",prov:"Córdoba",mp:"Transferencia",mc:"",m:6280,conocio:"",motivo:"",primera:null},
  {n:91,f:"2023-12-20",c:"Florencia Arias",sexo:"F",cat:"Cerámica",prov:"Córdoba",mp:"Transferencia",mc:"",m:20635,conocio:"",motivo:"",primera:null},
  {n:92,f:"2023-12-20",c:"Eliana Perno",sexo:"F",cat:"Cerámica",prov:"Córdoba",mp:"Transferencia",mc:"",m:16672,conocio:"",motivo:"",primera:null},
  {n:93,f:"2023-12-23",c:"Fran Doña",sexo:"M",cat:"Cerámica",prov:"",mp:"Transferencia",mc:"",m:8244,conocio:"",motivo:"",primera:null},
  {n:94,f:"2023-12-23",c:"Ceci Cordi",sexo:"F",cat:"Cerámica",prov:"Córdoba",mp:"Transferencia",mc:"",m:8244,conocio:"",motivo:"",primera:null},
  {n:95,f:"2024-05-15",c:"Josefina Somoza",sexo:"F",cat:"Perchero",prov:"Buenos Aires",mp:"Transferencia",mc:"",m:86608,conocio:"",motivo:"",primera:null},
  {n:96,f:"2024-05-21",c:"Ariana Obiedo",sexo:"F",cat:"Perchero",prov:"Buenos Aires",mp:"Transferencia",mc:"",m:32723,conocio:"",motivo:"",primera:null},
  {n:97,f:"2024-05-23",c:"Francisco Semino",sexo:"M",cat:"Cerámica",prov:"Córdoba",mp:"Transferencia",mc:"",m:81603,conocio:"",motivo:"",primera:null},
  {n:98,f:"2024-05-28",c:"Bianca Romano Duffau",sexo:"F",cat:"Cerámica",prov:"Córdoba",mp:"Mercado Pago",mc:"",m:51397,conocio:"",motivo:"",primera:null},
  {n:99,f:"2024-05-28",c:"Carolina Carbone",sexo:"F",cat:"Perchero",prov:"Córdoba",mp:"Mercado Pago",mc:"",m:26200,conocio:"",motivo:"",primera:null},
  {n:100,f:"2024-06-15",c:"Santiago Abeledo",sexo:"M",cat:"Cerámica",prov:"Córdoba",mp:"Mercado Pago",mc:"",m:77040,conocio:"",motivo:"",primera:null},
  {n:103,f:"2024-07-08",c:"Tala Padre",sexo:"",cat:"Perchero",prov:"Córdoba",mp:"Mercado Pago",mc:"Mercado Libre",m:44540,conocio:"",motivo:"",primera:null},
  {n:104,f:"2024-07-10",c:"Cecilia Pescara",sexo:"F",cat:"Cerámica",prov:"Córdoba",mp:"Transferencia",mc:"Mercado Libre",m:49000,conocio:"",motivo:"",primera:null},
  {n:105,f:"2024-07-12",c:"Julián López del Valle",sexo:"M",cat:"Perchero",prov:"Buenos Aires",mp:"Mercado Pago",mc:"Mercado Libre",m:237060,conocio:"",motivo:"",primera:null},
  {n:107,f:"2024-07-15",c:"Anónimo",sexo:"",cat:"Perchero",prov:"Córdoba",mp:"Mercado Pago",mc:"Transferencia",m:23600,conocio:"",motivo:"",primera:null},
  {n:108,f:"2024-07-19",c:"Anónimo",sexo:"",cat:"Perchero",prov:"Córdoba",mp:"Mercado Pago",mc:"Transferencia",m:35400,conocio:"",motivo:"",primera:null},
  {n:109,f:"2024-07-20",c:"Anónimo",sexo:"",cat:"Perchero",prov:"Córdoba",mp:"Mercado Pago",mc:"Transferencia",m:23600,conocio:"",motivo:"",primera:null},
  {n:110,f:"2024-07-20",c:"Valentina Perosio",sexo:"F",cat:"Cerámica",prov:"Córdoba",mp:"Mercado Pago",mc:"Transferencia",m:21600,conocio:"",motivo:"",primera:null},
  {n:111,f:"2024-08-24",c:"Anónimo",sexo:"",cat:"Cerámica",prov:"Córdoba",mp:"Efectivo",mc:"Feria",m:10300,conocio:"",motivo:"",primera:null},
  {n:112,f:"2024-08-30",c:"Anónimo",sexo:"",cat:"Cerámica",prov:"Córdoba",mp:"Efectivo",mc:"Feria",m:20500,conocio:"",motivo:"",primera:null},
  {n:113,f:"2024-08-30",c:"Anónimo",sexo:"",cat:"Perchero",prov:"Córdoba",mp:"Efectivo",mc:"Feria",m:23600,conocio:"",motivo:"",primera:null},
  {n:115,f:"2024-09-08",c:"Santiago Bustos",sexo:"M",cat:"Mesa S",prov:"Córdoba",mp:"Transferencia",mc:"Transferencia",m:74000,conocio:"",motivo:"",primera:null},
  {n:116,f:"2024-09-08",c:"Gonzalo Talavera",sexo:"M",cat:"Mesa S",prov:"Córdoba",mp:"Transferencia",mc:"Transferencia",m:74000,conocio:"",motivo:"",primera:null},
  {n:117,f:"2024-09-13",c:"Anónimo",sexo:"",cat:"Perchero",prov:"Buenos Aires",mp:"Transferencia",mc:"Feria",m:23580,conocio:"",motivo:"",primera:null},
  {n:118,f:"2024-09-14",c:"Omar Paris",sexo:"M",cat:"Perchero",prov:"Córdoba",mp:"Transferencia",mc:"Feria",m:11780,conocio:"",motivo:"",primera:null},
  {n:119,f:"2024-09-14",c:"Anónimo",sexo:"",cat:"Cerámica",prov:"Entre Ríos",mp:"Transferencia",mc:"Feria",m:10300,conocio:"",motivo:"",primera:null},
  {n:120,f:"2024-09-15",c:"Ramiro Martoglio",sexo:"M",cat:"Cerámica",prov:"Córdoba",mp:"Transferencia",mc:"Feria",m:23080,conocio:"",motivo:"",primera:null},
  {n:121,f:"2024-09-15",c:"Anónimo",sexo:"",cat:"Perchero",prov:"Entre Ríos",mp:"Efectivo",mc:"Feria",m:11800,conocio:"",motivo:"",primera:null},
  {n:122,f:"2024-09-15",c:"Anónimo",sexo:"",cat:"Cerámica",prov:"Entre Ríos",mp:"Transferencia",mc:"Feria",m:78800,conocio:"",motivo:"",primera:null},
  {n:123,f:"2024-09-15",c:"Anónimo",sexo:"",cat:"Cerámica",prov:"Entre Ríos",mp:"Transferencia",mc:"Feria",m:23000,conocio:"",motivo:"",primera:null},
  {n:124,f:"2024-09-15",c:"Anónimo",sexo:"",cat:"Cerámica",prov:"Entre Ríos",mp:"Transferencia",mc:"Feria",m:32100,conocio:"",motivo:"",primera:null},
  {n:125,f:"2024-09-17",c:"Florencia Arias",sexo:"F",cat:"Cerámica",prov:"Córdoba",mp:"Transferencia",mc:"",m:23089,conocio:"",motivo:"",primera:null},
  {n:128,f:"2024-10-14",c:"Elena Vagliera",sexo:"F",cat:"Perchero",prov:"Córdoba",mp:"Transferencia",mc:"",m:35400,conocio:"",motivo:"",primera:null},
  {n:129,f:"2024-10-17",c:"Gonzalo Talavera",sexo:"M",cat:"Cerámica",prov:"Salta",mp:"Transferencia",mc:"",m:50000,conocio:"",motivo:"",primera:null},
  {n:130,f:"2024-11-14",c:"Ismael Martinez",sexo:"M",cat:"Cerámica",prov:"Salta",mp:"Transferencia",mc:"Presencial",m:21874,conocio:"",motivo:"",primera:null},
  {n:131,f:"2024-11-14",c:"Ignacio Jimenez",sexo:"M",cat:"Mesa S",prov:"Buenos Aires",mp:"Crédito",mc:"Tienda Nube",m:240723,conocio:"",motivo:"",primera:null},
  {n:132,f:"2024-11-22",c:"Paula Sofia Pechin",sexo:"F",cat:"Perchero",prov:"Córdoba",mp:"Transferencia",mc:"Tienda Nube",m:40497,conocio:"",motivo:"",primera:null},
  {n:133,f:"2024-12-03",c:"Coqui",sexo:"",cat:"Cerámica",prov:"Córdoba",mp:"Efectivo",mc:"Física",m:206600,conocio:"",motivo:"",primera:null},
  {n:143,f:"2025-03-06",c:"Casa Capital",sexo:"",cat:"Cerámica",prov:"Córdoba",mp:"",mc:"",m:120000,conocio:"",motivo:"",primera:null},
  {n:150,f:"2025-04-08",c:"Guada Talavera",sexo:"F",cat:"Perchero",prov:"Córdoba",mp:"Mercado Pago",mc:"Tienda Nube",m:50398,conocio:"",motivo:"",primera:null},
  {n:152,f:"2025-05-14",c:"Florencia Arias",sexo:"F",cat:"Cerámica",prov:"Córdoba",mp:"Mercado Pago",mc:"Física",m:84000,conocio:"",motivo:"",primera:null},
  {n:157,f:"2025-06-26",c:"Mara Chávez",sexo:"F",cat:"Perchero",prov:"Córdoba",mp:"Mercado Pago",mc:"Tienda Nube",m:18900,conocio:"",motivo:"",primera:null},
  {n:158,f:"2025-09-27",c:"Santiago Carrara",sexo:"M",cat:"Cerámica",prov:"Córdoba",mp:"Mercado Pago",mc:"WhatsApp",m:28165,conocio:"",motivo:"",primera:null},
  {n:159,f:"2025-10-16",c:"Marisa Cordi",sexo:"F",cat:"Perchero",prov:"Córdoba",mp:"Mercado Pago",mc:"WhatsApp",m:52200,conocio:"",motivo:"",primera:null},
  {n:160,f:"2025-12-16",c:"Franco Marini",sexo:"M",cat:"Cerámica",prov:"Córdoba",mp:"Uala",mc:"Instagram",m:57600,conocio:"Instagram",motivo:"",primera:null},
  {n:161,f:"2025-12-18",c:"Carla Vázquez",sexo:"F",cat:"Perchero",prov:"Córdoba",mp:"Mercado Pago",mc:"WhatsApp",m:186000,conocio:"",motivo:"",primera:null},
  {n:162,f:"2026-03-13",c:"Ismael Martínez",sexo:"M",cat:"Perchero",prov:"Salta",mp:"Mercado Pago",mc:"Presencial",m:37000,conocio:"Recomendación",motivo:"",primera:false},
  {n:163,f:"2026-03-30",c:"Guadalupe Talavera",sexo:"F",cat:"Reloj Galaxia",prov:"Córdoba",mp:"Mercado Pago",mc:"Tienda Nube",m:65000,conocio:"",motivo:"",primera:null},
  {n:164,f:"2026-03-31",c:"Maximiliano Navarro",sexo:"M",cat:"Reloj Galaxia",prov:"Córdoba",mp:"Mercado Pago",mc:"Tienda Nube",m:69102,conocio:"",motivo:"",primera:null},
  {n:165,f:"2026-03-31",c:"Tomás Altina",sexo:"M",cat:"Reloj Galaxia",prov:"Buenos Aires",mp:"Pago Nube",mc:"Tienda Nube",m:66470,conocio:"",motivo:"",primera:null},
  {n:166,f:"2026-03-31",c:"Melina Ávalos",sexo:"F",cat:"Reloj Galaxia",prov:"Buenos Aires",mp:"Mercado Pago",mc:"Tienda Nube",m:69972,conocio:"",motivo:"",primera:null},
  {n:167,f:"2026-03-31",c:"Victoria Martina Brouchy",sexo:"F",cat:"Reloj Galaxia",prov:"Buenos Aires",mp:"Pago Nube",mc:"Tienda Nube",m:63472,conocio:"",motivo:"",primera:null},
  {n:168,f:"2026-03-31",c:"Santiago Carrara",sexo:"M",cat:"Reloj Galaxia",prov:"Córdoba",mp:"Pago Nube",mc:"Tienda Nube",m:58500,conocio:"",motivo:"",primera:false},
  {n:169,f:"2026-04-08",c:"Florencia Harari",sexo:"F",cat:"Reloj Galaxia",prov:"Buenos Aires",mp:"Pago Nube",mc:"Tienda Nube",m:62820,conocio:"",motivo:"",primera:null},
  {n:171,f:"2026-04-09",c:"Laura Cordi",sexo:"F",cat:"Reloj Galaxia",prov:"Córdoba",mp:"Transferencia",mc:"Transferencia",m:58500,conocio:"",motivo:"",primera:null},
  {n:172,f:"2026-04-09",c:"Pedro Ruiz Funes",sexo:"M",cat:"Reloj Galaxia",prov:"Córdoba",mp:"Efectivo",mc:"Efectivo",m:58500,conocio:"",motivo:"",primera:null},
  {n:173,f:"2026-04-13",c:"Daniel Tomaselli",sexo:"M",cat:"Reloj Galaxia",prov:"Mendoza",mp:"Pago Nube",mc:"Pago Nube",m:75512,conocio:"",motivo:"",primera:null},
  {n:174,f:"2026-04-18",c:"Manuela Santa Clara",sexo:"F",cat:"Reloj Galaxia",prov:"Buenos Aires",mp:"Mercado Pago",mc:"Mercado Pago",m:80481,conocio:"",motivo:"",primera:null},
  {n:175,f:"2026-04-19",c:"Victoria Rabinovich",sexo:"F",cat:"Reloj Galaxia",prov:"Buenos Aires",mp:"",mc:"",m:84102,conocio:"",motivo:"",primera:null},
  {n:176,f:"2026-04-21",c:"Maximiliano Ledesma",sexo:"M",cat:"Reloj Galaxia",prov:"Buenos Aires",mp:"Pago Nube",mc:"Pago Nube",m:80481,conocio:"",motivo:"",primera:null},
];

// ─── PARSER NUEVO FORMATO ─────────────────────────────────────────────────────
function parseVentaText(text) {
  const clean = s => s.replace(/<[^>]+>/g,'').replace(/\*/g,'').trim();
  const get = (...keys) => { for(const k of keys){const m=text.match(new RegExp(`${k}[^:\\n]*:\\s*([^\\n]+)`,'i'));if(m)return clean(m[1]);}return ''; };

  const numM = text.match(/VENTA\s*N[ºo°]?\s*:?\s*(\d+)/i);
  const fechaM = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  let fecha = new Date().toISOString().split('T')[0];
  if(fechaM){const[,d,mo,y]=fechaM;fecha=`${y.length===2?'20'+y:y}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}`;}

  const montoRaw = get('Monto total','Monto');
  const montoStr = montoRaw.replace(/[$.]/g,'').replace(',','.').split(/\s/)[0];
  const monto = parseFloat(montoStr)||0;

  const pedRaw = get('Pedido');
  const catMap=[['reloj','Reloj Galaxia'],['mesa','Mesa S'],['perchero','Perchero'],['taza','Cerámica'],['pocillo','Cerámica'],['jarra','Cerámica'],['postal','Gráfica']];
  let cat='Otro'; for(const[k,v]of catMap)if(pedRaw.toLowerCase().includes(k)){cat=v;break;}

  const prov = get('Provincia').split(/[-–]/)[0].trim().replace(/\.$/,'');
  const provMap={'córdoba':'Córdoba','cordoba':'Córdoba','buenos aires':'Buenos Aires','gran buenos aires':'Buenos Aires','salta':'Salta','mendoza':'Mendoza','entre ríos':'Entre Ríos','entre rios':'Entre Ríos','la pampa':'La Pampa'};
  let provNorm=prov; for(const[k,v]of Object.entries(provMap))if(prov.toLowerCase().includes(k)){provNorm=v;break;}

  const sexoRaw=get('Sexo').toLowerCase();
  let sexo=''; if(/^m/.test(sexoRaw))sexo='M'; else if(/^f/.test(sexoRaw))sexo='F'; else if(/otro|nb/i.test(sexoRaw))sexo='Otro';

  const conocioRaw=get('Cómo nos conoció','Como nos conocio','Conoció').toLowerCase();
  let conocio='';
  if(/instagram|ig/.test(conocioRaw))conocio='Instagram';
  else if(/tiktok/.test(conocioRaw))conocio='TikTok';
  else if(/google/.test(conocioRaw))conocio='Google';
  else if(/mercado libre|ml/.test(conocioRaw))conocio='Mercado Libre';
  else if(/recomend/.test(conocioRaw))conocio='Recomendación';
  else if(/ya nos conoc|anterior|recurrente/.test(conocioRaw))conocio='Ya nos conocía';
  else if(conocioRaw&&conocioRaw!=='-')conocio=clean(get('Cómo nos conoció','Como nos conocio'));

  const motivoRaw=get('Motivo').toLowerCase();
  let motivo='';
  if(/regalo/.test(motivoRaw)&&/propio/.test(motivoRaw))motivo='Ambos';
  else if(/regalo/.test(motivoRaw))motivo='Regalo';
  else if(/propio/.test(motivoRaw))motivo='Uso propio';
  else if(motivoRaw&&motivoRaw!=='-')motivo=clean(get('Motivo'));

  const primeraRaw=get('Primera compra').toLowerCase();
  let primera=null;
  if(/^s[ií]/.test(primeraRaw))primera=true;
  else if(/^no/.test(primeraRaw))primera=false;

  return {
    n:numM?parseInt(numM[1]):null, f:fecha,
    c:get('Nombre','Nombre de cliente')||'Anónimo',
    sexo, mp:get('Medio de pago'), mc:get('Medio de compra'),
    cat, prov:provNorm, m:monto, conocio, motivo, primera,
    telefono:get('Teléfono','Nro de teléfono'),
    encargo:/^s[ií]/i.test(get('Por encargo')),
    seña:/^s[ií]/i.test(get('Seña')),
    anulada:false
  };
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const ACC="#C8A96E",DARK="#0F0F0F",MID="#1E1E1E",CARD="#252525",BORDER="#2E2E2E",TEXT="#E8D5A3",MUTED="#666";
const COLORS=["#C8A96E","#8B6914","#E8D5A3","#5C4A1E","#F0E8D0","#A07840","#3D2F10","#D4B483","#6B5020","#FFE4A0"];
const CAT_COLORS={"Cerámica":"#A07840","Perchero":"#C8A96E","Reloj Galaxia":"#F0E8D0","Mesa S":"#8B6914","Gráfica":"#5C4A1E","Otro":"#444"};
const fmt=n=>n>=1000000?`$${(n/1000000).toFixed(1)}M`:n>=1000?`$${Math.round(n/1000)}K`:`$${Math.round(n)}`;
const fmtFull=n=>`$${Math.round(n).toLocaleString('es-AR')}`;

const TT=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return<div style={{background:'#1A1A1A',border:`1px solid ${ACC}44`,borderRadius:8,padding:'8px 14px'}}>
    <p style={{margin:0,color:'#888',fontSize:11,fontFamily:'DM Mono'}}>{label}</p>
    {payload.map((p,i)=><p key={i} style={{margin:'2px 0 0',color:ACC,fontSize:14,fontWeight:700}}>{typeof p.value==='number'&&p.value>1000?fmtFull(p.value):p.value}</p>)}
  </div>;
};
const KPI=({label,value,sub,hi})=>(
  <div style={{background:hi?`linear-gradient(135deg,${ACC}18,${ACC}05)`:CARD,border:`1px solid ${hi?ACC:BORDER}`,borderRadius:12,padding:'18px 22px',display:'flex',flexDirection:'column',gap:3}}>
    <span style={{fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',color:hi?ACC:MUTED,fontFamily:"'DM Mono',monospace"}}>{label}</span>
    <span style={{fontSize:26,fontWeight:700,color:hi?ACC:TEXT,fontFamily:"'Playfair Display',serif",lineHeight:1.1}}>{value}</span>
    {sub&&<span style={{fontSize:11,color:MUTED,fontFamily:"'DM Mono',monospace"}}>{sub}</span>}
  </div>
);
const Sec=({children})=>(
  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
    <div style={{width:3,height:18,background:ACC,borderRadius:2}}/>
    <h2 style={{margin:0,fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:ACC,fontFamily:"'DM Mono',monospace"}}>{children}</h2>
  </div>
);
const Panel=({children,style={}})=>(
  <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:22,...style}}>{children}</div>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [ventas,setVentas]=useState(HISTORICO);
  const [tab,setTab]=useState('dashboard');
  const [filterYear,setFilterYear]=useState('todos');
  const [filterCat,setFilterCat]=useState('todas');
  const [input,setInput]=useState('');
  const [parsed,setParsed]=useState(null);
  const [err,setErr]=useState('');
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [sheetStatus,setSheetStatus]=useState('idle'); // idle | loading | ok | error
  const [sheetMsg,setSheetMsg]=useState('');

  // Intentar cargar desde Sheet al iniciar
  useEffect(()=>{
    const creds=import.meta.env.VITE_CLIENT_EMAIL;
    if(!creds){setSheetStatus('local');return;}
    setSheetStatus('loading');
    fetchVentasFromSheet()
      .then(data=>{
        if(data.length>0){setVentas(data);setSheetStatus('ok');setSheetMsg(`${data.length} ventas cargadas desde Google Sheets`);}
        else{setSheetStatus('ok');setSheetMsg('Sheet conectada (vacía — cargando datos históricos)');}
      })
      .catch(e=>{setSheetStatus('error');setSheetMsg(e.message);});
  },[]);

  const years=useMemo(()=>[...new Set(ventas.map(v=>v.f.slice(0,4)))].sort(),[ventas]);
  const cats=useMemo(()=>[...new Set(ventas.map(v=>v.cat))].sort(),[ventas]);
  const filtered=useMemo(()=>ventas.filter(v=>{
    if(filterYear!=='todos'&&v.f.slice(0,4)!==filterYear)return false;
    if(filterCat!=='todas'&&v.cat!==filterCat)return false;
    return true;
  }),[ventas,filterYear,filterCat]);
  const conMonto=useMemo(()=>filtered.filter(v=>v.m>0),[filtered]);
  const totalIngresos=useMemo(()=>conMonto.reduce((s,v)=>s+v.m,0),[conMonto]);
  const ticketProm=useMemo(()=>conMonto.length?totalIngresos/conMonto.length:0,[totalIngresos,conMonto]);

  const byKey=useCallback((arr,key,fallback='Sin dato')=>{
    const m={};arr.forEach(v=>{const k=v[key]||fallback;m[k]=(m[k]||0)+1;});
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}));
  },[]);

  const byCat=useMemo(()=>byKey(filtered,'cat'),[filtered,byKey]);
  const byProv=useMemo(()=>byKey(filtered,'prov'),[filtered,byKey]);
  const byMP=useMemo(()=>byKey(conMonto,'mp'),[conMonto,byKey]);
  const byMC=useMemo(()=>byKey(filtered,'mc').slice(0,8),[filtered,byKey]);
  const bySexo=useMemo(()=>byKey(filtered,'sexo'),[filtered,byKey]);
  const byConocio=useMemo(()=>{const m={};filtered.filter(v=>v.conocio).forEach(v=>{m[v.conocio]=(m[v.conocio]||0)+1;});return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}));},[filtered]);
  const byMotivo=useMemo(()=>{const m={};filtered.filter(v=>v.motivo).forEach(v=>{m[v.motivo]=(m[v.motivo]||0)+1;});return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}));},[filtered]);

  const byYear=useMemo(()=>{
    const m={};ventas.forEach(v=>{const y=v.f.slice(0,4);if(!m[y])m[y]={year:y,ventas:0,ingresos:0};m[y].ventas++;if(v.m>0)m[y].ingresos+=v.m;});
    return Object.values(m).sort((a,b)=>a.year.localeCompare(b.year));
  },[ventas]);

  const byMonth=useMemo(()=>{
    const m={};filtered.forEach(v=>{const mes=v.f.slice(0,7);if(!m[mes])m[mes]={mes,ventas:0,ingresos:0};m[mes].ventas++;if(v.m>0)m[mes].ingresos+=v.m;});
    const L=['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return Object.values(m).sort((a,b)=>a.mes.localeCompare(b.mes)).map(d=>({...d,mes:d.mes.replace(/(\d{4})-(\d{2})/,(_,y,mo)=>`${L[+mo]} ${y.slice(2)}`)}));
  },[filtered]);

  const catIngresos=useMemo(()=>{
    const m={};conMonto.forEach(v=>{m[v.cat]=(m[v.cat]||0)+v.m;});
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}));
  },[conMonto]);

  const handleParse=()=>{
    setErr('');setSaved(false);
    if(!input.includes('VENTA')){setErr('No se detectó formato de venta válido. Incluí "VENTA Nº:".');setParsed(null);return;}
    const p=parseVentaText(input);
    if(!p.c||p.c==='Anónimo'&&!input.includes('Anónimo')){setErr('No se pudo leer el nombre del cliente.');return;}
    setParsed(p);
  };

  const handleSave=async()=>{
    setSaving(true);
    try{
      // Si hay Sheet conectada, guardar ahí
      if(sheetStatus==='ok'){await appendVentaToSheet(parsed);}
      setVentas(prev=>{
        const idx=prev.findIndex(v=>v.n===parsed.n);
        if(idx>=0){const c=[...prev];c[idx]=parsed;return c;}
        return [...prev,parsed].sort((a,b)=>a.n-b.n);
      });
      setSaved(true);setInput('');setParsed(null);
    }catch(e){setErr('Error al guardar: '+e.message);}
    setSaving(false);
  };

  const BarH=(data)=>(
    <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:8}}>
      {data.map((p,i)=>(
        <div key={i}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
            <span style={{fontSize:11,color:'#aaa',fontFamily:'DM Mono',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</span>
            <span style={{fontSize:11,color:ACC,fontFamily:'DM Mono'}}>{typeof p.value==='number'&&p.value>1000?fmt(p.value):p.value}</span>
          </div>
          <div style={{height:4,background:'#2A2A2A',borderRadius:2}}>
            <div style={{height:'100%',width:`${(p.value/data[0].value)*100}%`,background:COLORS[i%COLORS.length],borderRadius:2,transition:'width 0.5s'}}/>
          </div>
        </div>
      ))}
    </div>
  );

  const TABS=[{id:'dashboard',label:'Dashboard'},{id:'agregar',label:'+ Nueva venta'},{id:'base',label:'Base de datos'}];

  return(
    <div style={{minHeight:'100vh',background:DARK,color:TEXT,fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{borderBottom:`1px solid ${BORDER}`,padding:'20px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{margin:0,fontSize:20,fontFamily:"'Playfair Display',serif",fontWeight:700}}>Dialgo <span style={{color:ACC}}>Ventas</span></h1>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:3}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:sheetStatus==='ok'?'#4CAF50':sheetStatus==='loading'?ACC:sheetStatus==='error'?'#f44336':'#444'}}/>
            <p style={{margin:0,fontSize:10,color:'#444',fontFamily:"'DM Mono',monospace",letterSpacing:'0.08em'}}>
              {sheetStatus==='ok'?`SHEETS CONECTADO · ${sheetMsg||''}`:sheetStatus==='loading'?'CONECTANDO A SHEETS...':sheetStatus==='error'?`SIN CONEXIÓN · ${sheetMsg}`:'DATOS LOCALES · CONFIGURÁ SHEETS PARA PERSISTENCIA'}
            </p>
          </div>
        </div>
        <div style={{display:'flex',gap:6}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?ACC:'transparent',color:tab===t.id?DARK:'#777',border:`1px solid ${tab===t.id?ACC:BORDER}`,borderRadius:7,padding:'7px 14px',cursor:'pointer',fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:'0.06em'}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:'28px',maxWidth:1140,margin:'0 auto'}}>

        {/* ── DASHBOARD ── */}
        {tab==='dashboard'&&(
          <div style={{display:'flex',flexDirection:'column',gap:24}}>
            {/* Filtros */}
            <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
              <span style={{fontSize:10,color:MUTED,fontFamily:'DM Mono',letterSpacing:'0.1em'}}>AÑO:</span>
              {['todos',...years].map(y=>(
                <button key={y} onClick={()=>setFilterYear(y)} style={{background:filterYear===y?`${ACC}22`:'transparent',color:filterYear===y?ACC:'#555',border:`1px solid ${filterYear===y?ACC:BORDER}`,borderRadius:5,padding:'4px 10px',cursor:'pointer',fontSize:11,fontFamily:'DM Mono'}}>
                  {y==='todos'?'Todos':y}
                </button>
              ))}
              <span style={{fontSize:10,color:MUTED,fontFamily:'DM Mono',marginLeft:6,letterSpacing:'0.1em'}}>CAT:</span>
              {['todas',...cats].map(c=>(
                <button key={c} onClick={()=>setFilterCat(c)} style={{background:filterCat===c?`${ACC}22`:'transparent',color:filterCat===c?ACC:'#555',border:`1px solid ${filterCat===c?ACC:BORDER}`,borderRadius:5,padding:'4px 10px',cursor:'pointer',fontSize:11,fontFamily:'DM Mono'}}>
                  {c==='todas'?'Todas':c}
                </button>
              ))}
            </div>

            {/* KPIs */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
              <KPI label="Ingresos registrados" value={fmt(totalIngresos)} sub={`${conMonto.length} ventas con monto`} hi/>
              <KPI label="Total ventas" value={filtered.length} sub={`${ventas.length} en historial completo`}/>
              <KPI label="Ticket promedio" value={fmt(ticketProm)} sub="sobre ventas con monto"/>
              <KPI label="Clientes únicos" value={new Set(filtered.map(v=>v.c)).size} sub="en el período"/>
            </div>

            {/* Evolución anual */}
            <Panel>
              <Sec>Evolución anual</Sec>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={byYear} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222"/>
                  <XAxis dataKey="year" tick={{fill:MUTED,fontSize:11,fontFamily:'DM Mono'}}/>
                  <YAxis yAxisId="v" tick={{fill:MUTED,fontSize:10}} width={25}/>
                  <YAxis yAxisId="i" orientation="right" tick={{fill:MUTED,fontSize:10}} width={55} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
                  <Tooltip content={<TT/>}/>
                  <Bar yAxisId="i" dataKey="ingresos" fill={`${ACC}30`} radius={[4,4,0,0]} name="Ingresos"/>
                  <Bar yAxisId="v" dataKey="ventas" fill={ACC} radius={[4,4,0,0]} name="Ventas"/>
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            {/* Evolución mensual */}
            {byMonth.length>2&&(
              <Panel>
                <Sec>Evolución mensual</Sec>
                <ResponsiveContainer width="100%" height={170}>
                  <AreaChart data={byMonth}>
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={ACC} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={ACC} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222"/>
                    <XAxis dataKey="mes" tick={{fill:MUTED,fontSize:10,fontFamily:'DM Mono'}}/>
                    <YAxis yAxisId="v" tick={{fill:MUTED,fontSize:10}} width={20}/>
                    <Tooltip content={<TT/>}/>
                    <Area yAxisId="v" type="monotone" dataKey="ventas" stroke={ACC} strokeWidth={2} fill="url(#g)" name="Ventas"/>
                  </AreaChart>
                </ResponsiveContainer>
              </Panel>
            )}

            {/* Categoría + Geografía */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <Panel>
                <Sec>Categoría de producto</Sec>
                <div style={{display:'flex',gap:16,alignItems:'center'}}>
                  <ResponsiveContainer width={150} height={150}>
                    <PieChart><Pie data={byCat} cx="50%" cy="50%" innerRadius={38} outerRadius={68} paddingAngle={3} dataKey="value">
                      {byCat.map((_,i)=><Cell key={i} fill={CAT_COLORS[byCat[i].name]||COLORS[i]}/>)}
                    </Pie><Tooltip content={<TT/>}/></PieChart>
                  </ResponsiveContainer>
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:7}}>
                    {byCat.map((p,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <div style={{display:'flex',alignItems:'center',gap:7}}>
                          <div style={{width:8,height:8,borderRadius:2,background:CAT_COLORS[p.name]||COLORS[i],flexShrink:0}}/>
                          <span style={{fontSize:11,color:'#bbb',fontFamily:'DM Mono'}}>{p.name}</span>
                        </div>
                        <span style={{fontSize:11,color:ACC,fontFamily:'DM Mono'}}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
              <Panel>
                <Sec>Distribución geográfica</Sec>
                <div style={{display:'flex',gap:14,alignItems:'center'}}>
                  <ResponsiveContainer width={150} height={150}>
                    <PieChart><Pie data={byProv.slice(0,6)} cx="50%" cy="50%" innerRadius={38} outerRadius={68} paddingAngle={3} dataKey="value">
                      {byProv.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                    </Pie><Tooltip content={<TT/>}/></PieChart>
                  </ResponsiveContainer>
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:7}}>
                    {byProv.slice(0,6).map((p,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <div style={{display:'flex',alignItems:'center',gap:7}}>
                          <div style={{width:8,height:8,borderRadius:2,background:COLORS[i%COLORS.length],flexShrink:0}}/>
                          <span style={{fontSize:11,color:'#bbb',fontFamily:'DM Mono'}}>{p.name}</span>
                        </div>
                        <span style={{fontSize:11,color:ACC,fontFamily:'DM Mono'}}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>

            {/* Ingresos por categoría */}
            <Panel>
              <Sec>Ingresos por categoría</Sec>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={catIngresos} layout="vertical">
                  <XAxis type="number" tick={{fill:MUTED,fontSize:10}} tickFormatter={v=>fmt(v)}/>
                  <YAxis dataKey="name" type="category" tick={{fill:'#aaa',fontSize:11,fontFamily:'DM Mono'}} width={110}/>
                  <Tooltip content={<TT/>}/>
                  <Bar dataKey="value" radius={[0,6,6,0]}>{catIngresos.map((e,i)=><Cell key={i} fill={CAT_COLORS[e.name]||COLORS[i]}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            {/* Medios + Canal */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <Panel><Sec>Medio de pago</Sec>{BarH(byMP)}</Panel>
              <Panel><Sec>Canal de origen</Sec>{BarH(byMC)}</Panel>
            </div>

            {/* Sexo + Cómo conoció + Motivo (datos nuevos) */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
              <Panel>
                <Sec>Sexo del cliente</Sec>
                {bySexo.some(s=>s.name!=='Sin dato')?(
                  <div style={{display:'flex',gap:14,alignItems:'center',marginTop:8}}>
                    <ResponsiveContainer width={100} height={100}>
                      <PieChart><Pie data={bySexo.filter(s=>s.name!=='Sin dato')} cx="50%" cy="50%" innerRadius={28} outerRadius={46} paddingAngle={4} dataKey="value">
                        {bySexo.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
                      </Pie><Tooltip content={<TT/>}/></PieChart>
                    </ResponsiveContainer>
                    <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
                      {bySexo.map((p,i)=>(
                        <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <div style={{display:'flex',alignItems:'center',gap:6}}>
                            <div style={{width:7,height:7,borderRadius:2,background:COLORS[i],flexShrink:0}}/>
                            <span style={{fontSize:11,color:'#aaa',fontFamily:'DM Mono'}}>{p.name}</span>
                          </div>
                          <span style={{fontSize:11,color:ACC,fontFamily:'DM Mono'}}>{p.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ):<p style={{color:MUTED,fontSize:11,fontFamily:'DM Mono',margin:'8px 0 0'}}>Sin datos aún — se completará con el nuevo formato</p>}
              </Panel>
              <Panel>
                <Sec>Cómo nos conocieron</Sec>
                {byConocio.length>0?BarH(byConocio):<p style={{color:MUTED,fontSize:11,fontFamily:'DM Mono',margin:'8px 0 0'}}>Sin datos aún — se completará con el nuevo formato</p>}
              </Panel>
              <Panel>
                <Sec>Motivo de compra</Sec>
                {byMotivo.length>0?BarH(byMotivo):<p style={{color:MUTED,fontSize:11,fontFamily:'DM Mono',margin:'8px 0 0'}}>Sin datos aún — se completará con el nuevo formato</p>}
              </Panel>
            </div>

          </div>
        )}

        {/* ── NUEVA VENTA ── */}
        {tab==='agregar'&&(
          <div style={{maxWidth:640,margin:'0 auto',display:'flex',flexDirection:'column',gap:18}}>
            <div>
              <h2 style={{margin:'0 0 4px',fontFamily:"'Playfair Display',serif",fontSize:20}}>Nueva venta</h2>
              <p style={{margin:0,color:MUTED,fontSize:12,fontFamily:'DM Mono'}}>Pegá el mensaje del grupo de WhatsApp — nuevo o viejo formato.</p>
            </div>

            {/* Template del nuevo formato */}
            <details style={{background:'#181818',border:`1px solid ${BORDER}`,borderRadius:8,padding:'10px 14px'}}>
              <summary style={{cursor:'pointer',fontSize:11,color:ACC,fontFamily:'DM Mono',letterSpacing:'0.08em'}}>VER FORMATO DE MENSAJE NUEVO ▾</summary>
              <pre style={{margin:'12px 0 0',fontSize:11,color:'#aaa',fontFamily:'DM Mono',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{`VENTA Nº: 
Fecha: 

— PRODUCTO —
Pedido + (cantidad): 
Por encargo (Sí/No): 
Seña (Sí/No): 
Monto total: 

— CLIENTE —
Nombre: 
Teléfono: 
Sexo (M/F/Otro): 
Grupo etario (de 10 en 10): 
Primera compra (Sí/No): 
Cómo nos conoció: Instagram / TikTok / Google / ML / Recomendación / Ya nos conocía / Otro
Motivo (Regalo/Uso propio/Ambos): 

— ENVÍO —
Medio de compra: 
Medio de pago: 
Tipo de envío: 
Dirección: 
Provincia:`}</pre>
            </details>

            <textarea value={input} onChange={e=>{setInput(e.target.value);setParsed(null);setErr('');setSaved(false);}}
              placeholder={"VENTA Nº: 177\nPedido + (cantidad): Reloj Galaxia (1)\nNombre: ...\n..."}
              style={{width:'100%',minHeight:220,background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,color:TEXT,padding:16,fontFamily:'DM Mono',fontSize:12,resize:'vertical',outline:'none',lineHeight:1.7,boxSizing:'border-box'}}
            />
            <button onClick={handleParse} style={{background:ACC,color:DARK,border:'none',borderRadius:8,padding:'11px 22px',fontFamily:'DM Mono',fontSize:12,fontWeight:600,letterSpacing:'0.08em',cursor:'pointer'}}>
              PARSEAR VENTA
            </button>
            {err&&<div style={{background:'#2A1010',border:'1px solid #5A2A2A',borderRadius:8,padding:12,color:'#FF9999',fontSize:12,fontFamily:'DM Mono'}}>⚠ {err}</div>}
            {parsed&&(
              <div style={{background:CARD,border:`1px solid ${ACC}44`,borderRadius:12,padding:18,display:'flex',flexDirection:'column',gap:12}}>
                <span style={{fontFamily:'DM Mono',fontSize:11,color:ACC,letterSpacing:'0.1em'}}>PREVISUALIZACIÓN — VENTA Nº{parsed.n}</span>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px 20px'}}>
                  {[
                    ['Cliente',parsed.c],['Categoría',parsed.cat],['Monto',fmtFull(parsed.m)],['Provincia',parsed.prov||'—'],
                    ['Canal',parsed.mc||'—'],['Pago',parsed.mp||'—'],['Sexo',parsed.sexo||'—'],
                    ['Primera compra',parsed.primera===null?'—':parsed.primera?'Sí':'No'],
                    ['Cómo nos conoció',parsed.conocio||'—'],['Motivo',parsed.motivo||'—'],
                  ].map(([k,v])=>(
                    <div key={k} style={{display:'flex',flexDirection:'column',gap:2}}>
                      <span style={{fontSize:9,color:'#444',fontFamily:'DM Mono',textTransform:'uppercase',letterSpacing:'0.1em'}}>{k}</span>
                      <span style={{fontSize:13,color:TEXT}}>{v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} disabled={saving} style={{marginTop:4,background:saved?'#1A3A1A':saving?'#333':ACC,color:saved?'#6ABA6A':saving?'#888':DARK,border:`1px solid ${saved?'#3A7A3A':saving?BORDER:ACC}`,borderRadius:8,padding:'11px 18px',fontFamily:'DM Mono',fontSize:12,fontWeight:600,cursor:saving?'wait':'pointer',letterSpacing:'0.08em'}}>
                  {saved?'✓ GUARDADO':saving?'GUARDANDO...':'CONFIRMAR Y GUARDAR'}
                </button>
                {sheetStatus==='ok'&&!saved&&<p style={{margin:0,fontSize:10,color:MUTED,fontFamily:'DM Mono',textAlign:'center'}}>Se guardará en Google Sheets y en la vista local</p>}
              </div>
            )}
          </div>
        )}

        {/* ── BASE DE DATOS ── */}
        {tab==='base'&&(
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <h2 style={{margin:'0 0 4px',fontFamily:"'Playfair Display',serif",fontSize:18}}>Base de datos</h2>
              <p style={{margin:0,color:MUTED,fontSize:11,fontFamily:'DM Mono'}}>{ventas.length} registros · Nº{ventas[0]?.n} → Nº{ventas[ventas.length-1]?.n}</p>
            </div>
            <div style={{overflowX:'auto',borderRadius:10,border:`1px solid ${BORDER}`}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:11,fontFamily:'DM Mono'}}>
                <thead>
                  <tr style={{background:'#1A1A1A'}}>
                    {['Nº','Fecha','Cliente','Sexo','Categoría','Monto','Provincia','Canal','Pago','Conoció','Motivo'].map(h=>(
                      <th key={h} style={{padding:'9px 12px',textAlign:'left',color:MUTED,fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',borderBottom:`1px solid ${BORDER}`,whiteSpace:'nowrap'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((v,i)=>(
                    <tr key={i} style={{background:i%2===0?'#151515':MID}}>
                      <td style={{padding:'7px 12px',color:ACC,fontWeight:600}}>{v.n}</td>
                      <td style={{padding:'7px 12px',color:'#777'}}>{v.f}</td>
                      <td style={{padding:'7px 12px',color:TEXT,whiteSpace:'nowrap',maxWidth:150,overflow:'hidden',textOverflow:'ellipsis'}}>{v.c}</td>
                      <td style={{padding:'7px 12px',color:'#888'}}>{v.sexo||'—'}</td>
                      <td style={{padding:'7px 12px'}}>
                        <span style={{fontSize:9,padding:'2px 7px',borderRadius:4,background:`${CAT_COLORS[v.cat]||'#444'}22`,color:CAT_COLORS[v.cat]||'#aaa',border:`1px solid ${CAT_COLORS[v.cat]||'#444'}44`}}>{v.cat}</span>
                      </td>
                      <td style={{padding:'7px 12px',color:v.m>0?ACC:MUTED,whiteSpace:'nowrap'}}>{v.m>0?fmtFull(v.m):'—'}</td>
                      <td style={{padding:'7px 12px',color:'#888'}}>{v.prov||'—'}</td>
                      <td style={{padding:'7px 12px',color:'#777',maxWidth:100,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.mc||'—'}</td>
                      <td style={{padding:'7px 12px',color:'#777',whiteSpace:'nowrap'}}>{v.mp||'—'}</td>
                      <td style={{padding:'7px 12px',color:'#777'}}>{v.conocio||'—'}</td>
                      <td style={{padding:'7px 12px',color:'#777'}}>{v.motivo||'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
