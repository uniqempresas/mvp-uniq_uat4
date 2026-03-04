---
name: game-development
description: Game logic, mechanics, game loops, physics, and game design patterns.
---

# Game Development

> Building games: mechanics, loops, and player experience.

---

## 1. Game Loop

```typescript
let lastTime = 0;

function gameLoop(timestamp: number) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  update(deltaTime);
  render();
  
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

---

## 2. Entity Component System

```typescript
// Entity
const player = createEntity();

// Components
addComponent(player, Position, { x: 0, y: 0 });
addComponent(player, Velocity, { x: 0, y: 0 });
addComponent(player, Sprite, { texture: 'player.png' });

// System
class MovementSystem extends System {
  update() {
    this.query(Position, Velocity).forEach(entity => {
      entity.position.x += entity.velocity.x * deltaTime;
      entity.position.y += entity.velocity.y * deltaTime;
    });
  }
}
```

---

## 3. Input Handling

```typescript
class InputManager {
  private keys: Map<string, boolean> = new Map();
  
  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keys.set(e.key, true);
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys.set(e.key, false);
    });
  }
  
  isPressed(key: string): boolean {
    return this.keys.get(key) || false;
  }
}
```

---

## 4. Performance

### Object Pooling
```typescript
class BulletPool {
  private pool: Bullet[] = [];
  private active: Bullet[] = [];
  
  getBullet(): Bullet {
    const bullet = this.pool.pop() || new Bullet();
    this.active.push(bullet);
    return bullet;
  }
  
  returnBullet(bullet: Bullet) {
    this.active = this.active.filter(b => b !== bullet);
    this.pool.push(bullet);
  }
}
```

### Optimizations
- Object pooling
- Spatial partitioning
- Level of detail (LOD)
- Culling (frustum, occlusion)

---

## 5. Best Practices

- ✅ Fixed timestep for physics
- ✅ Separate update and render
- ✅ Object pooling
- ✅ Profiling tools
- ✅ Test on target hardware

---

> **Remember:** Games are interactive experiences. Fun beats graphics.
