import assert from "node:assert/strict";
import test from "node:test";
import { isTextAnswerCorrect, normalizeAnswer } from "./answer.js";

test("前後の空白と文末の句点を無視する", () => {
  assert.equal(
    normalizeAnswer("  担当部署に申し伝えます。 "),
    "担当部署に申し伝えます",
  );
});

test("全角と半角、文中の空白を統一する", () => {
  assert.equal(normalizeAnswer("Ａ Ｂ　Ｃ"), "ABC");
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
