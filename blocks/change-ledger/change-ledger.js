export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const table = document.createElement('table');
  const head = document.createElement('thead');
  const body = document.createElement('tbody');
  const labels = [...rows[0].children].map((cell) => cell.textContent.trim());

  const headRow = document.createElement('tr');
  [...rows[0].children].forEach((cell) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.innerHTML = cell.innerHTML;
    headRow.append(th);
  });
  head.append(headRow);

  rows.slice(1).forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell, index) => {
      const td = document.createElement('td');
      td.dataset.label = labels[index] || '';
      td.innerHTML = cell.innerHTML;
      tr.append(td);
    });
    body.append(tr);
  });

  table.append(head, body);
  block.replaceChildren(table);
}
