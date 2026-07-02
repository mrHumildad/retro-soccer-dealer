
# Retro Soccer Dealer — Design Bible

> Living UI/UX specification. Every visual or structural change must conform to this document.

# Core Vision

Retro Soccer Dealer is **not** a spreadsheet football manager.

It is a **retro football trading game** where players feel like collectible cards, negotiations feel tactile, and every interaction reinforces the fantasy of being a football dealer.

## Pillars

- Mobile-first
- Single Page Application
- Fixed app shell
- Retro arcade + Panini sticker aesthetic
- Clear visual hierarchy
- Small but satisfying interactions

# Visual Language

## Inspirations

- Panini stickers
- 90s football magazines
- Transfer office
- Arcade cabinets
- Stadium scoreboards
- Casino chips

## Color Tokens

| Token | Color |
|---|---|
| --bg | #0f100d |
| --panel | #203523 |
| --money | #5e7d45 |
| --gold | #d7b25a |
| --gold-light | #f0d18a |
| --cream | #f4e6b3 |
| --danger | #b62f28 |
| --danger-dark | #651313 |
| --black | #090909 |

## Typography

Display: slab serif.
Body: modern sans.
Numbers: monospace.

# Layout Rules

- 390px is the primary design target.
- Header fixed.
- Bottom navigation fixed.
- Only the central viewport scrolls.
- No horizontal scrolling.
- Cards always occupy full available width.

# CSS Architecture

```
src/styles/
  tokens.css
  reset.css
  base.css
  layout.css
  utilities.css
  components/
    header.css
    player-card.css
    panels.css
    buttons.css
    navigation.css
    animations.css
  themes/
    retro.css
```

# Components

## Header
Money | Logo | Date

## Squad
Accordion, collapsed by default.

## Market
Scrollable list of player cards.

## Player Card

Contains:
- Pixel portrait
- Rating badge
- Name
- Club
- Country
- Age
- Value
- Trend
- Buy/Sell button

# Portrait Pipeline

Original image

→ Canvas downscale

→ Pixel enlargement

→ Posterization

→ Cached bitmap

Goal: consistent retro sticker appearance.

# Animation Rules

Allowed:
- Border glow
- Counter roll
- Stamp
- Card slide
- Tiny lift

Avoid:
- Bouncy UI
- Large scaling
- Long easing

# Navigation

Bottom tabs:
- Home
- Market
- Timeline
- Hall of Fame
- Settings

# Roadmap

## Phase 0
Prepare CSS architecture (no visual changes).

## Phase 1
Introduce design tokens.

## Phase 2
Build fixed app shell.

## Phase 3
Convert to mobile-first.

## Phase 4
Redesign header.

## Phase 5
Redesign player card.

## Phase 6
Accordion squad.

## Phase 7
Bottom navigation.

## Phase 8
Micro animations.

## Phase 9
Portrait rendering.

## Phase 10
Visual polish.

# Working Agreement

For every phase:

1. Explain the goal.
2. List every file to modify.
3. Explain every code change before writing it.
4. Wait for approval.
5. Implement only the approved changes.
6. Commit and continue.

No implementation skips ahead.

This document is the single source of truth for the project's visual identity.
