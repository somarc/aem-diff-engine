function decorateCodeLines(container) {
  container.querySelectorAll('pre').forEach((pre) => {
    const code = pre.querySelector('code') || pre;
    const lines = code.textContent.replace(/^\n|\n$/g, '').split('\n');
    code.textContent = '';
    lines.forEach((text) => {
      const line = document.createElement('span');
      line.className = 'lens-code-line';
      const marker = text.trim().charAt(0);
      if (marker === '+') line.classList.add('is-added');
      if (marker === '-') line.classList.add('is-deleted');
      if (marker === '~') line.classList.add('is-modified');
      line.textContent = text;
      code.append(line);
    });
  });
}

function setLensPosition(stage, input, value) {
  const safeValue = Math.min(92, Math.max(8, Number(value)));
  stage.style.setProperty('--lens-x', `${safeValue}%`);
  input.value = safeValue;
  input.setAttribute('aria-valuenow', String(Math.round(safeValue)));
}

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row || row.children.length < 3) return;

  const [copy, published, current] = [...row.children];
  copy.className = 'lens-copy';
  published.className = 'lens-state lens-published';
  current.className = 'lens-state lens-current';

  decorateCodeLines(published);
  decorateCodeLines(current);

  const stage = document.createElement('div');
  stage.className = 'lens-stage';
  stage.style.setProperty('--lens-x', '58%');
  stage.append(published, current);

  const handle = document.createElement('div');
  handle.className = 'lens-handle';
  handle.setAttribute('aria-hidden', 'true');
  handle.innerHTML = '<span>↔</span>';
  stage.append(handle);

  const controls = document.createElement('div');
  controls.className = 'lens-controls';
  const publishedLabel = document.createElement('span');
  publishedLabel.textContent = 'Published baseline';
  const currentLabel = document.createElement('span');
  currentLabel.textContent = 'Current author state';
  const input = document.createElement('input');
  input.type = 'range';
  input.min = '8';
  input.max = '92';
  input.value = '58';
  input.setAttribute('aria-label', 'Reveal current author state');
  controls.append(publishedLabel, input, currentLabel);

  const art = document.createElement('div');
  art.className = 'lens-art';
  art.append(stage, controls);

  input.addEventListener('input', () => setLensPosition(stage, input, input.value));
  stage.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.buttons === 0) return;
    const bounds = stage.getBoundingClientRect();
    const position = ((event.clientX - bounds.left) / bounds.width) * 100;
    setLensPosition(stage, input, position);
  });
  stage.addEventListener('click', (event) => {
    const bounds = stage.getBoundingClientRect();
    const position = ((event.clientX - bounds.left) / bounds.width) * 100;
    setLensPosition(stage, input, position);
  });

  row.replaceChildren(copy, art);
  row.className = 'lens-inner';
  block.classList.add('is-ready');
}
