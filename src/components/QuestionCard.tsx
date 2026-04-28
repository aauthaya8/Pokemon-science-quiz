import type { Question } from "../types";

interface Props {
  question: Question;
  onAnswer: (index: number) => void;
  disabled?: boolean;
}

export function QuestionCard({ question, onAnswer, disabled }: Props) {
  return (
    <div className="bg-kidParchment border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] p-4">
      <h2 className="text-lg font-mono font-bold text-slate-900 mb-3 leading-snug">
        {question.prompt}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            disabled={disabled}
            onClick={() => onAnswer(i)}
            className="bg-amber-100 hover:bg-yellow-200 text-slate-900 font-mono font-bold text-base py-3 px-3 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a] disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
