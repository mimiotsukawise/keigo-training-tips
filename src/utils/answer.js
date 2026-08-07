const WHITESPACE = /[\s　]+/gu;
const IGNORABLE_PUNCTUATION = /[、。，．,.!！?？:：;；・「」『』“”‘’"'（）()［］\[\]【】]/gu;

export function normalizeAnswer(value) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(WHITESPACE, "")
    .replace(IGNORABLE_PUNCTUATION, "");
}

export function isTextAnswerCorrect(answer, acceptedAnswers) {
  const normalizedAnswer = normalizeAnswer(answer);

  return acceptedAnswers.some(
    (acceptedAnswer) => normalizeAnswer(acceptedAnswer) === normalizedAnswer,
  );
}
