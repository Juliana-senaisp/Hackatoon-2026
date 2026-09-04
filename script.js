// Contagem regressiva até o início do hackathon
const alvo = new Date('2026-09-18T08:00:00');

function atualizarContagem(){
  const agora = new Date();
  const diff = alvo - agora;
  const nota = document.getElementById('cd-note');

  if (diff <= 0){
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-min').textContent = '00';
    document.getElementById('cd-sec').textContent = '00';
    nota.textContent = 'O hackathon já começou!';
    return;
  }

  const dias = Math.floor(diff / (1000*60*60*24));
  const horas = Math.floor((diff / (1000*60*60)) % 24);
  const min = Math.floor((diff / (1000*60)) % 60);
  const seg = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = String(dias).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(horas).padStart(2,'0');
  document.getElementById('cd-min').textContent = String(min).padStart(2,'0');
  document.getElementById('cd-sec').textContent = String(seg).padStart(2,'0');
}
atualizarContagem();
setInterval(atualizarContagem, 1000);

// Código de acesso: validado contra o documento config/acesso no Firestore.
// O campo "codigo" desse documento é o que os alunos vão digitar.
const gateForm = document.getElementById('gate-form');
const gateError = document.getElementById('gate-error');
const gateBox = document.getElementById('theme-gate');
const unlocked = document.getElementById('theme-unlocked');
const gateSubmitBtn = gateForm.querySelector('.gate-submit');

let participanteId = null; // guarda o registro do aluno para salvar o tema depois

gateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('gate-name').value.trim();
  const codigoDigitado = document.getElementById('gate-code').value.trim();

  gateSubmitBtn.disabled = true;
  gateSubmitBtn.textContent = 'Verificando...';
  gateError.classList.remove('show');

  try {
    const configDoc = await db.collection('config').doc('acesso').get();
    const codigoValido = configDoc.exists ? configDoc.data().codigo : null;

    if (codigoValido && codigoDigitado.toUpperCase() === codigoValido.toUpperCase()){
      const novoRegistro = await db.collection('inscricoes').add({
        nome: nome,
        codigoUsado: codigoDigitado,
        tema: null,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
      });
      participanteId = novoRegistro.id;

      gateBox.style.display = 'none';
      unlocked.classList.add('show');
    } else {
      gateError.textContent = 'Código inválido. Confira com a organização e tente novamente.';
      gateError.classList.add('show');
    }
  } catch (err) {
    console.error(err);
    gateError.textContent = 'Não foi possível verificar o código agora. Tente novamente em instantes.';
    gateError.classList.add('show');
  } finally {
    gateSubmitBtn.disabled = false;
    gateSubmitBtn.textContent = 'Desbloquear temas';
  }
});

// Seleção de tema — salva a escolha no registro do aluno no Firestore
const cards = document.querySelectorAll('.theme-card');
const resumo = document.getElementById('theme-summary');

function selecionarTema(card){
  cards.forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  resumo.innerHTML = 'Tema selecionado: <strong>' + card.dataset.theme + '</strong>';

  if (participanteId){
    db.collection('inscricoes').doc(participanteId).update({
      tema: card.dataset.theme,
      atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(err => console.error('Não foi possível salvar o tema escolhido:', err));
  }
}

cards.forEach(card => {
  card.addEventListener('click', () => selecionarTema(card));

  // Acessibilidade: como o card virou um <div>, precisa responder também
  // ao teclado (Enter / Espaço), já que não é mais um <button> nativo.
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      selecionarTema(card);
    }
  });
});