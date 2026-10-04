
const demoDashboardURL = new URL('../../pages/dashboard.html', document.currentScript.src);
let authMode='login';
function openAuth(mode='login'){const m=document.getElementById('auth');if(!m)return; m.classList.add('open');setAuth(mode);document.getElementById('email')?.focus();}
function closeAuth(){document.getElementById('auth')?.classList.remove('open');}
function setAuth(mode){authMode=mode;const reg=mode==='register';const name=document.getElementById('nameField');if(name)name.hidden=!reg;const submit=document.getElementById('auth-submit');if(submit)submit.textContent=reg?'Create account (demo)':'Log in (demo)';document.getElementById('loginTab')?.classList.toggle('primary',!reg);document.getElementById('registerTab')?.classList.toggle('primary',reg);}
document.getElementById('auth-form')?.addEventListener('submit',e=>{e.preventDefault();window.location.href=demoDashboardURL.href;});
document.getElementById('auth')?.addEventListener('click',e=>{if(e.target.id==='auth')closeAuth();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAuth();});
function toggleDemo(button,first,second){button.dataset.active=button.dataset.active==='yes'?'no':'yes';button.textContent=button.dataset.active==='yes'?second:first;}
function showDemoNote(message){const n=document.getElementById('demo-note');if(n){n.textContent=message;n.hidden=false;}else alert(message);}
