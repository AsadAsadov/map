# Economy

## Economy Goals

The economy should be simple to understand, hard to fully optimize, and flexible enough to support future multiplayer trading, auctions, banking, and events.

## Currencies

| Currency | Type | Primary Use | Earned From |
| --- | --- | --- | --- |
| Coins | Soft currency | Buying plots, constructing and upgrading standard buildings. | Building income, daily rewards, missions, events. |
| Diamonds | Premium currency | Speed-ups, premium buildings, cosmetics, convenience items. | Starter grants, achievements, events, purchases. |

## Starting Balances

| Currency | Suggested Starting Amount | Purpose |
| --- | ---: | --- |
| Coins | 1,000 | Allows first plot and starter building. |
| Diamonds | 10 | Introduces premium actions without forcing purchase. |

## Building Income Formula

Recommended baseline formula:

```text
income_per_minute = base_income_per_minute × level_multiplier × category_multiplier
```

Suggested level multiplier:

```text
level_multiplier = 1 + ((level - 1) × 0.25)
```

Example:

| Building | Base Income/Min | Level | Multiplier | Result |
| --- | ---: | ---: | ---: | ---: |
| Small House | 10 | 1 | 1.00 | 10 coins/min |
| Small House | 10 | 3 | 1.50 | 15 coins/min |
| Hotel | 80 | 5 | 2.00 | 160 coins/min |

## Collection Formula

```text
collectable_coins = income_per_minute × minutes_since_last_collection
```

Recommended constraints:

| Rule | Recommendation |
| --- | --- |
| Offline cap | Start with 4 to 8 hours to prevent runaway inflation. |
| Minimum collection | Permit collection any time, but show stronger feedback above useful thresholds. |
| Server authority | Backend should calculate final rewards to prevent cheating. |

## Upgrade Cost Formula

Recommended baseline formula:

```text
upgrade_cost = base_building_price × (level ^ 1.55) × category_cost_multiplier
```

Upgrade times can scale separately:

```text
upgrade_time_seconds = base_build_time × (1 + ((level - 1) × 0.4))
```

## Daily Rewards

| Day | Reward |
| ---: | --- |
| 1 | Coins |
| 2 | Coins |
| 3 | Small diamond reward |
| 4 | Coins + speed-up token later |
| 5 | Larger coins |
| 6 | Diamonds |
| 7 | Premium chest or event item |

Rules:

- Reward streaks should be forgiving.
- Missing a day should not permanently punish players.
- Daily rewards should support early retention without flooding the economy.

## Shop Items

| Item Type | Currency | Phase | Notes |
| --- | --- | --- | --- |
| Buildings | Coins/Diamonds | Phase 1 | Core shop inventory. |
| Speed-ups | Diamonds | Phase 1/2 | Optional convenience. |
| Decorations | Coins/Diamonds | Phase 2 | Cosmetic city customization. |
| Event items | Event currency | Phase 3 | Seasonal progression. |
| Premium skins | Diamonds | Phase 2/3 | Visual-only upgrades. |

## Balancing Principles

- Early sessions should produce frequent upgrades and visible progress.
- Mid-game should introduce planning through plot choice, building category, and upgrade timing.
- Late-game should focus on optimization, prestige, trading, auctions, events, and leaderboard competition.
- Premium currency should save time or unlock cosmetics, not invalidate strategic play.
- Every economy value should be configurable through backend data or shared constants in the future.
