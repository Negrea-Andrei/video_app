"use client";
import { useUser } from "@clerk/nextjs";
import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { getToken } from "./actions";

// Define props interface for ClientProvider component
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
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}

// Custom hook to initialize video client
function useInitializeVideoClient() {
  // Get current user and its loading state
  const { user, isLoaded: userLoaded } = useUser();
  // State to hold video client
  const [videoClient, setVideoClient] = useState(null);

  useEffect(() => {
    // Wait for user to load
    if (!userLoaded) return;

    let streamUser;

    // Check if user is logged in
    if (user?.id) {
      // If logged in, create Stream user object
      streamUser = {
        id: user.id,
        name: user.username || user.id,
        image: user.imageUrl,
      };
    } else {
      // If not logged in, generate a guest user
      const id = nanoid();
      streamUser = {
        id,
        type: "guest",
        name: `Guest ${id}`,
      };
    }

    // Get Stream API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;

    // Throw error if API key is not set
    if (!apiKey) {
      throw new Error("Stream API key not set");
    }

    // Initialize Stream video client with API key and user information
    const client = new StreamVideoClient({
      apiKey,
      user: streamUser,
      tokenProvider: user?.id ? getToken : undefined,
    });

    // Set initialized client to state
    setVideoClient(client);

    // Cleanup function to disconnect user and reset client on unmount
    return () => {
      client.disconnectUser();
      setVideoClient(null);
    };
  }, [user?.id, user?.username, user?.imageUrl, userLoaded]);

  // Return initialized video client
  return videoClient;
}
