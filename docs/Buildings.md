# Buildings

## Building Design Goals

Buildings are the primary economic assets in Real Estate Empire. Each building should have a clear role, readable isometric silhouette, balanced income profile, and upgrade path.

## Starting Buildings

| Building | Category | Role | Suggested Cost | Suggested Income/Min | Suggested Build Time |
| --- | --- | --- | ---: | ---: | ---: |
| Small House | Residential | Starter income source. | 250 coins | 10 coins | 30 sec |
| Villa | Residential/Luxury | Higher-value early property. | 750 coins | 25 coins | 2 min |
| Apartment | Residential | Efficient mid-density property. | 1,500 coins | 45 coins | 5 min |
| Business Center | Commercial | Strong city income generator. | 3,500 coins | 90 coins | 15 min |
| Hotel | Luxury/Commercial | Premium high-output destination. | 7,500 coins | 160 coins | 30 min |

## Future Building Categories

| Category | Purpose | Example Buildings |
| --- | --- | --- |
| Residential | Stable base income and broad progression. | Small House, Villa, Apartment, Condo, Tower Residence. |
| Commercial | Higher income with higher costs and timers. | Shop, Office, Business Center, Mall. |
| Luxury | Premium prestige and high-value upgrades. | Hotel, Resort, Mansion, Landmark Tower. |
| Infrastructure | Supports city systems and bonuses. | Road Hub, Power Station, Park, Transit Station. |
| Special/Event | Limited-time collection and prestige. | Festival Plaza, Winter Market, Anniversary Tower. |

## Building Stats

Every building definition should eventually include:

| Field | Description |
| --- | --- |
| id/slug | Stable internal identifier. |
| displayName | Player-facing name. |
| category | Building category. |
| price | Construction cost. |
| incomePerMinute | Base income rate. |
| maxLevel | Maximum upgrade level. |
| buildTime | Construction duration. |
| imageUrl/assetKey | Visual asset reference. |
| isActive | Whether it can appear in the shop. |

## Upgrade Philosophy

- Upgrades should increase income and city value.
- Important level milestones can unlock improved visuals.
- Upgrade costs should scale faster than income to preserve long-term goals.
- Max levels should start simple and expand after economy testing.

## Visual Requirements

- All buildings must use the same 2.5D isometric camera angle.
- All buildings must have consistent shadow direction and ground footprint logic.
- No building should look copied from another game, stock pack, or copyrighted city builder.
- Building silhouettes should remain readable on mobile screens.
