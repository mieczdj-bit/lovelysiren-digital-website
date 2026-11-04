import {executiveDemo,metricCard,renderRows} from './dashboard-data.js';
const metrics=document.querySelector('#executive-metrics');
if(metrics)metrics.replaceChildren(...executiveDemo.metrics.map(metricCard));
const rows=document.querySelector('#product-results');
if(rows)renderRows(rows,executiveDemo.products,['name','receipts','expenses','result','installs']);
const actions=document.querySelector('#management-actions');
if(actions)renderRows(actions,executiveDemo.actions,['title','state']);
document.querySelector('#sample-period').textContent=executiveDemo.period;
