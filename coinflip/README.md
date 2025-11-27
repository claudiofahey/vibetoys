# Coin Flip Simulation

An interactive web application that simulates thousands of coin flip games to visualize probability distributions and random walk behavior.

## Overview

This simulation demonstrates how random walks behave over many iterations, comparing additive and multiplicative game modes. It's a powerful tool for understanding probability, expected value, and the surprising differences between additive and multiplicative processes.

> **Inspiration**: This project was inspired by the video [The Coin Flip Conundrum - Po-Shen Loh](https://www.youtube.com/watch?v=HBluLfX2F_k&t=395s)

## Features

### Game Modes

**Additive Mode (+/- $1)**
- Start with $100
- Win: +$1
- Lose: -$1
- Symmetric random walk
- Expected value: $100
- Can go negative

**Multiplicative Mode (× 1.1 / × 0.9)**
- Start with $100
- Win: ×1.1 (gain 10%)
- Lose: ×0.9 (lose 10%)
- Asymmetric growth/decay
- Expected value: negative (due to volatility drag)
- Can go negative

### Visualization

- **Histogram**: Distribution of final payouts across all simulations
- **Logarithmic Scale**: Available for multiplicative mode to better visualize wide-ranging outcomes
- **Statistics**: Real-time calculation of average, median, minimum, and maximum payouts

### Configuration

- **Simulations**: 1 to 100,000 games
- **Flips per Game**: 1 to 10,000 flips
- **Game Mode**: Toggle between additive and multiplicative

## How to Use

1. **Open** `index.html` in a modern web browser
2. **Configure** your simulation parameters:
   - Number of simulations (default: 10,000)
   - Flips per game (default: 100)
   - Game mode (additive or multiplicative)
3. **Click** "Run Simulation"
4. **Analyze** the results in the histogram and statistics panel

## Technology Stack

- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with glassmorphism effects and animations
- **Vanilla JavaScript**: Simulation logic and DOM manipulation
- **Chart.js**: Interactive histogram visualization
- **Google Fonts (Inter)**: Typography

## Key Insights

### Additive Mode
- Results cluster around $0 (the expected value)
- Distribution approximates a normal curve
- Variance increases with more flips

### Multiplicative Mode
- Median is typically below starting value ($100)
- Mean can be positive while most outcomes are negative
- Demonstrates "volatility drag" - why geometric mean < arithmetic mean
- Wide distribution requires logarithmic scale for visualization

## Files

- `index.html` - Main application structure
- `style.css` - Styling and animations
- `script.js` - Simulation logic and chart rendering

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid and Flexbox
- HTML5 Canvas (for Chart.js)

## License

Part of the VibeToys collection. Feel free to use and modify!
