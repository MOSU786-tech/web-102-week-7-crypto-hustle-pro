# Crypto Hustle Pro

Crypto Hustle Pro is a React + Vite crypto dashboard built for the WEB-102 Week 7 lab. It shows a searchable list of coins, detail pages for each coin, a not-found route, crypto news, and a 30-day Recharts price history view.

## Features

- Searchable crypto list on the home page
- Dynamic detail routes with React Router
- Coin detail pages at `/coinDetails/:symbol`
- Custom not-found page for invalid routes
- 30-day price chart using Recharts
- Live data from the CryptoCompare API

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from the example:

```bash
copy .env.example .env.local
```

3. Add your CryptoCompare API key to `.env.local`:

```env
VITE_APP_API_KEY=139dff000b58b51ca8141388df9653256b69140f7932547f3c1a08d211e7c7d8
```

4. Start the development server:

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- `.env.local` is ignored by Git so your real API key stays private.
- If the app does not pick up a new API key right away, restart the Vite dev server.
