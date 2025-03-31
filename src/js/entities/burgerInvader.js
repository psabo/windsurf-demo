// Burger Invader - Individual burger enemy entity
export class BurgerInvader {
  /**
   * Create a burger invader
   * @param {Object} options - Configuration options
   * @param {number} options.x - X position
   * @param {number} options.y - Y position
   * @param {number} options.width - Width of invader
   * @param {number} options.height - Height of invader
   * @param {number} options.type - Burger type (0=regular, 1=cheese, 2=double)
   */
  constructor({ x, y, width, height, type = 0 }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type; // 0: regular, 1: cheese, 2: double burger
    
    // Set color based on type
    this.colors = {
      0: '#8B4513', // Brown (regular burger)
      1: '#FFA500', // Orange (cheeseburger)
      2: '#FF6347'  // Tomato red (double burger)
    };
    
    // Animation properties
    this.animationFrame = 0;
    this.animationSpeed = 0.05;
    this.animationTimer = 0;
    
    // Define burger components for each type
    this.components = {
      0: [this.drawBun, this.drawPatty, this.drawBun], // Regular burger
      1: [this.drawBun, this.drawCheese, this.drawPatty, this.drawBun], // Cheeseburger
      2: [this.drawBun, this.drawPatty, this.drawCheese, this.drawPatty, this.drawBun] // Double burger
    };
  }
  
  /**
   * Update the burger invader animation
   * @param {number} deltaTime - Time since last frame in seconds
   */
  update(deltaTime) {
    // Update animation
    this.animationTimer += deltaTime;
    
    if (this.animationTimer >= this.animationSpeed) {
      this.animationFrame = (this.animationFrame + 1) % 2;
      this.animationTimer = 0;
    }
  }
  
  /**
   * Draw a burger bun component
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} offsetY - Vertical offset for positioning
   */
  drawBun(ctx, offsetY) {
    ctx.fillStyle = '#F0C080'; // Bun color
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.width / 2,
      this.y + offsetY,
      this.width / 2,
      this.height / 8,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  
  /**
   * Draw a burger patty component
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} offsetY - Vertical offset for positioning
   */
  drawPatty(ctx, offsetY) {
    ctx.fillStyle = '#8B4513'; // Patty color (brown)
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.width / 2,
      this.y + offsetY,
      this.width / 2 - 2,
      this.height / 10,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  
  /**
   * Draw a cheese component
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} offsetY - Vertical offset for positioning
   */
  drawCheese(ctx, offsetY) {
    ctx.fillStyle = '#FFA500'; // Cheese color (orange)
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.width / 2,
      this.y + offsetY,
      this.width / 2,
      this.height / 16,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  
  /**
   * Render the burger invader
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  render(ctx) {
    // Get components based on burger type
    const components = this.components[this.type] || this.components[0];
    const componentCount = components.length;
    
    // Distribute components vertically within the invader height
    const spacing = this.height / (componentCount + 1);
    
    // Draw each component with appropriate spacing
    for (let i = 0; i < componentCount; i++) {
      const offsetY = spacing * (i + 1);
      components[i].call(this, ctx, offsetY);
    }
    
    // Add eyes for personality (on top bun)
    const eyeSize = this.width / 10;
    const eyeY = spacing - this.height / 16;
    
    // Left eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 3,
      this.y + eyeY,
      eyeSize,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Right eye
    ctx.beginPath();
    ctx.arc(
      this.x + (2 * this.width) / 3,
      this.y + eyeY,
      eyeSize,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Mouth (changes with animation frame)
    ctx.beginPath();
    if (this.animationFrame === 0) {
      // Happy mouth
      ctx.arc(
        this.x + this.width / 2,
        this.y + eyeY + eyeSize * 2,
        eyeSize * 1.5,
        0,
        Math.PI
      );
    } else {
      // Surprised mouth
      ctx.arc(
        this.x + this.width / 2,
        this.y + eyeY + eyeSize * 2,
        eyeSize,
        0,
        Math.PI * 2
      );
    }
    ctx.fill();
  }
}
