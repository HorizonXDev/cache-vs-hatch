import React from 'react';
import { BookMarked, ArrowRight, ArrowDown, ExternalLink, Scale, FlaskConical, Target, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

/* ---------------------------------------------------------------------------
   RECENT RESEARCH — evidence for the KV-cache problem
   ---------------------------------------------------------------------------
   Citation numbering used across the whole section (and the references list):
     [1] KQ-SVD    (2026, AISTATS)
     [2] RocketKV  (2025, ICML)
     [3] NACL      (2024, ACL)
   The cards themselves are displayed chronologically (2024 → 2025 → 2026),
   exactly like the hackathon brief specifies. The papers are evidence about
   the KV-cache research problem — NOT proof that BDH is superior.
   ------------------------------------------------------------------------- */

type Accent = 'cyan' | 'purple' | 'pink';

interface ResearchPaper {
  /** Citation number used for [n] markers next to technical claims. */
  ref: number;
  name: string;
  year: number;
  venue: string;
  category: string;
  title: string;
  authors: string;
  problem: string;
  approach: string;
  result: string;
  simpleQuestion: string;
  whyItMatters: string;
  paperUrl: string;
  /** Secondary repository link — intentionally less prominent than the paper. */
  githubUrl?: string;
  accent: Accent;
}

/**
 * The three selected primary papers. Reported results are phrased exactly as
 * the authors reported them — they are not universal guarantees.
 */
const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    ref: 3,
    name: 'NACL',
    year: 2024,
    venue: 'ACL',
    category: 'KV-cache eviction',
    title: 'NACL: A General and Effective KV Cache Eviction Framework for LLMs at Inference Time',
    authors: 'Y. Chen, G. Wang, J. Shang, S. Cui, Z. Zhang, T. Liu, S. Wang, Y. Sun, D. Yu, H. Wu',
    problem:
      'The KV cache grows with context, and evicting tokens risks discarding information that attention still needs.',
    approach:
      'Combines Proxy-Tokens Eviction with Random Eviction to decide, at inference time, which cached tokens can be removed while reducing attention bias.',
    result:
      'Up to 5× KV-cache reduction while maintaining over 95% performance on the evaluated tasks — as reported by the authors.',
    simpleQuestion: 'Which cached tokens can we safely remove?',
    whyItMatters:
      'Shows researchers can shrink the conventional KV cache by selectively dropping cached information.',
    paperUrl: 'https://aclanthology.org/2024.acl-long.428/',
    githubUrl: 'https://github.com/PaddlePaddle/Research/tree/master/NLP/ACL2024-NACL',
    accent: 'cyan',
  },
  {
    ref: 2,
    name: 'RocketKV',
    year: 2025,
    venue: 'ICML',
    category: 'Compression + sparse attention',
    title: 'RocketKV: Accelerating Long-Context LLM Inference via Two-Stage KV Cache Compression',
    authors: 'P. Behnam, Y. Fu, R. Zhao, P.-A. Tsai, Z. Yu, A. Tumanov',
    problem:
      'Retaining the full cache makes long-context decoding expensive in both memory and the attention compute that reads it.',
    approach:
      'A training-free, two-stage strategy: coarse-grained permanent KV-cache eviction, followed by fine-grained top-k sparse attention.',
    result:
      'Up to 400× KV-cache compression, 3.7× end-to-end speedup, and 32.6% peak-memory reduction during decoding on an NVIDIA A100 — with negligible accuracy loss on the evaluated tasks, as reported by the authors.',
    simpleQuestion: 'Can we keep only the most useful KV information — and process less of it?',
    whyItMatters:
      'Shows conventional Transformer inference can store and process less KV information instead of always retaining the full cache.',
    paperUrl: 'https://proceedings.mlr.press/v267/behnam25a.html',
    githubUrl: 'https://github.com/NVlabs/RocketKV',
    accent: 'purple',
  },
  {
    ref: 1,
    name: 'KQ-SVD',
    year: 2026,
    venue: 'AISTATS',
    category: 'Low-rank attention compression',
    title: 'KQ-SVD: Compressing the KV Cache with Provable Guarantees on Attention Fidelity',
    authors: 'D. Lesens, B. T. Rakhshan, G. Rabusseau',
    problem:
      'Compressing keys or values on their own ignores that attention depends on query–key interactions — so the compressed cache may not match what attention actually uses.',
    approach:
      'Performs a low-rank decomposition directly on the attention matrix, with theoretical guarantees on attention fidelity.',
    result:
      'Evaluated on LLaMA and Mistral models, reporting higher-fidelity attention outputs under compression — as reported by the authors.',
    simpleQuestion: 'Can the important structure in attention be represented in fewer dimensions?',
    whyItMatters:
      'A third direction for reducing KV-cache cost: a more compact representation of what attention uses, rather than simply removing tokens.',
    paperUrl: 'https://proceedings.mlr.press/v300/lesens26a.html',
    accent: 'pink',
  },
];

/** Tailwind classes per accent — only classes covered by the light-theme audit. */
const ACCENT: Record<
  Accent,
  {
    cardBorder: string;
    cardHover: string;
    badge: string;
    rowLabel: string;
    quote: string;
    readButton: string;
    chipName: string;
  }
> = {
  cyan: {
    cardBorder: 'border-cyan-900/40',
    cardHover: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    rowLabel: 'text-cyan-400',
    quote: 'bg-cyan-950/40 border-cyan-500/20 text-cyan-200',
    readButton: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/20',
    chipName: 'text-cyan-300',
  },
  purple: {
    cardBorder: 'border-purple-500/30',
    cardHover: 'hover:border-purple-500/50 hover:shadow-purple-500/10',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    rowLabel: 'text-purple-400',
    quote: 'bg-purple-950/40 border-purple-500/20 text-purple-200',
    readButton: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20',
    chipName: 'text-purple-300',
  },
  pink: {
    cardBorder: 'border-pink-900/40',
    cardHover: 'hover:border-pink-500/50 hover:shadow-pink-500/10',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    rowLabel: 'text-pink-400',
    quote: 'bg-pink-950/40 border-pink-500/20 text-pink-200',
    readButton: 'bg-pink-600 hover:bg-pink-500 shadow-pink-600/20',
    chipName: 'text-pink-300',
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Inline citation marker, e.g. [1][2][3], placed directly beside claims. */
function Cite({ ids }: { ids: number[] }) {
  return (
    <sup className="font-mono text-[10px] font-bold text-cyan-400 whitespace-nowrap">
      {ids.map((id) => `[${id}]`).join('')}
    </sup>
  );
}

function PaperCard({ paper }: { paper: ResearchPaper }) {
  const a = ACCENT[paper.accent];
  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`group bg-slate-950/80 border ${a.cardBorder} rounded-2xl p-5 sm:p-6 flex flex-col space-y-4 shadow-xl ${a.cardHover} transition-all`}
    >
      {/* Metadata: year · venue + category */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold text-slate-400">
          {paper.year} · {paper.venue}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${a.badge}`}>
          {paper.category.toUpperCase()}
        </span>
      </div>

      {/* Title + authors */}
      <div className="space-y-2">
        <h3 className="font-bold text-white text-base sm:text-lg leading-snug">{paper.title}</h3>
        <p className="font-mono text-[11px] text-slate-400 leading-relaxed">{paper.authors}</p>
      </div>

      {/* Problem / Approach / Reported result */}
      <dl className="space-y-3 pt-4 border-t border-slate-800/80 text-xs sm:text-[13px] leading-relaxed">
        <div className="space-y-1">
          <dt className={`font-mono text-[10px] font-bold tracking-[0.14em] ${a.rowLabel}`}>PROBLEM</dt>
          <dd className="text-slate-300">{paper.problem}</dd>
        </div>
        <div className="space-y-1">
          <dt className={`font-mono text-[10px] font-bold tracking-[0.14em] ${a.rowLabel}`}>APPROACH</dt>
          <dd className="text-slate-300">
            {paper.approach} <Cite ids={[paper.ref]} />
          </dd>
        </div>
        <div className="space-y-1">
          <dt className={`font-mono text-[10px] font-bold tracking-[0.14em] ${a.rowLabel}`}>
            REPORTED RESULT
          </dt>
          <dd className="text-slate-300">
            {paper.result} <Cite ids={[paper.ref]} />
          </dd>
        </div>
      </dl>

      {/* In simple terms */}
      <blockquote className={`rounded-xl border px-3.5 py-2.5 font-mono text-xs ${a.quote}`}>
        “{paper.simpleQuestion}”
      </blockquote>

      {/* Why it matters */}
      <div className="space-y-1">
        <p className={`font-mono text-[10px] font-bold tracking-[0.14em] ${a.rowLabel}`}>WHY IT MATTERS</p>
        <p className="text-xs text-slate-400 leading-relaxed">{paper.whyItMatters}</p>
      </div>

      {/* Links — paper first, repository second (never more prominent) */}
      <div className="flex flex-wrap items-center gap-2.5 mt-auto pt-1">
        <a
          href={paper.paperUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read the paper “${paper.title}” (opens in a new tab)`}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-md ${a.readButton} transition-all`}
        >
          <span>Read Paper</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
        {paper.githubUrl && (
          <a
            href={paper.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open the ${paper.name} GitHub repository (opens in a new tab)`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 transition-all hover:border-cyan-500/50"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.article>
  );
}

interface RecentResearchProps {
  /** Switch back to the interactive simulator tab (links the research to the demo). */
  onOpenSimulator?: () => void;
}

export const RecentResearch: React.FC<RecentResearchProps> = ({ onOpenSimulator }) => {
  return (
    <div id="recent-research" className="space-y-10 sm:space-y-14">
      {/* ---------- 1. Section header ---------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="flex items-end gap-4 sm:gap-5 max-w-4xl">
          <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-xl shadow-cyan-500/10 shrink-0">
            <BookMarked className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <p className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-cyan-400 mb-2">
              Recent research
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              The evidence behind the KV-cache problem
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed mt-2">
              KV caching remains an active research problem. Recent work explores ways to compress,
              evict, and selectively represent cached information as context grows.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ---------- 2. Research context (citations beside claims) ---------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.18em] uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Why this is still an open problem
          </span>
          <span aria-hidden className="hidden sm:block h-px flex-1 max-w-xs bg-gradient-to-r from-cyan-500/40 to-transparent" />
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
          <p>
            Transformer inference can avoid recomputing the Key and Value representations of every
            previous token by caching them. But the cache grows with every token that enters the
            context — so long-context inference can create significant memory and bandwidth
            pressure. <Cite ids={[1, 2, 3]} />
          </p>
          <p>
            Recent work addresses this problem through token eviction, cache compression, sparse
            attention, and low-rank representations, each trying to reduce how much KV information
            must be stored or processed. <Cite ids={[1, 2, 3]} /> The three papers below demonstrate
            three different directions.
          </p>
        </div>
      </motion.section>

      {/* ---------- 3. Paper cards ---------- */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
      >
        {RESEARCH_PAPERS.map((paper) => (
          <PaperCard key={paper.ref} paper={paper} />
        ))}
      </motion.div>

      {/* ---------- 4. Three directions landscape ---------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.18em] uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30">
            The research landscape
          </span>
          <span aria-hidden className="hidden sm:block h-px flex-1 max-w-xs bg-gradient-to-r from-purple-500/40 to-transparent" />
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 sm:gap-3">
          {/* Baseline */}
          <div className="flex-1 min-w-0 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-center shadow-lg">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Baseline</p>
            <p className="font-bold text-white text-sm mt-1">Full KV cache</p>
            <p className="text-xs text-slate-400 mt-0.5">store every key &amp; value</p>
          </div>

          <ArrowDown className="mx-auto lg:hidden w-4 h-4 text-slate-500 shrink-0" />
          <ArrowRight className="hidden lg:block w-4 h-4 text-slate-500 shrink-0" />

          {/* Three directions — independent, not a lineage */}
          {RESEARCH_PAPERS.map((paper) => {
            const a = ACCENT[paper.accent];
            return (
              <React.Fragment key={paper.ref}>
                <div
                  className={`flex-1 min-w-0 rounded-2xl border ${a.cardBorder} bg-slate-950/90 p-4 text-center shadow-lg transition-all`}
                >
                  <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${a.rowLabel}`}>
                    {paper.name} · {paper.year}
                  </p>
                  <p className="font-bold text-white text-sm mt-1">{paper.simpleQuestion}</p>
                </div>
                {paper.ref !== RESEARCH_PAPERS[RESEARCH_PAPERS.length - 1].ref && (
                  <>
                    <ArrowDown className="mx-auto lg:hidden w-4 h-4 text-slate-500 shrink-0" />
                    <ArrowRight className="hidden lg:block w-4 h-4 text-slate-500 shrink-0" />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <p className="text-xs sm:text-sm text-slate-500 italic leading-relaxed max-w-4xl">
          Three directions for reducing KV-cache cost — independent lines of work, not a
          chronological lineage where each paper builds on the previous one. They all optimize the
          same thing: the conventional Transformer KV cache. <Cite ids={[1, 2, 3]} />
        </p>
      </motion.section>

      {/* ---------- 5. What does this mean for BDH? ---------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-7 sm:space-y-8 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.18em] uppercase bg-pink-500/10 text-pink-300 border border-pink-500/30">
            What does this mean for BDH?
          </span>
          <span aria-hidden className="hidden sm:block h-px flex-1 max-w-xs bg-gradient-to-r from-pink-500/40 to-transparent" />
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
          <p>
            Recent KV-cache research is largely focused on making the conventional Transformer
            approach more efficient: removing less useful tokens, compressing cached
            representations, using sparse attention, and approximating attention more cheaply to
            reduce memory pressure during long-context inference. <Cite ids={[1, 2, 3]} />
          </p>
          <p>
            That gives our project an important context. The papers above ask one kind of question;
            we ask another.
          </p>
        </div>

        {/* The two questions side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-cyan-800/60 space-y-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-cyan-400 font-semibold">
              <Scale className="w-4.5 h-4.5" />
              The conventional question
            </div>
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              “How can we make the KV cache smaller?”
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Eviction, compression, sparse attention, and low-rank representations all keep the
              growing cache and try to shrink its cost. <Cite ids={[1, 2, 3]} />
            </p>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-pink-800/60 space-y-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-pink-400 font-semibold">
              <Lightbulb className="w-4.5 h-4.5" />
              Our architectural question
            </div>
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              “What if a model maintains information over time in a fundamentally different way?”
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              BDH doesn&apos;t grow a cache at all — it re-tunes a fixed-size Hebbian memory
              matrix, trading perfect recall for a constant O(1) footprint.
            </p>
          </div>
        </div>

        {/* Honest academic boundary */}
        <div className="p-5 sm:p-7 rounded-2xl bg-amber-950/40 border border-amber-800/50 flex items-start gap-4 shadow-lg">
          <span className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 shrink-0">
            <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          </span>
          <div className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
            <span className="font-bold text-amber-300">An important boundary: </span>
            these papers are evidence about the KV-cache research problem — not experimental proof
            that BDH is superior. They describe how conventional Transformer KV caching is being
            optimized; they never compare against BDH. Our project uses that research context to
            explore a different architectural question: how BDH&apos;s approach to memory compares
            conceptually with a Transformer&apos;s growing cache.
          </div>
        </div>

        {/* Jump back into the demo */}
        {onOpenSimulator && (
          <div className="pt-1 text-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSimulator}
              className="px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-cyan-600/30 transition-all flex items-center justify-center gap-3 mx-auto"
            >
              <span>Revisit the live comparison in the simulator</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </motion.button>
            <p className="text-xs text-slate-400 mt-4 font-mono">
              See the memory trade-off computed live — with real, adjustable numbers.
            </p>
          </div>
        )}
      </motion.section>

      {/* ---------- 6. References ---------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-5"
      >
        <div className="flex items-end gap-4 sm:gap-5 max-w-4xl">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-xl shadow-purple-500/10 shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-purple-400 mb-2">
              Sources
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">References</h2>
          </div>
        </div>

        <ol className="space-y-3">
          {[
            {
              ref: 1,
              text: (
                <>
                  Lesens, D., Rakhshan, B. T., &amp; Rabusseau, G. (2026).{' '}
                  <em>KQ-SVD: Compressing the KV Cache with Provable Guarantees on Attention
                  Fidelity.</em>{' '}
                  Proceedings of the 29th International Conference on Artificial Intelligence and
                  Statistics, 300, 3556–3564.
                </>
              ),
              url: 'https://proceedings.mlr.press/v300/lesens26a.html',
            },
            {
              ref: 2,
              text: (
                <>
                  Behnam, P., Fu, Y., Zhao, R., Tsai, P.-A., Yu, Z., &amp; Tumanov, A. (2025).{' '}
                  <em>RocketKV: Accelerating Long-Context LLM Inference via Two-Stage KV Cache
                  Compression.</em>{' '}
                  Proceedings of the 42nd International Conference on Machine Learning, 267,
                  3358–3392.
                </>
              ),
              url: 'https://proceedings.mlr.press/v267/behnam25a.html',
            },
            {
              ref: 3,
              text: (
                <>
                  Chen, Y., Wang, G., Shang, J., Cui, S., Zhang, Z., Liu, T., Wang, S., Sun, Y., Yu,
                  D., &amp; Wu, H. (2024).{' '}
                  <em>NACL: A General and Effective KV Cache Eviction Framework for LLMs at
                  Inference Time.</em>{' '}
                  Proceedings of the 62nd Annual Meeting of the Association for Computational
                  Linguistics, 7913–7926.
                </>
              ),
              url: 'https://aclanthology.org/2024.acl-long.428/',
            },
          ].map((r) => (
            <li
              key={r.ref}
              className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-lg flex items-start gap-3 sm:gap-4"
            >
              <span className="px-2 py-0.5 rounded-lg font-mono text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0 mt-0.5">
                [{r.ref}]
              </span>
              <span className="min-w-0">
                {r.text}{' '}
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open reference [${r.ref}] (opens in a new tab)`}
                  className="text-purple-300 hover:text-purple-200 underline inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <span>paper</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </span>
            </li>
          ))}
        </ol>

        <p className="text-xs text-slate-500 italic leading-relaxed max-w-4xl">
          All three papers are primary peer-reviewed publications (ACL 2024, ICML 2025, AISTATS
          2026). Reported results are attributed to the authors&apos; own experiments — they are not
          universal guarantees across every model or hardware configuration.
        </p>
      </motion.section>
    </div>
  );
};

export default RecentResearch;