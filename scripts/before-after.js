
// Minimal before/after slider
document.querySelectorAll('.ba').forEach((wrap)=>{
  const handle = wrap.querySelector('.handle');
  const after = wrap.querySelector('.after');
  const rect = ()=> wrap.getBoundingClientRect();
  const set = (x)=>{
    const r = rect();
    let pct = (x - r.left) / r.width;
    pct = Math.max(0.05, Math.min(0.95, pct));
    handle.style.left = (pct*100) + '%';
    after.style.width = (pct*100) + '%';
  };
  const move = (e)=>{
    if(e.touches){ set(e.touches[0].clientX); }
    else{ set(e.clientX); }
  };
  let dragging=false;
  const start = (e)=>{ dragging=true; move(e); e.preventDefault(); }
  const end = ()=> dragging=false;
  wrap.addEventListener('mousedown', start);
  wrap.addEventListener('touchstart', start, {passive:true});
  window.addEventListener('mousemove', (e)=> dragging && move(e));
  window.addEventListener('touchmove', (e)=> dragging && move(e), {passive:true});
  window.addEventListener('mouseup', end);
  window.addEventListener('touchend', end);
});
