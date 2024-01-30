import { useEffect } from "react";

export default function AudioPlayer({
  fileUrl,
  onEnd,
}: {
  fileUrl: string;
  onEnd: () => void;
}) {
  const audio = new Audio(fileUrl);

  useEffect(() => {
    audio.addEventListener("ended", onEnd);
  }, [audio]);

  useEffect(() => {
    audio.play();
  }, []);

  return <div />;
}
