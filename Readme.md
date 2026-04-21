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
