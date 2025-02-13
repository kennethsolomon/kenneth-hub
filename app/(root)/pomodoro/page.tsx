"use client";
import { useState, useEffect, useRef, JSX } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

const DEFAULT_WORK_TIME: number = 10; // 25 minutes in seconds
const DEFAULT_BREAK_TIME: number = 5; // 5 minutes in seconds

export default function PomodoroTimer(): JSX.Element {
  const [time, setTime] = useState<number>(DEFAULT_WORK_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastShownRef = useRef<boolean>(false); // Prevent duplicate toast notifications

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSessionEnd();
            return isBreak ? DEFAULT_WORK_TIME : DEFAULT_BREAK_TIME;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isBreak]);

  const handleSessionEnd = (): void => {
    if (!toastShownRef.current) {
      // Ensure toast is shown only once
      toastShownRef.current = true;
      toast.success(
        isBreak
          ? "Break over! Time to work."
          : "Session completed! Take a break."
      );
    }
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(isBreak ? "Break Over!" : "Session Completed!", {
        body: isBreak ? "Time to work." : "Take a break!",
      });
    }
    playNotificationSound();
    setIsBreak(!isBreak);
    setTimeout(() => (toastShownRef.current = false), 500); // Reset toast flag
  };

  const playNotificationSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/notification.mp4");
    }
    audioRef.current.play();
  };

  const stopNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStartPause = (): void => {
    setIsRunning(!isRunning);
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setTime(DEFAULT_WORK_TIME);
    setIsBreak(false);
    stopNotificationSound();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-xl w-80 shadow-lg">
      <h2 className="text-xl font-bold mb-4">
        {isBreak ? "Break Time" : "Focus Time"}
      </h2>
      <div className="text-4xl font-mono mb-4">{formatTime(time)}</div>
      <Progress
        value={
          (time / (isBreak ? DEFAULT_BREAK_TIME : DEFAULT_WORK_TIME)) * 100
        }
        className="w-full mb-4"
      />
      <div className="flex gap-4">
        <Button onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={handleReset} variant="destructive">
          Reset
        </Button>
        <Button onClick={stopNotificationSound} variant="secondary">
          Stop Sound
        </Button>
      </div>
    </div>
  );
}
