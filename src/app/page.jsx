"use client";
import ErrorPage from "./error";

export default function Home() {
  const hello = true;
  return hello ? "Hello" : <ErrorPage />;
}
