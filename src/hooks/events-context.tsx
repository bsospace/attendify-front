import { apiClient } from "@/services/api";
import { CalendarEvent } from "@/utils/data";
import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { event } from "@/interface";

interface EventsContextType {
  calendarEvents: CalendarEvent[];
  fetchEvents: () => void;
  setCalendarEvents: (events: CalendarEvent[]) => void;
  events: event[];
  addEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  eventViewOpen: boolean;
  setEventViewOpen: (value: boolean) => void;
  eventAddOpen: boolean;
  setEventAddOpen: (value: boolean) => void;
  eventEditOpen: boolean;
  setEventEditOpen: (value: boolean) => void;
  eventDeleteOpen: boolean;
  setEventDeleteOpen: (value: boolean) => void;
  availabilityCheckerEventAddOpen: boolean;
  setAvailabilityCheckerEventAddOpen: (value: boolean) => void;
  start: Date;
  setStart: (value: Date) => void;
  end: Date;
  setEnd: (value: Date) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};

const getPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const pastel = `hsl(${hue}, 80%, 85%)`;
  return pastel;
};

export const EventsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [events, setEvents] = useState<event[]>([]);
  const [eventViewOpen, setEventViewOpen] = useState(false);
  const [eventAddOpen, setEventAddOpen] = useState(false);
  const [eventEditOpen, setEventEditOpen] = useState(false);
  const [eventDeleteOpen, setEventDeleteOpen] = useState(false);
  const [availabilityCheckerEventAddOpen, setAvailabilityCheckerEventAddOpen] =
    useState(false);

  const [start, setStart] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  });
  const [end, setEnd] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });

  // ⏳ Fetch Events from API on mount
  const fetchEvents = async () => {
    try {
      const response = await apiClient.get(`/project/upcomming?start=${start.toISOString().split('T')[0]}&end=${end.toISOString()}`);

      if (!response?.data) {
        return;
      }

      const formattedEvents = (response as { data: event[] }).data.map((event: event) => ({
        id: event.id,
        name: event.name,
        event_type_id: event.event_type_id,
        event_type: event.event_type,
        start_date: event.start_date,
        end_date: event.end_date,
        announce: event.announce,
        published_at: event.published_at,
        description: event.description || "",
        banner: event.banner,
        year: event.year,
        file: event.file,
        created_at: event.created_at,
        updated_at: event.updated_at,
        deleted_at: event.deleted_at,
      }));

      setEvents(formattedEvents);

      const calendarEvents = formattedEvents.map((event) => ({
        id: event.id,
        title: event.name,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        description: event.description,
        backgroundColor: getPastelColor(),
      }));

      setCalendarEvents(calendarEvents);

    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [start, end]);

  const addEvent = (event: CalendarEvent) => {
    setCalendarEvents((prevEvents) => [...prevEvents, { ...event, color: getPastelColor() }]);
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  return (
    <EventsContext.Provider
      value={{
        fetchEvents,
        calendarEvents,
        setCalendarEvents,
        events,
        addEvent,
        deleteEvent,
        eventViewOpen,
        setEventViewOpen,
        eventAddOpen,
        setEventAddOpen,
        eventEditOpen,
        setEventEditOpen,
        eventDeleteOpen,
        setEventDeleteOpen,
        availabilityCheckerEventAddOpen,
        setAvailabilityCheckerEventAddOpen,
        start,
        setStart,
        end,
        setEnd,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
