# Arquitectura — ClearMind

## Screaming Architecture

El terme **Screaming Architecture** (Robert C. Martin, "Uncle Bob") descriu un
principi senzill: **l'estructura de carpetes ha de cridar el propòsit del
sistema, no la tecnologia que l'implementa**.

Un projecte organitzat per capes tècniques es veu així:

```
src/
  controllers/
  models/
  views/
  services/
```

Aquesta estructura no diu res sobre el domini. Podria ser una tenda en línia,
un gestor de projectes o qualsevol altra cosa.

ClearMind s'organitza diferent. La primera cosa que veus en obrir `src/` és:

```
src/
  views/
    Hall/
    Study/
    Meditate/
  features/
    keybindings/
    quickAdd/
```

Qualsevol persona que obri el repositori sap immediatament que l'aplicació
té **tres sales** i dues **funcionalitats transversals**. L'arquitectura crida
el domini, no el framework.

---

## Estructura de carpetes

```
src/
│
├── views/                        # Sales de l'aplicació (domini principal)
│   ├── Hall/                     # Entrada: calendari + rellotge + portes
│   │   ├── Hall.jsx
│   │   ├── components/           # Components privats d'aquesta sala
│   │   │   ├── Calendar.jsx
│   │   │   ├── Day.jsx
│   │   │   ├── Door.jsx
│   │   │   └── WallClock.jsx
│   │   └── style/
│   │       └── hall.css
│   │
│   ├── Study/                    # Sala d'estudi: tasques + temporitzador
│   │   ├── Study.jsx
│   │   ├── components/
│   │   │   ├── CorkBoard.jsx     # Tauler de post-its
│   │   │   ├── Postit.jsx
│   │   │   ├── Notebook.jsx      # Llista completa de tasques
│   │   │   ├── AddTodo.jsx
│   │   │   ├── AddTodoModal.jsx
│   │   │   ├── NotebookForm.jsx
│   │   │   ├── Watch.jsx         # Contenidor timer/stopwatch
│   │   │   ├── Timer.jsx
│   │   │   ├── TimerRing.jsx
│   │   │   ├── Stopwatch.jsx
│   │   │   └── TodoEntryProvider.jsx
│   │   └── style/
│   │       └── study.css
│   │
│   └── Meditate/                 # Sala de meditació
│       ├── Meditate.jsx
│       └── style/
│           └── meditate.css
│
├── features/                     # Funcionalitats transversals (autocontingudes)
│   ├── keybindings/              # Navegació per teclat (estil Vim)
│   │   ├── config/
│   │   │   └── keymapConfig.js   # ÚNICA font de veritat de les dreceres
│   │   ├── domain/
│   │   │   ├── matcher.js        # Màquina d'estats de chords (pura)
│   │   │   └── eventGuards.js    # shouldIgnore / normalizeKey (pures)
│   │   ├── ui/
│   │   │   ├── KeymapProvider.jsx
│   │   │   ├── KeymapDefaults.jsx
│   │   │   ├── Cheatsheet.jsx
│   │   │   ├── CheatsheetButton.jsx
│   │   │   └── keybindings.css
│   │   └── index.js              # Superfície pública de la feature
│   │
│   └── quickAdd/                 # Entrada ràpida de tasques en llenguatge natural
│       ├── config/
│       │   └── quickAddConfig.js # Paraules clau i àlies (declaratiu)
│       ├── domain/
│       │   ├── tokenizer.js      # Tokenitza l'entrada (pura)
│       │   ├── parseQuickInput.js# Compon tokenizer + resolvers (pura)
│       │   ├── dateResolver.js   # Tradueix tokens a dates (pura)
│       │   ├── priorityResolver.js
│       │   └── clock.js          # Abstracció del temps (injectable)
│       ├── ui/
│       │   ├── QuickAddModal.jsx
│       │   ├── QuickAddInput.jsx
│       │   ├── useQuickAdd.js
│       │   └── quickAdd.css
│       └── index.js
│
├── context/                      # Estat global compartit (React Context)
│   ├── TodoContext.jsx            # Tasques: CRUD + resetDemo
│   ├── SoundContext.jsx           # So ambient
│   └── ToastContext.jsx           # Notificacions temporals
│
├── components/                   # Components UI reutilitzables (sense domini)
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── Loader.jsx
│   │   ├── BackButton.jsx
│   │   ├── RoomPills.jsx
│   │   └── SoundToggle.jsx
│   └── GlobalQuickAddProvider.jsx
│
├── hooks/                        # Hooks React reutilitzables (sense domini)
│   ├── useCalendarDays.js         # Càlcul d'intensitat del calendari
│   ├── useClock.js
│   ├── useTimer.js
│   ├── useStopwatch.js
│   └── useFocusTrap.js
│
├── data/
│   └── mockDB.js                 # Base de dades simulada en memòria
│
├── utils/
│   └── date.js                   # localDateKey / localDateShift (pures)
│
├── styles/
│   └── globals.css
│
├── App.jsx                       # Arrel: providers + enrutador per hash
└── index.js                      # Punt d'entrada React
```

---

## Capes internes de cada feature

Cada feature de `features/` segueix la mateixa estructura de tres capes:

```
config/   →   domain/   →   ui/
```

| Capa | Conté | Sap de React? | Sap del DOM? |
|---|---|---|---|
| `config/` | Declaració de dades (quines tecles, quines paraules clau) | No | No |
| `domain/` | Lògica de negoci pura (functions, state machines) | No | No |
| `ui/` | Components React que connecten domini i navegador | Sí | Sí |

El `index.js` de cada feature és l'**única porta d'entrada**. Tot el que no
s'exporta des d'allà és privat i no el pot importar cap fitxer extern.

---

## Principis SOLID

### S — Responsabilitat Única (Single Responsibility)

Cada mòdul fa una sola cosa i té un únic motiu de canvi.

**Exemple — `quickAdd/domain/`:**

```
tokenizer.js       → només classifica paraules en tokens
dateResolver.js    → només tradueix tokens DATE a dates concretes
priorityResolver.js→ només tradueix tokens PRIORITY a nivells
parseQuickInput.js → només compon els tres anteriors
```

Si la sintaxi de les dates canvia, només toca `dateResolver.js`.
Si s'afegeix una nova prioritat, només toca `priorityResolver.js` i el config.
Cap canvi afecta els altres mòduls.

**Exemple — `keybindings/domain/`:**

```
matcher.js      → màquina d'estats de chords, sense DOM ni React
eventGuards.js  → filtra events del teclat, sense lògica de chords
```

---

### O — Obert/Tancat (Open/Closed)

Un mòdul ha d'estar **obert a l'extensió** però **tancat a la modificació**.

**Exemple — `keymapConfig.js`:**

Afegir una drecera nova no requereix tocar cap altre fitxer. S'afegeix una
fila al `KEYMAP` i es registra el handler a la vista corresponent:

```js
// keymapConfig.js — afegir una línia
{ id: "openCalendar", keys: "gc", description: "Obrir calendari", group: "Navigation" },
```

```jsx
// QualsevolVista.jsx — registrar el handler
useKeyAction("openCalendar", () => setCalendarOpen(true));
```

La cheat-sheet, el dispatcher i el matcher incorporen automàticament la nova
drecera sense cap modificació addicional.

**Exemple — `quickAddConfig.js`:**

Afegir una paraula clau de data (p.ex. `"demà"` → `+1`) és una entrada al
config. La lògica del tokenitzador no canvia.

---

### L — Substitució de Liskov (Liskov Substitution)

Els subtipus han de poder substituir els seus supertipus sense trencar el
comportament del sistema.

**Exemple — `clock.js` al quickAdd:**

El parser de l'entrada ràpida necessita saber l'hora actual per resoldre
dates relatives (`"avui"`, `"demà"`). En lloc d'importar `Date.now()`
directament, rep un `clock` per injecció:

```js
// clock.js
export const realClock   = { now: () => new Date() };
export const fixedClock  = (date) => ({ now: () => date });
```

`parseQuickInput(input, config, realClock)` → producció.
`parseQuickInput(input, config, fixedClock(new Date("2026-01-01")))` → tests.

Ambdós rellotges són intercanviables sense modificar el parser.

**Exemple — `createMatcher` al keybindings:**

```js
createMatcher(keymap, {
  setTimeoutFn:   window.setTimeout,   // producció
  clearTimeoutFn: window.clearTimeout,
})

createMatcher(keymap, {
  setTimeoutFn:   (fn) => { fakeTimers.push(fn); },  // test
  clearTimeoutFn: () => {},
})
```

---

### I — Segregació d'Interfícies (Interface Segregation)

Cap client no hauria de dependre de mètodes que no utilitza.

**Exemple — `index.js` de cada feature:**

```js
// features/quickAdd/index.js — superfície pública mínima
export { QUICK_ADD_CONFIG }   from "./config/quickAddConfig";
export { parseQuickInput }    from "./domain/parseQuickInput";
export { useQuickAdd }        from "./ui/useQuickAdd";
export { default as QuickAddModal }  from "./ui/QuickAddModal";
export { default as QuickAddInput }  from "./ui/QuickAddInput";
```

Un component que només mostra el modal importa `QuickAddModal`.
Un test unitari que valida el parser importa `parseQuickInput`.
Cap dels dos necessita saber que existeix `tokenizer.js`.

**Exemple — `TodoContext`:**

El context exposa exactament el que els consumidors necessiten:
`{ todos, isLoading, error, addTodo, toggleTodo, deleteTodo, updateTodo }`.
Cap component accedeix directament a `mockDB`.

---

### D — Inversió de Dependències (Dependency Inversion)

Els mòduls d'alt nivell no han de dependre dels de baix nivell.
Tots dos han de dependre d'abstraccions.

**Exemple clau — sistema de keybindings:**

`KeymapProvider` no sap el que fa cap drecera. Coneix **ids** (`"goHall"`,
`"openQuickAdd"`), no implementacions:

```js
// KeymapProvider.jsx — dispatcher
const handler = handlersRef.current.get(id);
if (handler) handler(e);   // crida per id, mai per nom de funció
```

Les vistes registren els seus propis handlers:

```jsx
// App.jsx
useKeyAction("goHall",    () => go("hall"));
useKeyAction("goStudy",   () => go("study"));

// Study.jsx
useKeyAction("openQuickAdd", () => openModal());
```

El provider no importa cap vista. Les vistes no coneixen el dispatcher
internament. Tots dos depenen de l'abstracció (`id` de string).

**Exemple — `TodoContext` i `mockDB`:**

`TodoContext` depèn de la interfície de `mockDB`
(`getTodos`, `addTodo`, `toggleTodo`…), no d'una base de dades concreta.
Canviar de `mockDB` a una API REST real requeriria modificar únicament
`mockDB.js`, sense tocar cap context ni component.

---

## Flux de dades

```
mockDB (dades)
    ↓
TodoContext (estat React, CRUD)
    ↓
views/Hall/Calendar     views/Study/CorkBoard
views/Study/Notebook    ...
```

El flux és **unidireccional**: les vistes llegeixen de context, disparen
accions de context, i context actualitza el estat. Cap vista accedeix
directament a `mockDB`.

```
keymapConfig (declaració)
    ↓
KeymapProvider (dispatcher: document → id)
    ↓
useKeyAction (handler registrat per cada vista)
    ↓
funció concreta (go, setOpen, …)
```

---

## Per què no MVC ni carpetes per tipus

Una organització per tipus tècnic (components, services, models) fragmenta
el codi relacionat en carpetes distants. Per canviar el comportament del
Quick Add cal obrir `components/`, `services/` i `models/` alhora.

Amb la Screaming Architecture, **tot el que pertany al Quick Add viu a
`features/quickAdd/`**. Un canvi de funcionalitat toca un sol directori.
Això s'anomena **cohesió alta** i **acoblament baix**.
