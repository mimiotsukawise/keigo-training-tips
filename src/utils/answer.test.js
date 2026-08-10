import assert from "node:assert/strict";
import test from "node:test";
import { isTextAnswerCorrect, normalizeAnswer } from "./answer.js";

test("空白、改行、句読点の有無を無視する", () => {
  assert.equal(
    normalizeAnswer("  担当部署に、\n申し伝えます。 "),
    "担当部署に申し伝えます",
  );
});

test("全角と半角、文中の空白を統一する", () => {
  assert.equal(normalizeAnswer("Ａ Ｂ　Ｃ"), "ABC");
});

test("括弧や引用符などの装飾記号を無視する", () => {
  assert.equal(
    normalizeAnswer("「お名前」を（伺っても）よろしいでしょうか？"),
    "お名前を伺ってもよろしいでしょうか",
  );
});

test("コンマがない正しい回答を正解にする", () => {
  assert.equal(
    isTextAnswerCorrect("確認のためお名前を伺ってもよろしいでしょうか", [
      "確認のため、お名前を伺ってもよろしいでしょうか。",
    ]),
    true,
  );
});

test("複数の正解候補から判定できる", () => {
  assert.equal(
    isTextAnswerCorrect("お名前を教えていただけますでしょうか。", [
      "お名前を伺ってもよろしいでしょうか。",
      "お名前を教えていただけますでしょうか。",
    ]),
    true,
  );
});

test("敬語表現そのものが異なる回答は正解にしない", () => {
  assert.equal(
    isTextAnswerCorrect("お名前を頂戴してもよろしいでしょうか。", [
      "お名前を伺ってもよろしいでしょうか。",
    ]),
    false,
  );
});

test("未登録でも問題別の必須表現をすべて満たせば正解にする", () => {
  assert.equal(
    isTextAnswerCorrect("ご不明点は担当者までお問い合わせください", [], {
      requiredGroups: [["不明"], ["お尋ねください", "お問い合わせください"]],
      forbiddenExpressions: ["お伺いください"],
    }),
    true,
  );
});

test("必須表現を満たしても禁止表現があれば不正解にする", () => {
  assert.equal(
    isTextAnswerCorrect(
      "ご不明点は担当者までお問い合わせのうえ、お伺いください",
      [],
      {
        requiredGroups: [["不明"], ["お問い合わせ"]],
        forbiddenExpressions: ["お伺いください"],
      },
    ),
    false,
  );
});

test("必須表現が不足していれば不正解にする", () => {
  assert.equal(
    isTextAnswerCorrect("担当者までお問い合わせください", [], {
      requiredGroups: [["不明"], ["お問い合わせください"]],
      forbiddenExpressions: [],
    }),
    false,
  );
});
