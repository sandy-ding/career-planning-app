import { useRouter } from "next/router";
import {
  useSubmissionsQuery,
  useUpdateProfileMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useState } from "react";
import Loading from "../../components/Loading";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { getPartData } from "./transformData";
import fs from "fs";
// import { stringify } from "csv-stringify";
// import { Answer } from "@/graphql/generated/graphql";

const filename = "test_results.csv";
const writableStream = fs.createWriteStream(filename);

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Full Name",
    width: 100,
    dataIndex: "name",
    key: "name",
    fixed: "left",
  },
  {
    title: "Age",
    width: 100,
    dataIndex: "age",
    key: "age",
    sorter: true,
  },
  { title: "Column 1", dataIndex: "address", key: "1" },
  { title: "Column 2", dataIndex: "address", key: "2" },
  { title: "Column 3", dataIndex: "address", key: "3" },
  { title: "Column 4", dataIndex: "address", key: "4" },
  { title: "Column 5", dataIndex: "address", key: "5" },
  { title: "Column 6", dataIndex: "address", key: "6" },
  { title: "Column 7", dataIndex: "address", key: "7" },
  { title: "Column 8", dataIndex: "address", key: "8" },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: 100,
    render: () => <a>action</a>,
  },
];

const tdata: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 40,
    address: "London Park",
  },
];

export default function AdminManagement() {
  const router = useRouter();
  const dataSource = getDataSource();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { isLoading, data } = useSubmissionsQuery(dataSource);

  console.log({ data });
  const { mutate } = useUpdateProfileMutation(dataSource, {
    onSuccess() {
      router.push("/section/1");
    },
    onError(e: { message: string }) {
      setErrorMessage(e.message);
    },
  });

  const downloadExcel = () => {
    const { columns, tData } = getPartData(
      data?.submissions?.[1]?.answers?.filter(({ questionId }) => {
        return questionId.startsWith("1.1.");
      }) || []
    );
    // const stringifier = stringify({ header: true, columns: columns });
    // stringifier.write(tData);
    // stringifier.pipe(writableStream);
    console.log("Finished writing data");
  };

  return isLoading ? (
    <div className="w-screen h-full">
      <Loading />
    </div>
  ) : (
    <div className="">
      <div className="m-autobg-white px-20 py-12 rounded-lg">
        <Table columns={columns} dataSource={tdata} scroll={{ x: 1300 }} />
        <Button onClick={downloadExcel}>下载excel</Button>
      </div>
    </div>
  );
}
