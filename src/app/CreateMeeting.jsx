"use client";
// Importing necessary modules and components
import { useUser } from "@clerk/nextjs"; //! Importing useUser hook for user authentication
import { useState } from "react"; //! Importing useState hook from React
import { useStreamVideoClient, Call } from "@stream-io/video-react-sdk"; //! Importing necessary functions and components from Stream Video SDK
import { Loader2 } from "lucide-react"; //! Importing Loader2 component from lucide-react
import React from "react"; //! Importing React library
import { getUserID } from "./actions"; //! Importing function to get user ID

// Main component for creating a meeting
export default function CreateMeeting() {
  //? States for managing input values and client connection
  const [descriptionValue, setDescriptionValue] = useState(
    "Please add your description here!",
  ); // State for description input value
  const [startTimeInput, setStartTimeInput] = useState(""); //* State for start time input value
  const [participantsInput, setParticipantsInput] = useState(""); //* State for participants input value
  const client = useStreamVideoClient(); //* Stream Video client instance

  const [call, setCall] = useState(null); //* State for call object

  const { user } = useUser(); //* Current user object

  //! Function to create a meeting
  async function createMeeting() {
    if (!client || !user) {
      //* Check if client or user is available
      return;
    }
    try {
      const callType = participantsInput ? "private" : "default"; //* Determine call type
      console.log("Is ok");
      const id = crypto.randomUUID(); //* Generate unique ID for the call

      const call = client.call(callType, id); //* Create call object

      const membersEmails = participantsInput
        .split(",")
        .map((email) => email.trim()); //* Extract email addresses of participants

      const membersID = await getUserID(membersEmails); //* Retrieve user IDs corresponding to email addresses

      const members = membersID
        .map((id) => ({ user_id: id, role: "call_member" }))
        .concat({ user_id: user.id, role: "call_member" })
        .filter(
          (value, index, array) =>
            array.findIndex((value2) => value2.user_id === value.user_id) ===
            index,
        ); //! Construct members array for the call

      const start_meeting_time = new Date(startTimeInput || Date.now()).toISOString();

      await call.getOrCreate({
        data: {
          members,
          custom: { description: descriptionValue },
        },
      }); //! Create or get the call with specified data
      setCall(call); //* Set the call object
    } catch (error) {
      alert("Something went wrong! Please try again later!"); // Show alert if an error occurs
    }
  }

  if (!client || !user) {
    // Check if client or user is unavailable
    return <Loader2 className="mx-auto animate-spin" />; // Show loader
  }

  // Render the meeting creation form
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

// Component for describing meeting details
function DescribeInputs({ value, onChange }) {
  const [active, setActive] = useState(false); // State for managing input activation

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
  const [active, setActive] = useState(false); // State for managing input activation
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
  const [active, setActive] = useState(false); // State for managing input activation

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

// Component for displaying meeting link
function MeetingLink({ call }) {
  const meetingLink = `localhost:3000/meeting/${call.id}`; // Constructing meeting link

  return <div className="text-center">{meetingLink}</div>; // Rendering meeting link
}
