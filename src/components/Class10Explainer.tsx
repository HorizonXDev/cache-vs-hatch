import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, BookOpen, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export const Class10Explainer: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const quizQuestions = [
    {
      id: 1,
      question: 'Imagine an AI model reads a 100,000-page encyclopedia. Which memory system will fill up your computer memory and crash?',
      options: [
        { text: 'Standard Transformer KV Cache (Stores a new page for every word)', correct: true },
        { text: 'Pathway BDH Synaptic Memory (Stores memories in fixed synapses)', correct: false },
      ],
      explanation: 'Correct! Standard Transformers store every single key and value in a growing notebook. For 100,000 pages, the notebook becomes so huge it crashes GPU RAM!',
    },
    {
      id: 2,
      question: 'What happens to the physical size of the Pathway BDH Synaptic Grid as you feed it 1,000 new words?',
      options: [
        { text: 'It stays 100% fixed at a constant size (O(1) footprint)', correct: true },
        { text: 'It grows 1,000 times larger', correct: false },
      ],
      explanation: 'Spot on! BDH works like your brain—the size of the brain matrix never grows. It only adjusts synaptic weight tensions inside a fixed grid!',
    },
    {
      id: 3,
      question: 'Why does Pathway BDH activate only ~5% of its brain units at any moment?',
      options: [
        { text: 'To prevent different memories from mixing up and save compute energy', correct: true },
        { text: 'Because 95% of the nodes are broken', correct: false },
      ],
      explanation: 'Awesome! High biological sparsity (~5%) ensures different words light up different light switches, preventing crosstalk memory corruption!',
    },
  ];

  const handleSelectOption = (qId: number, optIdx: number) => {
    const updated = { ...selectedAnswers, [qId]: optIdx };
    setSelectedAnswers(updated);

    if (Object.keys(updated).length === quizQuestions.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const correctCount = Object.entries(selectedAnswers).reduce((count, [qId, optIdx]) => {
    const q = quizQuestions.find((item) => item.id === Number(qId));
    if (q && q.options[optIdx]?.correct) return count + 1;
    return count;
  }, 0);

  return (
    <div className="space-y-6">
      {/* 2 Visual Metaphor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metaphor 1: The Backpack vs The Mind */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3.5 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-slate-800/80 pb-2.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Metaphor 1: The Heavy Backpack vs The Brain</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Think of a <strong className="text-cyan-300">Standard Transformer</strong> as a student taking notes in class. Every single word spoken by the teacher gets written on a new page in a physical notebook.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1 shadow-inner">
            <div className="text-cyan-300 font-bold font-mono">🎒 The Result:</div>
            <div>After 10 words: Light notebook.</div>
            <div>After 100,000 words: Notebook is so heavy your backpack tears apart (GPU RAM Crash)!</div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In contrast, <strong className="text-pink-300">Pathway BDH</strong> acts like human memory. Your brain doesn't grow a bigger head for every new word—it simply tunes existing brain connections (synapses)!
          </p>
        </motion.div>

        {/* Metaphor 2: The 100 Light Switches */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3.5 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 text-pink-400 font-bold text-sm border-b border-slate-800/80 pb-2.5">
            <Lightbulb className="w-4 h-4 text-pink-400" />
            <span>Metaphor 2: The 100 Light Switches (~5% Sparsity)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Imagine a room with 100 light switches. If you flipped ALL 100 switches every time you learned a word, the room would get blindingly hot and all memories would blur together.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1 shadow-inner font-mono">
            <div className="text-pink-300 font-bold">⚡ BDH's Secret Trick:</div>
            <div>For "Apple 🍎", BDH only flips switches #5 and #12.</div>
            <div>For "Banana 🍌", BDH only flips switches #80 and #91.</div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Because only <strong className="text-yellow-300 font-bold">5% of switches flip at a time</strong>, memories never collide and computing stays super fast!
          </p>
        </motion.div>
      </div>

      {/* Interactive 3-Question AI Mini-Quiz */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-md shadow-yellow-500/10">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Interactive AI Knowledge Challenge (3-Question Mini-Quiz)
              </h3>
              <p className="text-xs text-slate-400">Test what you learned about Transformers vs Pathway BDH!</p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow-sm">
            Score: {correctCount} / 3 Stars ⭐️
          </div>
        </div>

        {/* Quiz Questions */}
        <div className="space-y-4">
          {quizQuestions.map((q) => {
            const userAns = selectedAnswers[q.id];
            const hasAnswered = userAns !== undefined;
            const isCorrect = hasAnswered && q.options[userAns]?.correct;

            return (
              <div key={q.id} className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-3.5 shadow-inner">
                <div className="font-semibold text-xs sm:text-sm text-slate-200 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-cyan-300 border border-slate-700 flex items-center justify-center text-xs font-mono shrink-0 shadow-sm">
                    Q{q.id}
                  </span>
                  <span className="pt-0.5">{q.question}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, idx) => {
                    const isSelected = userAns === idx;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectOption(q.id, idx)}
                        className={`p-3.5 rounded-xl text-xs text-left border font-medium transition-all shadow-sm ${
                          isSelected
                            ? opt.correct
                              ? 'bg-emerald-950 text-emerald-200 border-emerald-500 font-bold ring-2 ring-emerald-500/40'
                              : 'bg-red-950 text-red-200 border-red-500 font-bold'
                            : 'bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 border-slate-800'
                        }`}
                      >
                        {opt.text}
                      </motion.button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-xl text-xs leading-relaxed flex items-start gap-2.5 shadow-md ${
                      isCorrect ? 'bg-emerald-950/70 border border-emerald-800/80 text-emerald-200' : 'bg-amber-950/70 border border-amber-800/80 text-amber-200'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>{q.explanation}</div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {Object.keys(selectedAnswers).length === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-center space-y-2.5 shadow-2xl shadow-emerald-950/40"
          >
            <div className="text-3xl">🎉 🏆 ⭐️</div>
            <h4 className="font-extrabold text-white text-base sm:text-lg">
              Congratulations! You scored {correctCount} / 3 Stars!
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200">
              You now understand how Pathway BDH eliminates the KV Cache Memory Wall using biological fast weights!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

