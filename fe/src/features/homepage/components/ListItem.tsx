import { Link } from "react-router-dom";
import type { EventData } from "../../../../types/events";

interface Prop {
  event: EventData;
}

export default function ListIteme({ event }: Prop) {
  return (
    <div key={event.id} className="flex">
      <Link to={"/edit-event/" + event.id} className="mr-2 underline">
        [edit]
      </Link>
      <div className="shrink-0">
        <span className="text-orange-300 italic">
          {new Date(event.eventdate).toLocaleDateString("it-IT")}
        </span>
        <span className="text-blue-600">{" ---> "}</span>
      </div>
      <div className="pl-1.5">
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
