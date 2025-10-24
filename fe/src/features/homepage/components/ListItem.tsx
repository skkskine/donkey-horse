import { Link } from "react-router-dom";
import type { EventData } from "../../../types/events";

interface Prop {
  event: EventData;
  isAuthenticated: boolean;
}

export default function ListItem({ isAuthenticated, event }: Prop) {
  return (
    <div className="sm:flex mb-2 sm:mb-0">
      {isAuthenticated && (
        <Link to={"/edit-event/" + event.id} className="mr-2 underline">
          [edit]
        </Link>
      )}
      <div className="shrink-0">
        <span className="text-orange-300 italic">
          {new Date(event.eventdate).toLocaleDateString("it-IT")}
        </span>
        <span className="text-blue-600 hidden sm:inline">{" ---> "}</span>
      </div>
      <div className="sm:pl-1.5">
        <span className="text-yellow-300"> {event.name}</span>{" "}
        <span className="text-green-500">@</span>{" "}
        {event.link ? (
          <a
            href={event.link}
            target="_blank"
            className="underline text-yellow-300"
          >
            {event.venue}
          </a>
        ) : (
          <span className="text-yellow-300">{event.venue}</span>
        )}
      </div>
    </div>
  );
}
