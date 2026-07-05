# Database

## Current Database Technology

The backend uses Prisma with PostgreSQL. The database should remain the source of truth for users, currency balances, city content, plot ownership, construction timers, and collection timestamps.

## Current Prisma Models

### User

Represents a player account.

| Field Area | Purpose |
| --- | --- |
| Identity | Stores unique user id, optional name, and unique email. |
| Authentication | Stores password hash. Never store plaintext passwords. |
| Authorization | Stores role such as `USER` or `ADMIN`. |
| Economy | Stores coins and diamonds. |
| Timestamps | Tracks creation and last update. |
| Relations | Owns many `UserPlot` records. |

### City

Represents a playable city or city template.

| Field Area | Purpose |
| --- | --- |
| Identity | Stores city id, name, and unique slug. |
| Ordering | Controls display order for multiple cities. |
| Activation | `isActive` allows disabling city content without deleting it. |
| Relations | Contains many `Plot` records. |

### Plot

Represents a land tile or buildable location in a city.

| Field Area | Purpose |
| --- | --- |
| Location/content | Stores city id, name, zone, order, and status. |
| Economy | Stores plot price and base income values. |
| Construction | Stores default build time. |
| Relations | Belongs to a city and can be owned through `UserPlot`. |

### Building

Represents a building definition available to place on plots.

| Field Area | Purpose |
| --- | --- |
| Identity | Stores id, display name, and unique slug. |
| Economy | Stores price and income per minute. |
| Progression | Stores max level. |
| Presentation | Stores optional image URL. |
| Activation | `isActive` controls shop/content availability. |
| Relations | Can be referenced by many `UserPlot` records. |

### UserPlot

Represents a specific player's ownership and building state for a plot.

| Field Area | Purpose |
| --- | --- |
| Ownership | Links one user to one plot. |
| Building state | Optional building id, level, and built status. |
| Timers | Stores construction end time. |
| Income | Stores last collection time. |
| Constraints | Ensures each user can own a plot only once. |

## Current Enums

| Enum | Values | Purpose |
| --- | --- | --- |
| `UserRole` | `USER`, `ADMIN` | Separates regular players from administrative users. |
| `PlotStatus` | `LOCKED`, `AVAILABLE`, `OWNED` | Describes plot availability and ownership state. |

## Future Models Needed

| Model | Purpose | Phase |
| --- | --- | --- |
| Mission | Daily and long-term objectives. | Phase 2 |
| UserMission | Per-player mission progress and claims. | Phase 2 |
| InventoryItem | Owned boosts, cosmetics, and event items. | Phase 2 |
| ShopItem | Configurable shop offers. | Phase 1/2 |
| TransactionLog | Currency audit trail and anti-cheat support. | Phase 1/2 |
| Clan | Player groups. | Phase 3 |
| ClanMember | Clan membership, rank, and permissions. | Phase 3 |
| ChatMessage | Persisted moderation-friendly chat history. | Phase 3 |
| Auction | Auction listings for assets or special items. | Phase 3 |
| AuctionBid | Bid history and winner resolution. | Phase 3 |
| Trade | Player-to-player trade offers. | Phase 3 |
| BankAccount | Future banking balances, products, or loans. | Phase 3 |
| MarketAsset | Stock market or simulated investment entries. | Phase 3 |
| Event | Global and seasonal event configuration. | Phase 3 |
| UserEventProgress | Per-player event scoring and rewards. | Phase 3 |

## Database Rules

- Keep economy-critical calculations server-side.
- Add migrations deliberately and review data impact before deployment.
- Prefer soft activation flags for live content over deleting records.
- Track currency-changing actions in logs before enabling multiplayer trading.
- Never store production secrets in the database schema or repository.
