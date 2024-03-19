//? Importing necessary modules and libraries
import { clerkClient, currentUser } from "@clerk/nextjs"; //? Importing clerkClient and currentUser from Clerk for user authentication
import { StreamClient } from "@stream-io/node-sdk"; //? Importing StreamClient from Stream SDK

//? Function to retrieve token for Stream API
export async function getToken() {
    const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY; //? Retrieving Stream API key from environment variables
    const streamApiSecret = process.env.STREAM_VIDEO_API_SECRET; //? Retrieving Stream API secret from environment variables

    if (!streamApiKey || !streamApiSecret) { //? Checking if API key or secret is missing
        throw new Error("API key not set"); //? Throwing an error if API key or secret is missing
    }
    const user = await currentUser(); //? Retrieving current user
    if (!user) { //? Checking if user is logged in
        throw new Error("User not logged in"); //? Throwing an error if user is not logged in
    }

    const streamClient = new StreamClient(streamApiKey, streamApiSecret); //? Creating Stream client instance

    const expTokenTime = Math.floor(Date.now() / 1000) + 60 * 60; //? Calculating token expiration time (1 hour)
    const addedTokenTime = Math.floor(Date.now() / 1000) - 60; //? Calculating token creation time (1 minute ago)

    const token = streamClient.createToken(user.id, expTokenTime, addedTokenTime); //? Creating token for the user
    return token; //? Returning the token
}

//? Function to retrieve user IDs corresponding to given emails
export async function getUserID(emails) {
    const response = await clerkClient.users.getUserList({
        emails: emails
    }); //? Fetching user list based on emails
    return response.map(user => user.id); //? Returning array of user IDs
}
