/**
 * Personalize as frases, as imagens e as reações aqui.
 * Para trocar por uma nova figurinha, salve o PNG em assets/
 * e altere o campo "imagem" da frase correspondente.
 */
const falas = [
  { texto: 'Que terrível!', icone:'😱', imagem:'assets/que-terrivel.webp', estilo:'terrivel', reacao:'DRAMA TOTAL', extra:'💔', extra2:'💥', titulo:'Ai, que terrível!', descricao:'A atriz principal desse drama é ela.' },
  { texto: 'E como vai ser isso?', icone:'🤔', imagem:'assets/como-vai-ser-isso.webp', estilo:'duvida', reacao:'MIL PERGUNTAS', extra:'❔', extra2:'💭', titulo:'A pergunta do milhão', descricao:'Eu explico, e lá vem outra pergunta. 😅' },
  { texto: 'Que mistério é esse?', icone:'🕵️‍♀️', imagem:'assets/que-misterio-e-esse.webp', estilo:'misterio', reacao:'MODO DETETIVE', extra:'🔎', extra2:'❓', titulo:'Investigação iniciada', descricao:'Até Sherlock Holmes ficaria curioso.' },
  { texto: 'Oxe!', icone:'😳', imagem:'assets/oxe.webp', estilo:'oxe', reacao:'OXENTE!', extra:'⚡', extra2:'😯', titulo:'O clássico do Nordeste', descricao:'Uma palavrinha, mil significados!' },
  { texto: 'Ave Maria!', icone:'🙏', imagem:'assets/ave-maria.webp', estilo:'ave', reacao:'MEU DEUS!', extra:'✨', extra2:'😮', titulo:'O famoso “Ave Maria”', descricao:'A reação oficial de tudo que acontece.' },
  { texto: 'Vou me embora!', icone:'🏃‍♀️', imagem:'assets/vou-me-embora.webp', estilo:'tchau', reacao:'SAINDO DE CENA', extra:'💨', extra2:'🚪', titulo:'Ela ameaçou ir embora', descricao:'Mas eu já tô sentindo saudade. 🥹' },
  { texto: 'Errou, hihihi!', icone:'🤭', imagem:'assets/errou-hihihi.webp', estilo:'errou', reacao:'RISADINHA MALIGNA', extra:'😂', extra2:'✨', titulo:'A risadinha da vitória', descricao:'Ela errou? Nunca! Quem erra sou eu.' },
  { texto: 'Te peguei!', icone:'😏', imagem:'assets/te-peguei.webp', estilo:'peguei', reacao:'PEGADINHA!', extra:'🎯', extra2:'💗', titulo:'Caí direitinho!', descricao:'Ela já tá rindo antes de contar.' },
];

const $ = (id) => document.getElementById(id);
const el = {
  stage: $('stage'), image: $('stickerImage'), stickerButton: $('stickerButton'),
  bubble: $('speechBubble'), bubbleText: $('bubbleText'), bubbleEmoji: $('bubbleEmoji'),
  step: $('stepCounter'), emotion: $('emotionLabel'), emotionEmoji: $('emotionEmoji'),
  burstLeft: $('burstLeft'), burstRight: $('burstRight'),
  title: $('playTitle'), hint: $('playHint'), playInfoIcon: $('playInfoIcon'),
  list: $('phraseGrid'), particles: $('heartParticles'),
  nextButton: $('nextButton'), randomButton: $('randomButton'), soundButton: $('soundButton'),
  dialog: $('secretDialog'), secretButton: $('secretButton'), closeDialog: $('closeDialog'), letterOk: $('letterOk')
};
let atual = 0;
let visitas = new Set([0]);
let ultimoClique = 0;

function construirCartoes() {
  falas.forEach((fala, indice) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'phrase-card';
    botao.setAttribute('aria-pressed', indice === 0 ? 'true' : 'false');
    botao.setAttribute('aria-label', `Ver reação: ${fala.texto}`);
    const mini = document.createElement('img');
    mini.className = 'phrase-mini';
    mini.src = fala.imagem;
    mini.alt = '';
    mini.loading = 'eager';
    mini.decoding = 'async';
    const texto = document.createElement('span');
    texto.className = 'phrase-name';
    texto.textContent = fala.texto;
    botao.append(mini, texto);
    botao.addEventListener('click', () => mudarFrase(indice));
    el.list.appendChild(botao);
  });
}

function dispararCoracoes() {
  const caracteres = ['💗', '💖', '♡', '✨', '💕'];
  for (let i=0; i<7; i++) {
    const part = document.createElement('span');
    part.className = 'heart-particle';
    part.textContent = caracteres[(i + atual) % caracteres.length];
    part.style.left = `${19 + Math.random()*65}%`;
    part.style.bottom = `${Math.random()*13}%`;
    part.style.animationDelay = `${Math.random()*.16}s`;
    part.style.setProperty('--drift', `${Math.random()*110-55}px`);
    el.particles.appendChild(part);
    part.addEventListener('animationend', () => part.remove(), {once:true});
    setTimeout(() => part.remove(), 1400);
  }
}

function mudarFrase(indice) {
  if(!Number.isInteger(indice) || indice < 0 || indice >= falas.length) return;
  atual = indice;
  visitas.add(indice);
  const f = falas[indice];
  el.stage.className = `stage stage--${f.estilo} stage-changing`;
  // Reinicia a animação de entrada sem reconstruir os elementos.
  void el.stage.offsetWidth;
  el.image.src = f.imagem;
  el.image.alt = `Figurinha ilustrada da namorada dizendo: ${f.texto}`;
  el.bubbleText.textContent = f.texto;
  el.bubbleEmoji.textContent = f.icone;
  el.step.textContent = `${String(indice + 1).padStart(2, '0')} / ${String(falas.length).padStart(2, '0')}`;
  el.emotion.lastChild.textContent = ` ${f.reacao}`;
  el.emotionEmoji.textContent = f.icone;
  el.burstLeft.textContent = f.extra;
  el.burstRight.textContent = f.extra2;
  el.playInfoIcon.textContent = f.icone;
  el.title.textContent = f.titulo;
  el.hint.textContent = f.descricao;
  el.list.querySelectorAll('.phrase-card').forEach((card,i)=>card.setAttribute('aria-pressed',String(i===indice)));
  clearTimeout(ultimoClique);
  ultimoClique = setTimeout(() => el.stage.classList.remove('stage-changing'), 430);
  dispararCoracoes();
  if(visitas.size === falas.length) {
    $('secretButton').innerHTML = 'Todas desbloqueadas! 💌';
  }
}

el.stickerButton.addEventListener('click', () => mudarFrase((atual + 1) % falas.length));
el.nextButton.addEventListener('click', () => mudarFrase((atual + 1) % falas.length));
el.randomButton.addEventListener('click', () => {
  const numero = Math.floor(Math.random() * (falas.length-1));
  mudarFrase((atual + 1 + numero) % falas.length);
});
el.soundButton.addEventListener('click', () => {
  if(!('speechSynthesis' in window)) {
    el.soundButton.title='Seu navegador não oferece leitura de voz';
    return;
  }
  window.speechSynthesis.cancel();
  const frase = new SpeechSynthesisUtterance(falas[atual].texto);
  frase.lang = 'pt-BR';
  frase.rate = .95;
  frase.pitch = 1.2;
  const vozes = window.speechSynthesis.getVoices();
  const brasileira = vozes.find(v=>v.lang.toLowerCase().replace('_','-')==='pt-br');
  if(brasileira) frase.voice = brasileira;
  window.speechSynthesis.speak(frase);
});
function fecharCartinha(){ el.dialog.close(); }
el.secretButton.addEventListener('click', () => { el.dialog.showModal(); });
el.closeDialog.addEventListener('click', fecharCartinha);
el.letterOk.addEventListener('click', fecharCartinha);
el.dialog.addEventListener('click', (e) => { if(e.target === el.dialog) fecharCartinha(); });
document.addEventListener('keydown', (e) => {
  if(el.dialog.open) return;
  if(e.key === 'ArrowRight') mudarFrase((atual+1)%falas.length);
  else if(e.key === 'ArrowLeft') mudarFrase((atual+falas.length-1)%falas.length);
});
construirCartoes();
