const inputsDiv = document.getElementById('inputs');
const adjustTable = document.querySelector('#adjust-table tbody');
const rankOriginal = document.getElementById('rank-original');
const rankAdjusted = document.getElementById('rank-adjusted');
const statsDiv = document.getElementById('stats');
const multiplierInput = document.getElementById('multiplier');

let data = Array(49).fill(0).map((_, i) => ({ id: i + 1, value: 0, adjusted: 0, adjustInput: 0 }));

function createInputs() {
  inputsDiv.innerHTML = '';
  data.forEach((item, i) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '编号 ' + (i + 1);
    input.value = item.value;
    input.addEventListener('input', e => {
      try { item.value = eval(e.target.value) || 0; } catch { item.value = 0; }
      saveData(); updateAll();
    });
    inputsDiv.appendChild(input);
  });
}

function updateAdjustArea() {
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 20);
  adjustTable.innerHTML = '';
  sorted.forEach(item => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td'); td1.textContent = item.id;
    const td2 = document.createElement('td'); td2.textContent = item.value.toFixed(2);
    const td3 = document.createElement('td'); const input = document.createElement('input');
    input.type = 'number'; input.value = item.adjustInput || 0;
    input.addEventListener('input', () => { item.adjustInput = parseFloat(input.value) || 0; updateAll(); });
    td3.appendChild(input);
    const td4 = document.createElement('td'); td4.textContent = item.adjusted.toFixed(2);
    tr.append(td1, td2, td3, td4);
    adjustTable.appendChild(tr);
  });
}

function updateAll() {
  const multiplier = parseFloat(multiplierInput.value) || 1;
  data.forEach(item => { item.adjusted = item.value * multiplier - (item.adjustInput || 0); });
  updateAdjustArea(); updateRankings(); saveData();
}

function updateRankings() {
  const sortedOrig = [...data].sort((a, b) => b.value - a.value);
  const sortedAdj = [...data].sort((a, b) => b.adjusted - a.adjusted);
  rankOriginal.innerHTML = sortedOrig.map(i => `<li>${i.id}：${i.value.toFixed(2)}</li>`).join('');
  rankAdjusted.innerHTML = sortedAdj.map(i => `<li>${i.id}：${i.adjusted.toFixed(2)}</li>`).join('');
  const uniqueVals = {};
  data.forEach(i => { const v = i.adjusted.toFixed(2); uniqueVals[v] = (uniqueVals[v] || 0) + 1; });
  statsDiv.innerHTML = '<h4>数值统计</h4>' + Object.entries(uniqueVals).map(([v, c]) => `${v}：${c} 项`).join('<br>');
}

function randomFill() {
  data.forEach(item => item.value = Math.floor(Math.random() * 1000) + 1);
  updateAll();
}

function clearAll() {
  data.forEach(item => { item.value = 0; item.adjustInput = 0; item.adjusted = 0; });
  updateAll();
}

function saveData() { localStorage.setItem('betData_v13_4', JSON.stringify(data)); }
function restoreData() {
  const saved = localStorage.getItem('betData_v13_4');
  if (saved) { data = JSON.parse(saved); createInputs(); updateAll(); }
}

document.getElementById('random').onclick = randomFill;
document.getElementById('clear').onclick = clearAll;
document.getElementById('restore').onclick = restoreData;

createInputs(); updateAll();