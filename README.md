# Threlte Meteor Balls Animation

A stunning 3D animation showcasing 7 blue steel spheres traveling across the screen with reddish meteor trails, built with SvelteKit and Threlte.

## Features

- **7 Animated Spheres**: Blue steel colored balls that appear sequentially
- **Bezier Curve Paths**: Each sphere follows a unique curved path across the screen
- **Dynamic Meteor Trails**: Custom shader-based trails with red-orange gradient effects
- **Smooth Animations**: GSAP-powered timeline animations with natural easing
- **Responsive Design**: Balls scale to ~10% of viewport height
- **Interactive Camera**: OrbitControls for exploring the 3D scene

## Tech Stack

- **SvelteKit 2.x** - Modern web framework
- **Threlte 8.x/9.x** - Declarative Three.js bindings for Svelte
- **Three.js** - 3D graphics library
- **GSAP 3.12+** - Professional-grade animation library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool

## Installation

```bash
# Install dependencies
npm install --force

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The project is now running at: **http://localhost:5173/**

## Project Structure

```
meteor-balls/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Scene.svelte          # Main 3D scene container
│   │   │   ├── MeteorBall.svelte     # Individual animated sphere
│   │   │   └── MeteorTrail.svelte    # Trail effect component
│   │   ├── shaders/
│   │   │   ├── trail.vert.glsl       # Trail vertex shader
│   │   │   └── trail.frag.glsl       # Trail fragment shader
│   │   ├── utils/
│   │   │   ├── pathGenerator.ts      # Bezier curve path generation
│   │   │   ├── trailGeometry.ts      # Custom BufferGeometry for trails
│   │   │   └── constants.ts          # Animation timing constants
│   └── routes/
│       ├── +page.svelte              # Main page
│       └── +page.ts                  # Page configuration (SSR disabled)
```

## How It Works

### Animation System

1. **Sequential Spawning**: Balls spawn with 0.5s intervals
2. **Appearance**: Each ball scales from tiny to full size over 0.8s
3. **Path Following**: Balls travel along cubic bezier curves for 5s
4. **Trail Generation**: Position history creates dynamic ribbon geometry

### Technical Highlights

- **Custom Trail Geometry**: Efficient BufferGeometry with circular position buffer
- **GLSL Shaders**: Custom vertex/fragment shaders for trail gradient effect
- **Bezier Curves**: Procedurally generated cubic bezier paths with randomization
- **GSAP Integration**: Timeline-based animation with precise control
- **Threlte useTask**: Frame-by-frame updates for smooth motion

## Configuration

Animation parameters can be adjusted in `src/lib/utils/constants.ts`:

```typescript
export const BALL_COUNT = 7;              // Number of balls
export const SPAWN_INTERVAL = 0.5;        // Seconds between spawns
export const APPEARANCE_DURATION = 0.8;   // Scale animation duration
export const TRAVEL_DURATION = 5;         // Path travel duration
export const BALL_SIZE_PERCENT = 0.1;     // Ball size (% of viewport)
export const TRAIL_LENGTH = 80;           // Trail point count
export const TRAIL_WIDTH = 0.2;           // Trail ribbon width
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Requires WebGL support

## Performance

- Targets 60fps with all 7 balls and trails active
- Each trail limited to 80 position points
- Efficient BufferGeometry updates
- GPU-accelerated shader rendering

## Controls

- **Mouse Drag**: Rotate camera view
- **Mouse Wheel**: Zoom in/out
- **Right Click + Drag**: Pan camera

## Development

The project uses:
- TypeScript for type safety
- Vite for fast HMR (Hot Module Replacement)
- ESM modules throughout
- SSR disabled for browser-specific APIs

## Troubleshooting

### Node Version Issues

If you encounter engine compatibility errors during `npm install`, use the `--force` flag:

```bash
npm install --force
```

The project requires Node.js version that supports the latest SvelteKit packages.

### Vite Optimization

On first run, Vite may need to pre-optimize dependencies. This is normal and only happens once.

## License

MIT

## Credits

Created with ♥ using Threlte, Three.js, and GSAP
