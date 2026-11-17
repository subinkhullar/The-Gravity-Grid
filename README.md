# README.md

# 🎮 The Gravity Grid by Subin Khullar 😎

> A next-generation gravity-based strategy game combining the depth of Connect Four, the simplicity of Tic-Tac-Toe, and the replayability of modern competitive board games.

https://img.shields.io/badge/version-1.0-blue
https://img.shields.io/badge/PWA-Ready-green
https://img.shields.io/badge/Offline-Supported-orange
https://img.shields.io/badge/Vanilla-JavaScript-yellow

---

# 🌟 Overview

**The Gravity Grid by Subin Khullar 😎** is a configurable Progressive Web Application (PWA) strategy game where players compete on large boards while obeying gravity-based placement mechanics.

Unlike traditional Tic-Tac-Toe, players cannot place symbols freely. Every move follows the laws of gravity, causing pieces to occupy the lowest available position in the chosen column.

The game supports:

- Large configurable grids
- Multiple human and AI players
- Strategic gameplay
- Multiple victory conditions
- Tournament modes
- Statistics and analytics
- Achievements and progression
- Themes and customization
- Offline play as a Progressive Web App

---

# 🎯 Core Gameplay

Players take turns dropping symbols into columns.

When a symbol is placed:

1. Player selects a column.
2. Gravity is applied.
3. Symbol falls to the lowest available cell.
4. Turn passes to next player.
5. Game checks for victory conditions.

The objective is to align a configurable number of matching symbols.

---

# 🧲 Gravity System

The Gravity Engine prevents arbitrary placement.

Example:

Before move:

```text
| | | | |
| | | | |
| | | | |
|X| | | |
```

Column 1 selected.

After move:

```text
| | | | |
| | | | |
|O| | | |
|X| | | |
```

The symbol always occupies the first available slot from the bottom.

---

# 📏 Board Configuration

Board size is configurable.

| Setting | Value |
|----------|----------|
| Minimum | 10 × 10 |
| Default | 15 × 15 |
| Maximum | 25 × 25 |

Larger boards require greater strategic planning and support longer matches.

---

# 👥 Player Modes

Supported player counts:

- 2 Players
- 3 Players
- 4 Players
- 5 Players
- 6 Players
- 7 Players
- 8 Players

Game Modes:

### Human vs Human

Local multiplayer mode.

### Human vs AI

Play against intelligent computer opponents.

### AI vs AI

Observe AI behaviour and strategies.

### Tournament Mode

Multiple players compete across several rounds.

---

# 🏆 Victory Conditions

Victory conditions are fully configurable.

Available objectives:

- Connect 4
- Connect 5
- Connect 6
- Connect N

Winning alignments:

✅ Horizontal

✅ Vertical

✅ Diagonal

✅ Anti-Diagonal

---

# 🎮 Play Modes

## Classic Mode

Standard rules.

## Sudden Death

First completed alignment immediately wins.

## Timed Mode

Players must move before timer expires.

## Endless Mode

Board expands dynamically.

## Tournament Mode

Track standings across multiple games.

## Chaos Mode

Random modifiers affect gameplay.

Examples:

- Column lock
- Double turn
- Reverse turn order
- Symbol swap

---

# 🤖 Artificial Intelligence

The game includes configurable AI opponents.

---

## Level 1 – Random

Completely random moves.

Suitable for beginners.

---

## Level 2 – Basic Strategy

Understands:

- Immediate wins
- Immediate threats

---

## Level 3 – Offensive

Prioritises creating winning positions.

Capabilities:

- Sequence building
- Opportunity detection

---

## Level 4 – Defensive

Focuses on:

- Blocking threats
- Preventing player combinations

---

## Level 5 – Minimax

Uses game-tree searching.

Features:

- Board evaluation
- Predictive analysis
- Strategic counterplay

---

## Level 6 – Advanced Heuristics

Evaluates:

- Positional value
- Future opportunities
- Board control

---

## Level 7 – Adaptive Intelligence

Session-based learning.

Tracks:

- Player preferences
- Common strategies
- Frequent responses

Adjusts behaviour dynamically.

---

# 🏅 Achievement System

Players earn achievements while progressing.

Examples:

| Achievement | Requirement |
|------------|-------------|
| First Victory | Win first game |
| Rising Star | Win 10 games |
| Champion | Win 50 games |
| Grid Master | Win 100 games |
| Fast Thinker | Fast move average |
| Marathon Player | Long session |
| Theme Explorer | Use all themes |
| AI Conqueror | Beat Advanced AI |

Achievement notifications appear in real time.

---

# 📈 Gamification

The game includes modern progression systems.

### XP System

Earn experience points through:

- Victories
- Challenges
- Achievements
- Tournaments

### Levels

Player profiles gain levels.

### Ranks

Examples:

```text
Rookie
Strategist
Master
Elite
Grandmaster
Legend
Grid Titan
```

### Unlockables

Unlock:

- Themes
- Symbols
- Emblems
- Profile customizations

---

# ⏱️ Timer System

Supported timer options:

### Turn Timer

Per-turn countdown.

### Match Timer

Full game countdown.

### Count-Up Mode

Measures match duration.

### Disabled Mode

Unlimited thinking time.

Features:

- Warnings
- Visual indicators
- Audio alerts

---

# 🎨 Theme Engine

Multiple visual themes included.

## Cosmic Nebula

Deep space aesthetic.

## Cyberpunk

Neon futuristic styling.

## Ocean Depths

Underwater elements.

## Forest Kingdom

Nature-inspired colours.

## Royal Gold

Premium luxurious visuals.

## Minimalist

Clean modern design.

## Neon Matrix

Digital cyber-grid styling.

Theme changes apply instantly.

---

# 🔰 Player Symbols

Players may choose:

- X
- O
- Triangle
- Square
- Diamond
- Star
- Hexagon
- Crown
- Emoji
- Custom Symbol

Each symbol is visually distinct.

---

# 📊 Statistics Dashboard

The game records extensive analytics.

Tracked statistics include:

- Games Played
- Games Won
- Games Lost
- Draws
- Win Percentage
- Fastest Victory
- Longest Winning Streak
- Average Move Time
- Favourite Theme
- Favourite Symbol
- AI Usage
- Board Size Preferences

---

# 📉 Analytics Charts

Generated dynamically using HTML Canvas.

Available charts:

### Bar Charts

- Wins
- Losses
- Draws

### Pie Charts

- Theme usage
- Symbol usage

### Line Charts

- Historical performance
- Win trends

### Performance Graphs

- XP progression
- Ranking changes

---

# 💾 Data Persistence

All data is stored locally using LocalStorage.

Saved items:

- Statistics
- Achievements
- Settings
- Profiles
- Themes
- Leaderboards
- Saved Games

No external database required.

---

# 📱 Progressive Web App Features

The Gravity Grid is built as a full PWA.

Features:

✅ Offline Support

✅ Installable

✅ Mobile Friendly

✅ Desktop Friendly

✅ Fast Loading

✅ Cached Assets

✅ Service Worker Support

✅ App Manifest Support

---

# 🏗️ Project Architecture

```text
gravity-grid/
│
├── index.html
│
├── styles.css
│
├── app.js
│
├── service-worker.js
│
├── manifest.json
│
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
│
└── README.md
```

---

# ⚙️ Technical Architecture

## Frontend Layer

Responsible for:

- UI Rendering
- Event Handling
- Theme Management

Implemented in:

```text
HTML5
CSS3
Vanilla JavaScript
```

---

## Game Engine

Responsible for:

- Gravity calculations
- Turn management
- Win detection
- Timer logic

Main file:

```text
app.js
```

---

## Storage Layer

Responsible for:

- Save games
- Achievements
- Statistics

Technology:

```javascript
localStorage
```

---

## Analytics Layer

Responsible for:

- Chart generation
- Performance tracking
- Historical data

Technology:

```javascript
Canvas API
```

---

## PWA Layer

Responsible for:

- Offline support
- Caching
- Installation

Files:

```text
service-worker.js
manifest.json
```

---

# 🚀 Installation

## Option 1: Run Locally

Download project:

```bash
git clone https://github.com/YOUR_USERNAME/gravity-grid.git
```

Navigate:

```bash
cd gravity-grid
```

Open:

```text
index.html
```

---

## Option 2: VS Code Live Server

Install:

```text
Live Server Extension
```

Run:

```text
Right Click → Open with Live Server
```

---

## Option 3: Deploy to GitHub Pages

Push project:

```bash
git init

git add .

git commit -m "Initial commit"

git branch -M main

git remote add origin https://github.com/YOUR_USERNAME/gravity-grid.git

git push -u origin main
```

Enable:

```text
Repository Settings
→ Pages
→ Deploy from Branch
→ main
```

---

# 🌐 Browser Support

Supported browsers:

✅ Chrome

✅ Edge

✅ Firefox

✅ Brave

✅ Opera

✅ Safari

---

# 📖 Help Section

Included in-game:

- Rules Overview
- Gravity Mechanics
- Win Conditions
- AI Difficulty Guide
- Statistics Guide
- Achievement Guide
- Theme Guide
- FAQ

---

# 🔐 Privacy

The game:

- Stores data locally only
- Does not collect personal information
- Does not transmit gameplay data externally

---

# 👨‍💼 About the Author

## Subin Khullar

**Principal Consultant – IPR&D (HiTech)**

**Indian Patent Agent**

**Deep-Tech US Patent Drafting Specialist**

**Author, Technologist, Strategist, and Creative Storyteller**

Subin Khullar combines deep technical expertise, innovation strategy, and creative thinking to build engaging intellectual and digital experiences spanning advanced technology, gaming concepts, storytelling, patents, and educational content.

### Areas of Expertise

- Artificial Intelligence
- Semiconductors
- Computer Architecture
- Patent Drafting
- Innovation Management
- Technical Writing
- Game Design Concepts
- Creative Storytelling

---

# 📜 Copyright

Copyright ©️ 2026 Subin Khullar. All rights reserved.

---

# ⭐ Future Roadmap

Planned enhancements:

- Online Multiplayer
- Cloud Saves
- Friend System
- Seasonal Events
- Ranked Leagues
- New Themes
- Custom AI Training
- Custom Rule Builder
- Spectator Mode
- Replay Sharing

---

## The Gravity Grid by Subin Khullar 😎

**Master gravity. Control the grid. Outthink your rivals. Become a legend.** 🚀🎮🌌 
