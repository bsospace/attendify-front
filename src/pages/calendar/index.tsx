import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';
import { EventsProvider } from '@/hooks/events-context';
import { Tabs, TabsContent, TabsList } from '@radix-ui/react-tabs';
import { Separator } from '@radix-ui/react-separator';
import Calendar from '@/components/calendar';

export function CalendarPage() {
  const [, setBreadcrumbs] = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { name: "Calendar" }
    ]);

    return () => setBreadcrumbs(null);
  }, [setBreadcrumbs]);


  return (
    <EventsProvider>
      <div className="py-4">
        <Tabs
          defaultValue="calendar"
          className="flex flex-col w-full items-center"
        >
          <TabsList className="flex justify-center mb-2">
          </TabsList>
          <TabsContent value="calendar" className="w-full space-y-5">
            <div className="space-y-0">
              <h2 className="flex items-center text-2xl font-semibold tracking-tight md:text-3xl">
                Calendar
              </h2>
              <p className="text-xs md:text-sm font-medium">
                A calendar built to help you manage your events.
              </p>
            </div>

            <Separator />
            <Calendar />
          </TabsContent>
          <TabsContent
            value="schedulingAssistant"
            className="w-full px-5 space-y-5"
          >
            <div className="space-y-0">
              <h2 className="flex items-center text-2xl font-semibold tracking-tight md:text-3xl">
                Scheduling Assistant
              </h2>
              <p className="text-xs md:text-sm font-medium">
                A scheduling assistant built to analyze a user&apos;s schedule
                and automatically show open spots.
              </p>
            </div>
            <Separator />
            {/* <AvailabilityChecker /> */}
          </TabsContent>
        </Tabs>
      </div>
    </EventsProvider>
  );

}