// Burger Space Invaders - Main Game Engine
import { Player } from './entities/player.js';
import { BurgerInvaders } from './entities/burgerInvaders.js';
import { CollisionManager } from './managers/collisionManager.js';
import { InputManager } from './managers/inputManager.js';
import { GameState } from './utils/gameState.js';

export class Game {
  constructor(canvas, ctx) {
    // Canvas and context
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
    
    // Game state
    this.gameState = new GameState();
    
    // Managers
    this.inputManager = new InputManager(this);
    this.collisionManager = new CollisionManager();
    
    // Game entities
    this.player = null;
    this.burgerInvaders = null;
    
    // Animation frame ID for cancellation
    this.animationFrameId = null;
    
    // Timekeeping
    this.lastTime = 0;
    
    // Game stats
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.level = 1;
    this.lives = 3;
    
    // Scoring values for different burger types
    this.scoreValues = {
      0: 10,  // Regular burger
      1: 20,  // Cheeseburger
      2: 30   // Double burger
    };
    
    // Bind methods to keep context
    this.handleKeyPress = this.handleKeyPress.bind(this);
    
    // Add event listener for starting the game
    window.addEventListener('keydown', this.handleKeyPress);
  }
  
  /**
   * Initialize game entities and start the game loop
   */
  start() {
    // Reset game stats when starting a new game
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    
    // Initialize the player
    const playerSize = {
      width: this.width * 0.06, // 6% of canvas width
      height: this.height * 0.06 // 6% of canvas height
    };
    
    this.player = new Player({
      x: this.width / 2 - playerSize.width / 2,
      y: this.height - playerSize.height - 20,
      width: playerSize.width,
      height: playerSize.height,
      speed: 5,
      canvas: this.canvas
    });
    
    // Initialize burger invaders with current level
    this.initBurgerInvaders();
    
    // Start input listening
    this.inputManager.startListening(this.player);
    
    // Set game state to playing
    this.gameState.setState('playing');
    
    // Start the game loop
    this.lastTime = performance.now();
    this.gameLoop();
  }
  
  /**
   * Initialize burger invaders with current level settings
   */
  initBurgerInvaders() {
    this.burgerInvaders = new BurgerInvaders({
      canvas: this.canvas,
      rows: 5,
      columns: 8,
      invaderSize: {
        width: this.width * 0.05,
        height: this.width * 0.05
      },
      padding: 10,
      topOffset: 50,
      level: this.level
    });
  }
  
  /**
   * Advance to the next level
   */
  nextLevel() {
    // Increase level
    this.level++;
    
    // Clear existing burger invaders
    this.burgerInvaders = null;
    
    // Initialize new set of burger invaders with increased level
    this.initBurgerInvaders();
    
    // Reset player position
    if (this.player) {
      this.player.x = this.width / 2 - this.player.width / 2;
      // Clear any active projectiles
      this.player.projectiles = [];
    }
  }
  
  /**
   * Handle key press events for game state changes
   */
  handleKeyPress(event) {
    // Start game with Enter key from menu
    if (this.gameState.isMenu() && event.code === 'Enter') {
      this.start();
      // Remove this event listener since the inputManager will take over
      window.removeEventListener('keydown', this.handleKeyPress);
    }
    
    // Restart game with Enter key from game over
    if (this.gameState.isGameOver() && event.code === 'Enter') {
      this.reset();
      this.start();
    }
    
    // Pause/unpause with 'P' key when playing
    if ((this.gameState.isPlaying() || this.gameState.isPaused()) && event.code === 'KeyP') {
      this.gameState.togglePause();
    }
  }
  
  /**
   * Reset game for restart
   */
  reset() {
    // Stop current game
    this.stop();
    
    // Check if current score is a high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
    
    // Clear all entities
    this.player = null;
    this.burgerInvaders = null;
    
    // Reset managers
    this.inputManager = new InputManager(this);
    this.collisionManager = new CollisionManager();
    
    // Rebind event listener
    window.addEventListener('keydown', this.handleKeyPress);
  }
  
  /**
   * Main game loop using requestAnimationFrame
   */
  gameLoop(currentTime = 0) {
    // Calculate delta time for smooth animations
    const deltaTime = (currentTime - this.lastTime) / 1000; // convert to seconds
    this.lastTime = currentTime;
    
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Render appropriate content based on game state
    if (this.gameState.isMenu()) {
      this.renderMenuScreen();
    } else if (this.gameState.isPlaying()) {
      // Update game entities
      this.update(deltaTime);
      
      // Check for collisions
      this.checkCollisions();
      
      // Render game entities
      this.render();
      
      // Render UI elements
      this.renderUI();
      
      // Check win condition - all invaders destroyed
      if (this.burgerInvaders && this.burgerInvaders.invaders.length === 0) {
        this.nextLevel();
      }
    } else if (this.gameState.isPaused()) {
      // Render paused game
      this.render();
      this.renderUI();
      this.renderPauseScreen();
    } else if (this.gameState.isGameOver()) {
      // Render game over screen
      this.render();
      this.renderUI();
      this.renderGameOverScreen();
    }
    
    // Request next frame
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  /**
   * Update all game entities
   */
  update(deltaTime) {
    // Update player
    this.player.update(deltaTime);
    
    // Update burger invaders
    this.burgerInvaders.update(deltaTime);
  }
  
  /**
   * Check for collisions between entities
   */
  checkCollisions() {
    // Check player projectiles against burger invaders
    if (this.player && this.burgerInvaders) {
      // Filter out projectiles that have collided
      this.player.projectiles = this.player.projectiles.filter(projectile => {
        if (!projectile.isActive) return false;
        
        // Check against each invader
        for (let i = this.burgerInvaders.invaders.length - 1; i >= 0; i--) {
          const invader = this.burgerInvaders.invaders[i];
          
          if (this.collisionManager.checkAABBCollision(projectile, invader)) {
            // Add score based on invader type
            this.score += this.scoreValues[invader.type] || 10;
            
            // Remove invader using the new method
            this.burgerInvaders.removeInvader(i);
            
            // Deactivate projectile
            return false;
          }
        }
        
        return true;
      });
      
      // Check if any invaders have reached the bottom
      if (this.burgerInvaders.checkBottomCollision(this.player.y)) {
        // Lose a life
        this.lives--;
        
        if (this.lives <= 0) {
          // Game over when all lives are lost
          this.gameState.setState('gameOver');
        } else {
          // Reset invaders and player position for the current level
          this.initBurgerInvaders();
          // Reset player position
          this.player.x = this.width / 2 - this.player.width / 2;
          this.player.projectiles = [];
        }
      }
    }
  }
  
  /**
   * Render all game entities
   */
  render() {
    // Render player
    if (this.player) {
      this.player.render(this.ctx);
    }
    
    // Render burger invaders
    if (this.burgerInvaders) {
      this.burgerInvaders.render(this.ctx);
    }
  }
  
  /**
   * Render UI elements like score
   */
  renderUI() {
    // Set text properties
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.textAlign = 'left';
    
    // Render score
    this.ctx.fillText(`SCORE: ${this.score}`, 20, 30);
    
    // Render high score
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`HIGH SCORE: ${this.highScore}`, this.width - 20, 30);
    
    // Render level
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`LEVEL: ${this.level}`, this.width / 2, 30);
    
    // Render lives
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`LIVES: ${this.lives}`, 20, this.height - 20);
  }
  
  /**
   * Render the menu screen
   */
  renderMenuScreen() {
    // Set text properties
    this.ctx.fillStyle = '#0f0';
    this.ctx.font = '30px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    
    // Draw title
    this.ctx.fillText('BURGER SPACE INVADERS', this.width / 2, this.height / 3);
    
    // Draw instructions
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
    this.ctx.fillText('Move: ← →', this.width / 2, this.height / 2 + 40);
    this.ctx.fillText('Shoot: SPACE', this.width / 2, this.height / 2 + 70);
    
    // Draw high score if available
    if (this.highScore > 0) {
      this.ctx.fillText(`HIGH SCORE: ${this.highScore}`, this.width / 2, this.height / 2 + 110);
    }
  }
  
  /**
   * Render the pause screen
   */
  renderPauseScreen() {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Pause text
    this.ctx.fillStyle = '#0f0';
    this.ctx.font = '30px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
    
    // Instructions
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.fillText('Press P to Resume', this.width / 2, this.height / 2 + 40);
  }
  
  /**
   * Render the game over screen
   */
  renderGameOverScreen() {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Game over text
    this.ctx.fillStyle = '#0f0';
    this.ctx.font = '30px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    
    // Different message based on win/lose condition
    if (this.lives <= 0) {
      this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 40);
    } else {
      this.ctx.fillText('YOU WIN!', this.width / 2, this.height / 2 - 40);
    }
    
    // Display final score
    this.ctx.font = '20px "Press Start 2P", monospace';
    this.ctx.fillText(`FINAL SCORE: ${this.score}`, this.width / 2, this.height / 2);
    
    // Display high score
    if (this.score > this.highScore) {
      this.ctx.fillText('NEW HIGH SCORE!', this.width / 2, this.height / 2 + 30);
      this.highScore = this.score;
      this.saveHighScore();
    } else {
      this.ctx.fillText(`HIGH SCORE: ${this.highScore}`, this.width / 2, this.height / 2 + 30);
    }
    
    // Display level reached
    this.ctx.fillText(`LEVEL REACHED: ${this.level}`, this.width / 2, this.height / 2 + 60);
    
    // Restart instructions
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 100);
  }
  
  /**
   * Load high score from localStorage
   */
  loadHighScore() {
    const storedScore = localStorage.getItem('burgerInvadersHighScore');
    return storedScore ? parseInt(storedScore, 10) : 0;
  }
  
  /**
   * Save high score to localStorage
   */
  saveHighScore() {
    localStorage.setItem('burgerInvadersHighScore', this.highScore.toString());
  }
  
  /**
   * Handle canvas resize
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    
    // Update entities with new dimensions if needed
    if (this.player) {
      this.player.handleCanvasResize(width, height);
    }
    
    if (this.burgerInvaders) {
      this.burgerInvaders.handleCanvasResize(width, height);
    }
  }
  
  /**
   * Stop the game loop and clean up
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.inputManager) {
      this.inputManager.stopListening();
    }
  }
}
