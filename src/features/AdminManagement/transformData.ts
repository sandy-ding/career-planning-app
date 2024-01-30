// import fs from "fs";
// import { stringify } from "csv-stringify";
import { Answer } from "@/graphql/generated/graphql";

// const filename = "test_results.csv";
// const writableStream = fs.createWriteStream(filename);
// const columns = ["userId", "answers"];

// const main = async () => {
//     const stringifier = stringify({ header: true, columns: columns });

//     for (const result of results) {
//       const { _id, answers } = result;
//       for (const answer of answers) {
//         if (!columns.includes(answer.questionId)) {
//           columns.push(answer.questionId);
//         }
//       }
//       stringifier.write({
//         userId: _id.toString().replace(/'/g, ""),
//         answers: answers.sort((a, b) => a.questionId.localeCompare(b.questionId)),
//       });
//     }

//     stringifier.pipe(writableStream);

//     console.log("Finished writing data");
//   };

export const getPartData = (answers: Answer[]) => {
  const columns = [];
  const tData = [];
  for (const data of answers) {
    const { questionId, answer, duration } = data;
    columns.push(`${questionId}_RESP`, `${questionId}_RT`);
    tData.push({
      [`${questionId}_RESP`]: answer,
      [`${questionId}_RT`]: duration,
    });
  }
  return { columns, tData };
};
