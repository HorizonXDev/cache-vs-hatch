import type { SimulationToken, TransformerState, BDHState, RetrievalResult, ToyStepState } from '../types/simulation';

const TOKEN_POOL = [
  { label: 'Apple', emoji: '🍎', color: '#ef4444' },
  { label: 'Banana', emoji: '🍌', color: '#eab308' },
  { label: 'Cat', emoji: '🐱', color: '#f97316' },
  { label: 'Dog', emoji: '🐶', color: '#84cc16' },
  { label: 'Star', emoji: '⭐️', color: '#facc15' },
  { label: 'Fire', emoji: '🔥', color: '#f97316' },
  { label: 'Moon', emoji: '🌙', color: '#38bdf8' },
  { label: 'Sun', emoji: '☀️', color: '#fbbf24' },
  { label: 'Diamond', emoji: '💎', color: '#06b6d4' },
  { label: 'Rocket', emoji: '🚀', color: '#a855f7' },
  { label: 'Heart', emoji: '💖', color: '#ec4899' },
  { label: 'Target', emoji: '🎯', color: '#10b981' },
  { label: 'Lightning', emoji: '⚡️', color: '#eab308' },
  { label: 'Brain', emoji: '🧠', color: '#f43f5e' },
  { label: 'Atom', emoji: '⚛️', color: '#6366f1' },
  { label: 'Robot', emoji: '🤖', color: '#64748b' },
  { label: 'Key', emoji: '🔑', color: '#d97706' },
  { label: 'Shield', emoji: '🛡️', color: '#3b82f6' },
  { label: 'Book', emoji: '📚', color: '#8b5cf6' },
  { label: 'Compass', emoji: '🧭', color: '#14b8a6' },
];

/**
 * Deterministic PRNG (mulberry32) so a given seed always produces the same
 * token vectors. This lets the "Regenerate" buttons meaningfully consume
 * the seed state instead of relying on Math.random().
 */
export function createSeededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a random normalized vector of size D (optionally seeded)
 */
export function generateRandomUnitVector(dim: number, rand: () => number = Math.random): number[] {
  const vec = Array.from({ length: dim }, () => (rand() - 0.5) * 2);
  const norm = Math.sqrt(vec.reduce((sum, x) => sum + x * x, 0)) || 1;
  return vec.map((x) => x / norm);
}

/**
 * Generate a sequence of N tokens with associated Key and Value vectors of dimension D.
 * Passing a seed makes the sequence deterministic (same seed -> same vectors).
 */
export function generateTokenSequence(sequenceLength: number, dim: number, seed: number = 42): SimulationToken[] {
  const rand = createSeededRandom(seed);
  const tokens: SimulationToken[] = [];
  for (let i = 0; i < sequenceLength; i++) {
    const item = TOKEN_POOL[i % TOKEN_POOL.length];
    const cycle = Math.floor(i / TOKEN_POOL.length);
    const label = cycle > 0 ? `${item.label} #${cycle + 1}` : item.label;

    tokens.push({
      id: i,
      label,
      emoji: item.emoji,
      color: item.color,
      keyVector: generateRandomUnitVector(dim, rand),
      valueVector: generateRandomUnitVector(dim, rand),
    });
  }
  return tokens;
}

/**
 * Compute Standard Transformer KV Cache State
 * Stores all key and value vectors explicitly in N x D matrices
 */
export function computeTransformerKVCache(tokens: SimulationToken[]): TransformerState {
  const keys = tokens.map((t) => [...t.keyVector]);
  const values = tokens.map((t) => [...t.valueVector]);
  return { keys, values };
}

/**
 * Compute BDH (Dragon Hatchling) Fast-Weight Synaptic Memory State
 * W_t = \lambda * W_{t-1} + key_t * value_t^T (Hebbian outer-product write)
 */
export function computeBDHSynapticMatrix(
  tokens: SimulationToken[],
  decayLambda: number,
  dim: number
): BDHState {
  let weightMatrix: number[][] = Array.from({ length: dim }, () => Array(dim).fill(0));
  const sparseActivations: number[][] = [];

  tokens.forEach((token) => {
    const k = token.keyVector;
    const v = token.valueVector;

    const outerProduct: number[][] = Array.from({ length: dim }, () => Array(dim).fill(0));
    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < dim; c++) {
        outerProduct[r][c] = k[r] * v[c];
      }
    }

    const newW: number[][] = Array.from({ length: dim }, () => Array(dim).fill(0));
    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < dim; c++) {
        newW[r][c] = decayLambda * weightMatrix[r][c] + outerProduct[r][c];
      }
    }
    weightMatrix = newW;

    const relu = k.map((x) => Math.max(0, x - 0.25));
    sparseActivations.push(relu);
  });

  const totalElements = dim * dim;
  const activeCount = Math.max(1, Math.round(totalElements * 0.05));
  const flattened: { r: number; c: number; absVal: number }[] = [];

  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      flattened.push({ r, c, absVal: Math.abs(weightMatrix[r][c]) });
    }
  }

  flattened.sort((a, b) => b.absVal - a.absVal);
  const activeNodeIndices = flattened.slice(0, activeCount).map((item) => item.r * dim + item.c);

  return {
    weightMatrix,
    sparseActivations,
    activeNodeIndices,
  };
}

/**
 * Compute Toy Model Step History for N tokens
 * Returns an array of ToyStepState for step-by-step stepping (t=0..N)
 */
export function computeToyModelStepHistory(
  tokens: SimulationToken[],
  decayLambda: number,
  dim: number
): ToyStepState[] {
  const history: ToyStepState[] = [];
  let currentW: number[][] = Array.from({ length: dim }, () => Array(dim).fill(0));
  const accumulatedKeys: number[][] = [];
  const accumulatedValues: number[][] = [];

  // Step 0: Initial empty state
  history.push({
    stepIndex: 0,
    currentToken: null,
    keyVector: Array(dim).fill(0),
    valueVector: Array(dim).fill(0),
    outerProduct: Array.from({ length: dim }, () => Array(dim).fill(0)),
    transformerKeys: [],
    transformerValues: [],
    bdhMatrix: Array.from({ length: dim }, () => Array(dim).fill(0)),
    activeSparseUnits: [],
    explanation: 'Initial empty state: Transformer KV tables are empty. BDH fast-weight matrix W is set to zero (all synapses resting).',
  });

  tokens.forEach((token, idx) => {
    const k = token.keyVector;
    const v = token.valueVector;

    // Accumulate Transformer keys/values
    accumulatedKeys.push([...k]);
    accumulatedValues.push([...v]);

    // Outer product k * v^T
    const outer: number[][] = Array.from({ length: dim }, () => Array(dim).fill(0));
    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < dim; c++) {
        outer[r][c] = k[r] * v[c];
      }
    }

    // Apply Hebbian write update: W_t = decay * W_{t-1} + outer
    const newW: number[][] = Array.from({ length: dim }, () => Array(dim).fill(0));
    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < dim; c++) {
        newW[r][c] = decayLambda * currentW[r][c] + outer[r][c];
      }
    }
    currentW = newW;

    // Find top active sparse units for this step
    const flattened: { index: number; absVal: number }[] = [];
    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < dim; c++) {
        flattened.push({ index: r * dim + c, absVal: Math.abs(newW[r][c]) });
      }
    }
    flattened.sort((a, b) => b.absVal - a.absVal);
    const activeUnits = flattened.slice(0, Math.max(1, Math.round(dim * dim * 0.1))).map((x) => x.index);

    history.push({
      stepIndex: idx + 1,
      currentToken: token,
      keyVector: k,
      valueVector: v,
      outerProduct: outer,
      transformerKeys: JSON.parse(JSON.stringify(accumulatedKeys)),
      transformerValues: JSON.parse(JSON.stringify(accumulatedValues)),
      bdhMatrix: JSON.parse(JSON.stringify(currentW)),
      activeSparseUnits: activeUnits,
      explanation: `Step ${idx + 1}: Token "${token.label}" ${token.emoji} arrives! Transformer appends Row #${idx + 1} to [K] and [V] tables. BDH adds outer-product matrix k·vᵀ to synaptic matrix W with decay λ=${decayLambda.toFixed(2)}.`,
    });
  });

  return history;
}

/**
 * Calculate Dot Product between two vectors
 */
export function dotProduct(v1: number[], v2: number[]): number {
  return v1.reduce((sum, x, i) => sum + x * v2[i], 0);
}

/**
 * Calculate Cosine Similarity between two vectors
 */
export function cosineSimilarity(v1: number[], v2: number[]): number {
  const dot = dotProduct(v1, v2);
  const norm1 = Math.sqrt(v1.reduce((s, x) => s + x * x, 0));
  const norm2 = Math.sqrt(v2.reduce((s, x) => s + x * x, 0));
  if (norm1 === 0 || norm2 === 0) return 0;
  return dot / (norm1 * norm2);
}

/**
 * Query both models for a selected token query
 */
export function queryModels(
  tokens: SimulationToken[],
  queryIndex: number,
  transformerState: TransformerState,
  bdhState: BDHState,
  decayLambda: number
): RetrievalResult {
  const queryToken = tokens[queryIndex];
  const queryKey = queryToken.keyVector;
  const targetValue = queryToken.valueVector;
  const N = tokens.length;
  const D = queryKey.length;

  // 1. TRANSFORMER RETRIEVAL
  const temp = 0.3;
  const rawScores = transformerState.keys.map((k) => dotProduct(queryKey, k) / temp);
  const maxScore = Math.max(...rawScores);
  const expScores = rawScores.map((s) => Math.exp(s - maxScore));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  const attentionWeights = expScores.map((e) => e / sumExp);

  const transformerOutput = Array(D).fill(0);
  for (let i = 0; i < N; i++) {
    for (let d = 0; d < D; d++) {
      transformerOutput[d] += attentionWeights[i] * transformerState.values[i][d];
    }
  }

  const transformerAccuracy = Math.min(100, Math.max(0, cosineSimilarity(transformerOutput, targetValue) * 100));

  // 2. BDH RETRIEVAL
  const bdhOutput = Array(D).fill(0);
  for (let r = 0; r < D; r++) {
    for (let c = 0; c < D; c++) {
      bdhOutput[r] += bdhState.weightMatrix[r][c] * queryKey[c];
    }
  }

  const bdhNorm = Math.sqrt(bdhOutput.reduce((sum, x) => sum + x * x, 0));
  const bdhOutputNormalized = bdhNorm > 0 ? bdhOutput.map((x) => x / bdhNorm) : bdhOutput;

  const bdhRawSim = cosineSimilarity(bdhOutputNormalized, targetValue);
  const bdhAccuracy = Math.min(100, Math.max(0, bdhRawSim * 100));

  const age = N - 1 - queryIndex;
  const decayFactor = Math.pow(decayLambda, age);

  let interferenceMagnitude = 0;
  for (let i = 0; i < N; i++) {
    if (i !== queryIndex) {
      const overlap = Math.abs(dotProduct(queryKey, tokens[i].keyVector));
      const distance = N - 1 - i;
      interferenceMagnitude += overlap * Math.pow(decayLambda, distance);
    }
  }

  return {
    queryIndex,
    queryToken,
    targetValue,
    transformerOutput,
    transformerAttention: attentionWeights,
    transformerAccuracy,
    bdhOutput: bdhOutputNormalized,
    bdhAccuracy,
    decayFactor,
    interferenceMagnitude,
  };
}

/**
 * Format bytes to readable string (KB, MB, GB)
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
