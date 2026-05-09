# Keybindings — Navegació amb teclat (estil Vim)

## Per què

ClearMind aposta per l'accessibilitat: poder fer servir tota l'aplicació
sense ratolí. Les dreceres segueixen convencions de Vim (`g` com a *leader*
per "go to", `j`/`k` per scroll, `?` per ajuda) per ser familiars als usuaris
de teclat experimentats i fàcils d'aprendre per als que no.

Hi ha un botó flotant amb el caràcter **`?`** a baix a la dreta de
qualsevol pàgina que obre la fitxa de dreceres. La mateixa tecla
<kbd>?</kbd> commuta el modal.

---

## Llista de dreceres

### Navegació entre sales

| Tecles | Acció |
|---|---|
| <kbd>g</kbd> <kbd>h</kbd> | Anar al Hall |
| <kbd>g</kbd> <kbd>s</kbd> | Anar a Study |
| <kbd>g</kbd> <kbd>m</kbd> | Anar a Meditate |

### Desplaçament a la pàgina

| Tecles | Acció |
|---|---|
| <kbd>j</kbd> | Scroll avall |
| <kbd>k</kbd> | Scroll amunt |
| <kbd>g</kbd> <kbd>g</kbd> | A l'inici de la pàgina |
| <kbd>G</kbd> | Al final de la pàgina |

### Tasques

| Tecles | Acció |
|---|---|
| <kbd>q</kbd> | Obrir Quick Add (només a Study) |

### General

| Tecles | Acció |
|---|---|
| <kbd>?</kbd> | Mostrar/amagar la fitxa de dreceres |
| <kbd>Esc</kbd> | Tancar el modal actiu |

> Vegeu [QUICK-ADD.md](QUICK-ADD.md) per a les paraules clau dins de
> l'entrada ràpida.

---

## Quan no s'activen les dreceres

El sistema ignora la tecla en aquests casos:

- L'usuari està escrivint en un `<input>`, `<textarea>`, `<select>` o
  element `contenteditable` (perquè la tecla és part del que escriu).
- La combinació inclou `Ctrl`, `Cmd` o `Alt` (per no col·lidir amb
  dreceres del navegador o del sistema). `Shift` sí que es permet, així
  obtens caràcters com `?` i `G`.
- L'acció no està registrada per la pantalla actual (per exemple, `q` no
  fa res fora de Study).

---

## Acords de dues tecles (chords)

Les seqüències com `gh` esperen un màxim de **800 ms** entre la primera i
la segona tecla. Si triga més, el buffer es buida i es comença de nou.

Mentre la primera tecla està pendent, la tecla és consumida (no es passa
al navegador) per evitar comportaments com el *quick find* de Firefox.

---

## Arquitectura

Tot viu sota `src/features/keybindings/` i segueix els principis SOLID:

```
src/features/keybindings/
├── config/
│   └── keymapConfig.js       # ÚNIC fitxer per definir o renombrar dreceres
├── domain/
│   ├── eventGuards.js        # shouldIgnore(e), normalizeKey(e) — purs
│   └── matcher.js            # màquina d'estats per a chords (pura)
├── ui/
│   ├── KeymapProvider.jsx    # listener únic + registry de handlers
│   ├── KeymapDefaults.jsx    # registra j/k/gg/G (opt-in)
│   ├── Cheatsheet.jsx        # modal amb la llista (auto-derivada)
│   ├── CheatsheetButton.jsx  # botó flotant "?"
│   └── keybindings.css
└── index.js                  # superfície pública
```

| Capa | Què sap | Què no sap |
|---|---|---|
| `config/` | Quines tecles, quins ids, quines descripcions | Què fan els ids |
| `domain/` | Com casar tecles amb chords | Res de React |
| `ui/` | Com instal·lar el listener i renderitzar la fitxa | Quines accions concretes |

L'**Inversió de Dependències** clau:

- El dispatcher coneix només **ids de binding**, no implementacions.
- Els components que coneixen un `go("study")` o un `setHelpOpen` registren
  el seu propi handler amb `useKeyAction(id, fn)`.
- La cheat-sheet es genera **automàticament** des del config — afegir una
  línia al `KEYMAP` la fa aparèixer sense tocar la UI.

---

## Extensió

### Afegir una drecera nova

Exemple: <kbd>g</kbd> <kbd>n</kbd> → obrir el quadern *My Tasks*.

1. Afegir una entrada al config:

   ```js
   // src/features/keybindings/config/keymapConfig.js
   { id: "openNotebook", keys: "gn", description: "Obrir Notebook", group: "Tasks" },
   ```

2. Registrar el handler allà on viu l'estat associat. En aquest cas, el
   `setOpen` viu a `Study.jsx`:

   ```jsx
   import { useKeyAction } from "../../features/keybindings";

   useKeyAction("openNotebook", () => setOpen(true));
   ```

> No cal tocar res més. La fitxa de dreceres ja inclou la nova línia.

### Renombrar la tecla d'una drecera existent

Edita **només** el camp `keys` al config. Tota la resta (handlers, fitxa,
matcher) es regenera des d'allà.

### Desactivar una drecera temporalment

Comenta la línia al config. El handler que tingui la mateixa `id`
quedarà sense binding i no es cridarà mai.

### Afegir suport per a seqüències de 3 tecles

`domain/matcher.js` és l'únic fitxer que decideix la longitud màxima
d'un chord. Estendre's a 3 tecles és un canvi local.

---

## Tests

`createMatcher` accepta `setTimeoutFn` i `clearTimeoutFn` per injecció
en proves, així podem simular el pas del temps:

```js
import { createMatcher, KEYMAP } from "../features/keybindings";

let now = 0;
const fakeTimers = [];
const m = createMatcher(KEYMAP, {
  timeoutMs: 800,
  setTimeoutFn: (fn) => { fakeTimers.push(fn); return fakeTimers.length - 1; },
  clearTimeoutFn: () => {},
});

m.match("g");          // { id: null, consumed: true }   ← bufer engegat
m.match("h");          // { id: "goHall", consumed: true }
```

`shouldIgnore(e)` accepta un objecte amb forma d'event simulat
(`{ ctrlKey, metaKey, altKey, target: { tagName, isContentEditable } }`).

---

## Diagnòstic ràpid

| Símptoma | Causa probable |
|---|---|
| `q` no obre Quick Add | Estàs fora de Study, o tens un input enfocat |
| `?` obre el menú del navegador | El listener no s'ha pogut instal·lar — comprova que `<KeymapProvider>` envolta `<Shell>` |
| Cap tecla funciona | HMR no ha agafat el directori `features/` nou — reinicia `npm run dev` |
| `gh` no funciona però `g` sol "es perd" | Estàs trigant més de 800 ms entre les dues tecles |
