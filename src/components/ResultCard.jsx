function AnswerBlock({ question }) {
  return (
    <>
      <div className="answer-heading">
        <span aria-hidden="true" />
        <h2>正しい表現</h2>
        <span aria-hidden="true" />
      </div>
      <p className="correct-answer">{question.answerText}</p>
      {question.alternativeAnswers?.length ? (
        <div className="alternatives">
          <p>こちらも正解です</p>
          <ul>
            {question.alternativeAnswers.map((alternative) => (
              <li key={alternative}>{alternative}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="explanation">{question.explanation}</p>
    </>
  );
}

export function ResultCard({
  phase,
  question,
  answerLabel,
  onRetry,
  onReveal,
  onNext,
}) {
  const isCorrect = phase === "correct";
  const isIncorrect = phase === "incorrect";
  return (
    <section
      className={`quiz-card result-card result-${phase}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="result-title">
        <span className="result-icon" aria-hidden="true">
          {isCorrect ? "✓" : isIncorrect ? "×" : "!"}
        </span>
        <h1>
          {isCorrect
            ? "正解です！"
            : isIncorrect
              ? "もう一度考えてみましょう"
              : "答えはこちらです"}
        </h1>
      </div>

      <blockquote className="prompt-quote result-prompt">
        <span className="quote-mark quote-open" aria-hidden="true">
          “
        </span>
        <p>{question.prompt}</p>
        <span className="quote-mark quote-close" aria-hidden="true">
          ”
        </span>
      </blockquote>

      {isIncorrect ? (
        <>
          <div className="answer-heading answer-heading-user">
            <span aria-hidden="true" />
            <h2>あなたの回答</h2>
            <span aria-hidden="true" />
          </div>
          <p className="user-answer">{answerLabel}</p>
          <p className="retry-message">
            正解を見る前に、もう一度挑戦できます。
          </p>
          <div className="button-row">
            <button className="button button-secondary" onClick={onRetry}>
              やり直す
            </button>
            <button className="button button-primary" onClick={onReveal}>
              答えを見る
            </button>
          </div>
        </>
      ) : (
        <>
          <AnswerBlock question={question} />
          <button className="button button-primary next-button" onClick={onNext}>
            次のクイズへ
          </button>
        </>
      )}
    </section>
  );
}
