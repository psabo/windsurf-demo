# Burger Space Invaders

A retro-style web-based game where you defend against invading burger enemies by shooting ketchup and mustard at them.

## 🎮 Game Overview

Burger Space Invaders is a fun twist on the classic Space Invaders arcade game. Control your chef character at the bottom of the screen and shoot condiments to destroy the descending burger invaders before they reach you.

### Features
- Classic space invaders gameplay with a burger theme
- Three different burger enemy types with unique looks and point values:
  - Regular burgers (10 points)
  - Cheeseburgers (20 points)
  - Double burgers (30 points)
- Progressive difficulty with increasing levels
- Lives system with three attempts per game
- Local high score tracking using localStorage
- Pause functionality and game state management
- Retro pixel-art style graphics and UI

## 🚀 Quick Start

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/burger-space-invaders.git
   cd burger-space-invaders
   ```

2. Install dependencies (for testing):
   ```bash
   npm install
   ```

3. Start the local server:
   ```bash
   just serve
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8081
   ```

## 🎯 How to Play

- **Move**: Use the left and right arrow keys to move your chef
- **Shoot**: Press the space bar to fire ketchup and mustard
- **Pause**: Press 'P' to pause the game
- **Start/Restart**: Press 'Enter' to start or restart the game

## 🧰 Project Structure

```
burger-space-invaders/
├── index.html            # Main HTML file
├── src/
│   ├── css/              # Stylesheets
│   │   └── style.css     # Main CSS file
│   ├── js/               # JavaScript files
│   │   ├── entities/     # Game entities (player, invaders, projectiles)
│   │   ├── managers/     # Game managers (input, collision)
│   │   ├── utils/        # Utility classes (game state)
│   │   └── game.js       # Main game engine
│   └── assets/           # Game assets
│       └── sprites/      # Game sprites and images
├── tests/                # Test files
│   ├── unit/             # Unit tests for game components
│   └── integration/      # Integration tests
├── package.json          # NPM dependencies and scripts
├── babel.config.js       # Babel configuration for tests
├── justfile              # Command runner file
└── README.md             # This file
```

## 🛠️ Development

This project follows modular JavaScript architecture with clear separation of concerns:

- **Entities**: Player, projectiles, and burger invaders
- **Managers**: Handle input and collision detection
- **Game Engine**: Manages the game loop and state
- **Testing**: Jest-based unit tests for game components

### Available Commands

The project uses [just](https://github.com/casey/just) as a command runner:

```bash
just                # Show available commands
just serve          # Start the local server on port 8081
just test           # Run Jest tests
just clean          # Clean build artifacts
```

## 🧪 Testing

The game includes a comprehensive test suite using Jest:

```bash
just test           # Run all tests
```

Tests cover:
- Burger invader movement and behavior
- Game mechanics including level progression and scoring
- Collision detection and lives system

## 🎮 Game Mechanics

### Level Progression
- Clearing all burger invaders advances you to the next level
- Each level increases the speed of the invaders
- Your score and remaining lives carry over between levels

### Scoring System
- Regular burgers: 10 points
- Cheeseburgers: 20 points
- Double burgers: 30 points
- High scores are saved to localStorage

### Lives System
- You start with 3 lives
- Lose a life when a burger invader reaches the bottom
- Game over when all lives are lost

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
