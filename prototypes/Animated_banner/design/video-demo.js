(() => {
  const video = document.getElementById('rally-video');
  if (!video) return;
  const court = document.getElementById('video-demo-court');
  const message = document.getElementById('video-load-error');
  const $ = id => document.getElementById(id);
  const playbackRate = 0.3;
  const loopDuration = 15; // Seconds of playback at the configured slow-motion speed.
  // Manual source-pixel annotations from the user's 1280x720 reference images.
  const freezes = [
    { time: 2.9, duration: 5500, segments: [
      [[512,378],[526,367]], [[573,356],[587,355]],
      [[543,415],[543,430]], [[566,409],[566,433]],
      [[548,455],[553,477]], [[570,457],[575,475]],
    ] },
    { time: 3.7, duration: 3500, segments: [
      [[539,338],[542,347]], [[552,358],[562,358]],
      [[613,354],[632,373]], [[563,369],[563,397]],
      [[563,413],[562,435]], [[592,419],[588,445]],
      [[560,457],[567,482]], [[587,458],[586,482]],
    ] },
  ];
  let nextFreeze = 0, activeFreeze = null;
  const lineStepMs = 350;
  const lineDrawMs = 300;
  const canvas = document.getElementById('freeze-points');
  const context = canvas?.getContext('2d');
  let held = false, settled = false;
  let holdTimer = null, remaining = 0, timerStarted = 0;

  function drawAnnotations() {
    if (!context) return;
    const c = canvas.getBoundingClientRect(), v = video.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(c.width * dpr);
    canvas.height = Math.round(c.height * dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
    if (!held || !settled || !video.paused || Math.abs(video.currentTime-activeFreeze.time)>.001) return;
    // Centered cover crop; transformed bounds already include scale(1.07).
    const scale = Math.max(v.width/1280,v.height/720);
    const left = v.left-c.left+(v.width-1280*scale)/2;
    const top = v.top-c.top+(v.height-720*scale)/2;
    const elapsed = activeFreeze.duration - remaining + (holdTimer === null ? 0 : performance.now()-timerStarted);
    context.strokeStyle = '#39ff14';
    context.lineWidth = Math.max(2,3*scale);
    context.lineCap = 'round';
    activeFreeze.segments.forEach(([[x1,y1],[x2,y2]],index)=>{
      const progress = Math.min(1,Math.max(0,(elapsed-index*lineStepMs)/lineDrawMs));
      if (progress === 0) return;
      context.beginPath();
      context.moveTo(left+x1*scale,top+y1*scale);
      context.lineTo(left+(x1+(x2-x1)*progress)*scale,top+(y1+(y2-y1)*progress)*scale);
      context.stroke();
    });
  }
  function playWhenAllowed() {
    if (!held && visible && !document.hidden && !reduced) video.play().catch(()=>{});
  }
  function suspendHoldTimer() {
    if (holdTimer === null) return;
    clearTimeout(holdTimer);
    holdTimer = null;
    remaining = Math.max(0,remaining-(performance.now()-timerStarted));
  }
  function resumeHoldTimer() {
    if (!held || !settled || holdTimer !== null || !visible || document.hidden) return;
    timerStarted = performance.now();
    holdTimer = setTimeout(()=>{
      holdTimer = null;
      held = settled = false;
      drawAnnotations();
      playWhenAllowed();
    },remaining);
  }
  video.addEventListener('seeked',()=>{
    if (held && Math.abs(video.currentTime-activeFreeze.time)<.001) {
      settled = true;
      drawAnnotations();
      resumeHoldTimer();
    } else if (held) {
      suspendHoldTimer();
      held = settled = false;
      drawAnnotations();
    }
    if (!held) {
      const index = freezes.findIndex(freeze => freeze.time > video.currentTime);
      nextFreeze = index < 0 ? freezes.length : index;
    }
  });
  video.addEventListener('playing',()=>{if(held)video.pause();});
  if (canvas) new ResizeObserver(drawAnnotations).observe(canvas);
  window.addEventListener('resize',drawAnnotations);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){suspendHoldTimer();video.pause();}
    else{resumeHoldTimer();playWhenAllowed();}
  });
  window.addEventListener('pagehide',suspendHoldTimer);
  window.addEventListener('pageshow',()=>{resumeHoldTimer();playWhenAllowed();});

  function loopVideo() {
    const end = Math.min(loopDuration * playbackRate, video.duration);
    if (held) return;
    const upcoming = freezes[nextFreeze];
    if (context && !reduced && upcoming && !video.paused && end>upcoming.time && video.currentTime>=upcoming.time) {
      activeFreeze = upcoming;
      nextFreeze++;
      held = true;
      remaining = activeFreeze.duration;
      settled = false;
      video.pause();
      video.currentTime = activeFreeze.time;
      return;
    }
    if(Number.isFinite(end) && end>0 && video.currentTime>=end){nextFreeze=0;video.currentTime=0;}
  }
  let visible = true, frameId = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateTelemetry(t) {
    if(!visible)return;
    loopVideo();
    if(held && settled)drawAnnotations();
    // Illustrative telemetry, not measurements from the video.
    const phase = reduced ? 0.3 : ((video.currentTime || t/1000)%7)/7;
    const seq=[['READY','Prepare for the next shot.','156°','72 km/h','(0.3, -0.7)'],['TRACKING','Move toward the ball.','132°','65 km/h','(0.6, -0.4)'],['IMPACT','Follow through.','112°','94 km/h','(0.9, +0.2)'],['RECOVERY','Recover.','147°','81 km/h','(-0.4, +0.1)']];
    const st=seq[Math.floor(phase*seq.length)%seq.length];
    $('move-phase').textContent=st[0];$('ai-feedback').textContent=st[1];$('body-angle').textContent=st[2];$('ball-speed').textContent=st[3];$('racket-vector').textContent=st[4];$('live-coach').textContent=st[1];
    if(!reduced)frameId=requestAnimationFrame(updateTelemetry);
  }
  // Also enforce the loop when animation frames are throttled.
  video.addEventListener('timeupdate',loopVideo);
  video.addEventListener('error',()=>{message.hidden=false;},{once:true});
  video.addEventListener('loadeddata',()=>{message.hidden=true;},{once:true});
  video.addEventListener('canplay',playWhenAllowed);
  // HTML5 playback remains muted, looping, inline. No custom player controls.
  video.muted=true;
  video.defaultPlaybackRate=playbackRate;
  video.playbackRate=playbackRate;
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible){cancelAnimationFrame(frameId);frameId=requestAnimationFrame(updateTelemetry);resumeHoldTimer();playWhenAllowed();}
    else{cancelAnimationFrame(frameId);suspendHoldTimer();video.pause();}
  }).observe(court);
  frameId=requestAnimationFrame(updateTelemetry);
  if(reduced){video.pause();}
})();