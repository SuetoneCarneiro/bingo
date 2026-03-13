import {
  DEFAULT_CONFIG,
  NAME_KEY,
  createInitialState,
  normalizeConfig,
  saveConfig,
  saveState,
} from './game';
import { setCurrentYear } from './utils';

function setupInstructionsDialog() {
  const instructionsButton = document.getElementById('instrucoes');
  const dialog = document.querySelector('dialog');
  const closeButton = dialog?.querySelector('button') ?? null;

  if (!instructionsButton || !dialog || !(dialog instanceof HTMLDialogElement)) {
    return;
  }

  instructionsButton.addEventListener('click', () => {
    dialog.showModal();
  });

  closeButton?.addEventListener('click', () => {
    dialog.close();
  });
}

function setupPlayButton() {
  const playButton = document.getElementById('jogar');
  const nameInput = document.getElementById('nome-bingo') as
    | HTMLInputElement
    | null;
  const minInput = document.getElementById('range-min') as
    | HTMLInputElement
    | null;
  const maxInput = document.getElementById('range-max') as
    | HTMLInputElement
    | null;

  if (!playButton || !nameInput || !minInput || !maxInput) {
    return;
  }

  playButton.addEventListener('click', () => {
    const nomeBruto = nameInput.value.trim();
    const nome = nomeBruto.length > 0 ? nomeBruto : 'Bingo sem nome';

    const minValue = Number.parseInt(minInput.value, 10);
    const maxValue = Number.parseInt(maxInput.value, 10);

    const config = normalizeConfig(
      Number.isNaN(minValue) ? DEFAULT_CONFIG.min : minValue,
      Number.isNaN(maxValue) ? DEFAULT_CONFIG.max : maxValue,
    );

    if (config.min < 1 || config.max <= config.min) {
      alert('Por favor, informe um intervalo de números válido.');
      return;
    }

    try {
      localStorage.setItem(NAME_KEY, nome);
      saveConfig(config);
      const initialState = createInitialState();
      saveState(initialState);
    } catch {
      // Se o localStorage falhar, o jogo ainda abre, apenas sem persistência
    }

    globalThis.location.href = '/jogo.html';
  });
}

function bootstrap() {
  setCurrentYear('year-index');
  setupInstructionsDialog();
  setupPlayButton();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

