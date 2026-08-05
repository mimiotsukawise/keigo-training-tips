import assert from "node:assert/strict";
import test from "node:test";
import { shuffleQuestions } from "./quiz.js";

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
