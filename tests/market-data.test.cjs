const fs=require('fs');
const vm=require('vm');
const assert=require('assert/strict');
const path=require('path');
const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const start=source.indexOf('const agents=['),end=source.indexOf('const button=',start);
const graphStart=source.indexOf('function drawMarketChart()'),graphEnd=source.indexOf('function mountMarketChart()',graphStart);
const context=vm.createContext({assert,console,Intl,Date,Math,Number,ResizeObserver:function(){},nativeTooltips:function(){},state:{name:'Atlas',selectedAgent:0,selectedMarket:0},host:{clientWidth:440,innerHTML:''},escape:s=>String(s),q:function(){return this.host}});
vm.runInContext('const q=()=>host;\n'+source.match(/^const maxExposure=.*$/m)[0]+'\n'+source.slice(start,end)+'\n'+source.slice(graphStart,graphEnd)+`
 let tradesChecked=0,chartsChecked=0;
 for(let i=0;i<marketRuns.length;i++){
  const m=marketRuns[i];
  assert.equal(m.outcome,outcomes[i]);
  assert.equal(m.hours.length,m.prices.length);
  assert.ok(m.hours.every((h,n)=>Number.isFinite(h)&&h>=0&&h<m.duration&&(n===0||h>m.hours[n-1])));
  assert.ok(m.prices.every(p=>Number.isFinite(p)&&p>0&&p<1));
  for(let ai=0;ai<agents.length;ai++){
   const a=agents[ai];
   assert.equal(forecastAt(a,i,m.hours.at(-1)),a.p[i]);
   for(const arm of ['fixed','bounded']){
    const t=tradeRecord(a,i,arm);
    assert.ok(t.stake>=0&&t.stake<=maxExposure);
    assert.equal(t.net,roundPoints(t.shares*(t.side==='YES'?m.outcome:1-m.outcome)-t.stake));
    assert.ok(Math.abs(t.shares*t.share_price-t.stake)<1e-8);
    assert.ok(t.entry_hour<m.duration);
    tradesChecked++;
   }
   assert.equal(tradeRecord(a,i,'harness'),null);
   state.selectedAgent=ai;state.selectedMarket=i;
   for(const width of [218,439,760]){
    host.clientWidth=width;drawMarketChart();
    assert.ok(!/NaN|Infinity|undefined/.test(host.innerHTML));
    assert.ok(host.innerHTML.includes('width="'+width+'"'));
    assert.equal((host.innerHTML.match(/class="cf-price-dot"/g)||[]).length,6);
    assert.equal((host.innerHTML.match(/class="cf-outcome-dot"/g)||[]).length,1);
    chartsChecked++;
   }
  }
 }
 for(const a of agents)for(const arm of ['fixed','bounded'])assert.equal(a.points[arm],roundPoints(marketRuns.reduce((s,m,i)=>s+tradeRecord(a,i,arm).net,0)));
 console.log(JSON.stringify({tradesChecked,chartsChecked,summary:agents.map(a=>({configuration:a.variant,brier:brier(a),points:a.points}))},null,2));
`,context);
