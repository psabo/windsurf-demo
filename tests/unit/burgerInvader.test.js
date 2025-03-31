/**
 * @jest-environment jsdom
 */

import { BurgerInvader } from '../../src/js/entities/burgerInvader.js';

// Mock canvas context methods used by BurgerInvader
const mockCtx = {
  beginPath: jest.fn(),
  arc: jest.fn(),
  ellipse: jest.fn(),
  fill: jest.fn(),
  fillStyle: null
};

describe('BurgerInvader', () => {
  let burgerInvader;
  
  beforeEach(() => {
    // Create a fresh burger invader before each test
    burgerInvader = new BurgerInvader({
      x: 100,
      y: 50,
      width: 40,
      height: 40,
      type: 0 // Regular burger
    });
    
    // Reset mocks before each test
    jest.clearAllMocks();
  });
  
  test('should initialize with correct properties', () => {
    expect(burgerInvader.x).toBe(100);
    expect(burgerInvader.y).toBe(50);
    expect(burgerInvader.width).toBe(40);
    expect(burgerInvader.height).toBe(40);
    expect(burgerInvader.type).toBe(0);
    expect(burgerInvader.animationFrame).toBe(0);
  });
  
  test('should update animation frame with delta time', () => {
    // Initial state - starts at 0
    expect(burgerInvader.animationFrame).toBe(0);
    
    // Set animation timer above threshold
    burgerInvader.animationTimer = burgerInvader.animationSpeed + 0.01;
    burgerInvader.update(0);
    
    // Should cycle to 1
    expect(burgerInvader.animationFrame).toBe(1);
    
    // Set animation timer above threshold again
    burgerInvader.animationTimer = burgerInvader.animationSpeed + 0.01;
    burgerInvader.update(0);
    
    // Should cycle back to 0 (modulo 2)
    expect(burgerInvader.animationFrame).toBe(0);
  });
  
  test('should support different burger types', () => {
    // Create a cheeseburger (type 1)
    const cheeseBurger = new BurgerInvader({
      x: 100,
      y: 50,
      width: 40,
      height: 40,
      type: 1
    });
    
    // Create a double burger (type 2)
    const doubleBurger = new BurgerInvader({
      x: 100,
      y: 50,
      width: 40,
      height: 40,
      type: 2
    });
    
    // Verify they have different component arrays
    expect(burgerInvader.components[0].length).toBeLessThan(cheeseBurger.components[1].length);
    expect(cheeseBurger.components[1].length).toBeLessThan(doubleBurger.components[2].length);
  });
  
  test('should render correctly', () => {
    // Call render method
    burgerInvader.render(mockCtx);
    
    // Verify drawing methods were called
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.ellipse).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalled();
  });
});
