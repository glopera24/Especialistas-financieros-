"use client";

import { useState, useRef, useCallback } from "react";

export type RecordingState = "idle" | "requesting" | "recording" | "processing" | "error";

interface UseAudioRecordingReturn {
  state: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  transcription: string | null;
  error: string | null;
  duration: number;
}

export function useAudioRecording(
  onTranscription: (text: string) => void
): UseAudioRecordingReturn {
  const [state, setState] = useState<RecordingState>("idle");
  const [transcription, setTranscription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startTimer = useCallback(() => {
    setDuration(0);
    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setState("requesting");
      setError(null);
      setTranscription(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setState("processing");
        stopTimer();

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Error al transcribir el audio");

          const { text } = await response.json();
          setTranscription(text);
          onTranscription(text);
          setState("idle");
        } catch (err) {
          setError("No se pudo transcribir el audio. Intenta de nuevo.");
          setState("error");
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setState("recording");
      startTimer();
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Permiso de micrófono denegado. Permite el acceso en tu navegador.");
      } else {
        setError("No se pudo iniciar la grabación.");
      }
      setState("error");
    }
  }, [onTranscription, startTimer, stopTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, [state]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      stopTimer();
      setState("idle");
      setDuration(0);
    }
  }, [state, stopTimer]);

  return {
    state,
    startRecording,
    stopRecording,
    cancelRecording,
    transcription,
    error,
    duration,
  };
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
