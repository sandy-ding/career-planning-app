import { useRouter } from "next/router";
import { Question, useQuestionQuery } from "@/graphql/generated/graphql";
import { Button, Typography, Breadcrumb, Card } from "antd";
import Section1 from "@/pages/section1";
import Section2 from "@/pages/section1/unit1/2";
import Section3 from "@/pages/section1/unit1/3";
// import Countdown from "antd/es/statistic/Countdown";

const { Title } = Typography;
const deadline = Date.now() + 1000 * 60 * 8;

enum QuestionType {
  Radio = "Radio",
  Audio = "Audio",
  Chess = "Chess",
}

const Section = (id?: string) => {
  switch (id) {
    case "1":
      return <Section1 />;
    case "2":
      return <Section2 />;
    case "3":
      return <Section3 />;
  }
};

export default function Question() {
  const router = useRouter();
  const { id } = router.query;

  return Section(id as string);
}
