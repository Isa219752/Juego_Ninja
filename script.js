const figura = document.getElementById("figura");
const resultado = document.getElementById("resultado");
const puntosTexto = document.getElementById("puntos");
const vidasTexto = document.getElementById("vidas");
const recordTexto = document.getElementById("record");
const sonido = document.getElementById("sonido");
const btnModo = document.getElementById("modoBtn");
const btnReiniciar = document.getElementById("reiniciarBtn");
const btnActivarSonido = document.getElementById("activarSonido");

let inicioTiempo;
let puntos = 0;
let vidas = 3;
let delayMax = 3000;
let comboRapido = 0;
let juegoActivo = true;
let record = localStorage.getItem("record") || 9999;
recordTexto.textContent = record;

// Activar sonido en móviles
btnActivarSonido.addEventListener("click", () => {
  sonido.play().then(() => {
    sonido.pause(); // se detiene inmediatamente
    btnActivarSonido.style.display = "none";
  }).catch(err => {
    alert("Activa el volumen y toca la pantalla para habilitar el sonido");
    console.log("Error activando sonido:", err);
  });
});

function aparecerFigura() {
  if (!juegoActivo) return;

  const juego = document.getElementById("juego");
  const maxX = juego.clientWidth - 60;
  const maxY = juego.clientHeight - 60;
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  figura.style.left = x + "px";
  figura.style.top = y + "px";
  figura.style.display = "block";
  inicioTiempo = Date.now();

  setTimeout(() => {
    if (figura.style.display === "block" && juegoActivo) {
      perderVida();
    }
  }, 1800);
}

function iniciarJuego() {
  if (!juegoActivo) return;
  figura.style.display = "none";
  resultado.textContent = "";
  const delay = Math.random() * (delayMax - 1000) + 1000;
  setTimeout(aparecerFigura, delay);
}

figura.addEventListener("click", () => {
  if (!juegoActivo) return;

  const tiempo = Date.now() - inicioTiempo;
  figura.style.display = "none";
  resultado.textContent = `¡Tiempo: ${tiempo} ms!`;

  // Reproducir sonido
  try {
    sonido.currentTime = 0;
    sonido.play().catch(err => console.log("Sonido bloqueado:", err));
  } catch (e) {
    console.log("Error al reproducir sonido:", e);
  }

  puntos++;
  puntosTexto.textContent = puntos;
  delayMax = Math.max(1000, delayMax - 30);

  if (tiempo < record) {
    record = tiempo;
    localStorage.setItem("record", record);
    recordTexto.textContent = record;
  }

  if (tiempo < 300) {
    comboRapido++;
  } else {
    comboRapido = 0;
  }

  if (comboRapido >= 5) {
    resultado.textContent = "🏆 ¡Victoria Ninja! 5 reflejos rápidos 💨";
    juegoActivo = false;
    figura.style.display = "none";
    return;
  }

  setTimeout(iniciarJuego, 1000);
});

function perderVida() {
  figura.style.display = "none";
  vidas--;
  vidasTexto.textContent = vidas;
  resultado.textContent = "¡Perdiste una vida! ⚠️";
  comboRapido = 0;

  if (vidas <= 0) {
    resultado.textContent = `💀 Game Over | Puntos: ${puntos}`;
    juegoActivo = false;
    figura.style.display = "none";
    return;
  }

  setTimeout(iniciarJuego, 1000);
}

btnModo.addEventListener("click", () => {
  document.body.classList.toggle("modo-dia");
});

btnReiniciar.addEventListener("click", () => {
  puntos = 0;
  vidas = 3;
  comboRapido = 0;
  delayMax = 3000;
  juegoActivo = true;
  puntosTexto.textContent = puntos;
  vidasTexto.textContent = vidas;
  resultado.textContent = "Juego reiniciado 🔁";
  iniciarJuego();
});

window.onload = iniciarJuego;
