import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent } from "@/utils/data";
import { useEvents } from "@/hooks/events-context";
import {
  X,
  AlignLeft,
  CalendarDays,
  FileText,
  Bell,
  Tag,
  History,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatFutureDate, formatPastDate } from "@/utils/date.util";

interface EventViewProps {
  eventCalendars?: CalendarEvent;
}

export function EventView({ eventCalendars }: EventViewProps) {
  const { eventViewOpen, setEventViewOpen, events } = useEvents();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!eventCalendars) return null;

  const filteredEvent = events.find((e) => e.id === eventCalendars.id);
  if (!filteredEvent) return null;

  const isMultiDayEvent = () =>
    new Date(filteredEvent.start_date).toDateString() !==
    new Date(filteredEvent.end_date).toDateString();

  const getDurationInDays = () => {
    const startDate = new Date(filteredEvent.start_date);
    const endDate = new Date(filteredEvent.end_date);
    return Math.ceil(
      Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const maxWords = screenWidth < 640 ? 30 : screenWidth < 1024 ? 50 : 100;
  const shortDescription = filteredEvent.description
    ? filteredEvent.description.split(" ").slice(0, maxWords).join(" ") +
    (filteredEvent.description.split(" ").length > maxWords ? "..." : "")
    : "";

  return (
    <AlertDialog open={eventViewOpen}>
      <AlertDialogContent className={cn(
        "w-full max-w-3xl p-0 bg-white/95 shadow-2xl",
        "border border-gray-200/50",
        "sm:max-h-[90vh] overflow-y-auto",
        "mx-auto sm:mx-4"
      )}>
        <AlertDialogHeader className="p-0">
          {/* Banner Image Section */}
          <div className="relative h-36 sm:h-48 overflow-hidden rounded-t-[7px]">
            {filteredEvent.banner ? (
              <motion.img
                src={filteredEvent.banner}
                alt="Event Banner"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Close Button */}
            <AlertDialogCancel
              onClick={() => setEventViewOpen(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 h-8 w-8 p-0 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all border-0"
            >
              <X className="h-4 w-4 text-white" />
            </AlertDialogCancel>

            {/* Title and Tags Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs sm:text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {filteredEvent.event_type.name.charAt(0).toUpperCase() + filteredEvent.event_type.name.slice(1)}
                  </Badge>
                  {filteredEvent.announce && (
                    <Badge variant="secondary" className="bg-blue-500/20 backdrop-blur-sm text-blue-100 border-0 text-xs sm:text-sm">
                      <Bell className="h-3 w-3 mr-1" />
                      Announced
                    </Badge>
                  )}
                  {filteredEvent.published_at && (
                    <Badge variant="secondary" className="bg-green-500/20 backdrop-blur-sm text-green-100 border-0 text-xs sm:text-sm">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Published
                    </Badge>
                  )}
                </div>
                <AlertDialogTitle className="text-xl sm:text-3xl font-bold line-clamp-2">
                  {filteredEvent.name}
                </AlertDialogTitle>
              </motion.div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 text-sm sm:text-base">
                <Eye className="h-4 w-4 mr-2" />
                View details
              </Button>
            </div>

            <Separator />

            {/* Date Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <CalendarDays className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {isMultiDayEvent() ? `${getDurationInDays()} Day Event` : 'Event Date'}
                  </h3>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Starts: {formatFutureDate(filteredEvent.start_date.toString())}
                  </div>
                  {isMultiDayEvent() && (
                    <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Ends: {formatFutureDate(filteredEvent.end_date.toString())}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Description */}
            {filteredEvent.description && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <AlignLeft className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <h3 className="font-semibold">About this event</h3>
                </div>
                <div className="relative">
                  <p className={cn(
                    "text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed pl-7 whitespace-pre-line",
                    showFullDescription ? "" : ""
                  )}>
                    {showFullDescription ? filteredEvent.description : shortDescription}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 pl-7 mt-1 h-8"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? (
                      <><ChevronUp className="h-4 w-4 mr-1" /> Show Less</>
                    ) : (
                      <><ChevronDown className="h-4 w-4 mr-1" /> Show More</>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* File Attachment */}
            {filteredEvent.file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Button
                  variant="outline"
                  className="w-full text-sm sm:text-base"
                  asChild
                >
                  <a
                    href={filteredEvent.file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Event Materials
                  </a>
                </Button>
              </motion.div>
            )}

            {/* Footer Metadata */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <History className="h-4 w-4 mr-1" />
                Last updated: {formatPastDate(filteredEvent.updated_at.toString())}
              </div>
            </div>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EventView;