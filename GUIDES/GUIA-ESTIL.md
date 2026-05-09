# Guia d'Estil — ClearMind
## Estètica càlida i accessible per a persones amb TDAH

---

## 1. FILOSOFIA DE DISSENY

ClearMind és una **casa virtual acollidora** que evoca la calidesa d'un cafè de jazz íntim (Leblanc de Persona 5) combinada amb la sensació de confort d'una habitació isomètrica acollidora.

**Principis:**
- **Càlid, no abrasador** — Tons àmbar i fusta, mai blancs purs ni negres purs
- **Clar, no aclaparador** — Jerarquia visual neta, espai generós, elements rellevants
- **Calm, no avorrit** — Microinteraccions suaus, feedback clar, sense sorpreses
- **Accessible per a TDAH** — Contrasts alts però suaus, fonts llegibles, targets tàctils grans

---

## 2. PALETA DE COLORS

### Colors principals
| Nom (català) | Token CSS | Valor | Ús |
|---|---|---|---|
| **Fons pàgina** | `--bg-page` | `#FBF7F0` | Fons general (crema càlid) |
| **Fons paret** | `--bg-wall` | `#2C2218` | Parets de les habitacions (fusta fosca) |
| **Fons terra** | `--bg-floor` | `#3D2E20` | Terres (fusta mitjana) |
| **Fusta fosca** | `--wood-dark` | `#4A3728` | Marc de portes, mobles |
| **Fusta mitjana** | `--wood-mid` | `#6B4E3D` | Taules, superfícies |
| **Fusta clara** | `--wood-light` | `#8B6F5C` | Marc de pissarra, detalls |
| **Resplendor àmbar** | `--amber-glow` | `#D4A574` | Llum principal, elements actius |
| **Àmbar suau** | `--amber-soft` | `#E8C9A0` | Destacats suaus, esferes |
| **Crema** | `--cream` | `#F5E6D3` | Paper, text sobre fosc |

### Colors de suport
| Nom (català) | Token CSS | Valor | Ús |
|---|---|---|---|
| **Suro** | `--cork` | `#C4A882` | Fons de pissarra |
| **Suro fosc** | `--cork-dark` | `#8B7355` | Ombres de pissarra |
| **Títols** | `--text-heading` | `#3A271A` | Títols (cafè fosc) |
| **Cos** | `--text-body` | `#57493B` | Text general (marró llegible) |
| **Text fosc** | `--text-on-dark` | `#F2E2C9` | Text sobre fons fosc |
| **Text discret** | `--text-muted` | `#A4907A` | Text secundari |

### Colors d'èmfasi
| Nom (català) | Token CSS | Valor | Ús |
|---|---|---|---|
| **Estudi** | `--accent-study` | `#D4763A` | Sala d'estudi, cronòmetre |
| **Meditació** | `--accent-meditate` | `#5A8A8C` | Sala de meditació, calma |
| **Perill** | `--accent-danger` | `#A65D57` | Errors, eliminar (vermell apagat) |

### Colors de notes
| Nom (català) | Token CSS | Valor | Ús |
|---|---|---|---|
| **Post-it groc** | `--postit-yellow` | `#F5E6A3` | Prioritat normal |
| **Post-it rosa** | `--postit-rose` | `#E8B4B8` | Prioritat alta |
| **Post-it menta** | `--postit-mint` | `#B8D8C8` | Tasca completada |

### Colors d'esferes
| Nom (català) | Token CSS | Valor | Ús |
|---|---|---|---|
| **Esfera activa** | `--sphere-on` | `#F5A623` | Esfera amb tasques |
| **Esfera inactiva** | `--sphere-off` | `#3D2E20` | Esfera sense tasques |

---

## 3. TIPOGRAFIA

| Funció | Font | Pes | Mida | Ús |
|---|---|---|---|---|
| **Títols** | Playfair Display | 600-700 | 24-32px | Noms d'habitació, títols de secció |
| **Cos** | Inter | 400-500 | 16-18px | Text general, formularis |
| **Números** | JetBrains Mono | 400-500 | 16-24px | Rellotge, cronòmetre, dates |
| **Etiquetes** | Inter | 500 | 11-14px | Botons, etiquetes, llegendes |

**Regles:**
- Mida base: `18px` (més gran per a TDAH)
- Interlineat: `1.6`
- Títols: majúscules només per etiquetes petites (navegació)
- Mai uses fonts més petites de `16px` en mòbil

---

## 4. ESPAIAT I MESURES

### Tokens d'espaiat
| Nom | Valor | Ús |
|---|---|---|
| `--space-xs` | 0.5rem (8px) | Gap petit entre elements |
| `--space-sm` | 0.75rem (12px) | Padding intern |
| `--space-md` | 1.25rem (20px) | Separació estàndard |
| `--space-lg` | 2rem (32px) | Separació gran |

### Targets tàctils
- **Mínim**: 48px × 48px en mòbil
- **Mínim**: 36px × 36px en escriptori
- **Botons**: alçada mínima 44px

### Radi de cantonada
| Token | Valor | Ús |
|---|---|---|
| `sm` | 8px | Botons petits, inputs |
| `md` | 12px | Targetes, modals |
| `lg` | 16px | Panells |
| `pill` | 9999px | Botons ovalats, esferes |

---

## 5. OMBRES I LLUM

### Ombres
```css
--shadow-sm: 0 1px 3px rgba(60, 40, 20, 0.15);   /* Elements petits */
--shadow-md: 0 4px 12px rgba(60, 40, 20, 0.2);   /* Targetes, modals */
--shadow-lg: 0 8px 24px rgba(60, 40, 20, 0.25);  /* Panells flotants */
```

### Resplendors (glows)
```css
--glow-amber: 0 0 40px 10px rgba(212, 165, 116, 0.3);  /* Porta estudi */
--glow-teal:  0 0 60px 20px rgba(90, 138, 140, 0.4);   /* Cercle meditació */
```

**Regla d'or:** Les ombres sempre són **càlides** (tons marrons), mai negres pures.

---

## 6. COMPONENTS

### Botó (`Button`)
- **Variants**:
  - `primary`: fons `--wood-mid`, text blanc
  - `secondary`: fons `--wood-light`, text fosc
  - `ghost`: transparent, vora `1px solid rgba(74,55,40,0.25)`
  - `danger`: fons `--accent-danger`, text blanc
- **Hover**: `translateY(-2px)`, ombra més gran
- **Active**: `scale(0.97)`, ombra més petita
- **Focus**: `outline: 3px solid var(--focus-ring)`, `outline-offset: 2px`
- **Pill**: `border-radius: 9999px` per botons de selecció

### Modal
- Fons: `--cream`
- Vora: `--wood-dark`, 1px
- `border-radius: 16px`
- Backdrop: `rgba(26,20,16,0.7)` + `backdrop-filter: blur(4px)`
- Padding: 24px
- Anell de focus dins el modal

### Post-it (nota)
- Mida: ~120px × 100px
- Rotació lleugera: -3deg a +3deg
- Pin visual a la part superior (::before)
- Ombra: `--shadow-md`
- Hover: `translateY(-4px)`, ombra més gran

---

## 7. ANIMAICIONS

### Durades
| Tipus | Durada | Ús |
|---|---|---|
| **Micro** | 150-200ms | Hover de botons, canvis d'estat |
| **Ràpida** | 300-400ms | Obertura de modal, transicions de pàgina |
| **Lenta** | 4-10s | Cicle de respiració, canvis d'ambient |

### Easing
```css
/* Estandard */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Entrada suau */
transition: all 0.4s cubic-bezier(0.0, 0, 0.2, 1);

/* Sortida */
transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
```

### Reducció de moviment
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. ACCESIBILITAT

### Colors i contrast
- **Text sobre fons clar**: mínim 4.5:1 (WCAG AA)
- **Text sobre fons fosc**: mínim 4.5:1
- **Text gran (18px+)**: mínim 3:1
- **No depenis NOMÉS del color** — afegeix icones o text per indicar estat

### Navegació per teclat
- **Tab**: ordre lògic d'esquerra a dreta, dalt a baix
- **Enter/Space**: activa botons, enllaços, checkboxes
- **Escape**: tanca modals
- **Fletxes**: navega dins grups (radio, calendar)

### Anell de focus
```css
:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}
```
- Visible en TOTS els elements interactius
- Mai uses `outline: none` sense alternativa

### ARIA
- Tots els botons sense text visible: `aria-label="Descripció"`
- Icones decoratives: `aria-hidden="true"`
- Modals: `role="dialog"`, `aria-modal="true"`
- Rellotge: `role="timer"`, `aria-live="polite"`
- Post-its: `role="checkbox"`, `aria-checked`

### Text per a lectors de pantalla
```jsx
<span className="sr-only">Text per a lectors de pantalla</span>
```

```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 9. PRINCIPIS PER A TDAH

1. **Espai generós** — No aixafis elements, deixa aire entre ells
2. **Feedback immediat** — Tota acció té una resposta visual/sònica
3. **Sense sorpreses** — Els elements es comporten de forma previsible
4. **Una cosa cada cop** — Cada component té una sola responsabilitat
5. **Colors càlids** — Evita blancs purs i negres purs, usa tons marrons/crème
6. **Fonts llegibles** — Inter és neta, JetBrains Mono per a números
7. **No massa opcions** — 3 modes de meditació, 4 presets de temps, etc.
8. **Celebració suau** — Confeti mínim, so suau, color menta per completar

---

## 10. ESTRUCTURA DE FITXERS

```
src/
├── index.js              # Punt d'entrada
├── App.jsx               # Enrutador i shell
├── context/
│   └── AppContext.jsx    # Contextos globals + hooks
├── components/
│   ├── ui/               # Primitives reutilitzables
│   ├── hall/             # Components del Hall
│   ├── study/            # Components de l'Estudi
│   └── meditate/         # Components de la Meditació
├── hooks/                # Hooks personalitzats
├── data/                 # Base de dades simulada
└── styles/               # CSS global
```

### Convencions de noms
| Tipus | Convenció | Exemple |
|---|---|---|
| Fitxer component | PascalCase | `CalendarWall.jsx` |
| Fitxer hook | camelCase + use | `useTimer.js` |
| Classe CSS | kebab-case | `.calendar-grid` |
| Prop | camelCase | `onToggle`, `isLoading` |
| Constant | UPPER_SNAKE_CASE | `MONTHS`, `DAYS` |

---

## 11. CHECKLIST DE QUALITAT

Abans de donar per acabat un component:
- [ ] Tots els botons tenen text visible o `aria-label`
- [ ] Totes les imatges/icones tenen `alt` o `aria-hidden`
- [ ] L'anell de focus és visible
- [ ] Funciona amb teclat (Tab, Enter, Escape)
- [ ] El contrast de colors passa WCAG AA
- [ ] `prefers-reduced-motion` està implementat
- [ ] Els targets tàctils són ≥ 48px en mòbil
- [ ] No hi ha `console.log` ni errors
- [ ] El component fa UNA sola cosa

---

*ClearMind — Un espai càlid per a la concentració i la calma*
