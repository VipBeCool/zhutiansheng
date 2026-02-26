/* ============================================
   粒子/网格背景效果（性能优化版）
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let width, height;
  let frameCount = 0;

  // 初始化画布尺寸
  function resize() {
    const section = canvas.parentElement;
    width = canvas.width = section.offsetWidth;
    height = canvas.height = section.offsetHeight;
  }

  // 粒子类
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
      this.fadingIn = Math.random() > 0.5;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // 呼吸效果
      if (this.fadingIn) {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= 0.6) this.fadingIn = false;
      } else {
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0.1) this.fadingIn = true;
      }

      // 边界处理
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 70, 229, ${this.opacity})`;
      ctx.fill();
    }
  }

  // 初始化粒子（降低数量上限）
  function init() {
    resize();
    const count = Math.min(Math.floor((width * height) / 20000), 50);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // 绘制连线（每 2 帧绘制一次，降低 CPU 开销）
  function drawConnections() {
    const maxDist = 120;
    const maxDistSq = maxDist * maxDist;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // 每 2 帧绘制一次连线
    frameCount++;
    if (frameCount % 2 === 0) {
      drawConnections();
    }

    animationId = requestAnimationFrame(animate);
  }

  // 启动
  init();
  animate();

  // 窗口调整
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      init();
      animate();
    }, 200);
  });

  // 页面不可见时暂停
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();

