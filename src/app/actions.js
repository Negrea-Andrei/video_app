"use server"

import { currentUser } from "@clerk/nextjs"
import { StreamClient } from "@stream-io/node-sdk"

export async function getToken() {
    const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY
    const streamApiSecret = process.env.STREAM_VIDEO_API_SECRET

    if (!streamApiKey || !streamApiSecret) {
        throw new Error("ALI key not set")
    }
    const user = await currentUser();

    console.log(user?.id)
    if (!user) {
        throw new Error("User not logged in")
    }

    const streamClient = new StreamClient(streamApiKey, streamApiSecret)

    const expTokenTime = Math.floor(Date.now() / 1000) + 60 * 60

    const addedTokenTime = Math.floor(Date.now() / 1000) - 60

    const token = streamClient.createToken(user.id, expTokenTime, addedTokenTime)

    console.log(`Token ${token} added`)
}