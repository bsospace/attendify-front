"use client";

import { cn } from "@/lib/utils";
import { months } from "@/utils/data";
import { calendarRef } from "@/utils/data";
import { Button } from "@/components/ui/button";
import {
  generateDaysInMonth,
  goToday,
  handleDayChange,
  handleMonthChange,
  handleYearChange,
} from "@/utils/calendar-utils";

import { useState } from "react";
import {
  Check,
  ChevronsUpDown,
  GalleryVertical,
  Table,
  Tally3,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setView } from "@/utils/calendar-utils";
import { useEvents } from "@/hooks/events-context";

interface CalendarNavProps {
  calendarRef: calendarRef;
  viewedDate: Date;
}

export default function CalendarNav({ calendarRef, viewedDate }: CalendarNavProps) {
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const { setStart, setEnd } = useEvents();

  const selectedMonth = viewedDate.getMonth() + 1;
  const selectedDay = viewedDate.getDate();
  const selectedYear = viewedDate.getFullYear();

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const dayOptions = generateDaysInMonth(daysInMonth);

  const [daySelectOpen, setDaySelectOpen] = useState(false);
  const [monthSelectOpen, setMonthSelectOpen] = useState(false);

  return (
    <div className="flex flex-wrap min-w-full justify-center gap-3 px-10">
      <div className="flex flex-row space-x-1">
        {/* Day Picker */}
        {currentView === "timeGridDay" && (
          <Popover open={daySelectOpen} onOpenChange={setDaySelectOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-20 justify-between text-xs font-semibold">
                {selectedDay ? dayOptions.find((day) => day.value === String(selectedDay))?.label : "Select day..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search day..." />
                <CommandList>
                  <CommandEmpty>No day found.</CommandEmpty>
                  <CommandGroup>
                    {dayOptions.map((day) => (
                      <CommandItem
                        key={day.value}
                        value={day.value}
                        onSelect={(currentValue) => {
                          handleDayChange(calendarRef, viewedDate, currentValue);
                          setDaySelectOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", String(selectedDay) === day.value ? "opacity-100" : "opacity-0")} />
                        {day.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {/* Month Picker */}
        <Popover open={monthSelectOpen} onOpenChange={setMonthSelectOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="flex w-[105px] justify-between p-2 text-xs font-semibold md:text-sm md:w-[120px]">
              {selectedMonth ? months.find((month) => month.value === String(selectedMonth))?.label : "Select month..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search month..." />
              <CommandList>
                <CommandEmpty>No month found.</CommandEmpty>
                <CommandGroup>
                  {months.map((month) => (
                    <CommandItem
                      key={month.value}
                      value={month.value}
                      onSelect={(currentValue) => {
                        const newStart = new Date(selectedYear, Number(currentValue) - 7, 1);
                        const newEnd = new Date(selectedYear, Number(currentValue), +7);

                        handleMonthChange(calendarRef, viewedDate, currentValue);
                        setStart(newStart);
                        setEnd(newEnd);
                        setMonthSelectOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", String(selectedMonth) === month.value ? "opacity-100" : "opacity-0")} />
                      {month.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Year Picker */}
        <Input
          className="w-[75px] md:w-[85px] text-xs md:text-sm font-semibold"
          type="number"
          value={selectedYear}
          onChange={(event) => handleYearChange(calendarRef, viewedDate, event)}
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {/* Button to go to current date */}
        <Button className="w-[90px] text-xs md:text-sm" variant="outline" onClick={() => goToday(calendarRef)}>
          {currentView === "timeGridDay" ? "Today" : currentView === "timeGridWeek" ? "This Week" : "This Month"}
        </Button>

        {/* View Tabs */}
        <Tabs defaultValue="dayGridMonth">
          <TabsList className="flex w-44 md:w-64">
            <TabsTrigger value="timeGridDay" onClick={() => setView(calendarRef, "timeGridDay", setCurrentView)}>
              <GalleryVertical className="h-5 w-5" />
              {currentView === "timeGridDay" && <p className="text-xs md:text-sm">Day</p>}
            </TabsTrigger>
            <TabsTrigger value="timeGridWeek" onClick={() => setView(calendarRef, "timeGridWeek", setCurrentView)}>
              <Tally3 className="h-5 w-5" />
              {currentView === "timeGridWeek" && <p className="text-xs md:text-sm">Week</p>}
            </TabsTrigger>
            <TabsTrigger value="dayGridMonth" onClick={() => setView(calendarRef, "dayGridMonth", setCurrentView)}>
              <Table className="h-5 w-5 rotate-90" />
              {currentView === "dayGridMonth" && <p className="text-xs md:text-sm">Month</p>}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
