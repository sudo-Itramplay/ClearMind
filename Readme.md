# 🚀 Projecte: App de Productivitat (MVP - 3 Setmanes)

Aquest document defineix l'estructura i les convencions per al desenvolupament de l'aplicació. L'objectiu principal és la **velocitat d'execució** i la **claredat del codi**.

## 📂 Arquitectura de Carpetes (Modular Simplificada)

Hem optat per una estructura plana que redueix el temps de navegació entre fitxers i evita la sobre-enginyeria.

```text
src/
├── assets/         # Estils globals (CSS), imatges i logos.
├── components/     # Components UI reutilitzables (Button, Card, Input).
├── views/          # Pantalles completes de l'app (Pages).
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── Settings.jsx
├── hooks/          # Lògica d'estat i crides a API (Custom Hooks).
├── store/          # Estat global centralitzat.
└── utils/          # Funcions auxiliars (dates, validació de formularis).

---

## 🎨 Guia d'Estil Visual (TDAH Friendly)

L'aplicació utilitza una **paleta cromàtica fosca i reduïda** dissenyada específicament per minimitzar la fatiga visual i la distracció en persones amb TDAH. La consistència cromàtica és clau per crear un mapa mental clar i reduir la càrrega cognitiva.

### Variables CSS Globals

Tots els colors es defineixen a `ClearMind/src/assets/index.css` i s'accedeixen mitjançant variables CSS:

```css
:root {
  --color-bg: #203E39;
  --color-surface: #57493B;
  --color-primary: #3E8283;
  --color-secondary: #AE5815;
  --color-error: #C70D0B;
  --color-success: #5A9A7C;

  --color-text: #E8E4E0;
  --color-text-secondary: #B8B0A8;
  --color-text-muted: #8A8078;
  --color-text-inverse: #2A2520;
}
```

### Regla 60-30-10 per a TDAH

Per evitar el soroll visual, apliquem aquesta regla de forma estricta:

| Percentatge | Variable | Ús |
|-------------|----------|-----|
| **60%** | `--color-bg` | Fons de pantalla i àrees neutres. |
| **30%** | `--color-surface` | Targetes, panells, inputs i contenidors. |
| **10%** | `--color-primary` / `--color-secondary` | Només botons d'acció i indicadors d'estat. |

### Principis d'Accessibilitat

- **Sense blanc pur**: El text principal és `#E8E4E0` (blanc càlid). El blanc pur genera fatiga en sessions llargues.
- **Focus sempre visible**: Tots els elements interactius mostren un anell de focus de 3px amb `--color-secondary` quan es navega amb teclat.
- **Feedback previsible**: Tots els estats (hover, active, disabled) usen transicions de `0.2s`.
- **Errors puntuals**: El vermell (`--color-error`) només apareix quan hi ha un problema que atura el progrés.
- **Sense gradients complexos**: Si es necessita profunditat, usar `box-shadow` amb `--color-shadow`. Mai més de 2 colors en un gradient.

### Colors per Context

| Context | Color recomanat |
|---------|-----------------|
| Fons de pantalla | `--color-bg` |
| Targetes / Panells | `--color-surface` |
| Botons primaris (CTA) | `--color-primary` |
| Hover / Focus / Accents | `--color-secondary` |
| Text principal | `--color-text` |
| Subtítols / Etiquetes | `--color-text-secondary` |
| Placeholders | `--color-text-muted` |
| Errors / Destructiu | `--color-error` |
| Èxit / Confirmació | `--color-success` |

### Norma d'Or

> Si un botó és "Primari" a una pantalla, ha de ser exactament igual a la resta de l'aplicació. La consistència és la millor eina per a un usuari amb TDAH.
