"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  date: Date | null | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  label?: string;
  id?: string;
}

export function TimePicker({ date, setDate, className, label, id }: TimePickerProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value;
    if (!timeString) {
      setDate(undefined);
      return;
    }

    const hours = Number.parseInt(timeString.split(":")[0] || "00", 10);
    const minutes = Number.parseInt(timeString.split(":")[1] || "00", 10);
    const newDate = date ? new Date(date) : new Date();
    newDate.setHours(hours, minutes, 0, 0); // Set hours and minutes, reset seconds and ms
    setDate(newDate);
  };

  // Format the date to HH:MM for the input value
  const timeValue = date
    ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    : "";

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type="time"
        value={timeValue}
        onChange={handleTimeChange}
        className="w-auto" // Allow input to size naturally or be controlled by parent
      />
    </div>
  );
}
