/* V10.7 · Direção de demonstração pública.
 * O diário mostra perguntas e observações do estado PRESENTE: sem spoilers,
 * sem alterar flags, hotspots, colisões, escolhas ou salvamento.
 */
(()=>{'use strict';
const chapters=Object.freeze({
 '-1':{name:'PRÓLOGO',idea:'Um segundo desaparece da lente de Sierra.'},
 1:{name:'O ÚLTIMO SINAL',idea:'Uma falha administrativa tem consequências humanas.'},
 2:{name:'SILÊNCIO DOURADO',idea:'Confiar não é possuir acesso.'},
 3:{name:'ENLACE',idea:'A entrada só importa se houver saída.'},
 4:{name:'ENTRE AS ESTRELAS',idea:'Uma promessa não substitui o consentimento.'},
 5:{name:'ZONA CEGA',idea:'Uma gravação precisa sobreviver à noite.'},
 6:{name:'GHOST TRACK',idea:'Uma ausência não explica a si mesma.'},
 7:{name:'47 MINUTOS',idea:'O que o monitor mostra não é toda a verdade.'},
 8:{name:'CAFÉ ÀS 02:17',idea:'O que perdemos muda o que fazemos agora.'}
});
const safe=s=>s&&typeof s==='object'?s:{};
function caseFile(raw){
 const s=safe(raw),ch=String(s.chapter??'-1'),f=safe(s.flags),stage=String(s.stage||''),n=safe(chapters[ch]);
 if(!chapters[ch])return null;
 let question='',observation='',help='';
 switch(ch){
 case '-1':
  question='Que segundo sumiu do registro de Sierra?';
  observation='A lente falhou. Sierra ainda não sabe por quê.';
  help='Avance o prólogo. Na bancada, examine primeiro a falha da lente.';break;
 case '1':
  if(stage==='home'){
   question='A lente falhou. O que ainda é possível verificar?';
   observation='O visor não guardou a falha que Sierra presenciou.';
   help='Na bancada óptica, segure Q / SCAN; depois use E / USAR. A saída vem depois.';
  }else if(stage==='district'){
   question='Por que a clínica funciona no sistema, mas não na rua?';
   observation=f.repair?'A alimentação da clínica foi restaurada. A catraca ainda merece atenção.':'A clínica depende do quadro elétrico que Mara está tentando manter ligado.';
   help=f.repair?'Compare o que a unidade avariada registra; use o scanner antes de religar a rede.':'Encontre Mara junto ao quadro e examine a fiação com Q / SCAN.';
  }else if(stage==='trace'){
   question='Quem mexeu nos registros depois do apagão?';
   const clues=[f.terminal?'Uma sessão local foi recuperada.':'',f.credential?'Há um token revogado sem assinatura.':'',f.camera?'Uma gravação da câmera foi preservada.':''].filter(Boolean);
   observation=clues.length?clues.join(' '):'O corredor contém registros locais que podem ser comparados sem usar a rede.';
   help=!f.terminal?'Comece pelo console da galeria e mantenha o scanner ligado perto da fonte.':!f.credential?'Procure o leitor de acesso: o token e a sessão não contam a mesma história.':!f.camera?'A gravação da câmera é a terceira fonte; compare-a com os horários anteriores.':'Siga a trilha de manutenção até a passagem, sem descartar os originais.';
  }else{
   question='Quem abriu o caminho até o esconderijo?';
   observation='Uma porta fora da rede encerra a trilha da manutenção.';
   help='Observe os detalhes do corredor. A saída está no fim do acesso B-3.';
  }break;
 case '2':
  question='Até onde Sierra pode ajudar sem tomar o controle de Aura?';
  observation=f.repairedTogether?'As duas isolaram uma leitura na bancada, sem conectá-la à rede.':'Aura mantém o lugar fora da rede; abrir a porta não é autorizar uma varredura.';
  help=f.repairedTogether?'Siga a conversa sobre o enlace e escolha exatamente o acesso que Sierra autoriza.':'Procure a bancada. Compare os registros, isolando alimentação e dados antes de salvar.';break;
 case '3':{
  const found=Array.isArray(s.nodes)?s.nodes.filter(x=>x&&x.found).length:0;
  question='Como encerrar a vigilância sem entregar a própria lente?';
  observation=found?`${found} relé${found===1?'':'s'} isolado${found===1?'':'s'} nesta passagem.`:'Três relés compartilham um rastreamento. Aura acompanha pelo enlace óptico.';
  help='Siga até cada terminal; E / USAR isola um relé. Ao terminar, deixe o corredor antes de conversar.';
  break;}
 case '4':
  question='Como amar alguém que considera desaparecer na rede?';
  observation=Number.isInteger(s.beat)&&s.beat>2?'Aura falou de suspensão e consciência digital. Nenhuma resposta de Sierra encerra a decisão por ela.':'O terraço é um encontro presencial, com a lente desligada.';
  help='Escolha o que Sierra realmente diria. Aproximar-se não significa consentir em todas as outras escolhas.';break;
 case '5':
  question='O que há na gravação que Alexandra não quis transmitir?';
  observation='O original está na Zona Cega. Alexandra pediu que a equipe e a gravação ficassem fora da rede.';
  help=['raid','escape'].includes(stage)?'Corra com Jinx. Use o scanner apenas junto à trava; não pare para enfrentar toda a patrulha.':'Entre pelo acesso de serviço, converse com Alexandra e preserve o módulo original.';
  break;
 case '6':
  question='O que aconteceu entre a última gravação e o silêncio?';
  observation='Alexandra isolou uma segunda faixa. Ainda é preciso separar dado, hipótese e lembrança.';
  help='Compare os canais de áudio. Preserve a cópia antes de seguir qualquer rastro ECHO.';break;
 case '7':
  question='O que a transmissão prova — e o que ela não mostra?';
  observation=stage==='aftermath'?'A telemetria encerrou; a câmera continuou transmitindo.':'A instalação registra atividades sem explicar quem autorizou tudo.';
  help='Compare canais, portas e horários. A interface local de Alexandra tem limites diferentes da lente de Sierra.';break;
 case '8':
  question='O que Sierra fará com aquilo que ainda pode provar?';
  observation=stage==='depot'||stage==='depotTitle'||stage==='end'?'Uma autorização e uma fita não são a mesma coisa que um culpado.':'Jinx não tem respostas prontas. Sierra pode decidir quando falar e quando ficar em silêncio.';
  help=stage==='depot'?'Reúna as quatro provas do arquivo: mural, fichários, fita e terminal. Compare antes de concluir.':'Ouça Jinx e observe os registros da cena. Ninguém precisa escolher a resposta mais confortável.';break;
 }
 return {chapter:n.name,idea:n.idea,question,observation,help};
}
window.DemoDirector=Object.freeze({version:'RC73-V107-PUBLIC-DEMO',chapters,caseFile});
})();
