export function QuestionInput({ question, answer, onAnswerChange, disabled }) {
  if (question.type === "rewrite") {
    return (
      <label className="rewrite-field">
        <span className="sr-only">回答</span>
        <textarea
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
          placeholder="ここに回答を入力してください"
          rows="4"
          disabled={disabled}
        />
      </label>
    );
  }

  return (
    <fieldset className={`choices choices-${question.type}`} disabled={disabled}>
      <legend className="sr-only">回答を一つ選択してください</legend>
      {question.options.map((option, index) => (
        <label
          className={`choice ${answer === option.id ? "choice-selected" : ""}`}
          key={option.id}
        >
          <input
            type="radio"
            name={`answer-${question.id}`}
            value={option.id}
            checked={answer === option.id}
            onChange={(event) => onAnswerChange(event.target.value)}
          />
          <span className="choice-marker" aria-hidden="true">
            {question.type === "choice" ? String.fromCharCode(65 + index) : ""}
          </span>
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
