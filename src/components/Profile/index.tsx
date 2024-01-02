import dayjs from "dayjs";
import { useRouter } from "next/router";
import {
  CardVerifyRequest,
  useLoginMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { nations } from "./constant";

const { Option } = Select;

const EducationSelect = (
  <Select>
    <Option className="mb-1" value="graduate">
      研究生及以上
    </Option>
    <Option className="mb-1" value="undergraduate">
      本科
    </Option>
    <Option className="mb-1" value="highSchool">
      高中
    </Option>
    <Option className="mb-1" value="middleSchool">
      初中
    </Option>
    <Option className="mb-1" value="primarySchool">
      小学及以下
    </Option>
  </Select>
);

export default function Profile() {
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

  return (
    <Form
      name="basic"
      onFinish={onFinish}
      autoComplete="off"
      requiredMark={false}
      className="gap-4"
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
              <Option className="mb-1" value="Male">
                男
              </Option>
              <Option className="mb-1" value="Female">
                女
              </Option>
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
              {nations.map((nation) => (
                <Option className="mb-1" value={nation}>
                  {nation}
                </Option>
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
              <Option className="mb-1" value="city">
                城镇
              </Option>
              <Option className="mb-1" value="country">
                农村
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="学生类型：："
            name="studentType"
            rules={[{ required: true, message: "请输入学生类型" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="色觉：：" name="colorVision">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="视力：：" name="vision">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="听力：：" name="hearing">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="学校：：" name="school">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="年级：：" name="grade">
            <Select>
              <Option value="1-1">一年级</Option>
              <Option value="1-2">二年级</Option>
              <Option value="1-3">三年级</Option>
              <Option value="1-4">四年级</Option>
              <Option value="1-5">五年级</Option>
              <Option value="1-6">六年级</Option>
              <Option value="2-1">初一</Option>
              <Option value="2-2">初二</Option>
              <Option value="2-3">初三</Option>
              <Option value="3-1">高一</Option>
              <Option value="3-2">高二</Option>
              <Option value="3-3">高三</Option>
              <Option value="4-1">大一</Option>
              <Option value="4-2">大二</Option>
              <Option value="4-3">大三</Option>
              <Option value="4-4">大四</Option>
              <Option value="5">研究生</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="班级：：" name="class">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="科别：：" name="gender">
            <Select>
              <Option className="mb-1" value="science">
                理科
              </Option>
              <Option className="mb-1" value="arts">
                文科
              </Option>
              <Option className="mb-1" value="unknown">
                未分科
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="特长：：" name="speciality">
            <Input />
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
            rules={[{ required: true, message: "请选择出生年份" }]}
          >
            <DatePicker
              picker="year"
              disabledDate={disabledParentsYearOfBirth}
              placeholder=""
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="父亲职业：：" name="fathersJob">
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="父亲学历：：" name="fathersEducation">
            {EducationSelect}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="父亲年收入：：" name="fathersIncome">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item label="母亲出生年份：：" name="mothersYearOfBirth">
            <DatePicker
              picker="year"
              disabledDate={disabledParentsYearOfBirth}
              placeholder=""
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="母亲职业：：" name="mothersJob">
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="母亲学历：：" name="mothersEducation">
            {EducationSelect}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="母亲年收入：：" name="mothersIncome">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="Email：：" name="email">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="联系电话：：" name="phoneNumber">
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
              className="mt-4"
              shape="round"
              htmlType="submit"
              size="large"
            >
              提交
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
}
