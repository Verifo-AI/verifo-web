# Verifo Web

The main web application for Verifo, a decentralized AI infrastructure network built on Solana. This app lets contributors register hardware nodes, track task completion and rewards, and lets task submitters send AI workloads to the network.

## Stack

- React with Vite
- Tailwind CSS
- Solana web3.js for wallet and on-chain interactions
- Playwright for end to end tests

## Requirements

- Node.js 18 or newer
- npm or pnpm

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Set the required environment variables (see `.env.example` if present, or check `vite.config.ts` and `src/` for the variables read at runtime).

3. Start the dev server:

   ```
   PORT=5173 BASE_PATH=/ npm run dev
   ```

## Scripts

- `npm run dev`, starts the local development server.
- `npm run build`, builds the production bundle.
- `npm run serve`, previews the production build locally.
- `npm run typecheck`, runs the TypeScript compiler in check only mode.
- `npm run test:e2e`, runs the Playwright end to end test suite.

## Project layout

- `src/`, application source code.
- `attached_assets/`, static assets referenced by the app via the `@assets` alias.
- `vendor/api-client-react/`, a vendored copy of the shared API client library used to talk to the Verifo API.
- `e2e/`, Playwright end to end tests.
