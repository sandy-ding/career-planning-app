export enum Stage {
  Intro,
  Part1Intro,
  Part1Main,
  Mid,
  Part2Intro,
  Part2Main,
  End,
  Question,
  Intro1,
  Intro2,
  Part1,
  Part2,
  Part3,
  Main,
  PartIntro,
  Encouragement,
}

export interface Question {
  _id: string;
  label: string;
  description?: string;
  answer?: string;
  type?: string;
  className?: string;
  isTest?: boolean;
  fileUrl?: string;
  options: { value: string; label: string }[];
}
