
function setActive(){const p=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===p))}
function openModal(html){const m=document.getElementById('modal');m.querySelector('.modal-content').innerHTML=html;m.classList.add('open')}
function closeModal(){document.getElementById('modal')?.classList.remove('open')}
function imageModal(src){openModal(`<img class="responsive" src="${src}">`)}
function anomalyCard(a){
 const imgs=a.img.map(x=>`<img src="assets/img/${x}" onclick="imageModal(this.src)">`).join('');
 return `<article class="card anomaly"><span class="badge ${a.iv==='AutoFlush'?'amber':'red'}">${a.iv}</span><h3>${a.id}. ${a.title}</h3>
 <p><b>Subconjunto:</b> ${a.sub}<br><b>Componente:</b> ${a.comp}</p>
 <p><b>Impacto principal:</b> ${a.impact}</p>
 ${a.secondaryImpact?`<p class="secondary-impact"><b>Impacto secundário:</b> ${a.secondaryImpact}</p>`:''}
 ${imgs?`<div class="gallery">${imgs}</div>`:`<div class="card" style="background:#fff8dc"><b>Foto pendente</b><p>Registrar antes/depois da remoção dos cames.</p></div>`}
 <details><summary>Ver 5 Porquês e causa raiz</summary><div class="inside">${a.whys.map((w,i)=>`<div class="why"><b>${i+1}</b><span>${w}</span></div>`).join('')}<p><span class="badge red">Causa raiz preliminar</span> ${a.root}</p><p><b>Ação:</b> ${a.action}</p></div></details></article>`
}
function renderAnomalies(target,filter){const el=document.querySelector(target);if(!el)return;el.innerHTML=ANOMALIES.filter(a=>!filter||a.iv===filter).map(anomalyCard).join('')}
function saveEditable(key){const vals=[...document.querySelectorAll('[data-save]')].map(e=>e.innerHTML);localStorage.setItem(key,JSON.stringify(vals));alert('Alterações salvas neste navegador.')}
function loadEditable(key){try{const vals=JSON.parse(localStorage.getItem(key)||'[]');document.querySelectorAll('[data-save]').forEach((e,i)=>{if(vals[i])e.innerHTML=vals[i]})}catch(e){}}
document.addEventListener('DOMContentLoaded',()=>{setActive();document.querySelectorAll('.gallery img').forEach(i=>i.onclick=()=>imageModal(i.src));document.getElementById('modal')?.addEventListener('click',e=>{if(e.target.id==='modal')closeModal()})})
