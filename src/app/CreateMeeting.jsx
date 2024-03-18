"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import React from "react";

export default function CreateMeeting() {
  const client = useStreamVideoClient();

  const { user } = useUser();

  if (!client || !user) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1>Welcome {user?.username}</h1>
    </div>
  );
}
