const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const grid = document.querySelector('#lettersGrid');
const clearAllButton = document.querySelector('#clearAll');

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

  const ctx = canvas.getContext('2d');
  let isDrawing = false;

  const startPosition = e => {
    isDrawing = true;
    ctx.beginPath();
  };

  const endPosition = e => {
    isDrawing = false;
    ctx.closePath();
  };

  const draw = e => {
    if (isDrawing) {
      let x, y;
      const rect = canvas.getBoundingClientRect();
      if (e.type.includes('touch')) {
        x = e.touches[0].clientX - canvas.offsetLeft;
        y = e.touches[0].clientY - canvas.offsetTop;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  canvas.addEventListener('mousedown', startPosition);
  canvas.addEventListener('mouseup', endPosition);
  canvas.addEventListener('mouseleave', endPosition);
  canvas.addEventListener('mousemove', draw);

  canvas.addEventListener('touchstart', startPosition);
  canvas.addEventListener('touchend', endPosition);
  canvas.addEventListener('touchmove', draw);

  grid.appendChild(letterBox);
});

clearAllButton.addEventListener('click', e => {
  const canvases = document.querySelectorAll('canvas');
  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
});