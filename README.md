# Gravity Maze

Gravity Maze is a physics-based puzzle game created for the [GameDev.js Jam 2025](https://gamedevjs.com/jam/2025/). In this game, players guide a ball through a series of rotating platforms to reach a golden ring. Each level introduces new challenges, such as moving platforms and gravity-defying obstacles, testing players' precision and timing.

## Gameplay
- **Objective**: Navigate a ball through rotating discs to reach the golden ring at the end of each level.
- **Controls**:
  - Use **Arrow keys** or **WASD** to tilt the discs and guide the ball.
  - Avoid letting the ball fall off the platforms.
  - Reach the golden ring to complete the level.
- **Levels**: The game features multiple levels with increasing difficulty, including moving platforms in later stages.
- **Attempts Counter**: Tracks the number of attempts per level, resetting the ball to the starting position if it falls off.

## Features
- Realistic physics simulation using Three.js for rendering and Cannon.js for physics.
- Dynamic lighting and shadows for an immersive experience.
- Grass-textured ground and metallic ball with emissive effects.
- Interactive UI with attempt and level counters, victory screen, and level selector.
- Responsive design with viewport size warnings for optimal play (recommended: 1280x720 or larger).

## Development
Gravity Maze was entirely developed using [Cursor.ai](https://cursor.ai/), a powerful AI-assisted coding tool that streamlined the creation process. The game was built as a "vibe-coded" project, emphasizing an intuitive and creative workflow.

For insights into the development process, check out:
- **Blog Post**: [Vibe-coding for a GameJam](https://dev.to/jacklehamster/vibe-coding-for-a-gamejam-4k9h)
- **YouTube Playlist**: [Development Videos](https://www.youtube.com/watch?v=zbPcOla8yDY&list=PLJACaXedz4d3hSK3oD8Vz4GfcB031b1LE)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gravity-maze.git
   ```
2. Open `index.html` in a modern web browser (Chrome or Firefox recommended).
3. Ensure the window size is at least 1280x720 for the best experience.

## Dependencies
- [Three.js](https://threejs.org/) - 3D rendering
- [Cannon.js](https://github.com/schteppe/cannon.js) - Physics engine

No additional setup is required, as dependencies are loaded via CDN.

## How to Play
1. Launch the game to see the "Gravity Maze" start screen.
2. Click **Start Game** to begin.
3. Use **Arrow keys** or **WASD** to tilt the discs and guide the ball toward the golden ring.
4. Complete each level to unlock the next, or use the level selector to choose a specific level.
5. If the ball falls, it resets, and the attempt counter increments.
6. Reach the golden ring to trigger the victory screen and proceed to the next level.

## System Requirements
- Modern web browser (Chrome, Firefox, or Edge).
- Recommended window size: 1280x720 or larger.
- Fullscreen mode is recommended for the best experience.

## Credits
- **Developer**: Jack Le Hamster
- **Tools**: Built with Cursor.ai. Readme produced by Grok
- **Game Jam**: Created for [GameDev.js Jam 2025](https://gamedevjs.com/jam/2025/)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

