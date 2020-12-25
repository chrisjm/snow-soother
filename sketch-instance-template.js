// P5 exported functions (eslint flags)
/* exported preload, setup, draw */

const s = (sketch) => {
  sketch.preload = () => {};

  sketch.setup = () => {};

  sketch.draw = () => {};
};

// eslint-disable-next-line no-unused-vars
const myp5 = new p5(s, "p5sketch");
