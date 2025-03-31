// Collision Manager - Handles collision detection between game entities
export class CollisionManager {
  constructor() {
    // No state needed for basic collision detection
  }
  
  /**
   * Check for collisions between projectiles and invaders
   * @param {Array} projectiles - Array of player projectiles
   * @param {Array} invaders - Array of burger invaders
   * @returns {Array} List of collision results
   */
  checkProjectilesVsInvaders(projectiles, invaders) {
    const collisionResults = [];
    
    // Check each active projectile against each invader
    projectiles.forEach((projectile, projectileIndex) => {
      // Skip inactive projectiles
      if (!projectile.isActive) return;
      
      // Check against each invader
      invaders.forEach((invader, invaderIndex) => {
        // Simple AABB (Axis-Aligned Bounding Box) collision detection
        if (this.checkAABBCollision(projectile, invader)) {
          // Record collision
          collisionResults.push({
            projectileIndex,
            invaderIndex
          });
          
          // Deactivate projectile since it hit something
          projectile.deactivate();
        }
      });
    });
    
    // Remove hit invaders from the array (in reverse to avoid index issues)
    // We need to get unique invader indices and sort them in descending order
    const uniqueInvaderIndices = [...new Set(
      collisionResults.map(result => result.invaderIndex)
    )].sort((a, b) => b - a);
    
    // Remove each hit invader
    uniqueInvaderIndices.forEach(index => {
      invaders.splice(index, 1);
    });
    
    // Filter out projectiles that have collided
    const projectileIndices = new Set(
      collisionResults.map(result => result.projectileIndex)
    );
    
    // Return collision results for any further processing
    return collisionResults;
  }
  
  /**
   * Check for Axis-Aligned Bounding Box collision between two entities
   * @param {Object} a - First entity with x, y, width, height properties
   * @param {Object} b - Second entity with x, y, width, height properties
   * @returns {boolean} Whether the entities are colliding
   */
  checkAABBCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}
