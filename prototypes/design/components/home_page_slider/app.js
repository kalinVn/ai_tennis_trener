
function toggleDemo(button,first,second){button.dataset.active=button.dataset.active==='yes'?'no':'yes';button.textContent=button.dataset.active==='yes'?second:first;}
function showDemoNote(message){const n=document.getElementById('demo-note');if(n){n.textContent=message;n.hidden=false;}else alert(message);}
