export function CompletionCard({ correctCount, revealedCount, total, onRestart }) {
  return (
    <section className="quiz-card completion-card" aria-labelledby="complete-title">
      <span className="completion-symbol" aria-hidden="true">
        ✓
      </span>
      <h1 id="complete-title">20問、おつかれさまでした！</h1>
      <p className="completion-message">
        カスタマーサポートのメールで迷いやすい敬語を、最後まで確認できました。
      </p>
      <dl className="completion-summary">
        <div>
          <dt>正解した問題</dt>
          <dd>
            {correctCount} <span>/ {total}</span>
          </dd>
        </div>
        <div>
          <dt>答えを見た問題</dt>
          <dd>{revealedCount}</dd>
        </div>
      </dl>
      <button className="button button-primary" onClick={onRestart}>
        もう一度挑戦する
      </button>
    </section>
  );
}
