"use client";
// Importing necessary modules and components
import { useUser } from "@clerk/nextjs"; //! Clerk for user authentication
import { useState } from "react"; //! React hooks
import { useStreamVideoClient, Call } from "@stream-io/video-react-sdk"; //! Stream Video SDK
import { Copy, Loader2 } from "lucide-react"; //! Loader component
import React from "react"; //! React library
import { getUserID } from "./actions"; //! Function to get user ID

// Main component for creating a meeting
export default function CreateMeeting() {
  // States for managing input values and client connection
  const [descriptionValue, setDescriptionValue] = useState(
    "Please add your description here!",
  ); //* Default description value
  const [startTimeInput, setStartTimeInput] = useState(""); //* Default start time input
  const [participantsInput, setParticipantsInput] = useState(""); //* Default participants input
  const client = useStreamVideoClient(); //! Client for video streaming

  const [call, setCall] = useState(null); //* Initialize call object state

  const { user } = useUser(); //! Get current user

  // Function to create a meeting
  async function createMeeting() {
    if (!client || !user) {
      //! Check if client or user is unavailable
      return;
    }
    try {
      const callType = participantsInput ? "private" : "default"; //* Determine call type
      console.log("Is ok");

      // Generate unique ID for the call
      const id = crypto.randomUUID();

      // Initialize call object
      const call = client.call(callType, id);

      // Extract email addresses of participants
      const membersEmails = participantsInput
        .split(",")
        .map((email) => email.trim());

      // Retrieve user IDs corresponding to email addresses
      const membersID = await getUserID(membersEmails);

      // Construct members array for the call
      const members = membersID
        .map((id) => ({ user_id: id, role: "call_member" }))
        .concat({ user_id: user.id, role: "call_member" })
        .filter(
          (value, index, array) =>
            array.findIndex((value2) => value2.user_id === value.user_id) ===
            index,
        );

      const startTime = new Date(startTimeInput || Date.now());
      console.log(startTime);

      // Create or get the call with specified data
      await call.getOrCreate({
        data: {
          starts_at: startTime,
          members,
          custom: { description: descriptionValue },
        },
      });
      setCall(call); //* Set the created call
      console.log(call.startTime);
    } catch (error) {
      alert("Something went wrong! Please try again later!");
    }
  }

  // Display loader if client or user is unavailable
  if (!client || !user) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  // Render the meeting creation form
  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-center text-2xl font-bold">
        Welcome {user && user.username}
      </h1>
      <div className="mx-auto w-80 space-y-6 rounded-md bg-slate-100 p-5">
        <h2 className="flex w-full justify-center font-bold">
          Create a new meeting
        </h2>
        <DescribeInputs
          value={descriptionValue}
          onChange={setDescriptionValue}
        />
        <StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
        <Participants
          value={participantsInput}
          onChange={setParticipantsInput}
        />
        <button
          onClick={createMeeting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-600 disabled:bg-gray-200"
        >
          Create meeting
        </button>
      </div>
      {call && <MeetingLink call={call} />}
    </div>
  );
}

// Component for describing meeting details
function DescribeInputs({ value, onChange }) {
  const [active, setActive] = useState(false); //* State for managing input activation

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

// Component for setting meeting start time
function StartTimeInput({ value, onChange }) {
  const [active, setActive] = useState(false); //* State for managing input activation
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

// Component for specifying meeting participants
function Participants({ value, onChange }) {
  const [active, setActive] = useState(false); //* State for managing input activation

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
  const meetingLink = `https://video-app-one-xi.vercel.app/meeting/${call.id}`; // Constructing meeting link using a relative path

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex items-center gap-3">
        <span>
          Invitation link:{" "}
          <a
            className="font-medium"
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {meetingLink}
          </a>
        </span>
        <button
          title="Copy invitation link"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            alert("Copied to clipboard");
          }}
        >
          <Copy />
        </button>
      </div>
      <a
        href={getMailToLink(
          meetingLink,
          call.state.startsAt,
          call.state.custom.description,
        )}
        target="_blank"
        className="text-blue-500 hover:underline"
      >
        Send email invitation
      </a>
    </div>
  );
}

function getMailToLink(meetingLink, startsAt, description) {
  const startDateFormatted = startsAt
    ? startsAt.toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : undefined;

  const subject =
    "Join my meeting" + (startDateFormatted ? ` at ${startDateFormatted}` : "");

  const body =
    `Join my meeting at ${meetingLink}.` +
    (startDateFormatted
      ? `\n\nThe meeting starts at ${startDateFormatted}.`
      : "") +
    (description ? `\n\nDescription: ${description}` : "");

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
