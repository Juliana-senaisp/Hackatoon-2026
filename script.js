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

// Tema único deste hackathon — usado para registrar no cadastro do aluno.
const TEMA_UNICO = 'Planejador de Treino e Dieta';

// Código de acesso: validado contra o documento config/acesso no Firestore.
// O campo "codigo" desse documento é o que os alunos vão digitar.
const gateForm = document.getElementById('gate-form');
const gateError = document.getElementById('gate-error');
const gateBox = document.getElementById('theme-gate');
const unlocked = document.getElementById('theme-unlocked');
const gateSubmitBtn = gateForm.querySelector('.gate-submit');

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
      await db.collection('inscricoes').add({
        nome: nome,
        codigoUsado: codigoDigitado,
        tema: TEMA_UNICO,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
      });

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
    gateSubmitBtn.textContent = 'Revelar tema';
  }
});