export interface SimulationToken {
  id: number;
  label: string;
  emoji: string;
  color: string;
  keyVector: number[];
  valueVector: number[];
}

export interface TransformerState {
  keys: number[][]; // N x D
  values: number[][]; // N x D
}

export interface BDHState {
  weightMatrix: number[][]; // D x D
  sparseActivations: number[][]; // N x D (non-negative sparse activations)
  activeNodeIndices: number[]; // active sparse unit indices (~5% active)
}

export interface RetrievalResult {
  queryIndex: number;
  queryToken: SimulationToken;
  targetValue: number[];
  
  // Transformer result
  transformerOutput: number[];
  transformerAttention: number[];
  transformerAccuracy: number; // cosine similarity (~100%)
  
  // BDH result
  bdhOutput: number[];
  bdhAccuracy: number; // cosine similarity (decayed/interfered)
  decayFactor: number; // lambda^(N - 1 - queryIndex)
  interferenceMagnitude: number;
}

export interface ToyStepState {
  stepIndex: number; // 0..N
  currentToken: SimulationToken | null;
  keyVector: number[];
  valueVector: number[];
  outerProduct: number[][]; // D x D outer product for current token
  transformerKeys: number[][]; // keys accumulated up to step t
  transformerValues: number[][]; // values accumulated up to step t
  bdhMatrix: number[][]; // W_t after writing current token
  activeSparseUnits: number[];
  explanation: string;
}

export interface LLMModelPreset {
  name: string;
  layers: number;
  heads: number;
  dim: number;
  precisionBits: number;
}

export const LLM_PRESETS: Record<string, LLMModelPreset> = {
  toy: { name: 'Toy Educational Model', layers: 4, heads: 4, dim: 16, precisionBits: 16 },
  llama8b: { name: 'Llama 3 (8B Params)', layers: 32, heads: 32, dim: 128, precisionBits: 16 },
  llama70b: { name: 'Llama 3 (70B Params)', layers: 80, heads: 64, dim: 128, precisionBits: 16 },
};
