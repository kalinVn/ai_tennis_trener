  import { Application, Graphics, Text } from 'pixi.js'

  // A local imperative helper, not a composable or service. Each instance owns its resources.
  export function createHomePageVideoSlider(root) {
    let initialized = false
    let disposed = false, release = () => {}, resizeObserver, intersectionObserver
    const events = new AbortController()
    const on = (target, name, callback, options = {}) => target.addEventListener(name, callback, {...options, signal: events.signal})
    const app = new Application()
    const initialVideo = root.querySelector('video')
    initialVideo.pause()
    const ready = (async () => {
      await app.init({canvas: root.querySelector('canvas'), backgroundAlpha: 0, antialias: true, autoStart: false, autoDensity: true, resolution: devicePixelRatio || 1, preference: 'webgl'})
      initialized = true
      if (disposed) { app.destroy(false, {children: true}); return }
      app.canvas.style.width = '100%';
      app.canvas.style.height = '100%';

    const video = root.querySelector('[data-slider=\"rally-video\"]');
    if (!video) return;
    const court = root;
    const message = root.querySelector('[data-slider=\"video-load-error\"]');
    const audioIndicator = root.querySelector('[data-slider=\"coaching-audio\"]');
    const coachingMessage = root.querySelector('[data-slider=\"coaching-message\"]');
    const trackingPhase = root.querySelector('[data-slider=\"tracking-phase\"]');
    const playbackRate = 0.3;
    const loopDuration = 15; // Seconds of playback at the configured slow-motion speed.
    // Manual source-pixel annotations from the user's 1280x720 reference images.
    const freezes = [
      { time: 2.9, duration: 5500, feedback: ['Good arm position', 'Bend your knees', 'Toss the ball higher'], labels: ['Angle: 42°', 'Vector: [0.74, -0.31]', 'Knee Flexion: 28°', 'Hip Height: 82 cm', 'L-Foot: [0.42, 0.81]', 'R-Foot: [-0.35, 0.76]'], segments: [
        [[512,378],[526,367]], [[573,356],[587,355]],
        [[543,415],[543,430]], [[566,409],[566,433]],
        [[548,455],[553,477]], [[570,457],[575,475]],
      ] },
      { time: 3.7, duration: 3500, feedback: ['Keep the racket position stable', 'Follow through'], labels: ['Rotation: 27°', 'ΔX: 18 px', null, null, 'Knee Flexion: 38°', 'Hip Height: 76 cm', 'L-Foot: [0.18, 0.94]', 'R-Foot: [-0.12, 0.91]'], segments: [
        [[539,338],[542,347]], [[552,358],[562,358]],
        [[613,354],[632,373]], [[563,369],[563,397]],
        [[563,413],[562,435]], [[592,419],[588,445]],
        [[561,457],[566,482]], [[587,458],[589,482]],
      ] },
    ];
    let nextFreeze = 0, activeFreeze = null;
    const lineStepMs = 350;
    const lineDrawMs = 300;
    const canvas = root.querySelector('[data-slider=\"freeze-points\"]');
    const context = true; // Pixi renderer is ready before the timing loop starts.
    const graphics = new Graphics();
    const labels = Array.from({length: 8}, () => new Text({text: '', style: {fontFamily: 'monospace', fontSize: 10, fill: '#caffad'}}));
    app.stage.addChild(graphics, ...labels);
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
      if (trackingPhase) trackingPhase.textContent = isCoaching ? 'ANALYZING' : 'READY';
      if (!coachingMessage) return;
      if (!onScreen || !isCoaching || video.readyState < 2) {
        coachingMessage.hidden = true;
        return;
      }
      // Coaching and technical annotations share the existing hold clock.
      const elapsed = Math.min(holdElapsed(), activeFreeze.duration);
      const interval = activeFreeze.duration / activeFreeze.feedback.length;
      const index = Math.min(Math.floor(elapsed / interval), activeFreeze.feedback.length - 1);
      const text = activeFreeze.feedback[index];
      const letters = reduced ? text.length : Math.floor((elapsed - index * interval) / 55) + 1;
      const typed = text.slice(0, letters);
      if (coachingMessage.textContent !== typed) coachingMessage.textContent = typed;
      // Expose the complete cue without announcing every individual character.
      coachingMessage.setAttribute('aria-label', text);
      coachingMessage.hidden = false;
    }

    function drawAnnotations() {
      if (!context) return;
      const c = canvas.getBoundingClientRect(), v = video.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (app.screen.width !== c.width || app.screen.height !== c.height || app.renderer.resolution !== dpr) {
        app.renderer.resize(c.width, c.height, dpr);
        canvas.style.width = '100%';
        canvas.style.height = '100%';
      }
      graphics.clear();
      labels.forEach(label => { label.visible = false; });
      if (!held || !settled || !video.paused || video.seeking || Math.abs(video.currentTime-activeFreeze.time)>.001) { app.render(); return; }
      // Centered cover crop; transformed bounds already include scale(1.07).
      const scale = Math.max(v.width/1280,v.height/720);
      const left = v.left-c.left+(v.width-1280*scale)/2;
      const top = v.top-c.top+(v.height-720*scale)/2;
      const elapsed = holdElapsed();

      activeFreeze.segments.forEach(([[x1,y1],[x2,y2]],index)=>{
        const progress = Math.min(1,Math.max(0,(elapsed-index*lineStepMs)/lineDrawMs));
        if (progress === 0) return;

        graphics.moveTo(left+x1*scale,top+y1*scale);
        graphics.lineTo(left+(x1+(x2-x1)*progress)*scale,top+(y1+(y2-y1)*progress)*scale);
        graphics.stroke({color: '#39ff14', width: Math.max(2,3*scale), cap: 'round'});
        if (activeFreeze.labels[index]) {
          const lowerIndex = index - (activeFreeze.segments.length - 4);
          const lowerBody = lowerIndex >= 0;
          const compact = c.width <= 600;
          // Compact layouts keep leg data left of the player, clear of the right UI.
          const labelLeft = lowerBody ? compact || lowerIndex % 2 === 0 : index === 0;
          const offsetY = lowerBody
            ? (compact ? [0, 17, 8, 25][lowerIndex] : 3)
            : (compact && index === 1 ? 18 : -10);
          // Illustrative values, anchored to the source-video geometry, not measurements.
          const label = labels[index];
          label.visible = true;
          label.alpha = progress * .85;
          label.position.set(left + (x1+x2)/2*scale + (labelLeft ? -10 : 12), top + (y1+y2)/2*scale + offsetY);
          const rotationLimit = lowerBody ? .12 : .25;
          label.rotation = Math.max(-rotationLimit, Math.min(rotationLimit, Math.atan2(y2-y1,x2-x1)));
          label.style.fontSize = Math.max(9, Math.min(11, 10*scale));
          label.anchor.set(labelLeft ? 1 : 0, 1);
          label.text = activeFreeze.labels[index];
        }
      });
      app.render();
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
    on(video, 'seeked',()=>{
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
    on(video, 'playing',()=>{if(held)video.pause();updateCoaching();});
    for (const event of ['pause','waiting','seeking','ended','loadeddata']) on(video, event,updateCoaching);
    resizeObserver = new ResizeObserver(drawAnnotations);
    resizeObserver.observe(canvas);
    on(window, 'resize',drawAnnotations);
    on(document, 'visibilitychange',()=>{
      if(document.hidden){suspendHoldTimer();video.pause();}
      else{resumeHoldTimer();playWhenAllowed();cancelAnimationFrame(frameId);frameId=requestAnimationFrame(updateBanner);}
      updateCoaching();
    });
    on(window, 'pagehide',suspendHoldTimer);
    on(window, 'pageshow',()=>{resumeHoldTimer();playWhenAllowed();cancelAnimationFrame(frameId);frameId=requestAnimationFrame(updateBanner);});

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
      if(disposed || !visible || document.hidden)return;
      loopVideo();
      if(held && settled)drawAnnotations();
      updateCoaching();
      if(!reduced)frameId=requestAnimationFrame(updateBanner);
    }
    // Also enforce the loop when animation frames are throttled.
    on(video, 'timeupdate',loopVideo);
    on(video, 'error',()=>{message.hidden=false;suspendHoldTimer();held=settled=false;drawAnnotations();updateCoaching();},{once:true});
    on(video, 'loadeddata',()=>{message.hidden=true;},{once:true});
    on(video, 'canplay',playWhenAllowed);
    // HTML5 playback remains muted, looping, inline. No custom player controls.
    video.muted=true;
    video.defaultPlaybackRate=playbackRate;
    video.playbackRate=playbackRate;
    if('IntersectionObserver' in window) { intersectionObserver = new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting;
      if(visible){cancelAnimationFrame(frameId);frameId=requestAnimationFrame(updateBanner);resumeHoldTimer();playWhenAllowed();}
      else{cancelAnimationFrame(frameId);suspendHoldTimer();video.pause();}
      updateCoaching();
    }); intersectionObserver.observe(court); }
    frameId=requestAnimationFrame(updateBanner);
    if(reduced){video.pause();}
    release = () => { suspendHoldTimer(); cancelAnimationFrame(frameId); video.pause(); audioIndicator.dataset.active = 'false'; };
    playWhenAllowed();

    })().catch(error => {
      if (disposed) return
      destroy()
      const message = root.querySelector('[data-slider="video-load-error"]')
      message.textContent = 'Video analysis preview unavailable.'
      message.hidden = false
      console.error('HomePageVideoSlider initialization failed', error)
    })
    function destroy() {
      if (disposed) return
      disposed = true
      events.abort()
      release()
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      initialVideo.pause()
      if (initialized) app.destroy(false, {children: true})
    }
    return {ready, destroy}
  }
