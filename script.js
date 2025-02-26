// Array de notas disponibles
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Variables globales
let selectedNote = null;
let timerInterval = null;
let hits = 0; // Contador de aciertos

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

// Actualizar el contador de aciertos en pantalla
function updateHitsDisplay() {
  const hitsDisplay = document.getElementById('hits');
  hitsDisplay.textContent = `Aciertos: ${hits}`;
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
        hits++; // Incrementar aciertos
        updateHitsDisplay(); // Actualizar pantalla
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

// Inicializar el panel con notas únicas del arreglo `notes`
function populatePanelWithRandomNotes(panel, count) {
  // Borrar contenido anterior
  panel.innerHTML = '';

  // Hacer una copia del arreglo de notas
  const availableNotes = [...notes];

  // Generar notas únicas hasta completar el panel
  for (let i = 0; i < count; i++) {
    if (availableNotes.length === 0) break; // Evitar errores si se piden más notas de las disponibles

    const randomIndex = Math.floor(Math.random() * availableNotes.length);
    const randomNote = availableNotes.splice(randomIndex, 1)[0]; // Eliminar la nota seleccionada del arreglo

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

// Llenar el panel con 5 notas únicas al cargar la página
populatePanelWithRandomNotes(panel, 12);

// Cronómetro de 0 a 2 minutos
function startTimer() {
  const timerDisplay = document.getElementById('timer');
  let timeElapsed = 0;
  const duration = 120; // 2 minutos (en segundos)

  // Reiniciar aciertos al iniciar el cronómetro
  hits = 0;
  updateHitsDisplay();

  // Detener cualquier cronómetro en ejecución
  clearInterval(timerInterval);

  // Actualizar el cronómetro cada segundo
  timerInterval = setInterval(() => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timeElapsed++;

    // Cuando se alcanza el límite de 2 minutos
    if (timeElapsed > duration) {
      clearInterval(timerInterval);
      showMessage(`¡Cronómetro finalizado! Aciertos totales: ${hits}`, true);
      
      // Reiniciar automáticamente el cronómetro después de 1 segundo
      setTimeout(() => {
        showMessage("Cronómetro reiniciado", true);
        startTimer();
      }, 1000);
    }
  }, 1000);
}

// Botón para iniciar el cronómetro
document.getElementById('startTimerButton').addEventListener('click', () => {
  startTimer();
});
