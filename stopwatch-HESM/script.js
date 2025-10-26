// script.js
// Múltiples cronómetros y cuentas regresivas, cada uno independiente.

const $ = (s, r=document) => r.querySelector(s);
const on = (t, e, h) => t.addEventListener(e, h);

function pad(n, w=2){ return String(n).padStart(w,'0'); }
function formatHMSms(totalMs){
  if(totalMs < 0) totalMs = 0;
  const ms = Math.floor(totalMs % 1000);
  const s  = Math.floor(totalMs/1000);
  const hh = Math.floor(s/3600);
  const mm = Math.floor((s%3600)/60);
  const ss = s%60;
  return { hh:pad(hh), mm:pad(mm), ss:pad(ss), ms:pad(ms,3) };
}
function paint(elTime, elMs, ms){
  const f = formatHMSms(ms);
  elTime.textContent = `${f.hh}:${f.mm}:${f.ss}`;
  if(elMs) elMs.textContent = f.ms;
}

const cardsRoot = $('#cards');
const beep = $('#beep');

$('#createStopwatch').addEventListener('click', ()=> createStopwatchCard());
$('#createCountdown').addEventListener('click', ()=> createCountdownCard());

// ---------- STOPWATCH CARD (Imagen 2) ----------
function createStopwatchCard(){
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="label">Cronómetro</div>
    <button class="close" aria-label="Borrar">Borrar</button>
    <div class="panel"><span class="time">00:00:00</span><span class="ms">000</span></div>
    <div class="row">
      <button class="btn green start">Start</button>
      <button class="btn red clear">Clear</button>
    </div>
  `;
  cardsRoot.prepend(card);

  const timeEl = $('.time', card);
  const msEl   = $('.ms', card);
  const start  = $('.start', card);
  const clear  = $('.clear', card);
  const close  = $('.close', card);

  let running=false, startTs=0, accum=0, raf=0;
  function tick(){
    if(!running) return;
    const now = performance.now();
    paint(timeEl, msEl, accum + (now - startTs));
    raf = requestAnimationFrame(tick);
  }
  function doStart(){
    if(running){ doPause(); return; }
    running = true;
    start.textContent = 'Stop';
    startTs = performance.now();
    tick();
  }
  function doPause(){
    if(!running) return;
    running = false;
    accum += performance.now() - startTs;
    start.textContent = 'Start';
    if(raf) cancelAnimationFrame(raf);
  }
  function doClear(){
    doPause();
    accum = 0;
    paint(timeEl, msEl, 0);
  }

  on(start,'click',doStart);
  on(clear,'click',doClear);
  on(close,'click',()=>{ doPause(); card.remove(); });
}

// ---------- COUNTDOWN CARD (Imagen 3) ----------
function createCountdownCard(){
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="label">Cuenta regresiva</div>
    <button class="close" aria-label="Borrar">Borrar</button>

    <div class="panel"><span class="time">00:00:00</span><span class="ms">000</span></div>

    <div class="keypad">
      <button class="kbtn" data-k="5">5</button>
      <button class="kbtn" data-k="6">6</button>
      <button class="kbtn" data-k="7">7</button>
      <button class="kbtn" data-k="8">8</button>
      <button class="kbtn" data-k="9">9</button>
      <button class="kbtn dim" data-act="set" style="grid-column:6/7">Set</button>

      <button class="kbtn" data-k="0">0</button>
      <button class="kbtn" data-k="1">1</button>
      <button class="kbtn" data-k="2">2</button>
      <button class="kbtn" data-k="3">3</button>
      <button class="kbtn" data-k="4">4</button>
      <button class="kbtn dim" data-act="clear" style="grid-column:6/7">Clear</button>
    </div>

    <div class="row run" style="display:none">
      <button class="btn green start">Start</button>
      <button class="btn red reset">Clear</button>
    </div>

    <div class="finish-banner done">Tiempo cumplido</div>
  `;
  cardsRoot.prepend(card);

  const timeEl = $('.time', card);
  const keypad = $('.keypad', card);
  const runRow = $('.row.run', card);
  const start  = $('.start', card);
  const reset  = $('.reset', card);
  const close  = $('.close', card);
  const done   = $('.done', card);

  // Estado del timer
  let buffer = "";        // hasta 6 dígitos
  let initialMs = 0;
  let running = false;
  let endTs = 0, raf = 0;

  function bufferToMs(){
    const b = buffer.padStart(6,'0').slice(-6);
    const hh = parseInt(b.slice(0,2),10);
    const mm = parseInt(b.slice(2,4),10);
    const ss = parseInt(b.slice(4,6),10);
    return ((hh*3600 + mm*60 + ss) * 1000) | 0;
  }
  function renderBuffer(){
    const ms = bufferToMs();
    paint(timeEl, null, ms);
  }

  function switchToRun(){
    keypad.style.display = 'none';
    runRow.style.display = 'flex';
    done.classList.remove('show');
    paint(timeEl, null, initialMs);
    running = false;
    start.textContent = 'Start';
  }

  function tick(){
    if(!running) return;
    const remain = endTs - performance.now();
    paint(timeEl, null, Math.max(0, remain));
    if(remain <= 0){
      finish();
    }else{
      raf = requestAnimationFrame(tick);
    }
  }

  function startOrPause(){
    if(running){ pause(); return; }
    running = true;
    start.textContent = 'Stop';
    // calcular restante a partir del display actual
    const [hh,mm,ss] = timeEl.textContent.split(':').map(v=>parseInt(v,10)||0);
    const left = (hh*3600 + mm*60 + ss) * 1000;
    endTs = performance.now() + left;
    tick();
  }
  function pause(){
    if(!running) return;
    running = false;
    start.textContent = 'Start';
    if(raf) cancelAnimationFrame(raf);
  }
  function resetRun(){
    pause();
    paint(timeEl, null, initialMs);
    done.classList.remove('show');
  }
  function finish(){
    pause();
    paint(timeEl, null, 0);
    // Beep embebido (manejar errores silenciosamente)
    if(beep){ try{ beep.currentTime = 0; beep.play().catch(()=>{}); }catch(_e){} }
    done.classList.add('show');
  }

  // Eventos
  on(keypad,'click',(e)=>{
    const b = e.target.closest('button'); if(!b) return;
    const k = b.dataset.k;
    const act = b.dataset.act;
    if(k!==undefined){
      if(buffer.length<6){ buffer += k; renderBuffer(); }
      return;
    }
    if(act==='clear'){ buffer = ""; renderBuffer(); }
    else if(act==='set'){
      const ms = bufferToMs();
      if(ms<=0) return;
      initialMs = ms;
      switchToRun();
    }
  });
  on(start,'click', startOrPause);
  on(reset,'click', resetRun);
  on(close,'click', ()=>{ pause(); card.remove(); });

  // init UI
  renderBuffer();
}