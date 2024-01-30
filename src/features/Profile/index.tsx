import dayjs from "dayjs";
import { useRouter } from "next/router";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Alert, Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import {
  ColorVisions,
  Educations,
  Genders,
  Grades,
  MonthlyIncome,
  Nations,
  SchoolRolls,
  StudentTypes,
  Visions,
  Work,
} from "./constant";
import { useState } from "react";
import Loading from "../../components/Loading";

const { Option } = Select;
const yearFormat = "YYYY";

export default function Profile() {
  const router = useRouter();
  const dataSource = getDataSource();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { isLoading, data } = useProfileQuery(dataSource);

  const { mutate } = useUpdateProfileMutation(dataSource, {
    onSuccess() {
      router.push("/section/1");
    },
    onError(e: { message: string }) {
      setErrorMessage(e.message);
    },
  });

  const onFinish = (values: any) => {
    const input = {
      ...values,
      yearOfBirth: values["yearOfBirth"].format(yearFormat),
      fathersYearOfBirth: values["fathersYearOfBirth"].format(yearFormat),
      mothersYearOfBirth: values["mothersYearOfBirth"].format(yearFormat),
    };

    mutate({
      input,
    });
  };

  const disabledYearOfBirth = (current: dayjs.Dayjs) => {
    // allow birth of year within 100 years
    return (
      current &&
      (current > dayjs().endOf("date") ||
        current < dayjs().subtract(100, "year").endOf("date"))
    );
  };

  const disabledParentsYearOfBirth = (current: dayjs.Dayjs) => {
    // allow birth of year within 100 years
    return (
      current &&
      (current > dayjs().subtract(18, "year").endOf("date") ||
        current < dayjs().subtract(100, "year").endOf("date"))
    );
  };

  return isLoading ? (
    <div className="w-screen h-full">
      <Loading />
    </div>
  ) : (
    <div className="grow flex gap-10 px-10 bg-primary-200">
      <div className="m-autobg-white px-20 py-12 rounded-lg">
        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
          className="gap-4"
          initialValues={{
            ...data?.profile,
            ...(data?.profile?.yearOfBirth && {
              yearOfBirth: dayjs(data?.profile?.yearOfBirth, yearFormat),
            }),
            ...(data?.profile?.fathersYearOfBirth && {
              fathersYearOfBirth: dayjs(
                data?.profile?.fathersYearOfBirth,
                yearFormat
              ),
            }),
            ...(data?.profile?.mothersYearOfBirth && {
              mothersYearOfBirth: dayjs(
                data?.profile?.mothersYearOfBirth,
                yearFormat
              ),
            }),
          }}
        >
          <div className="mb-4 text-center font-bold text-primary-700">
            个人信息
          </div>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="姓名：："
                name="name"
                rules={[{ required: true, message: "请输入姓名" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="性别：："
                name="gender"
                rules={[{ required: true, message: "请选择性别" }]}
              >
                <Select>
                  {Genders.map((i) => (
                    <Option className="mb-1" value={i}>
                      {i}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="出生年份：："
                name="yearOfBirth"
                rules={[{ required: true, message: "请选择出生年份" }]}
              >
                <DatePicker
                  picker="year"
                  disabledDate={disabledYearOfBirth}
                  placeholder=""
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="民族：："
                name="nation"
                rules={[{ required: true, message: "请选择民族" }]}
              >
                <Select>
                  {Nations.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="学籍：："
                name="schoolRoll"
                rules={[{ required: true, message: "请选择学籍" }]}
              >
                <Select>
                  {SchoolRolls.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="学生类型：："
                name="studentType"
                rules={[{ required: true, message: "请输入学生类型" }]}
              >
                <Select>
                  {StudentTypes.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="学校：："
                name="school"
                rules={[{ required: true, message: "请输入学校" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="年级：："
                name="grade"
                rules={[{ required: true, message: "请选择年级" }]}
              >
                <Select>
                  {Grades.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="特长：：" name="speciality">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="色觉：："
                name="colorVision"
                rules={[{ required: true, message: "请选择色觉" }]}
              >
                <Select>
                  {ColorVisions.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="视力：："
                name="vision"
                rules={[{ required: true, message: "请选择视力" }]}
              >
                <Select>
                  {Visions.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="兴趣：：" name="interest">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <div className="mb-4 text-center font-bold text-primary-700">
            家庭信息
          </div>

          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label="父亲出生年份：："
                name="fathersYearOfBirth"
                rules={[{ required: true, message: "请选择父亲出生年份" }]}
                style={{ width: "100%" }}
              >
                <DatePicker
                  picker="year"
                  disabledDate={disabledParentsYearOfBirth}
                  placeholder=""
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="父亲职业：："
                name="fathersWork"
                rules={[{ required: true, message: "请选择父亲职业" }]}
              >
                <Select>
                  {Work.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="父亲学历：："
                name="fathersEducation"
                rules={[{ required: true, message: "请选择父亲学历" }]}
              >
                <Select>
                  {Educations.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="父亲月收入：："
                name="fathersMonthlyIncome"
                rules={[{ required: true, message: "请选择父亲月收入" }]}
              >
                <Select>
                  {MonthlyIncome.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label="母亲出生年份：："
                name="mothersYearOfBirth"
                rules={[{ required: true, message: "请选择母亲出生年份" }]}
              >
                <DatePicker
                  picker="year"
                  disabledDate={disabledParentsYearOfBirth}
                  placeholder=""
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="母亲职业：："
                name="mothersWork"
                rules={[{ required: true, message: "请选择母亲职业" }]}
              >
                <Select>
                  {Work.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="母亲学历：："
                name="mothersEducation"
                rules={[{ required: true, message: "请选择母亲学历" }]}
              >
                <Select>
                  {Educations.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="母亲月收入：："
                name="mothersMontylyIncome"
                rules={[{ required: true, message: "请选择母亲月收入" }]}
              >
                <Select>
                  {MonthlyIncome.map((i) => (
                    <Option value={i}>{i}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="Email：："
                name="email"
                rules={[
                  { required: true, message: "请输入Email" },
                  { type: "email", message: "请输入正确的Email" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="电话：："
                name="telephone"
                rules={[
                  { required: true, message: "请输入电话" },
                  { pattern: /^\d+$/, message: "请输入正确的电话" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="家庭地址：：" name="address">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="w-10">
            <Row gutter={24}>
              <Col span={8} offset={8}>
                <Button
                  block
                  className="mt-6"
                  shape="round"
                  htmlType="submit"
                  size="large"
                >
                  提交
                </Button>
              </Col>
            </Row>
          </Form.Item>
          {errorMessage && (
            <Alert message={errorMessage} type="error" showIcon closable />
          )}
        </Form>
      </div>
    </div>
  );
}
