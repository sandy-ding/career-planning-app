import AudioPlayer from "@/components/AudioPlayer";
import { Button, Typography, Form, Radio } from "antd";
import { useState } from "react";
import OtpInput from "react-otp-input";

const { Title } = Typography;
const category2 = "数学思维逻辑推理";

export default function Question() {
  const [otp, setOtp] = useState("");
  return (
    <>
      <Title level={2}>测试完成！</Title>
      <AudioPlayer audioUrl="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/t_o_1.mp3" />
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={4}
        renderInput={(props) => (
          <input
            {...props}
            className="!w-20 h-20 m-4 text-3xl border-2 border-black"
          />
        )}
      />
    </>
  );
}
