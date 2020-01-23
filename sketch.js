const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math')

const settings = {
  dimensions: [ 1024, 1024 ],
  animate: true,
  fps: 60
};

function fibonacci_series(n) {
  if (n === 1) {
    return [0, 1]; 
  } else {
    var s = fibonacci_series(n - 1);
    s.push(s[s.length - 1] + s[s.length - 2]);
    return s;
  }
};

function createTextGrid(string) {
  const points = []
  const length = string.length;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      points.push([string[j], j / (length - 1), i / (length - 1)])
    }
  }

  return points;
}

const sketch = () => {
  const STRING = 'schole'

  const textPoints = createTextGrid(STRING)
  let fib = fibonacci_series(7)
  fib = [0, .1, ...fib.map(x => x / Math.max.apply(null, fib)).slice(-STRING.length + 2)]
  const fibInv = [...fib].reverse().map(x => Math.abs(1 - x))

  const margin = 100;

  // const progress

  return ({ context, width, height, time }) => {
    console.log('tick')

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    context.font = '36px "Helvetica"';

    textPoints.forEach(([letter, x, y], i) => {
      context.fillText(
        letter, 
        lerp(margin, width - margin, lerp(fib[i % 6], fibInv[i % 6], (Math.sin(time * 1.3) + 1) / 2)), 
        lerp(margin, height - margin, y)
      );
    })
  };
};

canvasSketch(sketch, settings);
