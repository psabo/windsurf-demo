// Input Manager - Handles keyboard input for player controls
export class InputManager {
  constructor(game) {
    // Reference to game for state changes
    this.game = game;
    
    // Key states
    this.keys = {
      ArrowLeft: false,
      ArrowRight: false,
      Space: false,
      KeyP: false,  // P key for pause
      Enter: false  // Enter key for game state changes
    };
    
    // Bind methods to maintain 'this' context
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    
    // Reference to player entity
    this.player = null;
  }
  
  /**
   * Start listening for keyboard events
   * @param {Player} player - Reference to the player entity
   */
  startListening(player) {
    this.player = player;
    
    // Add event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }
  
  /**
   * Stop listening for keyboard events (cleanup)
   */
  stopListening() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
  
  /**
   * Handle key down events
   */
  handleKeyDown(event) {
    // Check if key is relevant for game controls
    if (this.keys.hasOwnProperty(event.code)) {
      // Prevent default to avoid scrolling the page when using arrow keys
      event.preventDefault();
      
      // Update key state
      this.keys[event.code] = true;
      
      // Player movement and shooting
      if (this.player) {
        if (event.code === 'ArrowLeft') {
          this.player.isMovingLeft = true;
        } else if (event.code === 'ArrowRight') {
          this.player.isMovingRight = true;
        } else if (event.code === 'Space') {
          // Only shoot if the game is in playing state
          if (this.game && this.game.gameState.isPlaying()) {
            this.player.shoot();
          }
        }
      }
      
      // Pause/unpause game with P key
      if (event.code === 'KeyP' && this.game) {
        if (this.game.gameState.isPlaying() || this.game.gameState.isPaused()) {
          this.game.gameState.togglePause();
        }
      }
    }
  }
  
  /**
   * Handle key up events
   */
  handleKeyUp(event) {
    // Check if key is relevant for game controls
    if (this.keys.hasOwnProperty(event.code)) {
      // Update key state
      this.keys[event.code] = false;
      
      // Update player movement flags
      if (this.player) {
        if (event.code === 'ArrowLeft') {
          this.player.isMovingLeft = false;
        } else if (event.code === 'ArrowRight') {
          this.player.isMovingRight = false;
        }
      }
    }
  }
}
