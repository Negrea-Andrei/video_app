import { Metadata } from "next";
import MeetingPage from "./MeetingPage";

export function generateMetadata({ id }) {
  return {
    title: `Meeting ${id}`,
  };
}

export default function Page({ params: { id } }) {
  return <MeetingPage id={id} />;
}
