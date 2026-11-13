/* V10.7 · Small verified line edits. Never edit an event, choice, flag, scene ID or timing state. */
(()=>{'use strict';
const audit={version:'RC73-V107-EDITORIAL',applied:[],missing:[]};
const edits=[
 ['ClubStory','brief',0,'line','Alex achou seis minutos da minha voz numa gravação anterior ao nosso encontro. O original está no clube. Não ligue sua lente à rede de lá.'],
 ['ClubStory','meet',0,'line','Desliga a lente. Minha equipe não autorizou uma varredura. Depois vemos a fita.'],
 ['GhostStory','invite',0,'line','Achei outro canal na faixa da Aura. Há coordenadas no ruído. Venha ouvir aqui; a cópia fica offline.'],
 ['GhostStory','arrival',0,'line','Duas assinaturas na mesma chave. Ainda não sabemos quem a trocou, nem quando.'],
 ['GhostStory','last',1,'line','O rastro da Alex termina aqui. Guardamos a cópia. Não vamos invadir outra mente para preencher o resto.'],
 ['InterludeStory','depotFinal',5,'text','Quando éramos crianças, Alex me ensinou a ouvir o silêncio antes de mexer no volume.'],
 ['InterludeStory','depotFinal',9,'text','Temos a ordem das autorizações. Falta saber quem assinou.']
];
for(const [name,group,index,field,text]of edits){
 let source;try{source=({ClubStory, GhostStory, InterludeStory})[name]}catch{}
 const beat=source?.[group]?.[index];
 if(!beat||typeof beat[field]!=='string'){audit.missing.push(`${name}.${group}[${index}].${field}`);continue;}
 beat[field]=text;audit.applied.push(`${name}.${group}[${index}].${field}`);
}
window.DemoEditorialV107Audit=Object.freeze(audit);
if(audit.missing.length)console.error('[V10.7] Editorias não aplicadas:',audit.missing);
})();
