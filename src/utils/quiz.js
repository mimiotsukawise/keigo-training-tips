export function shuffleQuestions(questions, random = Math.random) {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function selectRandomQuestions(
  questions,
  count,
  random = Math.random,
) {
  return shuffleQuestions(questions, random).slice(0, Math.min(count, questions.length));
}
