(() => {
  const video = document.getElementById('rally-video');
  if (!video) return;
  const court = document.getElementById('video-demo-court');
  const message = document.getElementById('video-load-error');
  const $ = id => document.getElementById(id);
  const playbackRate = 0.3;
  const loopDuration = 15; // Seconds of playback at the configured slow-motion speed.
  function loopVideo() {
    const end = Math.min(loopDuration * playbackRate, video.duration);
    if(Number.isFinite(end) && end>0 && video.currentTime>=end)video.currentTime=0;
  }
  let visible = true, frameId = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateTelemetry(t) {
    if(!visible)return;
    loopVideo();
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
  video.addEventListener('canplay',()=>{video.play().catch(()=>{});});
  // HTML5 playback remains muted, looping, inline. No custom player controls.
  video.muted=true;
  video.defaultPlaybackRate=playbackRate;
  video.playbackRate=playbackRate;
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible){cancelAnimationFrame(frameId);frameId=requestAnimationFrame(updateTelemetry);if(!reduced)video.play().catch(()=>{});}
    else{cancelAnimationFrame(frameId);video.pause();}
  }).observe(court);
  frameId=requestAnimationFrame(updateTelemetry);
  if(reduced){video.pause();}
})();