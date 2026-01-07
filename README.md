# SkillForge Idle

An incremental idle game inspired by RuneScape and Melvor Idle, built with React Native.

🎮 **[Play the Web Version](https://fahmed93.github.io/skillforgeidle/)**

## 🎮 Game Overview

SkillForge Idle is a mobile incremental game where players train various skills from level 1 to 99. Each skill offers multiple training activities that unlock as you progress, providing a satisfying progression system with meaningful choices.

## ✨ Features

### Core Gameplay
- **6 Trainable Skills**: Woodcutting, Mining, Fishing, Cooking, Smithing, and Crafting
- **Level Progression**: Train skills from level 1 to 99 with exponential XP curves
- **50+ Training Activities**: Each skill has 8-10 different training options
- **Resource Management**: Gather and process resources through complementary skills
- **Persistent Progress**: Your progress is automatically saved

### Skills

#### Gathering Skills
- **🪓 Woodcutting**: Chop trees to gather various types of wood (8 activities)
- **⛏️ Mining**: Extract ores and gems from rocks (10 activities)
- **🎣 Fishing**: Catch fish from various fishing spots (10 activities)

#### Production Skills
- **🍳 Cooking**: Cook raw food into edible meals (9 activities)
- **🔨 Smithing**: Forge bars from ores (9 activities)
- **✂️ Crafting**: Create items from various materials (9 activities)

## 📋 Specification System

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) for spec-driven development. All features are documented in the `specs/` directory:

- **[Core Game System](specs/01-core-game-system.md)**: Game loop, state management, XP calculations
- **[Skill System](specs/02-skill-system.md)**: Detailed skill and activity definitions
- **[User Interface](specs/03-user-interface.md)**: UI/UX specifications
- **[Future Features](specs/future-features.md)**: Roadmap for upcoming features

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment
- iOS Simulator (Mac only) or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/fahmed93/skillforgeidle.git
cd skillforgeidle

# Install dependencies
npm install

# Run on Web
npm run web

# For iOS (Mac only)
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Building for Production

```bash
# Build web version for deployment
npm run build:web

# Output will be in the dist/ directory
```

## 🏗️ Project Structure

```
skillforgeidle/
├── .specify/              # Spec-kit configuration
│   ├── config.yml        # Project configuration
│   └── memory/           # Project constitution
├── specs/                # Feature specifications
│   ├── 01-core-game-system.md
│   ├── 02-skill-system.md
│   ├── 03-user-interface.md
│   └── future-features.md
├── src/                  # Source code
│   ├── types/           # TypeScript type definitions
│   ├── data/            # Game data (skills, activities)
│   ├── store/           # State management
│   ├── components/      # React components
│   ├── screens/         # Screen components
│   ├── utils/           # Utility functions
│   └── hooks/           # Custom React hooks
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 XP Formula

The game uses a RuneScape-inspired XP formula for level progression:

```
xpForLevel(n) = floor(n + 300 * 2^(n/7)) / 4
totalXPForLevel(n) = sum(xpForLevel(i) for i = 1 to n-1)
```

This creates an exponential curve:
- Level 2: 83 XP
- Level 50: 101,333 XP
- Level 99: 13,034,431 XP

## 🗺️ Roadmap

See [Future Features](specs/future-features.md) for the complete roadmap. Planned features include:

### Phase 2
- Combat System
- Equipment System
- Bank Storage

### Phase 3
- Achievement System
- Quest System
- Mastery System

### Phase 4
- Leaderboards
- Trading System
- Clans/Guilds

### Phase 5
- 10+ Additional Skills
- Minigames
- Prestige System

## 🧪 Development

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

## 🚀 Deployment

The game is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The GitHub Actions workflow:

1. Installs dependencies
2. Builds the web version using webpack
3. Deploys to GitHub Pages

To enable GitHub Pages deployment for your fork:

1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Push to the `main` branch to trigger deployment

The site will be available at: `https://<username>.github.io/skillforgeidle/`

## 📝 Contributing

This project follows spec-driven development principles:

1. All features start with a specification in `specs/`
2. Specifications define the "what" and "why" before implementation
3. Code is written to fulfill the specifications
4. Tests validate that specifications are met

## 📄 License

MIT

## 🙏 Acknowledgements

- Inspired by [RuneScape](https://www.runescape.com/) and [Melvor Idle](https://melvoridle.com/)
- Built with [React Native](https://reactnative.dev/)
- Spec-driven development using [GitHub Spec Kit](https://github.com/github/spec-kit)