const fs = require('fs');

const xml = fs.readFileSync('.docx_work/word/document.xml', 'utf8');
const chunks = xml.split('</w:p>');

// index -> replacement
// type 'qa' = bold question run + br + body run; 'body' = single body run
const R = {
  11: { type: 'qa', q: 'What is this project about?', a: 'This project compares how Dragon Hatchling (BDH) is more efficient than the KV-Caching architecture, explores Key-Value (KV) Caching during autoregressive generation, and introduces BDH as an alternative approach to processing and maintaining information. The accompanying website provides visual, interactive explanations to make these concepts easier to understand.' },
  12: { type: 'qa', q: 'What problem does this project address?', a: 'Transformer-based models need substantial computation and memory when processing long sequences, and during autoregressive generation, previously processed information must stay available for future tokens. Our project explains this memory challenge and how KV Cache and BDH approach processing and retaining information.' },
  14: { type: 'body', a: 'A Transformer is a neural-network architecture that processes sequences using attention mechanisms. It is central to NLP (Natural Language Processing) because it relates tokens efficiently and processes information in parallel during training.' },
  15: { type: 'qa', q: 'Why are Transformers important?', a: 'Transformers form the foundation of modern large language models like ChatGPT and Llama. Their attention mechanism lets the model determine how tokens relate to one another, making Transformers effective for understanding and generating sequences.' },
  17: { type: 'body', a: 'A token is a unit of text processed by a language model. Depending on the tokenizer, it can represent a word, part of a word, punctuation, or another piece of text.' },
  19: { type: 'body', a: 'Neural networks operate on numerical representations. Tokenization converts text into manageable units that are mapped to numbers and processed by the model.' },
  21: { type: 'body', a: 'Autoregressive generation produces a sequence one token at a time, using previously generated tokens as context to predict the next token.' },
  25: { type: 'body', a: 'Self-attention lets a model determine how strongly tokens in a sequence influence one another, identifying which parts of the context are relevant when processing a particular token.' },
  27: { type: 'body', a: 'Recomputing information that has already been calculated wastes computation, and storing long contexts consumes substantial memory.' },
  30: { type: 'body', a: 'KV Cache is a Transformer-inference technique that stores previously computed Key and Value representations so they can be reused when generating subsequent tokens.' },
  32: { type: 'body', a: 'It is called KV Cache because the cache stores the Keys (K) and Values (V) of previous tokens.' },
  36: { type: 'body', a: 'The model computes Key and Value representations and stores them in the cache. When the next token \u201cbecause\u201d is generated, it reuses the stored K/V information instead of recomputing K/V for all previous tokens, so the cache grows as tokens are generated.' },
  51: { type: 'body', a: 'No. KV Cache reduces repeated computation, but the cache itself consumes memory: cached K/V information grows with context and generated tokens.' },
  53: { type: 'body', a: 'Less recomputation \u2194 more memory: KV Cache trades extra storage for improved inference efficiency.' },
  55: { type: 'body', a: 'Dragon Hatchling (BDH) is an architecture that explores a different approach to sequence processing and information retention than conventional Transformers. Instead of storing the Keys and Values of all previous tokens, BDH offers an alternative architectural perspective on how information is processed and retained.' },
  57: { type: 'body', a: 'KV Cache is a Transformer-inference mechanism that stores and reuses previously computed Key and Value representations. BDH is a different architectural approach to processing sequential information and maintaining useful internal state.' },
  81: { type: 'body', a: 'AI applications increasingly work with long conversations, documents, codebases, and other large contexts. Efficiently processing and retaining relevant information affects inference speed, memory requirements, scalability, and overall efficiency.' },
  86: { type: 'body', a: 'The project provides a structured, interactive way to learn about Transformer-based AI memory, KV Caching, and BDH. Instead of equations or research terminology, the website lets users visualize the underlying ideas and compare the approaches.' },
  88: { type: 'body', a: 'Understanding how AI systems process and retain information is essential for understanding modern language-model architectures. Transformers use attention to relate tokens, while KV Cache improves autoregressive inference by reusing computed Key and Value representations. BDH offers a different architectural perspective on sequential processing. Our interactive website makes these complex concepts accessible, visual, and understandable for learners.' },
};

const esc = (s) => s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

function firstRunRPr(chunk, wantBold) {
  const runs = [...chunk.matchAll(/<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g)].map((m) => m[1]);
  const hasBold = (r) => /<w:b\/>|<w:b\s/.test(r);
  const want = wantBold ? hasBold : (r) => !hasBold(r);
  const found = runs.find((r) => want(r) && r.includes('<w:rPr>'));
  const fallback = runs.find((r) => r.includes('<w:rPr>'));
  const src = (found || fallback);
  if (!src) return '<w:rPr><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr>';
  const m = src.match(/<w:rPr>[\s\S]*?<\/w:rPr>/);
  return m ? m[0] : '<w:rPr><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr>';
}

for (const idxStr of Object.keys(R)) {
  const idx = Number(idxStr);
  const chunk = chunks[idx];
  if (chunk === undefined) throw new Error('no chunk ' + idx);

  const pOpen = chunk.match(/^\s*<w:p\b[^>]*>/);
  if (!pOpen) throw new Error('no w:p open tag in ' + idx);
  const pPr = chunk.match(/<w:pPr>[\s\S]*?<\/w:pPr>/);

  const bodyRPr = firstRunRPr(chunk, false);
  const qRPr = firstRunRPr(chunk, true);

  const spec = R[idx];
  let runs = '';
  if (spec.type === 'qa') {
    runs =
      '<w:r>' + qRPr + '<w:t>' + esc(spec.q) + '</w:t></w:r>' +
      '<w:r>' + qRPr.replace('<w:b/><w:bCs/>', '').replace('<w:b/>', '') + '<w:br/></w:r>' +
      '<w:r>' + bodyRPr + '<w:t xml:space="preserve">' + esc(spec.a) + '</w:t></w:r>';
  } else {
    runs = '<w:r>' + bodyRPr + '<w:t xml:space="preserve">' + esc(spec.a) + '</w:t></w:r>';
  }

  chunks[idx] = pOpen[0] + (pPr ? pPr[0] : '') + runs + '</w:p>';
}

const out = chunks.join('</w:p>');
fs.writeFileSync('.docx_work/word/document.xml', out);

// verify: clean text + word count
const paras = out.split('</w:p>');
const text = paras.map((p) => p.replace(/<[^>]+>/g, '')).join('\n')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const words = text.split(/\s+/).filter(Boolean).length;
console.log('NEW WORD COUNT:', words);