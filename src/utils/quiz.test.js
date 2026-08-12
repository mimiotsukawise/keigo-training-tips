import assert from "node:assert/strict";
import test from "node:test";
import { selectRandomQuestions, shuffleQuestions } from "./quiz.js";

test("問題数と問題IDを保ったまま並べ替える", () => {
  const questions = [{ id: "a" }, { id: "b" }, { id: "c" }];
  const shuffled = shuffleQuestions(questions, () => 0);

  assert.equal(shuffled.length, questions.length);
  assert.deepEqual(
    shuffled.map(({ id }) => id).toSorted(),
    questions.map(({ id }) => id).toSorted(),
  );
  assert.notEqual(shuffled, questions);
});

test("全問題から指定数を重複なしで選ぶ", () => {
  const questions = Array.from({ length: 35 }, (_, index) => ({
    id: `q${index + 1}`,
  }));
  const selected = selectRandomQuestions(questions, 20, () => 0.5);

  assert.equal(selected.length, 20);
  assert.equal(new Set(selected.map(({ id }) => id)).size, 20);
  assert.ok(selected.every((question) => questions.includes(question)));
});

test("指定数が全問題数を超える場合は全問題を返す", () => {
  const questions = [{ id: "a" }, { id: "b" }];

  assert.equal(selectRandomQuestions(questions, 20, () => 0).length, 2);
});
