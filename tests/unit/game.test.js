/**
 * @jest-environment jsdom
 */

import { Game } from '../../src/js/game.js';
import { Player } from '../../src/js/entities/player.js';
import { BurgerInvaders } from '../../src/js/entities/burgerInvaders.js';
import { CollisionManager } from '../../src/js/managers/collisionManager.js';
import { InputManager } from '../../src/js/managers/inputManager.js';
import { GameState } from '../../src/js/utils/gameState.js';

// Mock dependencies
jest.mock('../../src/js/entities/player.js');
jest.mock('../../src/js/entities/burgerInvaders.js');
jest.mock('../../src/js/managers/collisionManager.js');
jest.mock('../../src/js/managers/inputManager.js');
jest.mock('../../src/js/utils/gameState.js');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock canvas and context
const mockCtx = {
  clearRect: jest.fn(),
  fillStyle: null,
  fillRect: jest.fn(),
  fillText: jest.fn(),
  font: null,
  textAlign: null
};

const mockCanvas = {
  width: 800,
  height: 600,
  getContext: jest.fn(() => mockCtx)
};

describe('Game', () => {
  let game;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock GameState methods
    GameState.mockImplementation(() => ({
      setState: jest.fn(),
      isMenu: jest.fn(() => false),
      isPlaying: jest.fn(() => true),
      isPaused: jest.fn(() => false),
      isGameOver: jest.fn(() => false),
      togglePause: jest.fn()
    }));
    
    // Mock BurgerInvaders methods
    BurgerInvaders.mockImplementation(() => ({
      update: jest.fn(),
      render: jest.fn(),
      invaders: [],
      checkBottomCollision: jest.fn(() => false),
      removeInvader: jest.fn()
    }));
    
    // Mock Player methods
    Player.mockImplementation(() => ({
      update: jest.fn(),
      render: jest.fn(),
      projectiles: [],
      x: 100,
      y: 500,
      width: 40,
      handleCanvasResize: jest.fn()
    }));
    
    // Mock InputManager methods
    InputManager.mockImplementation(() => ({
      startListening: jest.fn(),
      stopListening: jest.fn()
    }));
    
    // Mock CollisionManager methods
    CollisionManager.mockImplementation(() => ({
      checkAABBCollision: jest.fn(() => false)
    }));
    
    // Mock requestAnimationFrame to prevent recursion
    global.requestAnimationFrame = jest.fn(callback => {
      // Don't actually call the callback to prevent recursion
      return 123; // Mock ID
    });
    
    // Mock cancelAnimationFrame
    global.cancelAnimationFrame = jest.fn();
    
    // Mock performance.now()
    global.performance.now = jest.fn(() => 1000);
    
    // Create a fresh Game instance before each test
    game = new Game(mockCanvas, mockCtx);
    
    // Override the gameLoop to prevent recursion
    game.gameLoop = jest.fn();
  });
  
  test('should initialize with correct default properties', () => {
    expect(game.width).toBe(800);
    expect(game.height).toBe(600);
    expect(game.score).toBe(0);
    expect(game.level).toBe(1);
    expect(game.lives).toBe(3);
    expect(game.gameState).toBeDefined();
    expect(game.inputManager).toBeDefined();
    expect(game.collisionManager).toBeDefined();
  });
  
  test('should start game correctly', () => {
    // Replace game.start to avoid calling gameLoop which we mocked
    const originalGameLoop = game.gameLoop;
    game.gameLoop = jest.fn();
    
    // Start game
    game.start();
    
    // Restore the original gameLoop method
    game.gameLoop = originalGameLoop;
    
    // Verify game state was set to playing
    expect(game.gameState.setState).toHaveBeenCalledWith('playing');
    
    // Check that entities were initialized
    expect(Player).toHaveBeenCalled();
    expect(BurgerInvaders).toHaveBeenCalled();
    
    // Input manager should start listening
    expect(game.inputManager.startListening).toHaveBeenCalled();
  });
  
  test('should advance to next level when all invaders are cleared', () => {
    // Setup game
    game.start();
    
    // Initial level
    const previousLevel = game.level;
    
    // Call nextLevel directly
    game.nextLevel();
    
    // Level should have increased
    expect(game.level).toBe(previousLevel + 1);
    
    // New invaders should be initialized
    expect(BurgerInvaders).toHaveBeenCalledTimes(2); // Once in start, once in nextLevel
  });
  
  test('should decrease lives when invaders reach the bottom', () => {
    // Setup game
    game.start();
    
    // Mock bottom collision
    game.burgerInvaders.checkBottomCollision.mockReturnValue(true);
    
    // Initial lives
    expect(game.lives).toBe(3);
    
    // Check collisions
    game.checkCollisions();
    
    // Lives should decrease
    expect(game.lives).toBe(2);
    
    // Game should not be over yet
    expect(game.gameState.setState).not.toHaveBeenCalledWith('gameOver');
    
    // Lose all remaining lives
    game.lives = 1; // Set to 1 for last life
    game.burgerInvaders.checkBottomCollision.mockReturnValue(true);
    game.checkCollisions();
    
    // Now game should be over
    expect(game.gameState.setState).toHaveBeenCalledWith('gameOver');
  });
  
  test('should handle projectile-invader collisions correctly', () => {
    // Setup game
    game.start();
    
    // Add a mock invader and projectile
    game.burgerInvaders.invaders = [
      { x: 100, y: 100, width: 40, height: 40, type: 1 }
    ];
    
    game.player.projectiles = [
      { x: 100, y: 100, width: 5, height: 10, isActive: true }
    ];
    
    // Set up collision detection to return true
    game.collisionManager.checkAABBCollision.mockReturnValue(true);
    
    // Check collisions
    game.checkCollisions();
    
    // Invader should be removed
    expect(game.burgerInvaders.removeInvader).toHaveBeenCalledWith(0);
    
    // Score should be incremented by 20 (type 1 = cheeseburger = 20 points)
    expect(game.score).toBe(20);
  });
  
  test('should save and load high score correctly', () => {
    // Directly call saveHighScore with a specific score value
    game.score = 500;
    game.highScore = 500;
    game.saveHighScore();
    
    // Check localStorage was called with the correct value
    expect(localStorage.setItem).toHaveBeenCalledWith('burgerInvadersHighScore', '500');
    
    // Setup localStorage to return a value
    localStorage.getItem.mockReturnValue('750');
    
    // Load high score
    const highScore = game.loadHighScore();
    
    // Check high score loading
    expect(highScore).toBe(750);
    expect(localStorage.getItem).toHaveBeenCalledWith('burgerInvadersHighScore');
  });
  
  test('should stop game and clean up resources', () => {
    // Setup animation frame ID
    game.animationFrameId = 123;
    
    // Stop game
    game.stop();
    
    // Animation frame should be cancelled
    expect(cancelAnimationFrame).toHaveBeenCalledWith(123);
    
    // Input manager should stop listening
    expect(game.inputManager.stopListening).toHaveBeenCalled();
  });
});
