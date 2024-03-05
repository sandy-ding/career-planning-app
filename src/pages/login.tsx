import { useRouter } from "next/router";
import {
  CardVerifyRequest,
  useLoginMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form, Input } from "antd";
import Header from "@/components/Layout/Header";
import { useState } from "react";
import { ValidateStatus } from "antd/es/form/FormItem";

export default function Question() {
  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");
  const router = useRouter();

  const { mutate } = useLoginMutation(getDataSource(), {
    onSuccess(data) {
      localStorage.setItem("token", data?.login?.accessToken);
      router.push("/profile");
    },
    onError() {
      setValidateStatus("error");
      setHelp("卡号或卡密不正确");
    },
  });

  const onFinish = (values: CardVerifyRequest) => {
    mutate({
      input: values,
    });
  };

  const clearError = () => {
    setHelp("");
    setValidateStatus("success");
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="职业生涯测试" hideLogout />
      <div className="grow flex gap-10 px-10 items-center bg-primary-200">
        <div className="w-80 m-auto mt-40 bg-white px-20 py-10 rounded-lg">
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
            className="gap-4"
          >
            <Form.Item
              label="卡号：："
              name="code"
              validateStatus={validateStatus}
              rules={[{ required: true, message: "请输入卡号" }]}
            >
              <Input onChange={clearError} />
            </Form.Item>

            <Form.Item
              label="卡密：："
              name="key"
              rules={[{ required: true, message: "请输入卡密" }]}
              validateStatus={validateStatus}
              help={help}
            >
              <Input.Password onChange={clearError} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block className="mt-4">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
