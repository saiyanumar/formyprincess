# hidden's Birthday Surprise 🎂

A romantic birthday reveal app with interactive fireworks, animations, and heartfelt messages.

## Features

- 🔒 Protected access with PIN authentication
- 🎆 Interactive Diwali-style fireworks celebration
- 🎵 Background music with control
- 📱 Fully responsive design
- 💝 Multiple romantic sections:
  - Hero landing with floating hearts
  - Photo gallery with memories
  - Animated love letter
  - Private diary with local storage
  - Birthday countdown celebration
  - Beautiful outro message

## Project Structure

The app follows a stage-based flow:

```
auth -> blackout -> fireworks -> hero -> gallery -> letter -> diary -> countdown -> outro
```

### Key Components

- `AuthGate`: PIN protection with smooth animations
- `BlackoutTransition`: Dramatic entrance effect
- `DiwaliFireworks`: Interactive fireworks celebration
- `HeroSection`: Landing page with music control
- `StoryGallery`: Photo gallery with lightbox
- `RomanticLetter`: Animated typewriter effect letter
- `DiarySection`: Private thoughts with local storage
- `CountdownSection`: Birthday celebration message
- `OutroSection`: Final romantic message
- `SectionTransition`: Smooth transitions between sections

## Technologies Used

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Animations**: Custom CSS animations + Lucide icons

## Development Setup

1. Install dependencies:
```sh
npm install
```

2. Start development server:
```sh
npm run dev
```

3. Add required assets:
- Place `husn.mp3` in the `public` folder for background music
- Update story images in `StoryGallery.tsx`
- Customize PIN in `AuthGate.tsx`

## Implementation Notes

### Fireworks Integration

The fireworks effect is implemented using a hybrid approach:
- Original Diwali fireworks script loaded via script tags
- React wrapper (`DiwaliFireworks.tsx`) for lifecycle management
- Performance optimizations:
  - Loading UI hidden until script loaded
  - Reduced shell count during overlays
  - Quality settings adjusted for smoother transitions

### State Management

- Stage-based navigation using React state
- Local storage for diary entries
- Audio controls with useRef for persistence
- Smooth transitions between sections

## Outstanding Tasks

1. ✅ AuthGate Layout Improvements
   - Added attempt limiting (3 attempts with 30s cooldown)
   - Enhanced error feedback with attempts remaining
   - Improved mobile responsiveness

2. ✅ Fireworks Enhancement
   - Added configuration interface for better control
   - Implemented quality and performance settings
   - Added shell size and count configuration

3. ✅ Performance Optimization
   - Added lazy loading for gallery images
   - Optimized animations using requestAnimationFrame
   - Implemented intersection observer for better performance

Remaining Tasks:
1. Full React port of fireworks animation (future enhancement)
2. Additional security features (optional)
3. Advanced configuration UI (optional)

## Development Workflow

You can edit this project in several ways:

### Using Lovable

Visit the [Lovable Project](https://lovable.dev/projects/c00d249c-6500-4f8e-8a75-a1a9426769d8) and start prompting. Changes made via Lovable will be committed automatically to this repo.

### Using Local Development

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
```

2. Navigate to project:
```sh
cd <YOUR_PROJECT_NAME>
```

3. Install dependencies:
```sh
npm install
```

4. Start development:
```sh
npm run dev
```

### Other Methods

- **GitHub Direct**: Edit files directly through GitHub's web interface
- **GitHub Codespaces**: Use cloud-based development environment

## Deployment

1. Open [Lovable](https://lovable.dev/projects/c00d249c-6500-4f8e-8a75-a1a9426769d8)
2. Click on Share -> Publish
3. Optionally connect a custom domain via Project > Settings > Domains

## License

Made with ❤️ for hidden. All rights reserved.
