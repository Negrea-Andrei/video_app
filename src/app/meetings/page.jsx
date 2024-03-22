import { Metadata } from "next";
import MyMeetingsPage from "./MyMeetingsPage";

export const metadata = {
  title: "My Meetings",
};

export default function Page() {
  return <MyMeetingsPage />;
}
