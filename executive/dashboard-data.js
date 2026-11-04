// Fabricated layout data only. No customer, product, or company records are read.
export const executiveDemo = Object.freeze({
  period: 'Sample reporting period',
  metrics: [
    { label: 'Sample gross receipts', value: '$1,250.00 sample' },
    { label: 'Sample operating expenses', value: '$820.00 sample' },
    { label: 'Sample net result', value: '$430.00 sample' },
    { label: 'Sample installations', value: '12,800 sample' },
    { label: 'Sample active users', value: '815 sample' },
    { label: 'Sample engagement', value: '18 min sample' }
  ],
  products: [
    { name: 'Sample Game A', receipts: '$900', expenses: '$600', result: '$300', installs: '7,400' },
    { name: 'Sample App B', receipts: '$350', expenses: '$200', result: '$150', installs: '4,100' },
    { name: 'Sample Game C', receipts: '$0', expenses: '$20', result: '-$20', installs: '1,300' }
  ],
  actions: [
    { title: 'Sample proposal review', state: 'Demo status' },
    { title: 'Sample royalty report', state: 'Demo status' },
    { title: 'Sample content review', state: 'Demo status' }
  ]
});

export function metricCard({label,value}) {
  const article=document.createElement('article');article.className='dev-metric';
  const small=document.createElement('small');small.textContent=label;
  const strong=document.createElement('div');strong.className='sample-data';strong.textContent=value;
  article.append(small,strong);return article;
}

export function renderRows(tbody,rows,keys) {
  tbody.replaceChildren(...rows.map(row=>{const tr=document.createElement('tr');for(const key of keys){const td=document.createElement('td');td.textContent=row[key];tr.append(td);}return tr;}));
}
