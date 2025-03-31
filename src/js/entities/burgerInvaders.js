// Burger Invaders - Group of burger enemies
import { BurgerInvader } from './burgerInvader.js';

export class BurgerInvaders {
  /**
   * Create a group of burger invaders
   * @param {Object} options - Configuration options
   * @param {HTMLCanvasElement} options.canvas - Canvas element
   * @param {number} options.rows - Number of rows of invaders
   * @param {number} options.columns - Number of columns of invaders
   * @param {Object} options.invaderSize - Size of each invader
   * @param {number} options.padding - Padding between invaders
   * @param {number} options.topOffset - Offset from top of canvas
   * @param {number} options.level - Current game level
   */
  constructor({ canvas, rows = 5, columns = 8, invaderSize, padding = 10, topOffset = 50, level = 1 }) {
    this.canvas = canvas;
    this.rows = rows;
    this.columns = columns;
    this.invaderSize = invaderSize;
    this.padding = padding;
    this.topOffset = topOffset;
    this.level = level;
    
    // Movement properties
    this.baseSpeedX = 30; // Base horizontal speed
    this.speedX = this.baseSpeedX + (this.level - 1) * 5; // Increases slightly with level
    this.speedY = 20; // Vertical movement when hitting edge
    this.direction = 1; // 1 for right, -1 for left
    
    // Speed multiplier should be used for level progression, not during a level
    this.speedMultiplier = 1.0;
    
    // Destroyed invaders counter
    this.destroyedInvaders = 0;
    
    // Array to hold all burger invaders
    this.invaders = [];
    
    // Initialize invaders
    this.init();
  }
  
  /**
   * Initialize all burger invaders
   */
  init() {
    // Clear invaders array
    this.invaders = [];
    
    // Reset speed multiplier
    this.speedMultiplier = 1.0;
    
    // Calculate grid dimensions
    const gridWidth = (this.invaderSize.width + this.padding) * this.columns - this.padding;
    const startX = (this.canvas.width - gridWidth) / 2;
    
    // Create burger invaders grid
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        // Determine burger type based on row
        // Top rows are more valuable (double burgers)
        let type = 0; // Regular burger by default
        
        if (row === 0) {
          type = 2; // Double burger (top row)
        } else if (row <= 1) {
          type = 1; // Cheeseburger (2nd row)
        }
        
        // Create invader
        const invader = new BurgerInvader({
          x: startX + col * (this.invaderSize.width + this.padding),
          y: this.topOffset + row * (this.invaderSize.height + this.padding),
          width: this.invaderSize.width,
          height: this.invaderSize.height,
          type: type
        });
        
        // Add to invaders array
        this.invaders.push(invader);
      }
    }
  }
  
  /**
   * Update all burger invaders
   * @param {number} deltaTime - Time since last frame in seconds
   */
  update(deltaTime) {
    // If no invaders, nothing to update
    if (this.invaders.length === 0) return;
    
    // First, update all animations
    this.invaders.forEach(invader => {
      invader.update(deltaTime);
    });
    
    // Find the left-most and right-most invader positions
    let leftmost = this.canvas.width;
    let rightmost = 0;
    
    this.invaders.forEach(invader => {
      leftmost = Math.min(leftmost, invader.x);
      rightmost = Math.max(rightmost, invader.x + invader.width);
    });
    
    // Check if we hit an edge BEFORE moving
    const hitRightWall = rightmost + (this.direction * this.speedX * deltaTime) >= this.canvas.width;
    const hitLeftWall = leftmost + (this.direction * this.speedX * deltaTime) <= 0;
    
    if (hitRightWall || hitLeftWall) {
      // We're about to hit a wall, so:
      // 1. Reverse direction
      this.direction *= -1;
      
      // 2. Move down one row
      this.invaders.forEach(invader => {
        invader.y += this.speedY;
      });
      
      // We don't move horizontally this frame to avoid clipping through the wall
    } else {
      // No wall hit, move horizontally
      this.invaders.forEach(invader => {
        invader.x += this.direction * this.speedX * deltaTime;
      });
    }
  }
  
  /**
   * Remove an invader and track its destruction
   * @param {number} index - Index of the invader to remove
   */
  removeInvader(index) {
    if (index >= 0 && index < this.invaders.length) {
      this.invaders.splice(index, 1);
      this.destroyedInvaders++;
    }
  }
  
  /**
   * Set the current game level - should be called when advancing to a new level
   * @param {number} level - The new level to set
   */
  setLevel(level) {
    this.level = level;
    // Update speed for the new level
    this.speedX = this.baseSpeedX + (this.level - 1) * 5;
    // Reset destruction counter
    this.destroyedInvaders = 0;
  }
  
  /**
   * Check if any invaders have reached the bottom of the screen
   * @param {number} bottomBoundary - Bottom boundary to check against (typically player Y position)
   * @returns {boolean} - True if any invader has reached the bottom
   */
  checkBottomCollision(bottomBoundary) {
    return this.invaders.some(invader => {
      return invader.y + invader.height >= bottomBoundary;
    });
  }
  
  /**
   * Render all burger invaders
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  render(ctx) {
    // Render each invader
    this.invaders.forEach(invader => {
      invader.render(ctx);
    });
  }
  
  /**
   * Handle canvas resize
   * @param {number} width - New canvas width
   * @param {number} height - New canvas height
   */
  handleCanvasResize(width, height) {
    // Recalculate positioning if needed
    // For now just store the new canvas dimensions
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
