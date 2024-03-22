import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function useLoadRecordings(call) {
  const { user } = useUser();

  const [recordings, setRecordings] = useState([]);
  const [recordingsLoading, setRecordingsLoading] = useState(true);

  useEffect(() => {
    async function loadRecordings() {
      setRecordingsLoading(true);

      if (!user || !user.id) return;

      const { recordings } = await call.queryRecordings();
      setRecordings(recordings);

      setRecordingsLoading(false);
    }

    loadRecordings();
  }, [call, user && user.id]);

  return { recordings, recordingsLoading };
}

