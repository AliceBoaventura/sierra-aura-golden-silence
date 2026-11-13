/* RC73 V6: editorial polishing without modifying choices, flags or chapter logic.
   Small correction set: remove stage directions from replies and out-of-tone punchlines. */
(()=>{'use strict';
const changes=[
 ['ClubStory','meet',0,'choice',1,'Então me pergunta. Mas baixa a lente primeiro.'],
 ['ClubStory','parents',0,'choice',0,'Eu não sabia. Era aniversário da minha mãe naquela foto.'],
 ['ClubStory','return',0,'choice',0,'Estou saindo também. Não confunda minha calma com vontade de ficar.'],
 ['GhostStory','welcome',0,'choice',0,'O primeiro foi aos dezesseis. Depois ficou difícil parar de colecionar.'],
 ['GhostStory','records',0,'choice',0,'Nenhum. Só gosta de dizer que o som está alto demais.'],
 ['InterludeStory','walk2',2,'text',null,'Você pode sentir as duas coisas. Não precisa decidir agora.'],
 ['InterludeStory','walk2',3,'text',null,'Não consigo desligar a cabeça.'],
 ['InterludeStory','walk2',4,'text',null,'Então eu fico aqui. A gente anda um pouco.'],
 ['InterludeStory','cafe2',1,'text',null,'Pode.'],
 ['InterludeStory','cafe1',2,'text',null,'Ela disse que eu tinha talento. Pediu que não insistisse.'],
];
const report={version:'RC73-V6-EDITORIAL',expected:changes.length,applied:0,missing:[]};
for(const [scope,group,i,field,choice,text] of changes){
 let data;try{data=eval(scope)}catch{};
 const beat=data?.[group]?.[i];
 if(!beat){report.missing.push([scope,group,i]);continue;}
 if(field==='choice'){
   if(!Array.isArray(beat.choices?.[choice])||typeof beat.choices[choice][1]!=='string'){
     report.missing.push([scope,group,i,'choice',choice]);continue;
   }
   beat.choices[choice][1]=text;
 }else if(field==='text'){
   if(typeof beat.text!=='string'){report.missing.push([scope,group,i,'text']);continue;}
   beat.text=text;
 }
 report.applied++;
}
window.RC73V6EditorialAudit=Object.freeze(report);
if(report.missing.length)console.warn('[RC73 V6] Missing editorial targets',report.missing);
})();
