# API

## API Principles

The backend REST API should be authoritative for account state, currency, plot ownership, construction timers, and income collection. The web client should render game state and request actions, but it should not decide final economy outcomes.

## Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a new user account. |
| POST | `/api/auth/login` | Authenticate and return a session or token. |

### Example Register Request

```json
{
  "email": "player@example.com",
  "password": "secure-password",
  "name": "Player"
}
```

## Player

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/player/me` | Return current user profile, currency balances, and summary state. |

## City and Gameplay

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/game/city` | Return current city, plots, buildings, ownership, timers, and collectable income. |
| POST | `/api/game/plots/:id/buy` | Buy an available plot. |
| POST | `/api/game/plots/:id/build` | Start construction on an owned plot. |
| POST | `/api/game/plots/:id/upgrade` | Upgrade a completed building on a plot. |
| POST | `/api/game/plots/:id/collect` | Collect generated building income. |

### Build Request

```json
{
  "buildingId": "building-id"
}
```

### Standard Game Response Shape

```json
{
  "success": true,
  "player": {
    "coins": 1250,
    "diamonds": 10
  },
  "city": {},
  "message": "Action completed"
}
```

## Shop

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/shop/items` | Return active shop items and building offers. |
| POST | `/api/shop/buy` | Purchase a shop item. |

## Error Response Shape

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_COINS",
    "message": "Not enough coins to complete this purchase."
  }
}
```

## Future API Areas

| Area | Example Endpoints |
| --- | --- |
| Missions | `/api/missions`, `/api/missions/:id/claim` |
| Auctions | `/api/auctions`, `/api/auctions/:id/bid` |
| Trading | `/api/trades`, `/api/trades/:id/accept` |
| Clans | `/api/clans`, `/api/clans/:id/join` |
| Chat | `/api/chat/channels`, WebSocket events later. |
| Admin | `/api/admin/buildings`, `/api/admin/economy` |
