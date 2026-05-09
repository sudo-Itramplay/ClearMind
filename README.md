# ClearMind 🧠✨

Un espai virtual acollidor per a la concentració i la meditació, dissenyat amb especial atenció a les persones amb TDAH.

> **"Una casa digital on cada habitació té un propòsit: estudiar, descansar, i trobar la calma."**

---

## 🎨 Filosofia de Disseny

ClearMind evoca la **calidesa d'un cafè de jazz íntim** (estètica Leblanc de Persona 5) combinada amb la **sensació de confort d'una habitació personal acollidora**. 

Tots els elements visuals estan pensats per:
- 🌡️ Transmetre calidesa (tons àmbar i fusta, mai blancs/negres purs)
- 🧘 Reduir l'ansietat (interaccions suaus, feedback clar, sense sorpreses)
- 🎯 Millorar el focus (jerarquia visual neta, espai generós, distraccions mínimes)

📖 **Consulta la [Guia d'Estil](GUIDES/GUIA-ESTIL.md)** per a la documentació completa del sistema de disseny.

---

## 🚀 Començar

### Requisits previs
- Node.js ≥ 18
- npm ≥ 9

### Instal·lació

```bash
# Clonar el repositori
git clone <url-del-repositori>
cd ClearMind

# Instal·lar dependències
npm install

# Mode desenvolupament (amb hot reload)
npm run dev

# Obrirà automàticament http://localhost:3000
```

### Build per producció

```bash
npm run build
```

Genera els fitxers optimitzats a la carpeta `dist/`.

---

## 🏗️ Arquitectura

### Tecnologies
- **React 19** — Interfície d'usuari
- **Webpack 5** — Bundler i dev server
- **Babel** — Transpilació JSX amb runtime automàtic
- **Web Audio API** — Síntesi de sons en temps real
- **localStorage** — Persistència de dades

### Estructura del Projecte

```
src/
├── index.js                      # Punt d'entrada
├── App.jsx                       # Shell amb hash routing
├── context/
│   ├── TodoContext.jsx           # Estat global de tasques (CRUD)
│   └── SoundContext.jsx          # Sistema de so opt-in
├── components/
│   ├── ui/                       # Primitives reutilitzables
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── RoomPills.jsx         # Navegació (3 pills)
│   │   └── SoundToggle.jsx
│   ├── hall/                     # 🏠 Sala principal
│   │   ├── Hall.jsx
│   │   ├── Calendar.jsx          # Calendari amb esferes reactives
│   │   ├── WallClock.jsx         # Rellotge SVG analògic
│   │   └── Door.jsx              # Porta reutilitzable (3D)
│   ├── study/                    # 📚 Sala d'estudi
│   │   ├── Study.jsx
│   │   ├── CorkBoard.jsx         # Pissarra amb post-its
│   │   ├── Notebook.jsx          # Quadern de tasques
│   │   ├── Watch.jsx             # Timer / Cronòmetre
│   │   └── ...
│   └── meditate/                 # 🧘 Sala de meditació
│       └── Meditate.jsx          # 3 modes de respiració
├── hooks/
│   ├── useTimer.js
│   ├── useStopwatch.js
│   ├── useCalendarDays.js
│   └── useFocusTrap.js
├── data/
│   └── mockDB.js                 # Base de dades simulada (localStorage)
├── utils/
│   └── date.js
└── styles/
    └── globals.css               # Sistema de disseny complet
```

---

## ✨ Funcionalitats

### 🏠 Hall — Sala Principal
- **Calendari reactiu**: 35 esferes que mostren l'activitat dels últims 35 dies. La intensitat del color varia segons el nombre de tasques.
- **Rellotge analògic**: SVG funcional amb manetes d'hora, minut i segon.
- **Portes 3D**: Duess portes idèntiques amb efecte perspective i resplendor (àmbar per a l'estudi, teula per a la meditació).
- **Navegació minimalista**: 3 pills flotants (Study — Hall — Meditate).

### 📚 Study — Sala d'Estudi
- **Pissarra de suro**: Post-its de colors (groc, rosa, menta) que representen les tasques d'avui.
- **Quadern de tasques**: Formulari per afegir noves tasques amb prioritat i data.
- **Timer**: Compte enrere amb presets (15, 25, 45, 60 min) i anell de progrés SVG.
- **Cronòmetre**: Amb temps objectiu configurable. Canvia de color quan se supera l'objectiu.
- **Sons**: So suau al completar una tasca, so de campana quan el timer acaba.

### 🧘 Meditate — Sala de Meditació
- **3 modes de respiració**:
  - ⚡ **Activation** (3 min): Respiració ràpida 2-1-2-1
  - 🌿 **Anxiety Relief** (4 min): Box breathing 4-4-4-4
  - 🌙 **Sleep** (10 min): Tècnica 4-7-8
- **Cercle de respiració**: Visualització animada que guia la respiració.
- **Sons**: Gong suau al completar la sessió.

### 🗑️ Diàlegs de Confirmació
Confirmació elegant per a accions destructives:
- Esborrar tasca
- Reiniciar cronòmetre
- Descartar canvis del formulari

---

## ♿ Accessibilitat

Aquest projecte segueix les directrius **WCAG 2.1 AA**:

- ✅ **Navegació per teclat** completa (Tab, Enter, Escape, fletxes)
- ✅ **Anells de focus** visibles en tots els elements interactius
- ✅ **ARIA labels** per a lectors de pantalla
- ✅ **Contrasts** ≥ 4.5:1 per a text
- ✅ **Targets tàctils** ≥ 48px en mòbil
- ✅ **`prefers-reduced-motion`** respectat (animacions desactivades)
- ✅ **Font base 18px** per a millor llegibilitat (TDAH-friendly)

---

## 🎨 Sistema de Disseny

### Paleta Principal
| Color | Ús |
|-------|-----|
| `#FBF7F0` | Fons general (crema càlid) |
| `#2C2218` | Parets (fusta fosca) |
| `#D4A574` | Resplendor àmbar (elements actius) |
| `#D4763A` | Accent estudi (taronja càlid) |
| `#5A8A8C` | Accent meditació (teula suau) |

### Tipografia
- **Títols**: Playfair Display (serif elegant)
- **Cos**: Inter (sans-serif llegible)
- **Números**: JetBrains Mono (monospace per a rellotges)

📖 **Documentació completa**: Veure [`GUIDES/GUIA-ESTIL.md`](GUIDES/GUIA-ESTIL.md)

---

## 🛠️ Desenvolupament

### Scripts disponibles

| Comanda | Descripció |
|---------|-----------|
| `npm run dev` | Servidor de desenvolupament amb hot reload (port 3000) |
| `npm run build` | Build optimitzat per producció |
| `npm start` | Alias de `npm run dev` |

### Convencions de Codi
- **Components**: PascalCase (`CalendarWall.jsx`)
- **Hooks**: camelCase amb `use` (`useTimer.js`)
- **CSS classes**: kebab-case (`.calendar-grid`)
- **Props**: camelCase (`onToggle`, `isLoading`)

---

## 🧪 Proves Recomanades

1. **Hall**: Completa tasques a l'estudi i observa com el calendari actualitza les esferes en temps real.
2. **Study**: Afegeix tasques, marca-les com a fetes (escolta el so), prova el cronòmetre amb temps objectiu.
3. **Meditate**: Canvia entre els 3 modes de respiració i comprova els diferents cicles.
4. **Teclat**: Navega tota l'aplicació sense ratolí (Tab, Enter, Escape).
5. **Mòbil**: Redueix la finestra a < 640px i verifica que tot és usable.

---

## 📝 Notes

- **Sense backend**: Les dades es guarden a `localStorage` mitjançant `mockDB.js`.
- **Sense arxius de so**: Tots els sons es generen amb Web Audio API (zero dependències d'arxius).
- **Sense React Router**: S'usa hash-based routing natiu per mantenir el projecte lleuger.

---

## 👤 Autor

**@sudo-Itramplay**

Projecte desenvolupat com a exercici acadèmic (FH/UNI) amb l'objectiu de crear una eina útil i accessible per a la concentració.

---

## 📄 Llicència

MIT License — Feel free to use and modify.

---

<div align="center">

**ClearMind** · *Un espai càlid per a la concentració i la calma* 🧠✨

</div>
