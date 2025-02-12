import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useBreadcrumb } from "@/providers/breadcrumb-provider";
import { formatFutureDate } from "@/utils/date.util";
import { apiClient } from "@/services/api";
import { event } from "@/interface";
import { motion } from "framer-motion";

export function HomePage() {
  const [, setBreadcrumbs] = useBreadcrumb();
  const [annonouncements, setAnnonouncements] = useState<event[]>([]);
  const [upComingEvents, setUpComingEvents] = useState<event[]>([]);
  const [metaAnnonouncements, setMetaAnnonouncements] = useState({ total: 0, totalPages: 0 });
  const [metaUpComingEvents, setMetaUpComingEvents] = useState({ total: 0, totalPages: 0 });

  const [isLoadingAnnoncements, setIsLoadingAnnoncements] = useState(true);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);

  useEffect(() => {
    getAnnonouncements();
    getUpComingEvents();
    setBreadcrumbs([{ name: "Home" }]);
    return () => setBreadcrumbs(null);
  }, []);

  const getAnnonouncements = async () => {
    setIsLoadingAnnoncements(true);
    try {
      const response = await apiClient.get("project/announcement?page=1&pageSize=3");
      const { data, meta } = response as any as { data: event[]; meta: { total: number; totalPages: number } };
      setAnnonouncements(data);
      setMetaAnnonouncements(meta);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setIsLoadingAnnoncements(false);
    }
  };

  const getUpComingEvents = async () => {
    setIsLoadingUpcoming(true);
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 10);

      const formattedStart = new Date().toISOString().split("T")[0];
      const formattedEnd = endDate.toISOString().split("T")[0];

      const response = await apiClient.get(
        `project/upcomming?page=1&pageSize=3&start=${formattedStart}&end=${formattedEnd}`
      );

      const { data, meta } = response as any as { data: event[]; meta: { total: number; totalPages: number } };

      setUpComingEvents(data);
      setMetaUpComingEvents(meta);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    } finally {
      setIsLoadingUpcoming(false);
    }
  };

  const CardSection = ({
    name,
    cards,
    nextPage,
    meta,
    isLoading,
  }: {
    name: string;
    cards: event[];
    nextPage: string;
    meta?: { total: number; totalPages: number };
    isLoading: boolean;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
            <span className="text-sm text-gray-500">({meta?.total})</span>
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
            {isLoading ? (
              [...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-72 md:w-full p-4 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-full h-36 bg-gray-400 rounded-md"></div>
                  <div className="mt-4 space-y-2">
                    <div className="w-3/4 h-5 bg-gray-400 rounded-md"></div>
                    <div className="w-1/2 h-4 bg-gray-400 rounded-md"></div>
                  </div>
                </motion.div>
              ))
            ) : (
              cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
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
                            {formatFutureDate(card.start_date.toString())} - {formatFutureDate(card.end_date.toString())}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 p-4">
      <CardSection name="Announcements" cards={annonouncements} meta={metaAnnonouncements} nextPage="/announcements" isLoading={isLoadingAnnoncements} />
      <CardSection name="Up Coming" cards={upComingEvents} meta={metaUpComingEvents} nextPage="/upcomming" isLoading={isLoadingUpcoming} />
    </div>
  );
}
