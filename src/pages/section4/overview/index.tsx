import Overview from "@/components/Overview";

const props = {
  title: "智力测验",
  description:
    "欢迎来到智力测验系统！智力是指我们在学习、理解和解决问题时的能力。了解自己的智力水平对提高学习效果和职业规划至关重要。我们的系统覆盖多个智力领域，如逻辑推理、语言理解等，旨在科学、全面评估您的智力。<br/><br/>我们尊重您的隐私，系统将确保您的数据安全。快来探索智力的奥秘吧！",
  btnUrl: "/section1/unit1",
};

export default function Index() {
  return <Overview {...props} />;
}
