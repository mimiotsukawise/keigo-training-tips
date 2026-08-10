import assert from "node:assert/strict";
import test from "node:test";
import { isTextAnswerCorrect, normalizeAnswer } from "../utils/answer.js";
import { questions } from "./questions.js";

function grade(questionId, answer) {
  const question = questions.find(({ id }) => id === questionId);

  return isTextAnswerCorrect(
    answer,
    question.acceptedAnswers,
    question.gradingRules,
  );
}

test("承認済みの20問が重複なしで登録されている", () => {
  assert.equal(questions.length, 20);
  assert.equal(new Set(questions.map(({ id }) => id)).size, 20);
});

test("すべての問題に正解と解説がある", () => {
  for (const question of questions) {
    assert.ok(question.answerText, `${question.id}: answerText`);
    assert.ok(question.explanation, `${question.id}: explanation`);

    if (question.type === "rewrite") {
      assert.ok(question.acceptedAnswers.length > 0, `${question.id}: answers`);
    } else {
      assert.ok(question.correctAnswer, `${question.id}: correctAnswer`);
      assert.ok(question.options.length >= 2, `${question.id}: options`);
    }
  }
});

test("q08は自分側の行為に使う謙譲語を選ぶ選択問題である", () => {
  const question = questions.find(({ id }) => id === "q08");

  assert.equal(question.type, "choice");
  assert.equal(question.correctAnswer, "a");
  assert.equal(
    question.options.find(({ id }) => id === question.correctAnswer)?.label,
    "添付ファイルを拝見いたしました。",
  );
});

test("q15は自社担当者の行為を高めない書き換え問題である", () => {
  const question = questions.find(({ id }) => id === "q15");

  assert.equal(question.type, "rewrite");
  assert.ok(
    question.acceptedAnswers.includes(
      "弊社の担当者から、お客様へご連絡いたします。",
    ),
  );
  assert.ok(!question.acceptedAnswers.some((answer) => answer.includes("されます")));
});

test("q19はお客様の行為に謙譲語を使わない書き換え問題である", () => {
  const question = questions.find(({ id }) => id === "q19");

  assert.equal(question.type, "rewrite");
  assert.ok(
    question.acceptedAnswers.includes(
      "ご不明な点がございましたら、担当者にお尋ねください。",
    ),
  );
  assert.ok(!question.acceptedAnswers.some((answer) => answer.includes("お伺い")));
});

test("書き換え問題には複数の自然な正解候補がある", () => {
  const minimumAnswerCounts = {
    q02: 9,
    q03: 5,
    q04: 5,
    q06: 5,
    q09: 4,
    q12: 7,
    q13: 4,
    q15: 8,
    q19: 7,
  };

  for (const question of questions.filter(({ type }) => type === "rewrite")) {
    assert.ok(
      question.acceptedAnswers.length >= minimumAnswerCounts[question.id],
      `${question.id}: acceptedAnswers`,
    );
  }
});

test("書き換え問題の正解候補に表記ゆれだけの重複がない", () => {
  for (const question of questions.filter(({ type }) => type === "rewrite")) {
    const normalizedAnswers = question.acceptedAnswers.map(normalizeAnswer);

    assert.equal(
      new Set(normalizedAnswers).size,
      normalizedAnswers.length,
      `${question.id}: duplicate acceptedAnswers`,
    );
  }
});

const gradingExamples = {
  q02: {
    correct: [
      "確認のため、お名前を伺ってもよろしいですか。",
      "お名前を教えていただけますでしょうか。",
      "確認のため、お名前をお聞かせいただけますか。",
      "お名前をお知らせいただけますでしょうか。",
      "恐れ入りますが、お名前を伺ってもよろしいでしょうか。",
    ],
    incorrect: [
      "お名前を頂戴してもよろしいでしょうか。",
      "お名前をお伺いしてもよろしいでしょうか。",
      "お名前を伺われてもよろしいでしょうか。",
      "確認のため、お名前をお願いします。",
      "お名前を確認いたします。",
    ],
  },
  q03: {
    correct: [
      "弊社のサービスをご利用になる場合は、本人確認が必要です。",
      "弊社のサービスを利用される際は、本人確認が必要です。",
      "弊社のサービスをお使いになる場合、本人確認が必要です。",
      "弊社サービスのご利用には、本人確認が必要です。",
      "当サービスをご利用の場合は、本人確認が必要となります。",
    ],
    incorrect: [
      "弊社のサービスをご利用される場合は、本人確認が必要です。",
      "弊社のサービスをご利用になられる際は、本人確認が必要です。",
      "お客様が弊社のサービスを利用いたす場合は、本人確認が必要です。",
      "弊社のサービスをご利用になる場合があります。",
      "本人確認が必要です。",
    ],
  },
  q04: {
    correct: [
      "ファイルサイズが大きい場合、書類をご提出いただけません。",
      "ファイルサイズが大きい場合は、書類をご提出いただくことができません。",
      "ファイルサイズが大きいと、書類を提出できません。",
      "書類は、ファイルサイズが大きい場合には提出することができません。",
      "ファイルサイズが大きすぎる場合、書類をご提出いただけません。",
    ],
    incorrect: [
      "ファイルサイズが大きい場合は、書類をご提出できません。",
      "ファイルサイズが大きい場合、お客様は書類をご提出いたしかねます。",
      "ファイルサイズが大きい場合でも、書類をご提出いただけます。",
      "ファイルサイズが大きい場合は、書類を確認できません。",
      "書類をご提出いただけません。",
    ],
  },
  q06: {
    correct: [
      "いただいたご意見は、担当部署に申し伝えます。",
      "お寄せいただいたご意見を、担当部署へ申し伝えます。",
      "いただきましたご意見は、関係部署に申し伝えいたします。",
      "貴重なご意見として、担当部署に申し伝えます。",
      "ご意見につきましては、担当部署へ確かに申し伝えます。",
    ],
    incorrect: [
      "いただいたご意見は、担当部署にお伝えします。",
      "ご意見を担当部署へお伝えいたします。",
      "いただいたご意見は、担当部署に申し上げます。",
      "担当部署がご意見を申し伝えます。",
      "いただいたご意見を確認いたします。",
    ],
  },
  q09: {
    correct: [
      "本人確認書類がない場合は、住民票をご提出いただく必要があります。",
      "本人確認書類をお持ちでない場合は、住民票のご提出をお願いいたします。",
      "本人確認書類をご用意できない場合、住民票をご提出ください。",
      "本人確認書類がない場合は、住民票をご提出くださいますようお願いいたします。",
      "本人確認書類をお持ちでない場合には、住民票をご用意ください。",
    ],
    incorrect: [
      "本人確認書類がない場合は、住民票をご提出いただく形になります。",
      "本人確認書類がない場合は、住民票をご提出になる形になります。",
      "本人確認書類がない場合は、住民票を提出させていただきます。",
      "住民票をご提出ください。",
      "本人確認書類がない場合は、住民票を確認いたします。",
    ],
  },
  q12: {
    correct: [
      "先ほどお送りしたメールは、ご確認いただけましたか。",
      "先ほどお送りしたメールをご覧いただけましたでしょうか。",
      "先ほどのメールはご確認になりましたでしょうか。",
      "お送りしたメールをご覧になりましたか。",
      "先ほど送付いたしましたメールは、ご確認いただけましたでしょうか。",
    ],
    incorrect: [
      "先ほどお送りしたメールは、ご確認になられましたでしょうか。",
      "先ほどのメールをご覧になられましたか。",
      "先ほどお送りしたメールを拝見されましたか。",
      "先ほどのメールを拝見いただけましたでしょうか。",
      "先ほどメールをお送りいたしました。",
    ],
  },
  q13: {
    correct: [
      "先ほどお客様がおっしゃった内容を確認いたしました。",
      "お客様がお話しになった内容について確認しました。",
      "先ほどお客様がご説明くださった内容を確認いたしました。",
      "先ほどお客様から伺った内容について確認しました。",
      "お客様より先ほど伺いました内容を確認いたしました。",
    ],
    incorrect: [
      "先ほどお客様がおっしゃられた内容について確認いたしました。",
      "お客様がお話しになられた内容を確認しました。",
      "お客様が伺われた内容について確認いたしました。",
      "先ほどお客様がおっしゃった内容です。",
      "先ほど確認した内容をお客様がおっしゃいました。",
    ],
  },
  q15: {
    correct: [
      "弊社の担当者から、お客様へご連絡いたします。",
      "弊社担当者より、改めてご連絡申し上げます。",
      "担当者が後ほどご連絡いたします。",
      "弊社の担当者より、お客様へ連絡いたします。",
      "後ほど担当者から改めてご連絡いたします。",
    ],
    incorrect: [
      "弊社の担当者から、お客様へご連絡されます。",
      "弊社担当者がご連絡なさいます。",
      "担当者からのご連絡になります。",
      "弊社の担当者にご連絡いただきます。",
      "お客様から担当者へご連絡いただきます。",
    ],
  },
  q19: {
    correct: [
      "ご不明な点は、担当者までお問い合わせください。",
      "不明点がございましたら、担当者へお尋ねください。",
      "ご不明な点がある場合は、担当者までご連絡ください。",
      "ご質問がございましたら、担当者へお問い合わせください。",
      "ご不明点がございましたら、担当者までお申し付けください。",
    ],
    incorrect: [
      "ご不明な点がございましたら、担当者にお伺いください。",
      "不明点がある場合は、担当者に伺ってください。",
      "ご質問は担当者に伺われてください。",
      "ご不明な点は、担当者が問い合わせます。",
      "担当者までご連絡いたします。",
    ],
  },
};

test("問題別ルールで未登録の正解表現を判定できる", () => {
  for (const [questionId, examples] of Object.entries(gradingExamples)) {
    for (const answer of examples.correct) {
      assert.equal(grade(questionId, answer), true, `${questionId}: ${answer}`);
    }
  }
});

test("問題別ルールで誤った表現や不足した回答を除外できる", () => {
  for (const [questionId, examples] of Object.entries(gradingExamples)) {
    for (const answer of examples.incorrect) {
      assert.equal(grade(questionId, answer), false, `${questionId}: ${answer}`);
    }
  }
});

const cushionWords = [
  "恐れ入りますが、",
  "誠に恐れ入りますが、",
  "大変恐れ入りますが、",
  "恐縮でございますが、",
  "誠に恐縮でございますが、",
  "大変恐縮でございますが、",
  "差し支えなければ、",
  "お手数をおかけいたしますが、",
  "誠にお手数をおかけいたしますが、",
  "大変お手数をおかけいたしますが、",
  "申し訳ございませんが、",
  "誠に申し訳ございませんが、",
  "大変申し訳ございませんが、",
];

const answersThatAllowCushionWords = {
  q02: "お名前を伺ってもよろしいでしょうか。",
  q04: "ファイルサイズが大きい場合は、書類を提出できません。",
  q09: "本人確認書類がない場合は、住民票をご提出ください。",
  q12: "先ほどのメールは、ご確認になりましたでしょうか。",
  q19: "ご不明な点がございましたら、担当者までお問い合わせください。",
};

test("クッション言葉を加えても本文が正しければ正解にする", () => {
  for (const [questionId, answer] of Object.entries(
    answersThatAllowCushionWords,
  )) {
    for (const cushionWord of cushionWords) {
      const answerWithCushionWord = `${cushionWord}${answer}`;

      assert.equal(
        grade(questionId, answerWithCushionWord),
        true,
        `${questionId}: ${answerWithCushionWord}`,
      );
    }
  }
});

test("クッション言葉があっても本文の禁止表現は不正解にする", () => {
  assert.equal(
    grade(
      "q02",
      "大変恐れ入りますが、お名前をお伺いしてもよろしいでしょうか。",
    ),
    false,
  );
  assert.equal(
    grade(
      "q03",
      "誠に恐縮でございますが、弊社のサービスをご利用される場合は、本人確認が必要です。",
    ),
    false,
  );
});
