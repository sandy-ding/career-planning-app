export const ossUrl = "https://career-planning-app.oss-cn-beijing.aliyuncs.com";

export function shuffle(array: any[], seed: number) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  seed = seed || 1;
  let random = function () {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

export function getArrayLenSum(arr: any[]) {
  return arr.reduce((acc: number, element: any[]) => acc + element.length, 0);
}

const questionPathRegex = /^\/section\/(\d)\/unit\/(\d)/g;
export function getSectionUnitInfo(path: string) {
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

export function getCountdown(duration: number) {
  const date = new Date(duration);
  const seconds = date.getSeconds();
  return `${date.getMinutes()}:${seconds < 10 ? 0 : ""}${date.getSeconds()}`;
}
