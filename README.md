# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## code à revoir

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)

    const login = async (credentials) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        })
        const data = await response.json()
        setUser(data.user)
        localStorage.setItem('token', data.token)
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            // Verify token and set user
        }
        setLoading(false)
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext)

## to do sooner

Voici des propositions de fonctionnalités pour votre application :
👥 Gestion des clients

Fiche client (nom, contact, historique des visites)
Système de fidélité (points, récompenses)
Rappels automatiques (anniversaire, dernière visite)

📅 Rendez-vous

Calendrier de réservation par coiffeur/esthéticienne
Réservation en ligne pour les clients
Notifications SMS/email de rappel
Gestion des annulations et reports

💇 Services

Catalogue de prestations avec tarifs
Durée estimée par prestation
Assignation par compétence du personnel

🛍️ Vente de produits

Gestion du stock (alertes rupture)
Caisse intégrée (prestation + produit en une facture)
Historique des ventes par produit

👨‍💼 Personnel

Planning et gestion des horaires
Suivi des performances (CA par employé)
Gestion des commissions

📊 Tableau de bord

Chiffre d'affaires du jour/mois
Rendez-vous à venir
Produits les plus vendus
Taux d'occupation des créneaux

🧾 Facturation

Génération de factures/reçus PDF
Historique des paiements
Plusieurs modes de paiement (cash, mobile money, carte)

rsync -avz dist/ raoul@72.61.195.127:/var/www/monsalon/
