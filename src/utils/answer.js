const WHITESPACE = /[\s　]+/gu;
const IGNORABLE_PUNCTUATION = /[、。，．,.!！?？:：;；・「」『』“”‘’"'（）()［］\[\]【】]/gu;

export function normalizeAnswer(value) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(WHITESPACE, "")
    .replace(IGNORABLE_PUNCTUATION, "");
}

function includesAny(value, expressions) {
  return expressions.some((expression) =>
    value.includes(normalizeAnswer(expression)),
  );
}

export function isTextAnswerCorrect(
  answer,
  acceptedAnswers,
  gradingRules = null,
) {
  const normalizedAnswer = normalizeAnswer(answer);

  const matchesAcceptedAnswer = acceptedAnswers.some(
    (acceptedAnswer) => normalizeAnswer(acceptedAnswer) === normalizedAnswer,
  );

  if (matchesAcceptedAnswer) {
    return true;
  }

  if (!gradingRules) {
    return false;
  }

  if (includesAny(normalizedAnswer, gradingRules.forbiddenExpressions ?? [])) {
    return false;
  }

  return gradingRules.requiredGroups.every((group) =>
    includesAny(normalizedAnswer, group),
  );
}
