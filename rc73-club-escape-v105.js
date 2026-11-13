/* V10.5: cut and directed club evacuation. Runs after all older editorial patches. */
(()=>{'use strict';
 if(typeof ClubStory==='undefined')return;
 ClubStory.raid=[{
  who:'JINX / RÁDIO LOCAL',
  aside:'Alexandra corta a música e destrava a saída de serviço. Duas silhuetas da guarda entram pela pista. Jinx se põe entre Sierra e a linha de tiro.',
  line:'A porta dos fundos abriu. Sierra, comigo. Agora.',
  choices:[
   ['[Seguir Jinx sem parar.]','JINX: Direita. Eu cubro você.','trust'],
   ['Alexandra consegue sair?','ALEXANDRA / RÁDIO: Minha equipe já está na passagem. Vão.','trust'],
   ['E a origem da gravação?','SIERRA: Primeiro a gente sai viva. Guardo o módulo.','curious']
  ]
 }];
 ClubStory.boarding=[{
  who:'JINX',
  aside:'Os dois chegam juntos ao Cadillac. Jinx entra ao volante; Sierra guarda o módulo antes de fechar a porta. O portão some no retrovisor.',
  line:'Portas fechadas. Rampa do canal, sem passar pela avenida.',
  choices:[
   ['[Guardar o módulo e colocar o cinto.]','SIERRA: Estou pronta. JINX: Então vamos.','trust'],
   ['A Alexandra respondeu?','ALEXANDRA / RÁDIO: Estou tirando o último funcionário. Dirijam.','curious'],
   ['Você está ferido?','JINX: Só a placa do braço. Eu disse que aguentava.','trust']
  ]
 }];
})();
