let data = Array(49).fill().map((_, i) => ({id:i+1, value:0, result:0, multiple:45, profit:0}));
let adjustments = [];

function init(){
  renderTable();
  calcAll();
}
function renderTable(){
  const tbl = document.getElementById('mainTable');
  tbl.innerHTML = '<tr><th>编号</th><th>输入</th><th>结果</th><th>倍数</th><th>盈亏</th></tr>';
  data.forEach(item=>{
    tbl.innerHTML += `<tr>
      <td>${item.id}</td>
      <td><input type='text' value='${item.value}' onchange='updateValue(${item.id},this.value)'></td>
      <td id='result${item.id}'>${item.result}</td>
      <td><select onchange='setMultiple(${item.id},this.value)'>
        ${Array.from({length:21},(_,j)=>40+j).map(v=>`<option ${v==item.multiple?'selected':''}>${v}</option>`).join('')}
      </select></td>
      <td id='profit${item.id}'></td>
    </tr>`;
  });
}
function updateValue(id,val){
  try{
    let calc = eval(val);
    data[id-1].value = calc;
    data[id-1].result = calc;
  }catch{ data[id-1].result = 0; }
  calcAll();
}
function setMultiple(id,val){ data[id-1].multiple=parseInt(val); calcAll(); }
function calcAll(){
  const total = data.reduce((a,b)=>a+b.result,0);
  data.forEach(item=>{
    item.profit = total - item.result * item.multiple;
    const el = document.getElementById('profit'+item.id);
    if(el){
      el.innerText = item.profit>0?('+'+item.profit+' 盈'):item.profit<0?(item.profit+' 亏'):'0 平';
      el.className = item.profit>0?'profit':item.profit<0?'loss':'even';
      document.getElementById('result'+item.id).innerText=item.result;
    }
  });
  document.getElementById('summary').innerText = `总和: ${total}`;
  renderAdjustment();
  renderSorted('original');
}
function renderAdjustment(){
  const sorted = [...data].sort((a,b)=>b.result-a.result).slice(0,20);
  adjustments = sorted.map(x=>({...x,adjust:0,newValue:x.result}));
  const div=document.getElementById('adjustmentArea');
  div.innerHTML='<table><tr><th>编号</th><th>原值</th><th>调节值</th><th>新值</th></tr></table>';
  const tbl=div.querySelector('table');
  adjustments.forEach((a,i)=>{
    tbl.innerHTML+=`<tr><td>${a.id}</td><td>${a.result}</td>
      <td><input type='text' value='0' onchange='updateAdjust(${i},this.value)'></td>
      <td id='new${i}'>${a.newValue}</td></tr>`;
  });
}
function updateAdjust(i,val){
  try{
    let calc = eval(val);
    adjustments[i].adjust = calc;
    adjustments[i].newValue = adjustments[i].result - calc;
    document.getElementById('new'+i).innerText = adjustments[i].newValue;
    const found=data.find(d=>d.id===adjustments[i].id);
    if(found){found.result=adjustments[i].newValue;}
  }catch{}
  calcAll();
}
function renderSorted(type){
  const div=document.getElementById('sortedArea');
  let arr=[...data];
  if(type==='profit') arr.sort((a,b)=>b.profit-a.profit);
  else if(type==='adjusted') arr.sort((a,b)=>b.result-a.result);
  else arr.sort((a,b)=>b.result-a.result);
  let counts={盈:0,亏:0,平:0};
  arr.forEach(x=>{
    if(x.profit>0) counts.盈++;
    else if(x.profit<0) counts.亏++;
    else counts.平++;
  });
  div.innerHTML='<table><tr><th>编号</th><th>原值</th><th>盈亏</th><th>状态</th></tr></table>';
  const tbl=div.querySelector('table');
  arr.forEach(x=>{
    tbl.innerHTML+=`<tr><td>${x.id}</td><td>${x.result}</td><td>${x.profit}</td>
      <td class='${x.profit>0?'profit':x.profit<0?'loss':'even'}'>${x.profit>0?'盈':x.profit<0?'亏':'平'}</td></tr>`;
  });
  tbl.innerHTML+=`<tr><td colspan=4>盈:${counts.盈} 亏:${counts.亏} 平:${counts.平}</td></tr>`;
}
function saveData(){ localStorage.setItem('betcalc',JSON.stringify(data)); alert('保存成功'); }
function loadData(){ const d=localStorage.getItem('betcalc'); if(d){data=JSON.parse(d); renderTable(); calcAll();} }
function clearAll(){ localStorage.removeItem('betcalc'); data=data.map((_,i)=>({id:i+1,value:0,result:0,multiple:45,profit:0})); renderTable(); calcAll(); }
function randomFill(){ data.forEach(d=>d.value=Math.floor(Math.random()*1000+1)); renderTable(); calcAll(); }
function exportCSV(){
  let csv='编号,原值,盈亏\n';
  data.forEach(d=>csv+=`${d.id},${d.result},${d.profit}\n`);
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='bet-data.csv'; a.click();
}
window.onload=init;
