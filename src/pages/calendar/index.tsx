import { useEffect } from "react";
import { useBreadcrumb } from "@/providers/breadcrumb-provider";
import { useEvents } from "@/hooks/events-context";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import Calendar from "@/components/calendar";

export function CalendarPage() {
  const [, setBreadcrumbs] = useBreadcrumb();
  const { fetchEvents } = useEvents();

  useEffect(() => {
    setBreadcrumbs([{ name: "Calendar" }]);
    fetchEvents();
    return () => setBreadcrumbs(null);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="flex items-center text-2xl font-semibold tracking-tight md:text-3xl">
            Calendar
          </h2>
          <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 py-4">
            A calendar built to help you manage your events.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Calendar />
        </motion.div>
        <Separator />
      </motion.div>
    </>
  );
}

export default CalendarPage;
