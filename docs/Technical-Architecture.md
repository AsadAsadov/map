# Technical Architecture

## Overview

Real Estate Empire is organized as a browser game with a backend REST API, a Phaser-powered web client, and future admin/shared packages. The architecture should keep gameplay state authoritative on the backend while allowing the web client to focus on rendering and player interaction.

## Backend

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Runtime | Node.js | Server execution environment. |
| Framework | Express | REST API routing and middleware. |
| ORM | Prisma | Database access and migrations. |
| Database | PostgreSQL | Persistent player and game state. |
| API Style | REST | Client/server communication for Phase 1. |

Backend responsibilities:

- Register and authenticate users.
- Store player currency balances.
- Return city and plot state.
- Validate plot purchases, building construction, upgrades, and collection.
- Calculate authoritative income and timers.
- Provide shop and building content.
- Prepare for admin-controlled balancing later.

## Web

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Build tool | Vite | Fast development and production builds. |
| Game engine | Phaser | City scene, isometric interactions, animations. |
| Language | JavaScript | Current client implementation language. |
| Styling | CSS | Browser UI and responsive layout. |

Web responsibilities:

- Render the city scene and UI.
- Send API requests for game actions.
- Display current coins, diamonds, plot states, and timers.
- Keep mobile-first controls and layout.
- Use reusable Phaser managers/classes as systems grow.

## Admin

The admin dashboard is a future application for operating the game safely.

Potential admin features:

| Feature | Purpose |
| --- | --- |
| User lookup | Support, moderation, and debugging. |
| Building editor | Tune costs, incomes, build times, and active status. |
| Economy dashboard | Monitor currency creation, spending, and inflation. |
| Shop manager | Configure offers and bundles. |
| Event manager | Create global events and seasonal rewards. |
| Moderation tools | Review chat, trades, and reported users. |

## Shared

A future shared package should hold constants and types used by backend, web, and admin.

Examples:

- Building categories.
- Currency names.
- API response types.
- Error codes.
- Economy constants.
- Asset keys.
- Plot state names.

Shared code should avoid importing backend-only or browser-only dependencies.

## Deployment Idea

A simple VPS deployment can support early production testing.

| Component | Tool | Purpose |
| --- | --- | --- |
| Process manager | PM2 | Run and restart backend Node process. |
| Reverse proxy | Nginx | Serve web build and proxy API requests. |
| Database | PostgreSQL | Store game state. |
| SSL | Let's Encrypt | HTTPS certificates. |
| Environment | `.env` on server | Store production secrets outside git. |

Suggested production layout:

```text
Nginx
  ├─ serves web/dist
  └─ proxies /api to backend Express app managed by PM2

Backend Express app
  └─ Prisma → PostgreSQL
```

## Architectural Principles

- Backend owns game truth.
- Web never hardcodes secret values or production-only configuration.
- Keep backend, web, admin, and shared boundaries clear.
- Avoid adding multiplayer complexity before Phase 1 is stable.
- Prefer small, testable services and managers over large files.
