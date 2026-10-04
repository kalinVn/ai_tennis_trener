(() => {
  const video = document.getElementById('rally-video');
  const canvas = document.getElementById('tracking-layer');
  if (!video || !canvas) return;
  const court = document.getElementById('video-demo-court');
  const ctx = canvas.getContext('2d');
  const message = document.getElementById('video-load-error');
  const $ = id => document.getElementById(id);
  let width = 0, height = 0, visible = true, frameId = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize() {
    const r = court.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    width = r.width; height = r.height;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function line(a,b,color,thickness=1.7){ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.strokeStyle=color;ctx.lineWidth=thickness;ctx.stroke();}
  function draw(t) {
    if(!visible)return;
    ctx.clearRect(0,0,width,height);
    // Visual demo skeleton: illustrative animation, NOT detected joints in the video.
    const phase = reduced ? 0.3 : ((video.currentTime || t/1000)%7)/7;
    const travel = Math.sin(phase*Math.PI*2)*width*.04;
    const bob = Math.abs(Math.sin(phase*Math.PI*4))*height*.012;
    const cx = width*.49+travel, cy = height*.55+bob, s=Math.min(width,height)*.18;
    const nodes = {
      head:[cx,cy-s*1.52],neck:[cx,cy-s*1.05],
      shoulderL:[cx-s*.42,cy-s*.90],shoulderR:[cx+s*.43,cy-s*.92],
      elbowL:[cx-s*.63,cy-s*.43], elbowR:[cx+s*(.7+phase*.1),cy-s*.51],
      handL:[cx-s*.45,cy-s*.03],handR:[cx+s*(1+phase*.12),cy-s*.65],
      hip:[cx,cy],kneeL:[cx-s*(.35+phase*.15),cy+s*.64],kneeR:[cx+s*(.32+phase*.15),cy+s*.62],
      ankleL:[cx-s*.52,cy+s*1.23],ankleR:[cx+s*.53,cy+s*1.21]
    };
    const pairs=[['head','neck'],['neck','shoulderL'],['neck','shoulderR'],['neck','hip'],['shoulderL','elbowL'],['elbowL','handL'],['shoulderR','elbowR'],['elbowR','handR'],['hip','kneeL'],['hip','kneeR'],['kneeL','ankleL'],['kneeR','ankleR']];
    for(const [a,b] of pairs)line(nodes[a],nodes[b],'rgba(161,255,104,.72)',1.7);
    for(const [name,[x,y]] of Object.entries(nodes)){
      ctx.beginPath();ctx.arc(x,y,name==='head'?3.2:2.7,0,Math.PI*2);
      ctx.fillStyle='#b9ff76';ctx.shadowColor='#aaff72';ctx.shadowBlur=9;ctx.fill();ctx.shadowBlur=0;
    }
    // Simple vector and analysis HUD, intentionally not fitted to individual video players.
    const wrist = nodes.handR;
    line(wrist,[wrist[0]+s*.38,wrist[1]-s*.32],'#76eafa',2);
    ctx.fillStyle='#9dffd3';ctx.font='11px monospace';
    ctx.fillText('v=(0.3,-0.7)',Math.min(wrist[0]+7,width-110),wrist[1]-18);
    ctx.strokeStyle='rgba(175,253,108,.36)';ctx.lineWidth=1;
    ctx.strokeRect(cx-s*.78,cy-s*1.87,s*1.96,s*3.32);
    const seq=[['READY','Prepare for the next shot.','156°','72 km/h','(0.3, -0.7)'],['TRACKING','Move toward the ball.','132°','65 km/h','(0.6, -0.4)'],['IMPACT','Follow through.','112°','94 km/h','(0.9, +0.2)'],['RECOVERY','Recover.','147°','81 km/h','(-0.4, +0.1)']];
    const st=seq[Math.floor(phase*seq.length)%seq.length];
    $('move-phase').textContent=st[0];$('ai-feedback').textContent=st[1];$('body-angle').textContent=st[2];$('ball-speed').textContent=st[3];$('racket-vector').textContent=st[4];$('live-coach').textContent=st[1];
    if(!reduced)frameId=requestAnimationFrame(draw);
  }
  video.addEventListener('error',()=>{message.hidden=false;},{once:true});
  video.addEventListener('loadeddata',()=>{message.hidden=true;},{once:true});
  video.addEventListener('canplay',()=>{video.play().catch(()=>{});});
  // HTML5 playback remains muted, looping, inline. No custom player controls.
  video.muted=true;
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(court);
  else window.addEventListener('resize',resize);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible){resize();cancelAnimationFrame(frameId);frameId=requestAnimationFrame(draw);if(!reduced)video.play().catch(()=>{});}
    else{cancelAnimationFrame(frameId);video.pause();}
  }).observe(court);
  resize();frameId=requestAnimationFrame(draw);
  if(reduced){video.pause();}
})();