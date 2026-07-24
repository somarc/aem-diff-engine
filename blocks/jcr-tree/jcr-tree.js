export default function decorate(block) {
  const tree = document.createElement('ul');
  tree.className = 'jcr-tree-list';
  [...block.children].forEach((row) => {
    const [depthCell, pathCell, detailCell, stateCell] = [...row.children];
    const depth = Number.parseInt(depthCell?.textContent.trim(), 10) || 0;
    const item = document.createElement('li');
    item.className = 'jcr-tree-node';
    item.style.setProperty('--tree-depth', Math.min(depth, 8));
    if (pathCell) pathCell.className = 'jcr-tree-path';
    if (detailCell) detailCell.className = 'jcr-tree-detail';
    if (stateCell) {
      stateCell.className = 'jcr-tree-state';
      const state = stateCell.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      if (state) item.dataset.state = state;
    }
    item.append(...[pathCell, detailCell, stateCell].filter(Boolean));
    tree.append(item);
  });
  block.replaceChildren(tree);
}
