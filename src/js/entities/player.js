// Player entity class
import { Projectile } from './projectile.js';

export class Player {
  constructor({ x, y, width, height, speed, canvas }) {
    // Position and dimensions
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    
    // Canvas reference for boundaries
    this.canvas = canvas;
    
    // Movement flags
    this.isMovingLeft = false;
    this.isMovingRight = false;
    
    // Shooting properties
    this.projectiles = [];
    this.lastShotTime = 0;
    this.shootingCooldown = 250; // milliseconds between shots
    
    // Alternate between ketchup and mustard
    this.nextProjectileType = 'ketchup';
  }
  
  /**
   * Update player position and projectiles
   */
  update(deltaTime) {
    // Handle movement
    if (this.isMovingLeft) {
      this.moveLeft(deltaTime);
    }
    if (this.isMovingRight) {
      this.moveRight(deltaTime);
    }
    
    // Update all projectiles
    this.projectiles = this.projectiles.filter(projectile => {
      projectile.update(deltaTime);
      // Remove projectiles that have gone off screen
      return projectile.y > 0;
    });
  }
  
  /**
   * Move player left
   */
  moveLeft(deltaTime) {
    const newX = this.x - this.speed * (deltaTime * 60);
    this.x = Math.max(0, newX); // Don't go beyond left edge
  }
  
  /**
   * Move player right
   */
  moveRight(deltaTime) {
    const newX = this.x + this.speed * (deltaTime * 60);
    this.x = Math.min(this.canvas.width - this.width, newX); // Don't go beyond right edge
  }
  
  /**
   * Fire a projectile (ketchup or mustard)
   */
  shoot() {
    const currentTime = performance.now();
    
    // Check cooldown
    if (currentTime - this.lastShotTime < this.shootingCooldown) {
      return;
    }
    
    // Create a new projectile at the player's position
    const projectile = new Projectile({
      x: this.x + this.width / 2 - 2,  // Center projectile
      y: this.y,                        // Start at top of player
      width: 4,                         // Small projectile
      height: 10,
      speed: 7,
      type: this.nextProjectileType
    });
    
    // Add to active projectiles
    this.projectiles.push(projectile);
    
    // Alternate between ketchup and mustard
    this.nextProjectileType = this.nextProjectileType === 'ketchup' ? 'mustard' : 'ketchup';
    
    // Update last shot time
    this.lastShotTime = currentTime;
  }
  
  /**
   * Render the player and projectiles
   */
  render(ctx) {
    // Draw the player
    ctx.fillStyle = '#5F9EA0'; // Cadet Blue - temp color until we have sprites
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw a simple chef hat on top as a placeholder
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x + this.width * 0.2, this.y - 5, this.width * 0.6, 5);
    
    // Render all projectiles
    this.projectiles.forEach(projectile => {
      projectile.render(ctx);
    });
  }
  
  /**
   * Handle canvas resize
   */
  handleCanvasResize(canvasWidth, canvasHeight) {
    // Adjust position to keep player at bottom of screen
    this.y = canvasHeight - this.height - 20;
    
    // Make sure player is still within bounds
    if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width;
    }
  }
}
