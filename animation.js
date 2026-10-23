class RunningPerson {
  constructor(options = {}) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.speed = options.speed || 3;
    this.color = options.color || '#333333';
    this.canvas = null;
    this.ctx = null;
    
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.targetX = this.x;
    this.targetY = this.y;
    
    this.angle = 0;
    this.frame = 0;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    const style = this.canvas.style;
    style.position = 'fixed';
    style.top = '0';
    style.left = '0';
    style.width = '100vw';
    style.height = '100vh';
    style.pointerEvents = 'none'; 
    style.zIndex = '999999';

    document.body.appendChild(this.canvas);
    
    this.resizeCanvas();
    this.resizeListener = () => this.resizeCanvas();
    window.addEventListener('resize', this.resizeListener);

    this.pickNewTarget();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  pickNewTarget() {
    this.targetX = Math.random() * window.innerWidth;
    this.targetY = Math.random() * window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const deltaX = this.targetX - this.x;
    const deltaY = this.targetY - this.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 10) {
      this.pickNewTarget();
    } else {
      this.angle = Math.atan2(deltaY, deltaX);
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
    }

    this.frame += 0.15;
    this.drawRunner();

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  drawRunner() {
    this.ctx.save();
    
    // Position the runner, but force rotation to 0 so the head stays straight up
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(0); 

    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';

    const legSwing = Math.sin(this.frame) * 12;
    const armSwing = Math.cos(this.frame) * 10;

    // 1. Draw Head
    this.ctx.beginPath();
    this.ctx.arc(0, -22, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    // 2. Draw Spine/Torso
    this.ctx.beginPath();
    this.ctx.moveTo(0, -17);
    this.ctx.lineTo(0, -2);
    this.ctx.stroke();

    // 3. Draw Left Leg
    this.ctx.beginPath();
    this.ctx.moveTo(0, -2);
    this.ctx.lineTo(-6, 8 + legSwing);
    this.ctx.lineTo(-4 + legSwing / 2, 20);
    this.ctx.stroke();

    // 4. Draw Right Leg
    this.ctx.beginPath();
    this.ctx.moveTo(0, -2);
    this.ctx.lineTo(6, 8 - legSwing);
    this.ctx.lineTo(4 - legSwing / 2, 20);
    this.ctx.stroke();

    // 5. Draw Left Arm
    this.ctx.beginPath();
    this.ctx.moveTo(0, -14);
    this.ctx.lineTo(-8, -6 + armSwing);
    this.ctx.stroke();

    // 6. Draw Right Arm
    this.ctx.beginPath();
    this.ctx.moveTo(0, -14);
    this.ctx.lineTo(8, -6 - armSwing);
    this.ctx.stroke();

    this.ctx.restore();
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
    window.removeEventListener('resize', this.resizeListener);
  }
}

// Global window registration export check
if (typeof window !== 'undefined') {
  window.RunningPerson = RunningPerson;
}

// --- Your Initialization and Event Scripts ---
let runner = null;

document.getElementById('startBtn').onclick = function() {
  if (!runner) {
    runner = new RunningPerson({
      speed: 3,
      color: '#333333'
    });
  }
};

document.getElementById('stopBtn').onclick = function() {
  if (runner) {
    runner.destroy();
    runner = null;
  }
};

// Automatic load trigger
window.onload = function() {
  if (!runner) {
    runner = new RunningPerson({
      speed: 3,
      color: '#333333'
    });
  }
};
