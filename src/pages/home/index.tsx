import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useBreadcrumb } from "@/providers/breadcrumb-provider";
import { v4 as uuidv4 } from "uuid";
import { formatFutureDate } from "@/utils/date.util";
import { apiClient } from "@/services/api";
import { Announcement } from "../events/announcements";
// import { API_ENDPOINTS } from "@/lib/constants";

export type Announcement = {
  id: string;
  name: string;
  description: string;
  start_date: Date;
  banner: string;
};

export function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [, setBreadcrumbs] = useBreadcrumb();
  const [annonouncements, setAnnonouncements] = useState<Announcement[]>([]);
  const [upComingEvents, setUpComingEvents] = useState<Announcement[]>([]);
  const [recently, setRecently] = useState<Announcement[]>([]);

  useEffect(() => {
    getAnnonouncements();
    setBreadcrumbs([{ name: "Home" }]);
    return () => setBreadcrumbs(null);
  }, [setBreadcrumbs]);

  const getAnnonouncements = async () => {
    const response = await apiClient.get(
      "project/announcement?page=1&pageSize=3"
    );
    const { data, meta } = response as any as {
      data: Announcement[];
      meta: { total: number; totalPages: number };
    };
    setAnnonouncements(data)    
  };

  const getUpComingEvents = async () => {
    const response = await apiClient.get(
      "project/upcommming?page=1&pageSize=3&start=2025-02-01&end=2025-02-09 "
    );
    const { data, meta } = response as any as {
      data: Announcement[];
      meta: { total: number; totalPages: number };
    };
    setUpComingEvents(data);
  }

  const events = [
    {
      id: uuidv4(),
      name: "Quick Stats",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: new Date("2025-02-08T14:09:12.879Z"),
      dateEnd: new Date(),
    },
    {
      id: uuidv4(),
      name: "Recent Activity",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: new Date(),
      dateEnd: new Date(),
    },
    {
      id: uuidv4(),
      name: "Notifications",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: new Date(),
      dateEnd: new Date(),
    },
    {
      id: uuidv4(),
      name: "Tasks",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: new Date(),
      dateEnd: new Date(),
    },
    {
      id: uuidv4(),
      name: "Messages",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: new Date(),
      dateEnd: new Date(),
    },
    {
      id: uuidv4(),
      name: "Calendar",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: new Date(),
      dateEnd: new Date(),
    },
    {
      id: uuidv4(),
      name: "Projects",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: new Date(),
      dateEnd: new Date(),
    },
    {
      id: uuidv4(),
      name: "Reports",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nihil deserunt soluta, accusantium, cum eos mollitia quas esse eligendi, dicta labore ad optio vitae similique ullam nesciunt pariatur rerum? Asperiores?",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: new Date(),
      dateEnd: new Date(),
    },
    {
      id: uuidv4(),
      name: "Settings",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: new Date(),
      dateEnd: new Date(),
    },
  ];

  const CardSection = ({
    name,
    cards,
    nextPage,
  }: {
    name: string;
    cards: Announcement[];
    nextPage: string;
  }) => {
    return (
      <>
      {cards.length !== 0 && (
        <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          {/* Show "See More" button on larger screens */}
          <button
          onClick={() => window.location.href = nextPage}
          className="hidden md:block text-sm text-blue-600 hover:underline"
          >
          See More
          </button>
        </div>
        <div className="w-full max-w-[calc(100vw-2rem)] md:max-w-full">
          <div className="flex overflow-x-auto scrollbar-hide md:grid md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Card
            key={card.id}
            className="flex-shrink-0 w-72 md:w-full cursor-pointer transition-all hover:shadow-lg overflow-hidden"
            onClick={() => console.log(card.id)}
            >
            <div className="flex flex-col h-full">
              <div className="w-full h-36 relative">
              <img
                src={card.banner}
                className="w-full h-full object-cover"
                alt={card.name}
              />
              </div>
              <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 line-clamp-1 hover:line-clamp-none transition-all">
                {card.name}
              </h3>
              <p className="text-gray-500 line-clamp-2 hover:line-clamp-none transition-all h-12">
                {card.description}
              </p>
              <p className="text-gray-500 hover:line-clamp-none transition-all">
                {formatFutureDate(card.start_date.toString())}
              </p>
              </div>
            </div>
            </Card>
          ))}

          {/* Add "See More" card on mobile if it's the last one */}
          <Card
            key="see-more"
            className="flex-shrink-0 w-72 md:hidden cursor-pointer transition-all hover:shadow-lg overflow-hidden flex items-center justify-center"
            onClick={() => window.location.href = nextPage}
          >
            <p className="text-blue-600 font-semibold">See More</p>
          </Card>
          </div>
        </div>
        </div>
      )}
      </>
    );
  };

  return (
    <div className="space-y-8 p-4">
      {isAuthenticated && (
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back,{" "}
          {user?.username ?? user?.email?.split("@")[0] ?? user?.email ?? ""}!
        </h1>
      )}
      <CardSection name="Announcements" cards={annonouncements} nextPage={`/announcements`} />
      <CardSection name="Up Comming" cards={upComingEvents} nextPage={`/upcomming`} />
      {/* <CardSection name="Quick Activity" cards={events} />
      <CardSection name="Recent Activity" cards={events} /> */}
    </div>
  );
}
