# Pokemon Essentials PBS Editor App

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=flat-square)](https://atendev.github.io/PBS-Editor/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Electron](https://img.shields.io/badge/Electron-39-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)

A modern Electron + React application for editing Pokemon Essentials PBS (Pokemon Battle System) data files with a user-friendly interface, eliminating the need to manually edit raw text files.

[Link to the Original Live Page](https://atendev.github.io/PBS-Editor/)

## Overview

Provides a visual editor for Pokémon Essentials PBS data, letting you:

- **Manage Pokémon**: Create, edit, and manage Pokémon data including stats, types, abilities, moves, and more
- **Edit Moves**: Define and modify moves with their properties, effects, and battle mechanics
- **Alter Abilities**: Create and edit Pokémon abilities with descriptions and flags
- **Manage Items**: Change and add Items with their properties, battle and non-battle mechanics
- **Modify Types**: Create and edit Pokémon types with their interactions between each-other
- **Live Preview**: See changes instantly without switching between files

## Features

### Pokemon Editor
- Base stats configuration (HP, Attack, Defense, etc.)
- Type assignments with visual type bubbles
- Ability management with multiple ability slots
- Moveset configuration (level-up, TM, egg moves)
- Physical attributes (height, weight, gender ratios)
- Game mechanics (catch rate, base experience, growth rate)
- Breeding information (egg groups, compatibility)
- Wild held items configuration

### Move Editor
- Basic move properties (name, type, category, power, accuracy)
- Advanced mechanics (priority, critical hit ratio, effect chance)
- Move flags and target configuration
- Description and effect management

### Ability Editor
- Ability descriptions and in-game text
- Flag system for ability properties
- Battle and field effect configuration

### Item Editor
- Item properties (name, plural name, price)
- Item type and pocket assignment
- Field and battle usage configuration
- Flag system for item properties

### Type Editor
- Type properties (name, is pseudo type, is special type)
- Icon position configuration
- Weaknesses/Resistances/Immunities interactions

### Technical Features
- **React 19** with modern hooks and state management
- **TypeScript** for type safety
- **Tailwind CSS** for responsive styling
- **Vite** for fast development and building
- **Electron** for app building and app version control
- **Modular architecture** with reusable components

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/PBS-Editor-App.git
cd PBS-Editor-App
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
# For windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

The built application will be available in the `dist` directory.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for type check and initial build setup
- `npm run lint` - Run ESLint
- `npm run build:win` - Build for Windows
- `npm run build:linux` - Build for Linux
- `npm run build:mac` - Build for Mac

### Project Structure
```
src/
  components/          # React components
    pokemon/           # Pokemon-specific components
    move/              # Move editor components
    ability/           # Ability editor components
    item/              # Item editor components
    type/              # Type editor components
    ui/                # Reusable UI components
    layout/            # Layout components
  lib/
    hooks/             # Custom React hooks
    models/            # Data models and types
    services/          # Business logic and utilities
    providers/         # React context providers
    utils/             # Generic utilities
  routes/              # Page components
```

## Contributing

See [CONTRIBUTING](https://github.com/NathanTBeene/PBS-Editor?tab=contributing-ov-file) file for details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built for the Pokemon Essentials community
- Inspired by the need for better PBS data management tools
- Forked from Aten.Dev's PBS Editor page
