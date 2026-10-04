(() => {
  const video = document.getElementById('rally-video');
  if (!video) return;
  const court = document.getElementById('video-demo-court');
  const message = document.getElementById('video-load-error');
  const audioIndicator = document.getElementById('coaching-audio');
  const coachingMessage = document.getElementById('coaching-message');
  let shownMessage = '';
  const playbackRate = 0.3;
  const loopDuration = 15; // Seconds of playback at the configured slow-motion speed.
  // Manual source-pixel annotations from the user's 1280x720 reference images.
  const freezes = [
    { time: 2.9, duration: 5500, feedback: ['Good arm position', 'Bend your knees', 'Toss the ball higher', 'Keep the racket position stable'], segments: [
      [[512,378],[526,367]], [[573,356],[587,355]],
      [[543,415],[543,430]], [[566,409],[566,433]],
      [[548,455],[553,477]], [[570,457],[575,475]],
    ] },
    { time: 3.7, duration: 3500, feedback: ['Keep the racket position stable', 'Follow through'], segments: [
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

  function holdElapsed() {
    return activeFreeze.duration - remaining + (holdTimer === null ? 0 : performance.now()-timerStarted);
  }
  function updateCoaching() {
    const onScreen = visible && !document.hidden && !video.error;
    const isCoaching = held && settled && video.paused && !video.seeking
      && Math.abs(video.currentTime-activeFreeze.time)<.001;
    if (audioIndicator) audioIndicator.dataset.active = String(onScreen && !video.seeking
      && (isCoaching || (!video.paused && video.readyState >= 3)));
    if (!coachingMessage) return;
    if (!onScreen || !isCoaching) {
      coachingMessage.hidden = true;
      coachingMessage.textContent = '';
      shownMessage = '';
      return;
    }
    // Scripted prototype cues share the exact hold clock used by the line overlay.
    // No independent timers or CSS animations can outlive a video pause.
    const interval = activeFreeze.duration / activeFreeze.feedback.length;
    const elapsed = Math.min(holdElapsed(),activeFreeze.duration);
    const index = Math.min(Math.floor(elapsed/interval),activeFreeze.feedback.length-1);
    const text = activeFreeze.feedback[index];
    if (text !== shownMessage) {coachingMessage.textContent = text;shownMessage = text;}
    const localTime = elapsed-index*interval;
    const entrance = reduced ? 1 : Math.min(1,localTime/400);
    const exit = reduced ? 1 : Math.min(1,Math.max(0,(interval-localTime)/180));
    coachingMessage.hidden = false;
    coachingMessage.style.opacity = String(Math.min(entrance,exit));
    const eased = 1-Math.pow(1-entrance,3);
    const drift = reduced ? 0 : Math.max(0,(localTime-400)/(interval-400))*5;
    const lift = (1-eased)*28-drift-(1-exit)*10;
    coachingMessage.style.transform = `translate(${(1-eased)*-14}px, ${lift}px) scale(${.94+.06*eased})`;
  }

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
    const elapsed = holdElapsed();
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
      updateCoaching();
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
      updateCoaching();
    }
    if (!held) {
      const index = freezes.findIndex(freeze => freeze.time > video.currentTime);
      nextFreeze = index < 0 ? freezes.length : index;
    }
  });
  video.addEventListener('playing',()=>{if(held)video.pause();updateCoaching();});
  for (const event of ['pause','waiting','seeking','ended','loadeddata']) video.addEventListener(event,updateCoaching);
  if (canvas) new ResizeObserver(drawAnnotations).observe(canvas);
  window.addEventListener('resize',drawAnnotations);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){suspendHoldTimer();video.pause();}
    else{resumeHoldTimer();playWhenAllowed();cancelAnimationFrame(frameId);frameId=requestAnimationFrame(updateBanner);}
    updateCoaching();
  });
  window.addEventListener('pagehide',suspendHoldTimer);
  window.addEventListener('pageshow',()=>{resumeHoldTimer();playWhenAllowed();cancelAnimationFrame(frameId);frameId=requestAnimationFrame(updateBanner);});

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
  function updateBanner() {
    if(!visible || document.hidden)return;
    loopVideo();
    if(held && settled)drawAnnotations();
    updateCoaching();
    if(!reduced)frameId=requestAnimationFrame(updateBanner);
  }
  // Also enforce the loop when animation frames are throttled.
  video.addEventListener('timeupdate',loopVideo);
  video.addEventListener('error',()=>{message.hidden=false;suspendHoldTimer();held=settled=false;drawAnnotations();updateCoaching();},{once:true});
  video.addEventListener('loadeddata',()=>{message.hidden=true;},{once:true});
  video.addEventListener('canplay',playWhenAllowed);
  // HTML5 playback remains muted, looping, inline. No custom player controls.
  video.muted=true;
  video.defaultPlaybackRate=playbackRate;
  video.playbackRate=playbackRate;
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible){cancelAnimationFrame(frameId);frameId=requestAnimationFrame(updateBanner);resumeHoldTimer();playWhenAllowed();}
    else{cancelAnimationFrame(frameId);suspendHoldTimer();video.pause();}
    updateCoaching();
  }).observe(court);
  frameId=requestAnimationFrame(updateBanner);
  if(reduced){video.pause();}
})();