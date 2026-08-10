const WHITESPACE = /[\s　]+/gu;
const IGNORABLE_PUNCTUATION = /[、。，．,.!！?？:：;；・「」『』“”‘’"'（）()［］\[\]【】]/gu;
const LEADING_CUSHION_WORDS = [
  "恐れ入りますが",
  "誠に恐れ入りますが",
  "大変恐れ入りますが",
  "恐縮でございますが",
  "誠に恐縮でございますが",
  "大変恐縮でございますが",
  "差し支えなければ",
  "お手数をおかけいたしますが",
  "誠にお手数をおかけいたしますが",
  "大変お手数をおかけいたしますが",
  "申し訳ございませんが",
  "誠に申し訳ございませんが",
  "大変申し訳ございませんが",
];

export function normalizeAnswer(value) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(WHITESPACE, "")
    .replace(IGNORABLE_PUNCTUATION, "");
}

function removeLeadingCushionWord(value) {
  const cushionWord = LEADING_CUSHION_WORDS
    .map(normalizeAnswer)
    .sort((left, right) => right.length - left.length)
    .find((candidate) => value.startsWith(candidate));

  return cushionWord ? value.slice(cushionWord.length) : value;
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
  const answerWithoutCushionWord = removeLeadingCushionWord(normalizedAnswer);

  const matchesAcceptedAnswer = acceptedAnswers.some(
    (acceptedAnswer) => {
      const normalizedAcceptedAnswer = normalizeAnswer(acceptedAnswer);

      return (
        normalizedAcceptedAnswer === normalizedAnswer ||
        normalizedAcceptedAnswer === answerWithoutCushionWord
      );
    },
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
