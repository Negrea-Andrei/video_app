import useStreamCall from "../app/hooks/useStreamCall";
import {
  CallControls,
  PaginatedGridLayout,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import {
  BetweenHorizonalEnd,
  BetweenVerticalEnd,
  LayoutGrid,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EndCallButton from "./EndCallButton";

export default function FlexibleCallLayout() {
  const [layout, setLayout] = useState("speaker-vert");

  const call = useStreamCall();

  const router = useRouter();

  return (
    <div className="space-y-3">
      <CallLayoutButtons layout={layout} setLayout={setLayout} />
      <CallLayoutView layout={layout} />
      <CallControls onLeave={() => router.push(`/meeting/${call.id}/left`)} />
      <EndCallButton />
    </div>
  );
}

function CallLayoutButtons({ layout, setLayout }) {
  return (
    <div className="mx-auto w-fit space-x-6">
      <button onClick={() => setLayout("speaker-vert")}>
        <BetweenVerticalEnd
          className={layout !== "speaker-vert" ? "text-gray-400" : ""}
        />
      </button>
      <button onClick={() => setLayout("speaker-horiz")}>
        <BetweenHorizonalEnd
          className={layout !== "speaker-horiz" ? "text-gray-400" : ""}
        />
      </button>
      <button onClick={() => setLayout("grid")}>
        <LayoutGrid className={layout !== "grid" ? "text-gray-400" : ""} />
      </button>
    </div>
  );
}

function CallLayoutView({ layout }) {
  if (layout === "speaker-vert") {
    return <SpeakerLayout />;
  }

  if (layout === "speaker-horiz") {
    return <SpeakerLayout participantsBarPosition="right" />;
  }

  if (layout === "grid") {
    return <PaginatedGridLayout />;
  }

  return null;
}
