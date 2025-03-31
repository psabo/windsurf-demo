/**
 * @jest-environment jsdom
 */

import { BurgerInvaders } from '../../src/js/entities/burgerInvaders.js';
import { BurgerInvader } from '../../src/js/entities/burgerInvader.js';

// Mock the BurgerInvader dependency
jest.mock('../../src/js/entities/burgerInvader.js', () => {
  return {
    BurgerInvader: jest.fn().mockImplementation(() => ({
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      type: 0,
      update: jest.fn(),
      render: jest.fn()
    }))
  };
});

describe('BurgerInvaders', () => {
  let burgerInvaders;
  let mockCanvas;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a mock canvas
    mockCanvas = {
      width: 800,
      height: 600
    };
    
    // Create a fresh BurgerInvaders instance before each test
    burgerInvaders = new BurgerInvaders({
      canvas: mockCanvas,
      rows: 3,
      columns: 4,
      invaderSize: { width: 40, height: 40 },
      padding: 10,
      topOffset: 50,
      level: 1
    });
  });
  
  test('should initialize with correct properties', () => {
    expect(burgerInvaders.rows).toBe(3);
    expect(burgerInvaders.columns).toBe(4);
    expect(burgerInvaders.level).toBe(1);
    expect(burgerInvaders.invaders.length).toBe(12); // 3 rows * 4 columns
    expect(burgerInvaders.speedX).toBe(30 + (1 - 1) * 5); // baseSpeed + (level-1)*5
    expect(burgerInvaders.speedMultiplier).toBe(1.0);
    expect(burgerInvaders.destroyedInvaders).toBe(0);
  });
  
  test('should create correct grid of invaders', () => {
    // Check if BurgerInvader constructor was called correct number of times
    expect(BurgerInvader).toHaveBeenCalledTimes(12); // 3 rows * 4 columns
    
    // Check type assignments (top row should be type 2, second row type 1, rest type 0)
    let type2Count = 0;
    let type1Count = 0;
    let type0Count = 0;
    
    // Count calls to BurgerInvader by burger type
    BurgerInvader.mock.calls.forEach(call => {
      const type = call[0].type;
      if (type === 2) type2Count++;
      else if (type === 1) type1Count++;
      else type0Count++;
    });
    
    // We should have 4 invaders of type 2 (top row)
    expect(type2Count).toBe(4);
    // We should have 4 invaders of type 1 (second row)
    expect(type1Count).toBe(4);
    // We should have 4 invaders of type 0 (third row)
    expect(type0Count).toBe(4);
  });
  
  test('should move invaders horizontally and change direction at canvas edge', () => {
    // Mock invaders for this test
    burgerInvaders.invaders = [
      { x: 10, y: 50, width: 40, height: 40, update: jest.fn() },
      { x: 60, y: 50, width: 40, height: 40, update: jest.fn() }
    ];
    
    // Initial direction is right (1)
    expect(burgerInvaders.direction).toBe(1);
    
    // Update with some delta time - but not enough to hit wall
    burgerInvaders.update(0.1);
    
    // Check that invaders moved right
    expect(burgerInvaders.invaders[0].x).toBeGreaterThan(10);
    expect(burgerInvaders.invaders[1].x).toBeGreaterThan(60);
    
    // Move second invader to right edge
    burgerInvaders.invaders[1].x = mockCanvas.width - 40 - 1; // Just before the wall
    
    // Store current y positions to check for vertical movement
    const originalY0 = burgerInvaders.invaders[0].y;
    const originalY1 = burgerInvaders.invaders[1].y;
    
    // Update again - this should trigger the wall collision logic
    burgerInvaders.update(0.1);
    
    // Direction should have changed to left (-1)
    expect(burgerInvaders.direction).toBe(-1);
    
    // Invaders should have moved down
    expect(burgerInvaders.invaders[0].y).toBeGreaterThan(originalY0);
    expect(burgerInvaders.invaders[1].y).toBeGreaterThan(originalY1);
  });
  
  test('should increase speed with level', () => {
    // Initial speed at level 1
    expect(burgerInvaders.speedX).toBe(30); // 30 + (1-1)*5
    
    // Set level to 3
    burgerInvaders.setLevel(3);
    
    // Speed should have increased
    expect(burgerInvaders.speedX).toBe(40); // 30 + (3-1)*5
    
    // Destroyed invaders should be reset
    expect(burgerInvaders.destroyedInvaders).toBe(0);
  });
  
  test('should remove invaders correctly', () => {
    // Create test invaders
    burgerInvaders.invaders = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];
    
    // Remove the middle invader
    burgerInvaders.removeInvader(1);
    
    // Check invaders array
    expect(burgerInvaders.invaders.length).toBe(2);
    expect(burgerInvaders.invaders[0].id).toBe(1);
    expect(burgerInvaders.invaders[1].id).toBe(3);
    
    // Destroyed count should increase
    expect(burgerInvaders.destroyedInvaders).toBe(1);
  });
  
  test('should detect bottom collision', () => {
    // Reset invaders
    burgerInvaders.invaders = [
      { x: 100, y: 100, width: 40, height: 40 },
      { x: 200, y: 500, width: 40, height: 40 } // This one is close to bottom
    ];
    
    // No collision with high boundary
    expect(burgerInvaders.checkBottomCollision(600)).toBe(false);
    
    // Collision with lower boundary
    expect(burgerInvaders.checkBottomCollision(540)).toBe(true);
  });
});
