# Real Estate Empire — Game Design Document

## Vision

Real Estate Empire is a premium 2.5D isometric real estate MMO strategy browser game where players grow from first-time land owners into city-scale property tycoons. Players buy plots, build properties, collect income, upgrade assets, hire workers, trade holdings, participate in auctions, and compete for prestige on leaderboards.

The project should feel approachable on mobile, deep enough for long-term progression, and visually consistent across every future feature and asset.

## Target Platform

| Platform | Priority | Notes |
| --- | --- | --- |
| Mobile browser | Primary | Touch-first controls, readable UI, fast sessions. |
| Desktop browser | Primary | Larger city view, keyboard shortcuts later. |
| Native mobile wrappers | Future | Possible post-launch packaging if the web version proves stable. |

## Core Inspirations

Real Estate Empire is inspired by the accessibility and city-building clarity of games like SimCity BuildIt, Township, Hay Day, and Monopoly GO, but must keep its own original mechanics, economy, and visual identity.

**Non-negotiable:** do not copy assets, UI, maps, icons, or proprietary game systems directly from any inspiration source.

## Core Gameplay Loop

1. Player logs in and enters their city.
2. Player reviews available plots and current buildings.
3. Player buys land with coins or diamonds.
4. Player constructs a building on owned land.
5. Building takes time to finish.
6. Finished building generates coin income.
7. Player collects income.
8. Player upgrades buildings to increase output.
9. Player unlocks better properties, city districts, shop items, and social systems.

```text
Buy land → Build property → Wait/boost → Collect income → Upgrade → Expand city → Compete/trade
```

## Player Progression

| Progression Area | Description | Example Unlocks |
| --- | --- | --- |
| Account level | Overall player growth from collection, construction, and upgrades. | New plots, city districts, buildings. |
| Building level | Individual building investment. | Higher income, improved visuals, prestige value. |
| City expansion | Unlocking more land and city zones. | Suburbs, downtown, waterfront, luxury district. |
| Economy power | Increasing income efficiency and liquidity. | Better collection rates, bank features, auctions. |
| Social status | Multiplayer achievement and ranking. | Clans, leaderboard badges, trade reputation. |

## City Map

The city map should be a 2.5D isometric grid with readable plot ownership states.

| Plot State | Visual Direction | Player Action |
| --- | --- | --- |
| Locked | Dimmed, gated, or clouded plot. | Unlock later through progression. |
| Available | Empty highlighted land. | Buy plot. |
| Owned empty | Clear owned plot marker. | Build property. |
| Under construction | Construction base, crane, timer. | Wait or speed up. |
| Built | Finished building sprite. | Collect income or upgrade. |

## Building Lifecycle

1. **Available building** appears in shop or build menu.
2. **Construction started** after player pays required cost.
3. **Build timer** begins.
4. **Construction complete** when timer ends.
5. **Income generation** starts from completion time.
6. **Collection** transfers stored income to player coins.
7. **Upgrade** consumes coins/diamonds and may require another timer.
8. **Visual evolution** can show higher building levels in later phases.

## UI Structure

| UI Area | Purpose |
| --- | --- |
| Top bar | Coins, diamonds, level, profile access. |
| City canvas | Phaser-rendered isometric city and plots. |
| Bottom navigation | Shop, buildings, missions, social, settings. |
| Plot panel | Buy/build/upgrade/collect actions for selected plot. |
| Building shop | Available properties, costs, income, build time. |
| Notifications | Rewards, construction completed, errors, event messages. |
| Admin tools | Future separate dashboard for balancing and content operations. |

## Monetization Ideas

Monetization must support fair long-term gameplay and avoid pay-to-win pressure.

| Monetization Item | Currency | Notes |
| --- | --- | --- |
| Diamond packs | Real money | Premium currency purchase. |
| Starter bundle | Real money | Small amount of coins, diamonds, and cosmetic item. |
| Construction speed-ups | Diamonds | Reduces waiting time. |
| Cosmetic skins | Diamonds/events | Building skins, city decorations. |
| Premium pass | Real money | Seasonal rewards; should not lock core gameplay. |

## Multiplayer Vision

Phase 3 introduces MMO-style systems while preserving a stable single-player city foundation.

| System | Description |
| --- | --- |
| Chat | Global, clan, and trade channels with moderation tools. |
| Auctions | Players bid on rare buildings, plots, cosmetics, or event items. |
| Trading | Controlled player-to-player asset exchange with fraud prevention. |
| Clans | Groups with shared goals, clan missions, and leaderboards. |
| Global events | Time-limited cooperative or competitive city challenges. |
| Leaderboards | Rankings by wealth, city value, event score, and reputation. |
