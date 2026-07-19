/* Lightweight canvas atmosphere and page interactions — no external libraries required. */
const $ = (selector) => document.querySelector(selector);

// Loading sequence
const loaderText = $('#loader-text'), loaderBar = $('.loader-line i');
const loadingSteps = ['Connecting...', 'Loading Memories...', 'Loading Feelings...', 'Loading Courage...', 'Done ❤️'];
loadingSteps.forEach((line, index) => setTimeout(() => { loaderText.textContent = line; loaderBar.style.width = `${(index + 1) * 20}%`; }, index * 480));
setTimeout(() => $('#loader').classList.add('done'), loadingSteps.length * 480 + 400);

// Stars, hearts, petals and soft particles in one canvas for performance.
const canvas = $('#universe'), ctx = canvas.getContext('2d'); let W, H, particles = [], lastShoot = 0;
function resize(){ W = canvas.width = innerWidth * devicePixelRatio; H = canvas.height = innerHeight * devicePixelRatio; canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px'; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); particles = Array.from({length: Math.min(155, Math.floor(innerWidth/7))}, (_,i) => ({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.2,a:Math.random()*.75+.15,vy:(Math.random()-.25)*.09,type:i%27===0?'heart':i%31===0?'petal':'star'})); }
function draw(now){ ctx.clearRect(0,0,innerWidth,innerHeight); for(const p of particles){ p.y += p.vy; if(p.y < -15) p.y = innerHeight+15; if(p.y > innerHeight+15) p.y = -15; ctx.globalAlpha = p.a * (.7 + .3*Math.sin(now*.001+p.x)); if(p.type==='star'){ctx.fillStyle='#fff';ctx.fillRect(p.x,p.y,p.r,p.r)} else {ctx.fillStyle=p.type==='heart'?'#ff8db5':'#d99bae';ctx.font=`${p.type==='heart'?9:7}px serif`;ctx.fillText(==='heart'?'♥':'✦',p.x,p.y)} } ctx.globalAlpha=1; requestAnimationFrame(draw); }
resize(); addEventListener('resize',resize,{passive:true}); requestAnimationFrame(draw);

// Intersection-driven content reveals.
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }}), {threshold:.12});
document.querySelectorAll('.observer').forEach(el=>observer.observe(el));

// Personal letter
const letter = $('#letter-card'), openLetter = $('#open-letter'), typed = $('#typed-message'); let letterOpened = false;
function typeLetter(){ if(letterOpened) return; letterOpened=true; letter.classList.add('open'); openLetter.textContent='Read with care ♥'; const message=typed.dataset.text; typed.textContent=''; setTimeout(()=>{let i=0; const timer=setInterval(()=>{typed.textContent+=message[i++];if(i>=message.length)clearInterval(timer)},18)},850); }
letter.addEventListener('click',typeLetter);openLetter.addEventListener('click',typeLetter);

// Clock and elapsed time since the date.
function updateTime(){const now=new Date(); $('#clock').textContent=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); const d=Math.max(0,now-new Date('2026-02-22T00:00:00')), days=Math.floor(d/864e5), hours=Math.floor(d%864e5/36e5); $('#countdown').textContent=`${days}d ${hours}h`;}; updateTime();setInterval(updateTime,30000);

// Ambient audio is only attempted after a direct user click.
const audio=$('#ambient-audio'), sound=$('#sound-toggle'), musicPanel=$('#music-panel');
sound.addEventListener('click',async()=>{musicPanel.classList.toggle('visible'); if(audio.paused){try{await audio.play();sound.classList.add('playing');sound.setAttribute('aria-label','Pause ambient music')}catch(e){/* Add an ambient.mp3 to assets/music to enable sound. */}}else{audio.pause();sound.classList.remove('playing');}}); $('#volume').addEventListener('input',e=>audio.volume=e.target.value);

// Gentle final choices.
document.querySelectorAll('.choice').forEach(button=>button.addEventListener('click',()=>$('#choice-message').textContent=button.classList.contains('talk')?'Thank you. I’ll be here to listen, gently.':'Thank you for being honest. Take all the time you need.'));

const quotes=['“The most meaningful apologies are followed by changed behaviour.”','“Kindness is a language the heart never forgets.”','“Some things are best said softly, then shown consistently.”','“Respect makes space for every honest answer.”']; let quoteIndex=0;
$('#quote-button').addEventListener('click',()=>{quoteIndex=(quoteIndex+1)%quotes.length;$('#quote-popover').textContent=quotes[quoteIndex];$('.side-tools').classList.toggle('show-quote');});

// Mouse light and restrained cursor particles.
let lastSpark=0; addEventListener('pointermove',e=>{ $('#cursor-light').style.left=e.clientX+'px';$('#cursor-light').style.top=e.clientY+'px'; if(e.pointerType==='mouse'&&performance.now()-lastSpark>90){lastSpark=performance.now();const s=document.createElement('i');s.className='spark';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.style.setProperty('--x',`${(Math.random()-.5)*25}px`);s.style.setProperty('--y',`${(Math.random()-.5)*25}px`);$('#cursor-sparkles').append(s);setTimeout(()=>s.remove(),800)}},{passive:true});
