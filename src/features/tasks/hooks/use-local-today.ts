"use client";

import { useEffect, useState } from "react";

import { getLocalToday } from "@/features/tasks/date";

const midnightBufferMs = 50;

export function millisecondsUntilNextLocalDay(date = new Date()) {
  const nextDay = new Date(date);
  nextDay.setHours(24, 0, 0, midnightBufferMs);
  return Math.max(0, nextDay.getTime() - date.getTime());
}

export function useLocalToday() {
  const [today, setToday] = useState(() => getLocalToday());

  useEffect(() => {
    const refresh = () => setToday(getLocalToday());
    const timeout = window.setTimeout(refresh, millisecondsUntilNextLocalDay());
    window.addEventListener("focus", refresh);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("focus", refresh);
    };
  }, [today]);

  return today;
}
