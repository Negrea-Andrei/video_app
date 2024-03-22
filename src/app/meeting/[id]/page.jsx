import { currentUser } from "@clerk/nextjs/server";
import MeetingLoginPage from "./MeetingLoginPage";
import MeetingPage from "./MeetingPage";

export async function generateMetadata({ params: { id } }) {
  return {
    title: `Meeting ${id}`,
  };
}

export default async function Page({
  params: { id },
  searchParams: { guest },
}) {
  const user = await currentUser();

  const guestMode = guest === "true";

  if (!user && !guestMode) {
    return <MeetingLoginPage />;
  }

  return <MeetingPage id={id} />;
}
