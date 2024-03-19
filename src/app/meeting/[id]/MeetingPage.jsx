"use client";

import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function MeetingPage({ id }) {
  const [call, setCall] = useState(null);

  const client = useStreamVideoClient();

  if (!client) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (!call) {
    return (
      <button
        onClick={async () => {
          const call = client.call("default", id);
          await call.join();
          setCall(call);
        }}
      >
        Join
      </button>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme className="space-y-3">
        <SpeakerLayout>
          <CallControls />
        </SpeakerLayout>
      </StreamTheme>
    </StreamCall>
  );
}
