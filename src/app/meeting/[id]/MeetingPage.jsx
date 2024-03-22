"use client";

import { useUser } from "@clerk/nextjs";
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import useLoadCall from "../../hooks/useLoadCall";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function MeetingPage({ id }) {
  const { user, isLoaded: userLoaded } = useUser();

  const { call, callLoading } = useLoadCall(id);

  const client = useStreamVideoClient();

  if (!userLoaded || callLoading) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (!call) {
    return <p className="text-center font-bold">Call not found</p>;
  }

  const notAllowedToJoin =
    call.type === "private-meeting" &&
    (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowedToJoin) {
    return (
      <p className="text-center font-bold">
        You are not allowed to view this meeting
      </p>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme className="space-y-3">
        <MeetingScreen />
      </StreamTheme>
    </StreamCall>
  );
}

function MeetingScreen() {
  const { useCallEndedAt, useCallStartedAt } = useCallStateHooks();

  const callEndedAt = useCallEndedAt();
  const callStartsAt = useCallStartsAt();

  const [setupComplete, setSetupComplete] = useState(false);

  async function handleSetupComplete() {
    call.join();
    setSetupComplete(true);
  }

  const callIsInFuture = callStartsAt && new Date(callStartsAt) > new Date();

  const callHasEnded = !!callEndedAt;

  if (callHasEnded) {
    return <MeetingEndedScreen />;
  }

  if (callIsInFuture) {
    return <UpcomingMeetingScreen />;
  }

  const description = call.state.custom.description;

  return (
    <div className="space-y-6">
      {description && (
        <p className="text-center">
          Meeting description: <span className="font-bold">{description}</span>
        </p>
      )}
      {setupComplete ? (
        <CallUI />
      ) : (
        <SetupUI onSetupComplete={handleSetupComplete} />
      )}
    </div>
  );
}
