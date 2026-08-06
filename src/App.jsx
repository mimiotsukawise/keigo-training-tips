import { useMemo, useRef, useState } from "react";
import { BrandHeader } from "./components/BrandHeader.jsx";
import { CompletionCard } from "./components/CompletionCard.jsx";
import { Mascot } from "./components/Mascot.jsx";
import { QuestionCard } from "./components/QuestionCard.jsx";
import { ResultCard } from "./components/ResultCard.jsx";
import { questions } from "./data/questions.js";
import { isTextAnswerCorrect } from "./utils/answer.js";
import { shuffleQuestions } from "./utils/quiz.js";

function createQuizOrder() {
  return shuffleQuestions(questions);
}

function getAnswerLabel(question, answer) {
  if (question.type === "rewrite") {
    return answer;
  }

  return question.options.find((option) => option.id === answer)?.label ?? answer;
}

function isAnswerCorrect(question, answer) {
  if (question.type === "rewrite") {
    return isTextAnswerCorrect(answer, question.acceptedAnswers);
  }

  return answer === question.correctAnswer;
}

export default function App() {
  const [quizOrder, setQuizOrder] = useState(createQuizOrder);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("question");
  const [answer, setAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const submitLockRef = useRef(false);
  const revealLockRef = useRef(false);
  const navigationLockRef = useRef(false);

  const currentQuestion = quizOrder[currentIndex];
  const answerLabel = useMemo(
    () => (currentQuestion ? getAnswerLabel(currentQuestion, answer) : ""),
    [answer, currentQuestion],
  );

  function handleSubmit() {
    if (!answer.trim() || phase !== "question" || submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;

    if (isAnswerCorrect(currentQuestion, answer)) {
      setCorrectCount((count) => count + 1);
      setPhase("correct");
    } else {
      setPhase("incorrect");
    }
  }

  function handleRetry() {
    submitLockRef.current = false;
    setAnswer("");
    setPhase("question");
  }

  function handleReveal() {
    if (revealLockRef.current) {
      return;
    }

    revealLockRef.current = true;
    setRevealedCount((count) => count + 1);
    setPhase("answer-revealed");
  }

  function handleNext() {
    if (navigationLockRef.current) {
      return;
    }

    navigationLockRef.current = true;

    if (currentIndex === quizOrder.length - 1) {
      setPhase("completed");
      return;
    }

    setCurrentIndex((index) => index + 1);
    setAnswer("");
    setPhase("question");
    submitLockRef.current = false;
    revealLockRef.current = false;

    window.setTimeout(() => {
      navigationLockRef.current = false;
    }, 300);
  }

  function handleRestart() {
    setQuizOrder(createQuizOrder());
    setCurrentIndex(0);
    setPhase("question");
    setAnswer("");
    setCorrectCount(0);
    setRevealedCount(0);
    submitLockRef.current = false;
    revealLockRef.current = false;
    navigationLockRef.current = false;
  }

  const mascotState =
    phase === "answer-revealed" ? "revealed" : phase;

  return (
    <div className="app-shell">
      <div className="sakura sakura-one" aria-hidden="true" />
      <div className="sakura sakura-two" aria-hidden="true" />
      <div className="sakura sakura-three" aria-hidden="true" />
      <BrandHeader
        current={phase === "completed" ? null : currentIndex + 1}
        total={quizOrder.length}
      />

      <main className="quiz-stage">
        {phase === "question" ? (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            answer={answer}
            onAnswerChange={setAnswer}
            onSubmit={handleSubmit}
          />
        ) : phase === "completed" ? (
          <CompletionCard
            correctCount={correctCount}
            revealedCount={revealedCount}
            total={quizOrder.length}
            onRestart={handleRestart}
          />
        ) : (
          <ResultCard
            phase={phase}
            question={currentQuestion}
            answerLabel={answerLabel}
            onRetry={handleRetry}
            onReveal={handleReveal}
            onNext={handleNext}
          />
        )}
      </main>

      <Mascot state={mascotState} />
      <div className="wave-pattern wave-left" aria-hidden="true" />
      <div className="wave-pattern wave-right" aria-hidden="true" />
    </div>
  );
}
