export const ossUrl = "https://career-planning-app.oss-cn-beijing.aliyuncs.com";

export function shuffle(array: any[]) {
  for (let i = array.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [array[i - 1], array[j]] = [array[j], array[i - 1]];
  }
  return array;
}

export function getArrayLenSum(arr: any[]) {
  return arr.reduce((acc: number, element: any[]) => acc + element.length, 0);
}

const questionPathRegex = /^\/section\/(\d)\/unit\/(\d)/g;
export function getSectionUnitInfo(path: string) {
  console.log({ path });
  const match = questionPathRegex.exec(path);
  const unitPath = match?.[0];
  const sectionNo = match?.[1];
  const unitNo = match?.[2];
  const unitId = `${sectionNo}.${unitNo}`;
  const questionIdPrefix = `${unitId}.`;
  return {
    unitPath,
    sectionNo,
    unitNo,
    unitId,
    questionIdPrefix,
  };
}
