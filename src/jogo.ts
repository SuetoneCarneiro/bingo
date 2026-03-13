import {
  DEFAULT_CONFIG,
  GameConfig,
  GameState,
  NAME_KEY,
  clearGame,
  drawNextNumber,
  loadConfig,
  loadState,
  saveState,
} from './game';
import { setCurrentYear } from './utils';

function getElements() {
  const numeroSorteado = document.getElementById(
    'numero-sorteado',
  ) as HTMLElement;
  const numeroAnterior = document.getElementById(
    'numero-anterior',
  ) as HTMLElement;
  
  const sortearButton = document.getElementById('sortear') as HTMLButtonElement
  const checarButton = document.getElementById('checar') as HTMLButtonElement;
  const limparButton = document.getElementById('limpar-jogo') as HTMLButtonElement;
  const nomeHeading = document.getElementById('nome') as HTMLElement;

  const dialog = document.querySelector('.pagina-sorteados') as
    | HTMLDialogElement;
  const closeDialogButton = document.querySelector(
    '.botao-modal',
  ) as HTMLButtonElement;
  const listaNumeros = document.getElementById(
    'lista-numeros',
  ) as HTMLElement;
  const qtdNumeros = document.getElementById(
    'qtd-numeros',
  ) as HTMLElement;

  return {
    numeroSorteado,
    numeroAnterior,
    sortearButton,
    checarButton,
    limparButton,
    nomeHeading,
    dialog,
    closeDialogButton,
    listaNumeros,
    qtdNumeros,
  };
}

function formatNumber(n: number): string {
  return n > 9 ? `${n}` : `0${n}`;
}

function renderState(
  state: GameState,
  config: GameConfig,
  els: ReturnType<typeof getElements>,
) {
  if (els.numeroSorteado) {
    if (typeof state.lastDraw === 'number') {
      els.numeroSorteado.textContent = formatNumber(state.lastDraw);
      els.numeroSorteado.setAttribute(
        'class',
        'border border-primary rounded-circle p-3',
      );
    } else {
      els.numeroSorteado.textContent = '';
      els.numeroSorteado.removeAttribute('class');
    }
  }

  if (els.numeroAnterior) {
    if (typeof state.previousDraw === 'number') {
      els.numeroAnterior.textContent = `Último número sorteado: ${formatNumber(
        state.previousDraw,
      )}`;
    } else {
      els.numeroAnterior.textContent = '';
    }
  }

  if (els.sortearButton) {
    const total = config.max - config.min + 1;
    if (state.drawnNumbers.length >= total) {
      els.sortearButton.disabled = true;
      els.sortearButton.textContent = 'Todos os números foram sorteados';
    } else {
      els.sortearButton.disabled = false;
      els.sortearButton.textContent = 'Sortear';
    }
  }
}

function setupFromStorage() {
  const els = getElements();

  setCurrentYear('year-jogo');

  if (els.nomeHeading) {
    const nomeSalvo = localStorage.getItem(NAME_KEY);
    els.nomeHeading.textContent = nomeSalvo || 'Bingo sem nome';
  }

  let config: GameConfig = loadConfig(DEFAULT_CONFIG);
  let state: GameState = loadState(config);

  renderState(state, config, els);

  if (els.sortearButton) {
    els.sortearButton.addEventListener('click', () => {
      const total = config.max - config.min + 1;
      if (state.drawnNumbers.length >= total) {
        renderState(state, config, els);
        return;
      }

      const finalState = drawNextNumber(state, config);

      if (!els.numeroSorteado) {
        state = finalState;
        saveState(state);
        renderState(state, config, els);
        return;
      }

      const intervalMs = 25;
      const durationMs = 1000;
      let elapsed = 0;

      if (els.sortearButton) {
        els.sortearButton.disabled = true;
      }

      const spinInterval = globalThis.setInterval(() => {
        elapsed += intervalMs;
        const random =
          Math.floor(Math.random() * total) + config.min;
        els.numeroSorteado.textContent = formatNumber(random);
        els.numeroSorteado.setAttribute(
          'class',
          'border border-primary rounded-circle p-3',
        );

        if (elapsed >= durationMs) {
          globalThis.clearInterval(spinInterval);
          state = finalState;
          saveState(state);
          renderState(state, config, els);
        }
      }, intervalMs);
    });
  }

  if (els.checarButton && els.dialog && els.listaNumeros && els.qtdNumeros) {
    els.checarButton.addEventListener('click', () => {
      const sorted = [...state.drawnNumbers]
        .filter((n) => typeof n === 'number')
        .sort((a, b) => a - b);

      const show = sorted.map((n) => formatNumber(n)).join(', ');
      els.listaNumeros.textContent = show;

      if (sorted.length > 0) {
        els.qtdNumeros.textContent = `${
          sorted.length
        } números foram sorteados até o momento... Guenta coração...`;
      } else {
        els.qtdNumeros.textContent = 'Nenhum número foi sorteado ainda.';
      }

      els.dialog.showModal();
    });
  }

  if (els.closeDialogButton && els.dialog) {
    els.closeDialogButton.addEventListener('click', () => {
      els.dialog.close();
    });
  }

  if (els.limparButton) {
    els.limparButton.addEventListener('click', () => {
      clearGame();
      globalThis.location.href = '/';
    });
  }
}

function bootstrap() {
  setupFromStorage();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

