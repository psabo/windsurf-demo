// Game State - Manages the current state of the game
export class GameState {
  constructor() {
    // Possible states: 'menu', 'playing', 'paused', 'gameOver'
    this.state = 'menu';
  }
  
  /**
   * Set the current game state
   * @param {string} newState - The new state to set
   */
  setState(newState) {
    if (['menu', 'playing', 'paused', 'gameOver'].includes(newState)) {
      this.state = newState;
    } else {
      console.error(`Invalid game state: ${newState}`);
    }
  }
  
  /**
   * Get the current game state
   * @returns {string} Current game state
   */
  getState() {
    return this.state;
  }
  
  /**
   * Check if game is in the menu state
   * @returns {boolean}
   */
  isMenu() {
    return this.state === 'menu';
  }
  
  /**
   * Check if game is in the playing state
   * @returns {boolean}
   */
  isPlaying() {
    return this.state === 'playing';
  }
  
  /**
   * Check if game is in the paused state
   * @returns {boolean}
   */
  isPaused() {
    return this.state === 'paused';
  }
  
  /**
   * Check if game is in the game over state
   * @returns {boolean}
   */
  isGameOver() {
    return this.state === 'gameOver';
  }
  
  /**
   * Toggle between playing and paused states
   */
  togglePause() {
    if (this.state === 'playing') {
      this.state = 'paused';
    } else if (this.state === 'paused') {
      this.state = 'playing';
    }
  }
}
