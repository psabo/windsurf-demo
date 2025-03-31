// Burger Space Invaders - Main Entry Point
import { Game } from './game.js';

// Wait for DOM to be fully loaded before initializing the game
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions to match the container's width while maintaining aspect ratio
  const resizeCanvas = () => {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    
    // Standard game dimensions (16:9 aspect ratio)
    const gameWidth = containerWidth;
    const gameHeight = Math.floor(containerWidth * 0.75); // 4:3 aspect ratio for retro feel
    
    canvas.width = gameWidth;
    canvas.height = gameHeight;
    
    // If we already have a game instance, update its dimensions
    if (window.gameInstance) {
      window.gameInstance.resize(gameWidth, gameHeight);
    }
  };
  
  // Initial canvas sizing
  resizeCanvas();
  
  // Handle window resize
  window.addEventListener('resize', resizeCanvas);
  
  // Initialize the game
  window.gameInstance = new Game(canvas, ctx);
  window.gameInstance.start();
});
