// P5 exported functions (eslint flags)
/* exported preload, setup, draw */

const snowflake = (sketch) => {
  let snow = [];
  let gravity;

  let zOff = 0;

  let spritesheet;
  let textures = [];

  function getRandomSize() {
    let r = sketch.pow(sketch.random(0, 1), 3);
    return sketch.constrain(r * 32, 5, 32);

    // let r = randomGaussian() * 2.5;
    // return constrain(abs(r * r), 2, 36);

    //   while(true) {
    //     let r1 = random(1);
    //     let r2 = random(1);
    //     if (r2 > r1) {
    //       return r1 * 36;
    //     }
    //   }
  }

  class Snowflake {
    constructor(sx, sy, img) {
      this.randomize(sx, sy);
      this.img = img;
      this.dir = sketch.random(1) > 0.5 ? 1 : -1;
      this.xOff = 0;
    }

    applyForce(force) {
      // Parallax Effect hack
      let f = force.copy();
      f.mult(this.r);

      // let f = force.copy();
      // f.div(this.mass);
      this.acc.add(f);
    }

    update() {
      this.xOff = sketch.sin(this.angle) * this.r;

      this.vel.add(this.acc);
      this.vel.limit(this.r * 0.2);

      if (this.vel.mag() < 1) {
        this.vel.normalize();
      }

      this.pos.add(this.vel);
      this.acc.mult(0);

      if (this.offScreenY()) {
        this.randomize();
      }

      if (this.pos.x < -this.r) {
        this.pos.x = sketch.width + this.r;
      }

      if (this.pos.x > sketch.width + this.r) {
        this.pos.x = -this.r;
      }

      this.angle += (this.vel.mag() / 300) * this.dir;
    }

    randomize(sx, sy) {
      let x = sx || sketch.random(sketch.width);
      let y = sy || sketch.random(-100, -10);

      this.pos = sketch.createVector(x, y);
      this.vel = sketch.createVector(0, 0);
      this.acc = sketch.createVector();
      this.angle = sketch.random(sketch.TWO_PI);

      this.r = getRandomSize();
    }

    render() {
      // stroke(255);
      // strokeWeight(this.r);
      // point(this.pos.x, this.pos.y);

      sketch.push();
      sketch.translate(this.pos.x + this.xOff, this.pos.y);
      sketch.rotate(this.angle);
      sketch.imageMode(sketch.CENTER);
      sketch.image(this.img, 0, 0, this.r, this.r);
      sketch.pop();
    }

    offScreenY() {
      return this.pos.y > sketch.height + this.r;
    }
  }

  sketch.preload = () => {
    spritesheet = sketch.loadImage("graphics/flakes32.png");
  };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    gravity = sketch.createVector(0, 0.25);

    for (let x = 0; x < spritesheet.width; x += 32) {
      for (let y = 0; y < spritesheet.height; y += 32) {
        const img = spritesheet.get(x, y, 32, 32);
        textures.push(img);
      }
    }

    for (let i = 0; i < 300; i++) {
      let x = sketch.random(sketch.width);
      let y = sketch.random(sketch.height);
      let design = sketch.random(textures);
      snow.push(new Snowflake(x, y, design));
    }
  };

  sketch.draw = () => {
    sketch.background(0);

    zOff += 0.01;

    for (var flake of snow) {
      let xOff = flake.pos.x / sketch.width;
      let yOff = flake.pos.y / sketch.height;
      let windAngle = sketch.noise(xOff, yOff, zOff) * sketch.TWO_PI;
      let wind = p5.Vector.fromAngle(windAngle);
      wind.mult(0.1);

      flake.applyForce(gravity);
      flake.applyForce(wind);
      flake.update();
      flake.render();
    }

    // for (let i = snow.length - 1; i >= 0; i--) {
    //   if (snow[i].offScreen()) {
    //     snow.splice(i, 1);
    //   }
    // }
  };
};

// eslint-disable-next-line no-unused-vars
const snowflakep5 = new p5(snowflake, "snowflakes-sketch");
