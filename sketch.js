const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const dat = require("dat.gui");

const getVariables = () => ({
  padding: 100,
  speed: 1.3,
  message: "khokhlachev",
  fontSize: 36,
  spacing: 1.3
});

const gui = new dat.GUI();
const variables = getVariables();

const settings = {
  dimensions: [1024, 1024],
  animate: true,
  fps: 60
};

function series(n) {
  if (n === 1) {
    return [0, 1];
  } else {
    var s = series(n - 1);

    s.push((s[s.length - 1] + 1 / n) * variables.spacing);
    return s;
  }
}

function createTextGrid(string) {
  const points = [];
  const length = string.length;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      points.push([string[j], j / (length - 1), i / (length - 1)]);
    }
  }

  return points;
}

const sketch = () => {
  const messageController = gui.add(variables, "message");
  const spacingController = gui.add(variables, "spacing", 1, 2);
  gui.add(variables, "speed", 0, 5);
  gui.add(variables, "padding", -500, 500);
  gui.add(variables, "fontSize", 12, 200);

  let textPoints;
  let fib;
  let fibMax;
  let fibInv;

  const handleUpdate = () => {
    textPoints = createTextGrid(variables.message);

    fib = series(variables.message.length - 1);
    fibMax = Math.max.apply(null, fib);
    fib = fib.map(x => x / fibMax);
    fibInv = [...fib].reverse().map(x => Math.abs(1 - x));
  };

  handleUpdate();

  messageController.onChange(handleUpdate);
  spacingController.onChange(handleUpdate);

  return ({ context, width, height, time }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "black";
    context.font = `${variables.fontSize}px "Helvetica"`;

    textPoints.forEach(([letter, x, y], i) => {
      context.fillText(
        letter,
        lerp(
          variables.padding,
          width - variables.padding - variables.fontSize / 2,
          lerp(
            fib[i % variables.message.length],
            fibInv[i % variables.message.length],
            (Math.sin(time * variables.speed) + 1) / 2
          )
        ),
        lerp(
          variables.padding,
          height - variables.padding + variables.fontSize / 2,
          y
        )
      );
    });
  };
};

canvasSketch(sketch, settings);
