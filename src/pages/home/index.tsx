import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useBreadcrumb } from "@/providers/breadcrumb-provider";
import { v4 as uuidv4 } from "uuid";

export function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [, setBreadcrumbs] = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([{ name: "Home" }]);
    return () => setBreadcrumbs(null);
  }, [setBreadcrumbs]);

  const events = [
    {
      id: uuidv4(),
      name: "Quick Stats",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Recent Activity",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Notifications",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Tasks",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Messages",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Calendar",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Projects",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Reports",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nihil deserunt soluta, accusantium, cum eos mollitia quas esse eligendi, dicta labore ad optio vitae similique ullam nesciunt pariatur rerum? Asperiores?",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Settings",
      description: "Your description here",
      banner:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      date: new Date().toISOString(),
    },
  ];

  const CardSection = ({
    name,
    cards,
  }: {
    name: string;
    cards: { name: string; description: string; banner: string; date: string }[];
  }) => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
      <div className="w-full max-w-[calc(100vw-2rem)] md:max-w-full">
        <div className="flex overflow-x-auto scrollbar-hide md:grid md:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <Card
              key={index}
              className="flex-shrink-0 w-72 md:w-full cursor-pointer transition-all hover:shadow-lg overflow-hidden"
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
                  <p className="text-gray-500 line-clamp-2 hover:line-clamp-none transition-all">
                    {card.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-4">
      {isAuthenticated && (
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back,{" "}
          {user?.username ?? user?.email?.split("@")[0] ?? user?.email ?? ""}!
        </h1>
      )}

      <CardSection name="Notifications" cards={events} />
      <CardSection name="Quick Activity" cards={events} />
      <CardSection name="Recent Activity" cards={events} />
    </div>
  );
}