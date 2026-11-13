/* Adaptacao SEGURA do conceito de interferencia visual do web engine recebido.
 * Opt-in por palavras ja presentes no jogo. Nao muda frases, escolhas ou estado.
 * Nao importa parser HTML, motor de nos, typewriter nem controladores de input.
 */
'use strict';
(()=>{
  const critical=/\b(?:SIGNAL INTERRUPTION|SECONDARY PRESENCE LOST|TRACE TERMINATED|NO EXIT VECTOR|TRACE LOST|TRACE RESTORED)\b/i;
  const known=new WeakMap();
  const watched=['line','talkLine','ghostDialogue','intervalDialogue'];
  function check(el){
    if(!el||!el.isConnected)return;
    const value=el.textContent||'';
    if(known.get(el)===value)return;
    known.set(el,value);
    el.classList.remove('neo-signal-interference');
    if(!critical.test(value))return;
    // Force a new single animation on actual changes, not in the game loop.
    void el.offsetWidth;
    el.classList.add('neo-signal-interference');
  }
  for(const id of watched){
    const parent=document.getElementById(id);
    if(!parent)continue;
    const scan=()=>{
      if(id==='ghostDialogue'||id==='intervalDialogue'){
        for(const el of parent.querySelectorAll('p.club-line'))check(el);
      }else check(parent);
    };
    new MutationObserver(scan).observe(parent,{childList:true,characterData:true,subtree:true});
    scan();
  }
})();
