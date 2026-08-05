import assert from "node:assert/strict";
import test from "node:test";
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
