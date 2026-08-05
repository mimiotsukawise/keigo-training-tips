const TRAILING_PUNCTUATION = /[。．.]+$/u;

export function normalizeAnswer(value) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/[\s　]+/gu, "")
    .replace(TRAILING_PUNCTUATION, "");
}

export function isTextAnswerCorrect(answer, acceptedAnswers) {
  const normalizedAnswer = normalizeAnswer(answer);

  return acceptedAnswers.some(
    (acceptedAnswer) => normalizeAnswer(acceptedAnswer) === normalizedAnswer,
  );
}
