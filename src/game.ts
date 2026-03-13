export type GameConfig = {
  min: number;
  max: number;
};

export type GameState = {
  drawnNumbers: number[];
  lastDraw?: number;
  previousDraw?: number;
};

type PersistedConfig = {
  version: 1;
  config: GameConfig;
};

type PersistedState = {
  version: 1;
  state: GameState;
};

const CONFIG_KEY = 'bingo:config';
const STATE_KEY = 'bingo:state';
export const NAME_KEY = 'bingo:nome';

export const DEFAULT_CONFIG: GameConfig = {
  min: 1,
  max: 90,
};

export function normalizeConfig(min: number, max: number): GameConfig {
  let safeMin = Number.isFinite(min) ? Math.floor(min) : DEFAULT_CONFIG.min;
  let safeMax = Number.isFinite(max) ? Math.floor(max) : DEFAULT_CONFIG.max;

  if (safeMin < 1) safeMin = 1;
  if (safeMax <= safeMin) {
    safeMax = safeMin + 1;
  }

  return { min: safeMin, max: safeMax };
}

export function createInitialState(): GameState {
  return {
    drawnNumbers: [],
  };
}

function rangeSize(config: GameConfig): number {
  return config.max - config.min + 1;
}

function drawRandomNumber(config: GameConfig, drawn: number[]): number | null {
  const total = rangeSize(config);
  if (drawn.length >= total) {
    return null;
  }

  let candidate: number;
  do {
    candidate =
      Math.floor(Math.random() * total) +
      config.min; /* uniform in [min, max] */
  } while (drawn.includes(candidate));

  return candidate;
}

export function drawNextNumber(
  state: GameState,
  config: GameConfig,
): GameState {
  const next = drawRandomNumber(config, state.drawnNumbers);
  if (next === null) {
    return state;
  }

  const newPrevious = state.lastDraw;

  return {
    drawnNumbers: [...state.drawnNumbers, next],
    lastDraw: next,
    previousDraw: newPrevious,
  };
}

export function saveConfig(config: GameConfig): void {
  try {
    const payload: PersistedConfig = { version: 1, config };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(payload));
  } catch {
    // ignore persistence errors
  }
}

export function loadConfig(fallback: GameConfig = DEFAULT_CONFIG): GameConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PersistedConfig>;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.config ||
      typeof parsed.config.min !== 'number' ||
      typeof parsed.config.max !== 'number'
    ) {
      return fallback;
    }
    return normalizeConfig(parsed.config.min, parsed.config.max);
  } catch {
    return fallback;
  }
}

export function saveState(state: GameState): void {
  try {
    const payload: PersistedState = { version: 1, state };
    localStorage.setItem(STATE_KEY, JSON.stringify(payload));
  } catch {
    // ignore persistence errors
  }
}

export function loadState(config: GameConfig): GameState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (!parsed || typeof parsed !== 'object' || !parsed.state) {
      return createInitialState();
    }

    const drawn =
      Array.isArray(parsed.state.drawnNumbers) &&
      parsed.state.drawnNumbers.every(
        (n) => typeof n === 'number' && n >= config.min && n <= config.max,
      )
        ? parsed.state.drawnNumbers
        : [];

    const last = parsed.state.lastDraw;
    const previous = parsed.state.previousDraw;

    const state: GameState = {
      drawnNumbers: drawn,
    };

    if (typeof last === 'number') {
      state.lastDraw = last;
    }
    if (typeof previous === 'number') {
      state.previousDraw = previous;
    }

    return state;
  } catch {
    return createInitialState();
  }
}

export function clearGame(): void {
  try {
    localStorage.removeItem(CONFIG_KEY);
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(NAME_KEY);
  } catch {
    // ignore
  }
}

