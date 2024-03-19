"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useStreamVideoClient, Call } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import React from "react";
import { getUserID } from "./actions";

export default function CreateMeeting() {
  const [descriptionValue, setDescriptionValue] = useState(
    "Please add your description here!",
  );
  const [startTimeInput, setStartTimeInput] = useState("");
  const [participantsInput, setParticipantsInput] = useState("");
  const client = useStreamVideoClient();

  const [call, setCall] = useState(null);

  const { user } = useUser();

  async function createMeeting() {
    if (!client || !user) {
      return;
    }
    try {
      const callType = participantsInput ? "private" : "default";
      console.log("Is ok");
      const id = crypto.randomUUID();

      const call = client.call(callType, id);

      const membersEmails = participantsInput
        .split(",")
        .map((email) => email.trim());

      const membersID = await getUserID(membersEmails);

      const members = membersID
        .map((id) => ({ user_id: id, role: "call_member" }))
        .concat({ user_id: user.id, role: "call_member" })
        .filter(
          (value, index, array) =>
            array.findIndex((value2) => value2.user_id === value.user_id) ===
            index,
        );

      await call.getOrCreate({
        data: {
          members,
          custom: { description: descriptionValue },
        },
      });
      setCall(call);
    } catch (error) {
      alert("Something went wrong! Please try again later!");
    }
  }

  if (!client || !user) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-center text-2xl font-bold">
        Welcome {user && user.username}
      </h1>
      <div className="mx-auto w-80 space-y-6 rounded-md bg-slate-100 p-5">
        <h2 className="text-xl font-bold">Create a new meeting</h2>
        <DescribeInputs
          value={descriptionValue}
          onChange={setDescriptionValue}
        />
        <StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
        <Participants
          value={participantsInput}
          onChange={setParticipantsInput}
        />
        <button onClick={createMeeting} className="w-full">
          Create meeting
        </button>
      </div>
      {call && <MeetingLink call={call} />}
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

function Participants({ value, onChange }) {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-2">
      <div className="font-medium">Invite </div>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange("");
          }}
        />
        Everyone with link can join
      </label>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={active}
          onChange={() => {
            setActive(true);
            onChange("");
          }}
        />
        Private meeting
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Participant emails</span>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter participant email addresses separated by commas"
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </label>
      )}
    </div>
  );
}

function MeetingLink({ call }) {
  const meetingLink = `localhost:3000/meeting/${call.id}`;

  return <div className="text-center">{meetingLink}</div>;
}
