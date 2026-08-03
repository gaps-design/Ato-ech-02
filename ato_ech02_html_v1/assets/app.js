
function setActive(){const p=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===p))}
function openModal(html){const m=document.getElementById('modal');m.querySelector('.modal-content').innerHTML=html;m.classList.add('open')}
function closeModal(){document.getElementById('modal')?.classList.remove('open')}
function imageModal(src){openModal(`<img class="responsive" src="${src}">`)}
function anomalyCard(a){
 const imgs=a.img.map(x=>`<img src="assets/img/${x}" onclick="imageModal(this.src)">`).join('');
 return `<article class="card anomaly"><span class="badge ${a.iv==='Autoflush'?'amber':'red'}">${a.iv}</span><h3>${a.id}. ${a.title}</h3>
 <p><b>Subconjunto:</b> ${a.sub}<br><b>Componente:</b> ${a.comp}</p>
 <p><b>Impacto principal:</b> ${a.impact}</p>
 ${a.secondaryImpact?`<p class="secondary-impact"><b>Impacto secundário:</b> ${a.secondaryImpact}</p>`:''}
 ${imgs?`<div class="gallery">${imgs}</div>`:`<div class="card" style="background:#fff8dc"><b>Foto pendente</b><p>Registrar antes/depois da remoção dos cames.</p></div>`}
 <details><summary>Ver 5 Porquês e causa raiz</summary><div class="inside">${a.whys.map((w,i)=>`<div class="why"><b>${i+1}</b><span>${w}</span></div>`).join('')}<p><span class="badge red">Causa raiz preliminar</span> ${a.root}</p><p><b>Ação:</b> ${a.action}</p></div></details></article>`
}
function renderAnomalies(target,filter){const el=document.querySelector(target);if(!el)return;el.innerHTML=ANOMALIES.filter(a=>!filter||a.iv===filter).map(anomalyCard).join('')}
function saveEditable(key){const vals=[...document.querySelectorAll('[data-save]')].map(e=>e.innerHTML);localStorage.setItem(key,JSON.stringify(vals));alert('Alterações salvas neste navegador.')}
function loadEditable(key){try{const vals=JSON.parse(localStorage.getItem(key)||'[]');document.querySelectorAll('[data-save]').forEach((e,i)=>{if(vals[i])e.innerHTML=vals[i]})}catch(e){}}
function filterStatusTable(tableId,status,counterId){
 const rows=[...document.querySelectorAll(`#${tableId} tbody tr`)];
 let visible=0;
 rows.forEach(row=>{const show=status==='all'||row.dataset.status===status;row.hidden=!show;if(show)visible++});
 const counter=document.getElementById(counterId);if(counter)counter.textContent=`${visible} ${visible===1?'item exibido':'itens exibidos'}`
}
const USER_PROCEDURES_KEY='ato-procedures-v1';
function createProcedureCard({name,description,link}){
 const article=document.createElement('article');article.className='procedure-card';
 const info=document.createElement('div');
 const badge=document.createElement('span');badge.className='badge green';badge.textContent='Procedimento';
 const title=document.createElement('h4');title.textContent=name;
 info.append(badge,title);
 if(description){const text=document.createElement('p');text.textContent=description;info.append(text)}
 const anchor=document.createElement('a');anchor.className='btn';anchor.href=link;anchor.target='_blank';anchor.rel='noopener noreferrer';anchor.textContent='Abrir procedimento';
 article.append(info,anchor);return article
}
function loadSavedProcedures(){
 const target=document.getElementById('saved-procedures');if(!target)return;
 try{const items=JSON.parse(localStorage.getItem(USER_PROCEDURES_KEY)||'[]');items.forEach(item=>target.append(createProcedureCard(item)))}catch(e){}
}
function addProcedure(){
 const form=document.getElementById('procedure-form');if(!form)return;
 const name=form.elements['procedure-name'].value.trim();
 const description=form.elements['procedure-description'].value.trim();
 const link=form.elements['procedure-link'].value.trim();
 if(!name||!link){alert('Informe o nome e o link do procedimento.');return}
 try{const url=new URL(link);if(!['http:','https:'].includes(url.protocol))throw new Error()}catch(e){alert('Informe um link válido iniciado por http:// ou https://.');return}
 const item={name,description,link};let items=[];
 try{items=JSON.parse(localStorage.getItem(USER_PROCEDURES_KEY)||'[]')}catch(e){}
 items.push(item);localStorage.setItem(USER_PROCEDURES_KEY,JSON.stringify(items));
 document.getElementById('saved-procedures')?.append(createProcedureCard(item));form.reset()
}
const MAPA_CONTAMINACAO_KEY='ato-mapa-contaminacao-v1';
function updateContaminationStatus(select){
 if(!select)return;
 const classes={'OK':'status-ok','Em andamento':'status-progress','Pendente':'status-pending','Validar':'status-validate'};
 select.classList.remove('status-ok','status-progress','status-pending','status-validate');
 select.classList.add(classes[select.value]||'status-validate')
}
function saveContaminationMap(){
 const rows=[...document.querySelectorAll('#contamination-action-table tbody tr')];if(!rows.length)return;
 const data=rows.map(row=>({
  number:Number(row.dataset.number),
  action:row.querySelector('[data-field="action"]')?.innerText.trim()||'',
  contamination:row.querySelector('[data-field="contamination"]')?.innerText.trim()||'',
  status:row.querySelector('[data-field="status"]')?.value||'Validar',
  comment:row.querySelector('[data-field="comment"]')?.innerText.trim()||''
 }));
 localStorage.setItem(MAPA_CONTAMINACAO_KEY,JSON.stringify(data));
 const feedback=document.getElementById('contamination-save-feedback');if(feedback){feedback.hidden=false;clearTimeout(window.contaminationFeedbackTimer);window.contaminationFeedbackTimer=setTimeout(()=>{feedback.hidden=true},4000)}
}
function loadContaminationMap(){
 const table=document.getElementById('contamination-action-table');if(!table)return;
 let saved=[];try{saved=JSON.parse(localStorage.getItem(MAPA_CONTAMINACAO_KEY)||'[]')}catch(e){}
 if(Array.isArray(saved))saved.forEach(item=>{
  const row=table.querySelector(`tr[data-number="${Number(item.number)}"]`);if(!row)return;
  ['action','contamination','comment'].forEach(field=>{if(typeof item[field]==='string')row.querySelector(`[data-field="${field}"]`).textContent=item[field]});
  const select=row.querySelector('[data-field="status"]');if(select&&[...select.options].some(option=>option.value===item.status))select.value=item.status
 });
 table.querySelectorAll('.status-select').forEach(select=>{updateContaminationStatus(select);select.addEventListener('change',()=>updateContaminationStatus(select))})
}
document.addEventListener('DOMContentLoaded',()=>{setActive();document.querySelectorAll('.gallery img').forEach(i=>i.onclick=()=>imageModal(i.src));document.getElementById('modal')?.addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});loadSavedProcedures();loadContaminationMap()})
