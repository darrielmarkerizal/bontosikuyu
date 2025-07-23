"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface DatePickerWithRangeProps {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePickerWithRange({
  date,
  onDateChange,
  placeholder = "Pilih tanggal",
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal truncate",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate text-sm">
              {date?.from ? (
                date.to ? (
                  <>
                    <span className="hidden sm:inline">
                      {format(date.from, "dd MMM yyyy", { locale: id })} -{" "}
                      {format(date.to, "dd MMM yyyy", { locale: id })}
                    </span>
                    <span className="sm:hidden">
                      {format(date.from, "dd/MM", { locale: id })} -{" "}
                      {format(date.to, "dd/MM", { locale: id })}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">
                      {format(date.from, "dd MMM yyyy", { locale: id })}
                    </span>
                    <span className="sm:hidden">
                      {format(date.from, "dd/MM/yy", { locale: id })}
                    </span>
                  </>
                )
              ) : (
                <span className="text-sm">{placeholder}</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={window.innerWidth < 768 ? 1 : 2}
            locale={id}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
