"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import React from "react";

export default function CreateMeeting() {
  const [descriptionValue, setDescriptionValue] = useState(
    "Please add your description here!",
  );
  const [startTimeInput, setStartTimeInput] = useState("");
  const client = useStreamVideoClient();

  const { user } = useUser();

  if (!client || !user) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-center text-2xl font-bold">
        Welcome {user?.username}
      </h1>
      <div className="mx-auto w-80 space-y-6 rounded-md bg-slate-100 p-5">
        <h2 className="text-xl font-bold">Create a new meeting</h2>
        <DescribeInputs
          value={descriptionValue}
          onChange={setDescriptionValue}
        />
        <StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
      </div>
    </div>
  );
}

function DescribeInputs({ value, onChange }) {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-2">
      <div className="font-medium">Meeting details:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => {
            setActive(e.target.checked);
            onChange("");
          }}
        />
        Add description
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Description</span>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={500}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </label>
      )}
    </div>
  );
}

function StartTimeInput({ value, onChange }) {
  const [active, setActive] = useState(false);
  const dateTimeLocal = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);
  return (
    <div className="space-y-2">
      <div className="font-medium">Meeting start:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange("");
          }}
        />
        Start meeting immediately
      </label>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={active}
          onChange={() => {
            setActive(true);
            onChange(dateTimeLocal);
          }}
        />
        Start meeting at date/time
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Start time</span>
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={dateTimeLocal}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </label>
      )}
    </div>
  );
}
