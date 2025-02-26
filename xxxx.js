// Array de notas disponibles
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Variable para almacenar la nota seleccionada
let selectedNote = null;
let timerInterval = null; // Variable para el cronómetro

// Función para reproducir sonido
function playSound(note) {
  const audio = new Audio(`sounds/${note}.mp3`); // Asegúrate de tener los archivos de audio
  audio.play();
}

// Mostrar mensajes
function showMessage(message, isCorrect) {
  const messageBox = document.getElementById('message');
  messageBox.textContent = message;
  messageBox.style.color = isCorrect ? 'green' : 'red'; // Color verde si es correcto, rojo si no
}

// Hacer que las teclas reproduzcan sonidos y creen notas arrastrables
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('mousedown', () => {
    const note = key.getAttribute('data-note');
    selectedNote = note; // Guardar la nota seleccionada
    playSound(note);
    showMessage(`Has seleccionado la nota: ${note}`, true);
  });
});

// Función para crear un elemento de nota
function createNoteElement(note, inPanel = false) {
  const noteElement = document.createElement('div');
  noteElement.classList.add('note');
  noteElement.textContent = note;

  if (inPanel) {
    // Si la nota está en el panel, no es arrastrable y suena al hacer clic
    noteElement.draggable = false;
    noteElement.addEventListener('click', () => {
      playSound(note); // Reproducir sonido
      if (selectedNote === note) {
        showMessage("¡Correcto! La nota coincide.", true);
      } else {
        showMessage("Incorrecto, la nota no coincide.", false);
      }
    });
  } else {
    // Si la nota es arrastrable
    noteElement.draggable = true;
    noteElement.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', note);
    });
  }

  return noteElement;
}

// Inicializar el panel con notas aleatorias
function populatePanelWithRandomNotes(panel, count) {
  for (let i = 0; i < count; i++) {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    const noteElement = createNoteElement(randomNote, true); // Notas del panel no son arrastrables
    panel.appendChild(noteElement);
  }
}

// Panel de destino
const panel = document.getElementById('panel');
panel.addEventListener('dragover', (event) => {
  event.preventDefault();
});
panel.addEventListener('drop', (event) => {
  event.preventDefault();
  
  // Obtener la nota arrastrada
  const note = event.dataTransfer.getData('text/plain');
  
  // Crear el elemento de nota en el panel
  const droppedNote = createNoteElement(note, true); // Notas en el panel no son arrastrables
  panel.appendChild(droppedNote);
});

// Llenar el panel con 5 notas aleatorias al cargar la página
populatePanelWithRandomNotes(panel, 5);

// Cronómetro de 2 minutos
function startTimer(duration) {
  const timerDisplay = document.getElementById('timer');
  let timeRemaining = duration;

  // Actualizar el cronómetro cada segundo
  timerInterval = setInterval(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timeRemaining--;

    // Detener el cronómetro cuando llegue a cero
    if (timeRemaining < 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "¡Tiempo agotado!";
    }
  }, 1000);
}

// Botón para iniciar el cronómetro
document.getElementById('startTimerButton').addEventListener('click', () => {
  clearInterval(timerInterval); // Reiniciar si ya había un cronómetro en marcha
  startTimer(120); // 2 minutos
});
