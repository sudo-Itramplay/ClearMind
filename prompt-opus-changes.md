# Prompt de canvis — ClearMind
## Per a: Claude Opus (sessió nova, accés al projecte)

El projecte ja existeix al directori. Aplica els canvis i correccions següents al codi actual. **No reconstrueixis des de zero** — modifica el que ja hi ha.

---

## 🔧 CANVIS VISUALS I DE LAYOUT

### 1. Capçalera — Reemplaçar per 3 esferes flotants
**Elimina completament** la capçalera actual (`app-header`). Substitueix-la per:

- **3 esferes el·líptiques** (pills) flotant al centre superior
- Ordre (d'esquerra a dreta): **Study — Hall — Meditate**
- Mida: 40px d'ample × 24px d'alt, `border-radius: 9999px`
- Fons: `--wood-mid` amb text `--cream` (11px, majúscules)
- Activa: fons `--amber-glow`, text blanc
- Inactiva: opacitat 60%, hover → 100%
- Posició: `fixed`, `top: 12px`, `left: 50%`, `transform: translateX(-50%)`
- `z-index: 1000`, gap: 8px
- Sense títol, sense logo, sense barra pesada

### 2. Portes — UNIFICAR a un sol component
Les dues portes del Hall tenen estils DIFERENTS. **Crea UN sol component `Door.jsx` reutilitzable**:

- Mateixa mida per ambdues: 160px × 200px
- Mateix marc de fusta, mateixos panells, mateix efecte 3D
- Mateix comportament hover (`rotateY(-18deg)`, so de cruixit)
- **Única diferència permesa**: el color del resplendor (glow)
  - Porta Study: resplendor àmbar `rgba(212, 165, 116, 0.35)`
  - Porta Meditate: resplendor teula `rgba(90, 138, 140, 0.35)`
- Mateixa placa de llautó sota la porta ("Study Room" / "Meditate")
- NO facis una porta més alta o més ampla que l'altra

### 3. Layout del Hall — Ajustar perquè càpiga tot a la vista
A 100% zoom en pantalla estàndard (1366×768 o 1920×1080), **tot els elements han de ser visibles sense scroll**:

- Secció superior (calendari + rellotge): ~35vh
- Secció mitjana (portes + taula): ~45vh
- Secció inferior (terra): ~20vh
- Si cal, redueix lleugerament les mides però que tot es vegi
- Les portes NO han de xocar amb el calendari
- Usa `vh` i flexbox/grid per distribuir l'espai
- Fes les distàncies dinàmiques tot el possible per evitar errors

### 4. Rellotge del Study — Centrar els números PERFECTAMENT
El temps del cronòmetre/timer NO està centrat dins l'anelleta SVG. Corregeix:

```css
.timer-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.timer-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--cream);
  line-height: 1;
  text-align: center;
}
```

- Els dos punts de "25:00" han d'estar exactament al centre geomètric del cercle
- El contenidor del text i l'SVG comparteixen pare amb `position: relative`

---

## 🗑️ DIÀLEGS DE CONFIRMACIÓ (CRUD)

Afegeix diàlegs de confirmació per accions destructives usant el component Modal existent:

### 1. Esborrar tasca
- Títol: "Vols eliminar aquesta tasca?"
- Missatge: "S'esborrarà de la pissarra."
- Botons: "Conservar" (ghost) / "Eliminar" (vermell `var(--accent-danger)`)

### 2. Reiniciar cronòmetre
- Títol: "Reiniciar el cronòmetre?"
- Missatge: "El progrés de la sessió actual es perdrà."
- Botons: "Cancel·lar" / "Reiniciar"

### 3. Tancar quadern amb canvis sense guardar
- Títol: "Descartar canvis?"
- Missatge: "Hi ha canvis sense guardar al formulari."
- Botons: "Seguir editant" / "Descartar"

**Estil dels diàlegs:**
- Fons fosc: `rgba(26,20,16,0.7)` + `backdrop-filter: blur(4px)`
- Caixa: fons `--cream`, vora `--wood-dark` 1px, `border-radius: 16px`
- Títol: 18px Playfair Display
- Botó principal: fons `--wood-mid`, text blanc
- Botó cancel·lar: ghost, text `--text-body`
- Escape i clic fora tanquen el diàleg (cancel·len)

---

## 📅 CALENDARI — Verificar reactivitat

Assegura't que les esferes del calendari **s'actualitzen immediatament** quan canvien les tasques:

- Quan s'afegeix una tasca → l'esfera del dia corresponent canvia de color
- Quan es completa una tasca → canvi d'intensitat o checkmark
- Quan s'elimina una tasca → es redueix la intensitat
- Verifica que `useCalendarDays` rep `todos` del `useTodos()` i que el `useMemo` té `todos` com a dependència

---

## 🏗️ ARQUITECTURA I CODI NET

### Estructura de fitxers (organitza així si no ho està):
```
src/
├── index.js
├── App.jsx
├── context/
│   └── AppContext.jsx       # TodoContext + SoundContext + hooks
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Loader.jsx
│   │   └── BackButton.jsx
│   ├── hall/
│   │   ├── Hall.jsx
│   │   ├── CalendarWall.jsx
│   │   ├── WallClock.jsx
│   │   └── Door.jsx         # Component ÚNIC reutilitzable
│   ├── study/
│   │   ├── Study.jsx
│   │   ├── CorkBoard.jsx
│   │   ├── Notebook.jsx
│   │   ├── NotebookForm.jsx
│   │   └── DeskTimer.jsx
│   └── meditate/
│       ├── Meditate.jsx
│       ├── BreathingCircle.jsx
│       └── ModeSelector.jsx
├── hooks/
│   ├── useTimer.js
│   └── useCalendarDays.js
├── data/
│   └── mockDB.js
└── styles/
    └── globals.css
```

### Principis:
- **Responsabilitat única**: cada component fa UNA cosa
- `Door.jsx` només renderitza una porta, rep `kind`, `label`, `onClick` per props
- `WallClock.jsx` només el rellotge, sense lògica de calendari
- Passa dades cap avall (`props`), eleva estat cap amunt (`context`)
- **No facis prop drilling** — usa context per estat global

### Convencions de noms:
- Components: PascalCase (`CalendarWall.jsx`)
- Hooks: camelCase amb `use` (`useTimer.js`)
- Classes CSS: kebab-case (`calendar-grid`, `door-wrap`)
- Props: camelCase (`onToggle`, `isLoading`)

---

## ✅ LLISTA DE VERIFICACIÓ FINAL

Abans d'acabar, verifica:
- [ ] La capçalera són 3 esferes pills (Study — Hall — Meditate)
- [ ] Les portes usen el MATEIX component, només canvia el glow
- [ ] El Hall cap a la vista sense scroll
- [ ] Els números del cronòmetre estan PERFECTAMENT centrats
- [ ] Apareixen diàlegs de confirmació per esborrar/reiniciar/descartar
- [ ] El calendari s'actualitza quan canvien les tasques
- [ ] Cada fitxer exporta UN component principal
- [ ] Tots els botons interactius tenen `aria-label`
- [ ] Tots els elements interactius tenen anell de focus visible
- [ ] No hi ha errors a la consola

---

## 📝 REGLA CLAU

**Modifica, no reconstrueixis.** Mantén l'estètica càlida i els colors existents. Aquests són retocs i correccions, no un redisseny.
