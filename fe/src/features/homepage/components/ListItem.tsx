import { Link } from "react-router-dom";
import type { EventData } from "../../../types/events";

interface Prop {
  event: EventData;
  isAuthenticated: boolean;
}

function formatTime(time: string) {
  const timeWithoutTimezone = time.split("+")[0];
  return timeWithoutTimezone.substring(0, 5);
}

export default function ListItem({ isAuthenticated, event }: Prop) {
  return (
    <div className="sm:flex mb-2 text-center sm:text-left">
      {isAuthenticated && (
        <Link to={"/edit-event/" + event.id} className="mr-2 underline">
          [edit]
        </Link>
      )}
      <div className="shrink-0">
        <span className="text-orange-300 italic">
          {new Date(event.eventdate).toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
          })}
        </span>
        <span className="text-blue-600 hidden sm:inline">{" ---> "}</span>
      </div>
      <div className="sm:pl-1.5">
        <span className="text-yellow-300"> {event.name.toLowerCase()}</span>{" "}
        <span className="text-green-500">@</span>{" "}
        {event.link ? (
          <a
            href={event.link}
            target="_blank"
            className="underline text-yellow-300"
          >
            {event.venue.toLowerCase()}
          </a>
        ) : (
          <span className="text-yellow-300">{event.venue.toLowerCase()}</span>
        )}
        <span className="text-sm italic text-yellow-200">
          {" "}
          {event.eventtime && `(${formatTime(event.eventtime)})`}
        </span>
        {event.city && (
          <span className="italic text-green-300 text-sm">
            {" "}
            &#60;{event.city}&#62;
          </span>
        )}
      </div>
    </div>
  );
}
