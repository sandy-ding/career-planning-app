import { SoundTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function AudioPlayer({
  fileUrl,
  onEnd,
}: {
  fileUrl: string;
  onEnd: () => void;
}) {
  const audio = new Audio(fileUrl);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    audio.addEventListener("ended", onEnd);
  }, [audio]);

  const playPause = () => {
    if (!played && audio) {
      audio.play();
    }
    setPlayed(true);
    setPlaying(true);
  };
  return (
    <SoundTwoTone
      className={`${played ? "!cursor-not-allowed" : ""} text-5xl w-10 h-10 pr`}
      onClick={playPause}
    />
  );
}
