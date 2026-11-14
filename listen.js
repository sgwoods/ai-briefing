
(() => {
  const mp3 = document.getElementById("mp3"), synth = window.speechSynthesis;
  const bR = document.getElementById("read"), bL = document.getElementById("listen"), ctl = document.getElementById("ctl");
  const rate = () => parseFloat(document.getElementById("rate").value);
  let q = [];
  function clear(){document.querySelectorAll("section.speaking").forEach(s=>s.classList.remove("speaking"));}
  function stop(){ if(mp3) mp3.pause(); if(synth){q=[];synth.cancel();} clear(); }
  function next(){ if(!q.length){clear();return;} const el=q.shift(); clear(); el.classList.add("speaking");
    el.scrollIntoView({behavior:"smooth",block:"start"});
    const c=el.cloneNode(true); c.querySelectorAll("a").forEach(a=>a.remove());
    const u=new SpeechSynthesisUtterance(c.innerText.replace(/\s*·\s*/g,". ")); u.rate=rate(); u.onend=next; synth.speak(u); }
  function play(){ if(mp3){mp3.hidden=false; mp3.playbackRate=rate(); mp3.play(); return;}
    if(!synth){alert("No speech support in this browser.");return;} stop(); q=[...document.querySelectorAll("#brief section")]; next(); }
  function mode(l){ bR.classList.toggle("on",!l); bL.classList.toggle("on",l); ctl.hidden=!l; if(!l) stop(); }
  bR.onclick=()=>mode(false); bL.onclick=()=>mode(true);
  document.getElementById("play").onclick=play; document.getElementById("stop").onclick=stop;
})();
