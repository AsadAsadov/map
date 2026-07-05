# Assets

## Visual Style

Real Estate Empire uses a premium 2.5D isometric city-builder style.

Required characteristics:

- 2.5D isometric perspective.
- Clean premium shapes.
- Soft shadows with consistent direction.
- Bright readable colors.
- Mobile-first silhouettes and contrast.
- Original AI-generated assets only.
- No mixed asset styles.
- No copied assets from commercial games, marketplaces, or copyrighted references.

## Style Rules

| Rule | Requirement |
| --- | --- |
| Camera angle | Maintain one consistent isometric angle across buildings, props, roads, and decorations. |
| Lighting | Use soft, friendly city-builder lighting. |
| Palette | Bright but not neon; high readability on small screens. |
| Outlines | Use consistent edge treatment if outlines are introduced. |
| Shadows | Use soft ground shadows that anchor objects to the tile. |
| Detail density | Large shapes first, small details second, readable at mobile scale. |
| Export quality | Use transparent backgrounds for sprites unless a full background is intended. |

## Asset Naming Conventions

Use lowercase kebab-case filenames.

| Asset Type | Pattern | Example |
| --- | --- | --- |
| Building | `building-{category}-{name}-lvl-{level}.png` | `building-residential-small-house-lvl-1.png` |
| Plot | `plot-{state}.png` | `plot-available.png` |
| UI icon | `icon-{purpose}.png` | `icon-coins.png` |
| Decoration | `decor-{name}.png` | `decor-tree-oak.png` |
| Vehicle | `vehicle-{type}-{color}.png` | `vehicle-car-red.png` |
| Effect | `effect-{name}.png` | `effect-coin-collect.png` |

## Folder Recommendations

Future asset folders should follow this structure:

```text
web/src/assets/
  buildings/
  plots/
  ui/
  decorations/
  vehicles/
  effects/
  audio/
```

## AI Generation Rules

- Prompts should describe the original Real Estate Empire style, not another game's exact style.
- Generated assets must be reviewed for consistency before merging.
- Do not mix pixel art, flat vector, realistic 3D renders, and painterly sprites in the same gameplay view.
- Maintain a prompt library later so future assets share perspective, lighting, and palette.
