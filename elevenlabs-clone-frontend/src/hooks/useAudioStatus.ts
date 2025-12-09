import {useEffect, useRef, useState} from "react";

export interface AudioStatusData {
  status: "processing" | "success" | "failed" | "error" | "timeout";
  audioUrl?: string;
  service?: string;
  message?: string;
}

export function useAudioStatus(audioId: string | null) {
  const [status, setStatus] = useState<AudioStatusData | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!audioId) {
      setStatus(null);
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Create new SSE connection
    const eventSource = new EventSource(`/api/audio-status/${audioId}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event: MessageEvent<string>) => {
      try {
        const data: AudioStatusData = JSON.parse(event.data) as AudioStatusData;
        setStatus(data);

        // Close connection on terminal states
        if (["success", "failed", "error", "timeout"].includes(data.status)) {
          eventSource.close();
          eventSourceRef.current = null;
        }
      } catch (e) {
        console.error("Error parsing SSE data: ", e)
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error: ", error);
      setStatus({ status: "error", message: "Connection failed" });
      eventSource.close();
      eventSourceRef.current = null;
    };

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [audioId]);

  return status;
}