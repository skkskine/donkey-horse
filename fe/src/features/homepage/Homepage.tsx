import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../api/api";

export default function Homepage() {
  const { data } = useQuery({ queryKey: ["getEvents"], queryFn: getEvents });

  const events = data?.items.map((event) => {
    return (
      <div key={event.id}>
        <span>{new Date(event.eventdate).toLocaleDateString("it-IT")}</span>
        {" -> "}
        <span>{event.name}</span> @{" "}
        {event.link ? (
          <a href={event.link} target="_blank" className="underline">
            {event.venue}
          </a>
        ) : (
          <span>{event.venue}</span>
        )}
      </div>
    );
  });

  return (
    <>
      <p className="text-sm mb-3">
        donkey horse is a minimal event aggreator for your diy and local events
        <br />
        atm in alpha stage, if you want to add your events ask!
      </p>
      {events}
    </>
  );
}
