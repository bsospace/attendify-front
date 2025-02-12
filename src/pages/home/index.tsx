import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useBreadcrumb } from "@/providers/breadcrumb-provider";
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
  // const { user, isAuthenticated } = useAuth();
  const [, setBreadcrumbs] = useBreadcrumb();
  const [annonouncements, setAnnonouncements] = useState<Announcement[]>([]);
  const [upComingEvents, setUpComingEvents] = useState<Announcement[]>([]);
  const [recently, setRecently] = useState<Announcement[]>([]);

  useEffect(() => {
    getAnnonouncements();
    getUpComingEvents();
    setBreadcrumbs([{ name: "Home" }]);
    return () => setBreadcrumbs(null);
  }, []);

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
      "project/upcomming?page=1&pageSize=3&start=2025-02-01&end=2025-02-15"
    );
    const { data, meta } = response as any as {
      data: Announcement[];
      meta: { total: number; totalPages: number };
    };
    setUpComingEvents(data);
  }

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
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
                <span className="text-sm text-gray-500">({cards.length})</span>
              </div>
              <button
                onClick={() => window.location.href = nextPage}
                className="hidden md:flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                See More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="w-full max-w-[calc(100vw-4rem)] md:max-w-full">
              <div className="flex overflow-x-auto scrollbar-hide md:grid md:grid-cols-3 gap-4 pb-4">
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    className="flex-shrink-0 w-72 md:w-full cursor-pointer transition-all hover:shadow-lg overflow-hidden group"
                    onClick={() => console.log(card.id)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="w-full h-36 relative overflow-hidden">
                        <img
                          src={card.banner}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          alt={card.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        {card.event_type && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs">
                            {card.event_type.name}
                          </div>
                        )}
                        {card.file && (
                          <div className="absolute top-2 right-2 bg-white/80 text-gray-700 p-1 rounded-full">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {card.name}
                        </h3>
                        <p className="text-gray-500 line-clamp-2 group-hover:line-clamp-none transition-all h-12">
                          {card.description}
                        </p>
                        <div className="mt-3 space-y-1">
                          <p className="text-gray-500 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatFutureDate(card.start_date)} - {formatFutureDate(card.end_date)}
                          </p>
                          <p className="text-gray-500 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Published: {formatFutureDate(card.published_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                <Card
                  key="see-more"
                  className="flex-shrink-0 w-72 md:hidden cursor-pointer transition-all hover:shadow-lg overflow-hidden flex items-center justify-center h-36"
                  onClick={() => window.location.href = nextPage}
                >
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <span>See More</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
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
      <CardSection name="Announcements" cards={annonouncements} nextPage={`/announcements`} />
      <CardSection name="Up Comming" cards={upComingEvents} nextPage={`/upcomming`} />
      {/* <CardSection name="Quick Activity" cards={events} />
      <CardSection name="Recent Activity" cards={events} /> */}
    </div>
  );
}
