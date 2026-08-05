export function BrandHeader({ current, total }) {
  const progress = total === 0 ? 0 : (current / total) * 100;

  return (
    <header className="brand-header">
      <div className="brand-lockup" aria-label="敬語トレーニング">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" role="img">
            <circle cx="24" cy="24" r="21" />
            <path d="M24 34V14" />
            <path d="M23 19c-7-5-12-2-13 2 6 2 10 1 13-2Z" />
            <path d="M25 19c7-5 12-2 13 2-6 2-10 1-13-2Z" />
            <path d="M23 26c-6-4-10-1-11 3 5 1 8 0 11-3Z" />
            <path d="M25 26c6-4 10-1 11 3-5 1-8 0-11-3Z" />
          </svg>
        </span>
        <span>敬語トレーニング</span>
      </div>

      {current !== null ? (
        <div className="progress" aria-label={`進行状況 ${current} / ${total}`}>
          <span className="progress-label">
            {current} / {total}
          </span>
          <span className="progress-track" aria-hidden="true">
            <span
              className="progress-value"
              style={{ width: `${progress}%` }}
            />
          </span>
        </div>
      ) : null}
    </header>
  );
}
