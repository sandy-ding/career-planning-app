import React, { useContext } from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd/es/menu";
import { MenuContext } from "@/hooks/MenuContext";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  {
    key: "1",
    label: "一、语言能力",
    children: [
      { key: "1.1", label: "1. 词汇理解" },
      { key: "1.2", label: "2. 句子理解" },
      { key: "1.3", label: "3. 语句填空" },
      { key: "1.4", label: "4. 语句排序" },
      { key: "1.5", label: "5. 语句续写" },
    ],
  },
  {
    key: "2",
    label: "二、逻辑推理能力",
    children: [
      { key: "2.1", label: "1. 具体推理" },
      { key: "2.2", label: "2. 抽象推理" },
    ],
  },
  {
    key: "3",
    label: "三、工作记忆能力",
    children: [
      { key: "3.1", label: "1. 数字广度测验" },
      { key: "3.2", label: "2. 视觉矩阵测验" },
    ],
  },
  { key: "4", label: "四、数学能力" },
  {
    key: "5",
    label: "五、信息检索与归纳能力",
    children: [
      { key: "5.1", label: "1. 表格分析" },
      { key: "5.2", label: "2. 图形分析" },
    ],
  },
  {
    key: "6",
    label: "六、空间能力",
    children: [
      { key: "6.1", label: "1. 二维空间旋转" },
      { key: "6.2", label: "2. 三维空间旋转" },
      { key: "6.3", label: "3. 空间想象" },
    ],
  },
  {
    key: "7",
    label: "七、机械能力",
    children: [
      { key: "7.1", label: "1. 速度" },
      { key: "7.2", label: "2. 力和杠杆" },
      { key: "7.3", label: "3. 流体" },
      { key: "7.4", label: "4. 滑轮" },
      { key: "7.5", label: "5. 热力学" },
      { key: "7.6", label: "6. 电力" },
      { key: "7.7", label: "7. 齿轮" },
      { key: "7.8", label: "8. 车轮" },
      { key: "7.9", label: "9. 声学" },
      { key: "7.10", label: "10. 光学" },
    ],
  },
  {
    key: "8",
    label: "八、信息加工能力",
    children: [
      { key: "8.1", label: "1. 辨别反应时" },
      { key: "8.2", label: "2. 简单反应时" },
      { key: "8.3", label: "3. 匹配反应时" },
    ],
  },
  {
    key: "9",
    label: "九、自然观察能力",
    children: [
      { key: "9.1", label: "1. 目标搜索" },
      { key: "9.2", label: "2. 目标比较" },
      { key: "9.3", label: "3. 目标拼图" },
    ],
  },
  { key: "10", label: "十、内省能力" },
  { key: "11", label: "十一、运动协调能力" },
  {
    key: "12",
    label: "十二、美术能力",
    children: [
      { key: "12.1", label: "1. 线段长短估计" },
      { key: "12.2", label: "2. 实物估计" },
    ],
  },
  { key: "13", label: "十三、音乐能力" },
  {
    key: "14",
    label: "十四、思维转换能力",
    children: [
      { key: "14.1", label: "1. 图片转换为对应文字" },
      { key: "14.2", label: "2. 文字转换为对应图片" },
    ],
  },
  { key: "15", label: "十五、控制抑制能力" },
  {
    key: "16",
    label: "十六、人际交往能力",
    children: [
      { key: "16.1", label: "1. 人际交往礼仪" },
      { key: "16.2", label: "2. 人际关系能力" },
    ],
  },
  {
    key: "17",
    label: "十七、职业兴趣量表",
    children: [
      { key: "17.1", label: "第一部分" },
      { key: "17.2", label: "第二部分" },
    ],
  },
  {
    key: "18",
    label: "十八、人格测评量表",
  },
];

const Navbar: React.FC = () => {
  const { menu } = useContext(MenuContext);
  return (
    <div className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <div className="h-full w-full rounded-[inherit]">
        <Menu
          className="h-full w-full pt-1 overflow-scroll"
          selectedKeys={[menu]}
          openKeys={[menu[0]]}
          mode="inline"
          theme="light"
          items={items}
        />
      </div>
    </div>
  );
};

export default Navbar;
