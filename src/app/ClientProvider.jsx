"use client";
import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";

export default function ClientProvider({ children }) {
  // Initialize video client
  const videoClient = useInitializeVideoClient();

  // If video client is not initialized yet, display loader
  if (!videoClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );
  }

  // Return StreamVideo component with initialized client and children
  return <StreamVideo client={""}>{children}</StreamVideo>;
}

function useInitializeVideoClient() {}
