class Sky {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.lastConstelation = 0;
    this.nextConstellation = Math.random() * 3000;
    this.constellation = {
      stars: [],
      isClosed: false,
      width: null
    };
    this.lastUpdate = 0;
    this.run();
  }

  run() {
    this.initCanvas();
    this.generateStars(500);
    this.generateRandomConstellation();
    this.draw(0);
  }

  initCanvas() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  draw(now) {
    this.delta = (now - this.lastUpdate) / 16;
    this.clearCanvas();

    this.updateStars();
    this.drawAllStars();

    this.drawConstellation();
    this.updateConstellation(now);

    this.drawOverlayer();
    this.lastUpdate = now;
    window.requestAnimationFrame(now => this.draw(now));
  }

  drawStar(star) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.translate(star.x, star.y);
    ctx.moveTo(0, 0 - star.radius);
    for (let i = 0; i < 5; i++) {
      ctx.rotate((Math.PI / 180) * (360 / 10));
      ctx.lineTo(0, 0 - star.radius * 0.6);
      ctx.rotate((Math.PI / 180) * (360 / 10));
      ctx.lineTo(0, 0 - star.radius);
    }
    ctx.fill();
    ctx.restore();
  }

  generateStars(count) {
    let stars = [];
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 3 + 2;
      stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        color: `#fff`,
        radius: radius,
        orginalRadius: radius,
        speed: Math.random() * 0.8 + 0.1
      });
    }
    this.stars = stars;
  }

  drawAllStars() {
    this.stars.forEach(star => this.drawStar(star));
  }

  updateStars() {
    this.stars.forEach(star => {
      star.x += star.speed * this.delta;
      star.y -= (star.speed * this.delta * (this.width / 2 - star.x)) / 1000;
      star.radius = star.orginalRadius * (Math.random() / 4 + 0.9);
      if (star.x > this.width + 2 * star.radius) star.x = -2 * star.radius;
      if (star.y < 0 - 2 * star.radius) star.y = this.height + 2 * star.radius;
      if (star.y > this.height + 2 * star.radius) star.y = -2 * star.radius;
    });
  }

  clearCanvas() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawOverlayer() {
    const { width, height } = this;
    let gradient = this.ctx.createRadialGradient(
      width / 2,
      height / 2,
      250,
      width / 2,
      height / 2,
      width / 2
    );
    gradient.addColorStop(0, "#0000");
    gradient.addColorStop(1, "#000C");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
  }

  generateRandomConstellation() {
    const x = Math.random() * this.width * 0.8;
    const y = Math.random() * this.height * 0.8;
    const radius = (this.height / 2) * Math.random() * 0.5;

    this.constellation = {
      stars: this.stars
        .filter(
          star =>
            star.x > x - radius &&
            star.x < x + radius &&
            star.y > y - radius &&
            star.y < y + radius
        )
        .slice(0, Math.round(Math.random() * 7 + 3)),
      isClosed: Math.random() > 0.5,
      width: 4
    };
  }

  drawConstellation() {
    const { stars, isClosed, width } = this.constellation;
    const { ctx } = this;
    const starsCount = stars.length;
    if (starsCount > 2) {
      const firstStar = stars[0];
      ctx.beginPath();
      ctx.moveTo(firstStar.x, firstStar.y);
      for (let i = 0; i < starsCount - 1; i++) {
        const nextStar = stars[i + 1];
        ctx.lineTo(nextStar.x, nextStar.y);
      }
      if (isClosed) ctx.lineTo(firstStar.x, firstStar.y);
      ctx.strokeStyle = "#f7eada";
      ctx.lineWidth = width;
      ctx.stroke();
    }
  }

  updateConstellation(now) {
    if (this.constellation.width > 0) {
      this.constellation.width -= 0.07 * this.delta;
    } else this.constellation.width = 0;

    if (now - this.lastConstelation > this.nextConstellation) {
      this.lastConstelation = now;
      this.nextConstellation = Math.random() * 1000 + 2000;
      this.generateRandomConstellation();
    }
  }
}

const sky = new Sky(document.querySelector("#canvas"));
