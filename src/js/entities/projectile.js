// Projectile entity class
export class Projectile {
  constructor({ x, y, width, height, speed, type }) {
    // Position and dimensions
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    // Movement
    this.speed = speed;
    
    // Projectile type (ketchup or mustard)
    this.type = type;
    
    // Active flag
    this.isActive = true;
  }
  
  /**
   * Update projectile position
   */
  update(deltaTime) {
    // Move projectile upward (negative y direction)
    this.y -= this.speed * (deltaTime * 60);
  }
  
  /**
   * Render the projectile
   */
  render(ctx) {
    // Set color based on type
    if (this.type === 'ketchup') {
      ctx.fillStyle = '#FF3B30'; // Red for ketchup
    } else {
      ctx.fillStyle = '#FFCC00'; // Yellow for mustard
    }
    
    // Draw the projectile
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  
  /**
   * Deactivate the projectile (after collision)
   */
  deactivate() {
    this.isActive = false;
  }
}
