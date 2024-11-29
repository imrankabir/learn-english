const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const grid = document.querySelector('#lettersGrid');
const undoBtn = document.querySelector('#undo-btn');
const redoBtn = document.querySelector('#redo-btn');
const clearBtn = document.querySelector('#clear-btn');

let isDrawing = false;
let data = [];
let singleData = [];
let removedData = [];

const get = (k, d) => JSON.parse(localStorage.getItem(`learn-english-${k}`)) ?? d;
const set = (k, v) => localStorage.setItem(`learn-english-${k}`, JSON.stringify(v));

const getCoordinates = (c, e) => {
  const rect = c.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  } else {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
};

const startPosition = (c, e) => {
  isDrawing = true;
  const ctx = c.getContext('2d');
  ctx.beginPath();
  e.preventDefault();
};

const endPosition = (c, e) => {
  isDrawing = false;
  const ctx = c.getContext('2d');
  data.push(singleData);
  set('data', {data, removedData});
  singleData = [];
  ctx.closePath();
  e.preventDefault();
};

const draw = (c, e) => {
  if (isDrawing) {
    const { x, y } = getCoordinates(c, e);
    const ctx = c.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
    if (x || y) {
        singleData.push({ x, y });
    }
  }
  e.preventDefault();
};

const undo = e => {
  if (data.length == 0) {
    console.warn('No undo available');
    return false;
  }
  removedData.push(data.pop());
  drawAll();
  set('data', {data, removedData});
};

const redo = e => {
  if (removedData.length == 0) {
    console.warn('No redo available');
    return false;
  }
  data.push(removedData.pop());
  drawAll();
  set('data', {data, removedData});
};

const clear = (c, cd = true) => {
  undoBtn.classList.add('disable');
  undoBtn.classList.remove('enable');
  redoBtn.classList.add('disable');
  redoBtn.classList.remove('enable');
  clearBtn.classList.add('disable');
  clearBtn.classList.remove('enable');
  if (cd) {
    data = [];
    removedData = [];
    set('data', {data, removedData});
  }
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
};

const drawAll = c => {
  clear(c, false);
  if (data.length !== 0) {
    undoBtn.classList.add('enable');
    undoBtn.classList.remove('disable');
  }
  if (removedData.length !== 0) {
    redoBtn.classList.add('enable');
    redoBtn.classList.remove('disable');
  }
  if (data.length !== 0 || removedData.length !== 0) {
    clearBtn.classList.add('enable');
    clearBtn.classList.remove('disable');
  }
  const ctx = c.getContext('2d');
  data.forEach(lineData => {
    let i = 0;
    lineData.forEach(point => {
      const { x, y } = point;
      if (i == 0) {
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (lineData.length == i) {
        ctx.moveTo(x, y);
        ctx.stroke();
        ctx.beginPath();
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      i++;
    });
    ctx.beginPath();
  });
};

letters.forEach(letter => {
    const letterBox = document.createElement('div');
    letterBox.classList.add('letter-box');

    const letterEl = document.createElement('div');
    letterEl.classList.add('letter');
    letterEl.textContent = letter;
    letterBox.appendChild(letterEl);

    const canvas = document.createElement('canvas');
    
    canvas.width = 150;
    canvas.height = 150;
    letterBox.appendChild(canvas);

    canvas.addEventListener('mousedown', e => startPosition(canvas, e));
    canvas.addEventListener('mouseup', e => endPosition(canvas, e));
    canvas.addEventListener('mouseleave', e => endPosition(canvas, e));
    canvas.addEventListener('mousemove', e => draw(canvas, e));

    canvas.addEventListener('touchstart', e => startPosition(canvas, e));
    canvas.addEventListener('touchend', e => endPosition(canvas, e));
    canvas.addEventListener('touchmove', e => draw(canvas, e));

    grid.appendChild(letterBox);

    if (letter == 'A') {
        set(`canvas-${letter}`, canvas.toDataURL());

        const c = get(`canvas-${letter}`, {});
        console.log({c});
    }
});

(e => {
    const {data: d, removedData: rd} = get('data', {data: [], removedData: []});
    data = d;
    removedData = rd;
    console.log({data, removedData});
    if (d.length !== 0) {
        document.querySelectorAll('canvas').forEach(c => {
            drawAll(c);
        });
    }
})();

undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);
clearBtn.addEventListener('click', e => {
    document.querySelectorAll('canvas').forEach(c => {
        clear(c);
    });
});

document.addEventListener('keydown', e => {
  switch (e.which) {
    case 38:
    case 67:
        document.querySelectorAll('canvas').forEach(c => {
            clear(c);
        });
      break;
    case 37:
      undo();
      break;
    case 39:
      redo();
      break;
  }
});

// clearAllButton.addEventListener('click', e => {
//   const canvases = document.querySelectorAll('canvas');
//   canvases.forEach(canvas => {
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   });
// });