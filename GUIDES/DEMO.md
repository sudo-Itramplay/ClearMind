# Demo — Presentació del prototip

## Com iniciar

Executa l'script des de l'arrel del projecte:

```bash
./demo.sh
```

Això atura qualsevol servidor anterior al port 3000 i obre l'aplicació al navegador.
Cada cop que es carrega la pàgina, les dades de mostra es generen automàticament amb les dates del dia actual.

---

## Dades de mostra

El calendari del Hall i el tauler de la Study Room es poblen amb dades simulades que cobreixen:

| Dia | Contingut |
|---|---|
| Avui | 8 tasques (6 pendents, 2 fetes) — esfera **high** |
| +1 a +4 | 2 tasques pendents cada dia — esfera **med** |
| +5, +6, +7 | 1 tasca per dia — esfera **low** |
| +8 | 2 tasques — esfera **med** |
| +9 | **7 tasques** (el dia d'alta intensitat) — esfera **high** |
| +11 | 3 tasques — esfera **med** |
| +13 | 1 tasca — esfera **low** |
| Passat (-1 a -7) | Tasques completades — esfera fosca amb punt verd |

Els dies buits apareixen com esferes fosques (nivell `none`).

---

## Reiniciar les dades durant la demo

Si has afegit, eliminat o marcat tasques i vols tornar a l'estat inicial **sense recarregar la pàgina**:

1. Obre les DevTools del navegador (`F12`)
2. Ves a la pestanya **Console**
3. Executa:

```js
resetDemo()
```

El calendari i el tauler tornen instantàniament a les dades de mostra originals.

Si prefereixes recarregar la pàgina (`F5`), les dades també es reinicien automàticament.

---

## Diagnòstic ràpid

| Símptoma | Solució |
|---|---|
| El calendari apareix buit (esferes grises) | Recarrega la pàgina |
| `resetDemo()` no funciona a la consola | Assegura't que el servidor (`npm run dev`) està en marxa |
| El port 3000 ja està ocupat | Executa `./demo.sh` — atura el procés anterior automàticament |
