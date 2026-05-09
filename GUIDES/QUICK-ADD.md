# Quick Add — Afegir tasques amb llenguatge natural

## Què és

Una entrada d'una sola línia, inspirada en Todoist, per crear tasques sense
obrir el formulari complet. L'usuari escriu el títol i, opcionalment, hi
intercala paraules clau curtes per fixar **prioritat** i **data**.

```
Llegir capítol 4 p1 nxmn
└──────────────────┘  └┘ └──┘
        títol       prio  dilluns vinent (segona ocurrència)
```

> El formulari complet (`NotebookForm`) segueix existint i s'obre fent
> clic al `+` del tauler de suro. La Quick Add és la via ràpida de teclat
> per a usuaris que volen prémer poques tecles.

---

## Com s'obre

| Acció | Resultat |
|---|---|
| Tecla <kbd>Q</kbd> a la sala d'estudi | Obre el modal de Quick Add |
| Clic al `+` del tauler | Obre el formulari complet (Notebook) |
| Botó *More options* dins del Quick Add | Tanca el quick add i obre el formulari complet |
| <kbd>Enter</kbd> dins del Quick Add | Desa la tasca i tanca el modal |
| <kbd>Esc</kbd> | Tanca qualsevol modal |

Vegeu també [KEYBINDINGS.md](KEYBINDINGS.md) per a la llista completa de
dreceres globals.

---

## Paraules clau

Totes les paraules clau es comparen com a *paraules senceres* i sense
distinció de majúscules/minúscules. La resta del text queda com a títol
de la tasca.

### Prioritats

| Paraula | Prioritat resultant |
|---|---|
| `p1` | high |
| `p2` | normal |
| `p3` | low |
| `p4` | low |

> Per defecte, una tasca sense prioritat explícita queda com a `normal`.

### Dates relatives

| Paraula | Data resultant |
|---|---|
| `today` / `tdy` | avui |
| `tomorrow` / `tmrw` | demà (+1 dia) |

### Dies de la setmana

Codi de 2 lletres: `mn`, `tu`, `we`, `th`, `fr`, `sa`, `su`.

| Forma | Resol a |
|---|---|
| `mn`, `tu`, … | El **proper** dilluns/dimarts/… (avui mateix si coincideix) |
| `nxmn`, `nxtu`, … | Una setmana després del proper (sempre +7 dies) |

> Exemple: si avui és dissabte, `mn` = dilluns d'aquí 2 dies; `nxmn` =
> dilluns d'aquí 9 dies.

### Resolució i precedència

- Si l'usuari escriu múltiples tokens del mateix tipus, **el darrer guanya**
  (`p2 ... p1` → `p1`). Reflecteix la idea de "rectificar" el que s'havia
  escrit abans.
- Si manca prioritat o data, s'apliquen els valors per defecte: `normal` i
  avui.

---

## Confirmació

En desar correctament, apareix un toast amb el text:

- `Task added for today` — si la tasca és per avui
- `Task added for May 15` — per a qualsevol altra data

És exactament el mateix format que utilitza el formulari complet.

---

## Arquitectura

Tota la lògica viu sota `src/features/quickAdd/` i segueix els principis
SOLID: cada fitxer té una única responsabilitat, l'extensió no implica
modificar els ja existents, i les dependències externes (rellotge,
context) s'injecten.

```
src/features/quickAdd/
├── config/
│   └── quickAddConfig.js     # ÚNIC fitxer per editar paraules clau
├── domain/
│   ├── clock.js              # realClock / fixedClock (DI)
│   ├── tokenizer.js          # string → tokens tipats (pur)
│   ├── priorityResolver.js   # tokens → "low"|"normal"|"high"
│   ├── dateResolver.js       # tokens + clock → "YYYY-MM-DD"
│   └── parseQuickInput.js    # composa els tres anteriors
├── ui/
│   ├── useQuickAdd.js        # estat React + addTodo + toast
│   ├── QuickAddInput.jsx     # input + xips + cheat-sheet
│   ├── QuickAddModal.jsx     # embolcall amb el component Modal
│   └── quickAdd.css
└── index.js                  # superfície pública
```

| Capa | Què sap | Què no sap |
|---|---|---|
| `config/` | Quines paraules clau existeixen | Què fan ni com es processen |
| `domain/` | Com tokenitzar i resoldre tipus | Res de React ni del DOM |
| `ui/` | Com presentar i submit | Les regles de parsing concretes |

### Orquestrador

`src/views/Study/components/TodoEntryProvider.jsx` és qui decideix quan
mostrar el formulari ràpid o el complet. Viu a la capa de la vista perquè
la *feature* en si es pugui reutilitzar des d'altres vistes en el futur.

---

## Extensió

### Afegir una nova paraula clau

1. Edita **només** `src/features/quickAdd/config/quickAddConfig.js`.

   Exemples:

   ```js
   // Afegir "tonight" com a sinònim d'avui
   export const DATE_KEYWORDS = {
     today: 0, tdy: 0, tonight: 0,
     tomorrow: 1, tmrw: 1,
   };

   // Afegir un nivell p5 (collapsed a "low")
   export const PRIORITY_ALIASES = {
     p1: "high", p2: "normal", p3: "low", p4: "low", p5: "low",
   };
   ```

2. (Opcional, recomanat) Afegeix la nova paraula al *cheat-sheet* del
   modal:
   `src/features/quickAdd/ui/QuickAddInput.jsx` → `CHEAT_SHEET`.

> Cap altre fitxer del *feature* necessita canvis. El tokenitzador llegeix
> directament de la configuració.

### Afegir un tipus de data nou (no només dia)

Cas típic: suport per `+3d` (d'aquí 3 dies).

1. Estendre `tokenizer.js` perquè reconegui el patró i emeti
   `{ kind: "relativeDays", days: N }`.
2. Estendre `dateResolver.js` perquè manegi `kind: "relativeDays"`.
3. La UI no necessita canvis — `parseQuickInput` ja propaga el resultat.

### Tests sense rellotge real

`fixedClock(isoString)` permet fixar la data en proves:

```js
import { fixedClock, parseQuickInput, QUICK_ADD_CONFIG } from "../features/quickAdd";

const out = parseQuickInput("revisar p1 nxmn", QUICK_ADD_CONFIG, fixedClock("2026-05-09"));
// out.priority === "high"
// out.date     === "2026-05-18"
```

---

## Limitacions conegudes

- En clicar **More options** dins del Quick Add, el text que s'estava
  escrivint **no es transfereix** al formulari complet. Per fer-ho caldria
  afegir un prop `initialValues` al `NotebookForm`.
- Les paraules clau només es detecten si formen *paraules completes*
  separades per espais. `p1.` o `p1,` no compten.
