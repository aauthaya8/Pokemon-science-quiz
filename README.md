# Kids Science Battle

A Pokémon-style quiz RPG for Grade 3 and Grade 4 science. Kids pick a starter, walk a route map, and battle creatures by answering science questions. Right answers deal damage, wrong answers cost a heart, and every win earns points, stars, and new powers.

The game runs entirely in the browser with no backend. Progress is saved to `localStorage`.

## How it plays

1. **Title screen** – enter a name, choose Grade 3 or Grade 4, and pick a starter (Pikachu, Eevee, Bulbasaur, or Charmander).
2. **Route map** – 12 levels across five themed regions. Beating a level unlocks the next one.
3. **Battle** – each level is a creature with 3, 5, or 7 HP. Every correct answer deals 1 damage. Three wrong answers and the battle is lost. Finishing with fewer strikes earns more stars (3 stars for a perfect run).
4. **Result** – points are added to the trainer's lifetime total. Losing a battle costs half of the current points, so a bad streak has real stakes.

### Powers

Six powers are unlocked by clearing specific levels. Arming a power before answering doubles the damage and points of the next correct answer. Some powers are super effective against certain creature types for an extra 1.5x multiplier, and critical hits deal extra damage and double points again on top of that.

| Power | Unlocked by | Topic |
| --- | --- | --- |
| Beast Roar | Level 2 (Lillipup) | Animals |
| Vine Whip | Level 4 (Caterpie) | Life |
| Meteor Strike | Level 6 (Beheeyem) | Earth & Space |
| Lightning Bolt | Level 8 (Magneton) | Physical |
| Cosmic Crush | Level 10 (Cosmog) | Any |
| Master's Spark | Level 12 (Mewtwo, final boss) | Any |

### Progression and extras

- **Trainer levels** – lifetime points map to trainer levels 1 through 10 with rank titles from Rookie to Legend.
- **Evolution** – the starter evolves as the trainer levels up (for example Charmander → Charmeleon → Charizard), with a full-screen evolution cinematic.
- **Shop** – spend points on one-shot consumables (extra heart, triple crit chance, pre-armed power) or permanent cosmetics that render on the avatar.
- **Achievements** – seven unlockables such as First Win, Perfectionist, and Champion.
- **Sound** – battle music and sound effects with a mute toggle. Audio files are not checked in; see `public/sounds/README.txt` for the expected file names.

## Content

The question bank has 240 questions: 30 per topic per grade, spread across three difficulty tiers, in multiple choice and true/false formats. Every question includes a short explanation shown after answering.

| Topic | Region on the map |
| --- | --- |
| Animals | Wildwood |
| Life science | Botany Garden |
| Earth & Space | Stargazer's Peak |
| Physical science | Volt Lab |
| Mixed (final boss) | Champion's Plateau |

Switching grade resets level progress and powers but keeps the point total.

## Tech stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS for the RPG-style UI
- Vitest + Testing Library for unit and component tests
- Creature and avatar sprites are loaded from PokéAPI by Dex ID

## Development

```bash
npm install
npm run dev            # start the dev server
npm test               # run the test suite once
npm run test:watch     # run tests in watch mode
npm run test:coverage  # run tests with a coverage report
npm run lint           # lint with ESLint
npm run build          # type-check and build for production
npm run preview        # serve the production build locally
```

## Project layout

```
src/
  components/   screens and UI pieces (TitleScreen, LevelSelect, BattleScreen, ResultScreen, ...)
  data/         levels, powers, questions, regions, evolutions, shop items, achievements
  logic/        pure game logic (battle reducer, scoring, level unlock, evolution, shop, ...)
  hooks/        useProfile (load/save the player profile)
  types.ts      shared TypeScript types
public/sounds/  drop-in location for audio files
```

Game logic lives in `src/logic` as pure functions with tests beside them, so rules can be changed and verified without touching the UI.
