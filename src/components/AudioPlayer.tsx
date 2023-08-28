import { SoundTwoTone } from "@ant-design/icons";
import { useState } from "react";

export default function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audio = typeof Audio !== "undefined" && new Audio(audioUrl);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);

  const playPause = () => {
    if (!played && audio) {
      audio.play();
    }
    setPlayed(true);
    setPlaying(true);
    console.log({ played });
  };

  return (
    // <div className="w-40">
    <SoundTwoTone
      // spin
      // style={{ animation: "stepsV1 1s ease infinite" }}
      className={`${
        played ? "!cursor-not-allowed" : ""
      } text-5xl w-10 h-10 bg-green-500 pr
      transition-all duration-100 
      ease-out hover:w-20`}
      onClick={playPause}
    />
    // {/* </div> */}
  );
}
