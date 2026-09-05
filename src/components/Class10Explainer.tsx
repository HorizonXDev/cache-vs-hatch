import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, BookOpen, Lightbulb } from 'lucide-react';

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
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-slate-800 pb-2">
            <BookOpen className="w-4 h-4" />
            <span>Metaphor 1: The Heavy Backpack vs The Brain</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Think of a <strong className="text-cyan-300">Standard Transformer</strong> as a student taking notes in class. Every single word spoken by the teacher gets written on a new page in a physical notebook.
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="text-cyan-300 font-bold">🎒 The Result:</div>
            <div>After 10 words: Light notebook.</div>
            <div>After 100,000 words: Notebook is so heavy your backpack tears apart (GPU RAM Crash)!</div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In contrast, <strong className="text-pink-300">Pathway BDH</strong> acts like human memory. Your brain doesn't grow a bigger head for every new word—it simply tunes existing brain connections (synapses)!
          </p>
        </div>

        {/* Metaphor 2: The 100 Light Switches */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-sm border-b border-slate-800 pb-2">
            <Lightbulb className="w-4 h-4" />
            <span>Metaphor 2: The 100 Light Switches (~5% Sparsity)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Imagine a room with 100 light switches. If you flipped ALL 100 switches every time you learned a word, the room would get blindingly hot and all memories would blur together.
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="text-pink-300 font-bold">⚡ BDH's Secret Trick:</div>
            <div>For "Apple 🍎", BDH only flips switches #5 and #12.</div>
            <div>For "Banana 🍌", BDH only flips switches #80 and #91.</div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Because only <strong className="text-yellow-300 font-bold">5% of switches flip at a time</strong>, memories never collide and computing stays super fast!
          </p>
        </div>
      </div>

      {/* Interactive 3-Question AI Mini-Quiz */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Interactive AI Knowledge Challenge (3-Question Mini-Quiz)
              </h3>
              <p className="text-xs text-slate-400">Test what you learned about Transformers vs Pathway BDH!</p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
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
              <div key={q.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="font-semibold text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-cyan-400 border border-slate-700 flex items-center justify-center text-xs font-mono shrink-0">
                    Q{q.id}
                  </span>
                  <span>{q.question}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, idx) => {
                    const isSelected = userAns === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(q.id, idx)}
                        className={`p-3 rounded-lg text-xs text-left border font-medium transition-all ${
                          isSelected
                            ? opt.correct
                              ? 'bg-emerald-950 text-emerald-200 border-emerald-500 font-bold ring-2 ring-emerald-500/40'
                              : 'bg-red-950 text-red-200 border-red-500 font-bold'
                            : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                      isCorrect ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200' : 'bg-amber-950/60 border border-amber-800 text-amber-200'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>{q.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {Object.keys(selectedAnswers).length === 3 && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <div className="text-2xl">🎉 🏆 ⭐️</div>
            <h4 className="font-extrabold text-white text-base">
              Congratulations! You scored {correctCount} / 3 Stars!
            </h4>
            <p className="text-xs text-emerald-200">
              You now understand how Pathway BDH eliminates the KV Cache Memory Wall using biological fast weights!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
