import type { Question } from "../types";

interface Props {
  question: Question;
  onAnswer: (index: number) => void;
  disabled?: boolean;
}

export function QuestionCard({ question, onAnswer, disabled }: Props) {
  return (
    <div className="bg-white rounded-chunky p-6 shadow-chunky">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {question.prompt}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            disabled={disabled}
            onClick={() => onAnswer(i)}
            className="bg-kidAccent text-white text-lg font-bold py-4 px-6 rounded-chunky shadow-chunky active:translate-y-1 active:shadow-none disabled:opacity-50"
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
