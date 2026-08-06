import { QuestionInput } from "./QuestionInput.jsx";

const iconByType = {
  rewrite: "✎",
  choice: "✓",
  "yes-no": "○",
};

export function QuestionCard({ question, answer, onAnswerChange, onSubmit }) {
  const hasAnswer = answer.trim().length > 0;

  return (
    <section className="quiz-card question-card" aria-labelledby="question-title">
      <div className="question-type">
        <span className="question-type-icon" aria-hidden="true">
          {iconByType[question.type]}
        </span>
        <h1 id="question-title">{question.typeLabel}</h1>
      </div>

      <p className="instruction">{question.instruction}</p>

      <blockquote className="prompt-quote">
        <span className="quote-mark quote-open" aria-hidden="true">
          “
        </span>
        <p>{question.prompt}</p>
        <span className="quote-mark quote-close" aria-hidden="true">
          ”
        </span>
      </blockquote>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <QuestionInput
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
          disabled={false}
        />
        <button className="button button-primary submit-button" disabled={!hasAnswer}>
          回答する
        </button>
      </form>
    </section>
  );
}
