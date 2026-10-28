import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Lock } from 'lucide-react';

export const StealthDecoy = ({ isOpen, onExit }) => {
  const [notes, setNotes] = useState(
    `# AP Biology: Cellular Respiration & ATP Synthesis
Date: October 2026 | Unit 3 Research Notes

1. Glycolysis (Cytoplasm):
- Glucose (6C) is split into two molecules of Pyruvate (3C).
- Net yield: 2 ATP + 2 NADH.
- Anaerobic process (does not require oxygen).

2. Krebs Cycle / Citric Acid Cycle (Mitochondrial Matrix):
- Acetyl-CoA combines with oxaloacetate to form citrate.
- Decarboxylation reactions release CO2.
- Generates high-energy electron carriers: 6 NADH, 2 FADH2, and 2 ATP per glucose.

3. Oxidative Phosphorylation & Electron Transport Chain (Inner Membrane):
- Electrons from NADH and FADH2 are transferred through Complexes I-IV.
- Proton gradient drives ATP Synthase rotor (chemiosmosis).
- Oxygen acts as the terminal electron acceptor, forming H2O.
- Theoretical total yield: ~30-32 ATP per glucose molecule.`
  );

  useEffect(() => {
    if (isOpen) {
      const originalTitle = document.title;
      document.title = 'Google Docs - Cellular Respiration Notes';

      const handleKey = (e) => {
        if (e.key === ']' || e.key === 'Escape') {
          onExit();
        }
      };
      window.addEventListener('keydown', handleKey);

      return () => {
        document.title = originalTitle;
        window.removeEventListener('keydown', handleKey);
      };
    }
  }, [isOpen, onExit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white text-slate-900 flex flex-col font-sans select-text">
      {/* Google Docs style top bar */}
      <div className="border-b border-slate-200 px-4 py-2 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">
                Cellular Respiration Notes - Unit 3
              </span>
              <span className="text-xs text-slate-400">Saved to Drive</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-0.5">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Format</span>
              <span>Tools</span>
              <span>Help</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Private to only me</span>
          </div>
          <button
            onClick={onExit}
            title="Return to Arcade (Shortcut: press ] or Esc)"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded shadow-sm transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Arcade (])</span>
          </button>
        </div>
      </div>

      {/* Document Sheet */}
      <div className="flex-1 bg-slate-100 overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="bg-white w-full max-w-3xl min-h-[900px] shadow-md border border-slate-200 p-8 md:p-12 text-slate-800 rounded-sm">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-full min-h-[750px] border-0 outline-none resize-none font-mono text-sm leading-relaxed text-slate-800 bg-transparent"
          />
        </div>
      </div>

      {/* Discrete bottom bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-1.5 text-[11px] text-slate-400 flex justify-between items-center">
        <span>Word count: 184 · Last edit was 2 minutes ago</span>
        <span>Press <kbd className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-600">]</kbd> to restore portal</span>
      </div>
    </div>
  );
};
