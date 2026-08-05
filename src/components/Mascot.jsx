const mascotByState = {
  question: {
    src: `${import.meta.env.BASE_URL}assets/mascot-bow.png`,
    alt: "おじぎをする柴犬のマスコット",
  },
  correct: {
    src: `${import.meta.env.BASE_URL}assets/mascot-jump.png`,
    alt: "喜んでジャンプする柴犬のマスコット",
  },
  incorrect: {
    src: `${import.meta.env.BASE_URL}assets/mascot-cry.png`,
    alt: "涙を流す柴犬のマスコット",
  },
  revealed: {
    src: `${import.meta.env.BASE_URL}assets/mascot-bow.png`,
    alt: "おじぎをする柴犬のマスコット",
  },
  completed: {
    src: `${import.meta.env.BASE_URL}assets/mascot-jump.png`,
    alt: "喜んでジャンプする柴犬のマスコット",
  },
};

export function Mascot({ state }) {
  const mascot = mascotByState[state] ?? mascotByState.question;

  return (
    <img
      className={`mascot mascot-${state}`}
      src={mascot.src}
      alt={mascot.alt}
      width="1254"
      height="1254"
    />
  );
}
