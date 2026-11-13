/* Sierra & Aura / P54 · consolidação seletiva da revisão de 29/10.
   Preserva história, escolhas, dados de puzzles, final P53, física e save.
   Aproveita os melhores princípios de encenação da revisão anterior sem
   substituir sequências mais completas da P53 por falas anteriores. */
(()=>{'use strict';
const records=[];
function aside(story,section,index,value){
 const source={interlude:InterludeStory,interval:IntervalStory}[story];
 const b=source?.[section]?.[index];
 if(!b||typeof b.aside==='string'&&b.aside.trim())throw Error(`P54: alvo narrativo modificado ${story}.${section}[${index}]`);
 if(typeof value!=='string'||!value.trim())throw Error('P54: aside vazio');
 b.aside=value;
 records.push(`${story}.${section}[${index}].aside`);
}
function prefix(story,section,index,value){
 const source={interlude:InterludeStory,interval:IntervalStory}[story];
 const b=source?.[section]?.[index];
 if(!b||!b.text?.startsWith(value))throw Error(`P54: fala incompatível ${story}.${section}[${index}]`);
 b.text=b.text.slice(value.length);
 records.push(`${story}.${section}[${index}].text`);
}
// Café às 02:17: a sequência nova é ramificada e traz suas próprias pausas/gestos.
// Os índices antigos pertenciam à conversa linear e não devem ser reaplicados.
records.push('interlude.cafe1.topic-branches');
aside('interlude','auraCloud',7,'Sierra afasta a mão do controle sensorial. Não é uma recusa à Aura; é espaço para que ambas escolham o próximo gesto.');
// A morte não é substituída por suspense artificial. A confirmação é definitiva.
aside('interval','sacrificeEnd',2,'Jinx prende a porta com o ombro e espera Sierra atravessar. A voz de Alexandra ainda vem pelo circuito local.');
// Keep legacy dialogue fixes for old save data, without rewriting the new RC60 observation-room script.
if(!IntervalStory.aftermath?.[0]?.text?.startsWith('CAM 04 /')){
aside('interval','aftermath',5,'O painel deixa de atualizar. Nenhuma segunda linha aparece, por mais que Aura toque no vidro.');
// Corrige prefixo duplo: who já define quem fala no painel.
prefix('interval','aftermath',9,'SIERRA: ');
prefix('interval','aftermath',11,'SIERRA: ');
prefix('interval','aftermath',12,'JINX: ');
}

window.P54SelectiveMerge=Object.freeze({version:'2026-10-29',changes:records,source:'P53 RC43 + editorial compatible',preserves:['P53 final','manual dialogue','puzzle gates','Alexandra death','save schema']});
})();
