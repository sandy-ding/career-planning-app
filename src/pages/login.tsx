import { useRouter } from "next/router";
import {
  CardVerifyRequest,
  useLoginMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form, Input } from "antd";
import Header from "@/components/Layout/Header";

export default function Question() {
  const router = useRouter();

  const { mutate } = useLoginMutation(getDataSource(), {
    onSuccess(data) {
      localStorage.setItem("token", data?.login?.accessToken);
      router.push("/section/1");
    },
  });

  const onFinish = (values: CardVerifyRequest) => {
    const res = mutate({
      input: values,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="职业生涯测试" />
      <div className="grow flex gap-10 px-10 items-center bg-primary-200">
        <div className="w-80 m-auto mt-40 bg-white px-20 py-10 rounded-lg">
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
            className="gap-4"
          >
            <Form.Item
              label="卡号"
              name="code"
              rules={[{ required: true, message: "请输入卡号" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="卡密"
              name="key"
              rules={[{ required: true, message: "请输入卡密" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
