export default function decorate(block) {
  const list = document.createElement('ol');
  [...block.children].forEach((row) => {
    const [number, body, output] = [...row.children];
    const item = document.createElement('li');
    item.className = 'signal-step';
    if (number) number.className = 'signal-number';
    if (body) body.className = 'signal-body';
    if (output) output.className = 'signal-output';
    item.append(...[number, body, output].filter(Boolean));
    list.append(item);
  });
  block.replaceChildren(list);
}
