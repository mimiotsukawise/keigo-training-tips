import assert from "node:assert/strict";
import test from "node:test";
import { normalizeAnswer } from "../utils/answer.js";
import { questions } from "./questions.js";

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
