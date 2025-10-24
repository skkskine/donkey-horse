import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../api/api";
import { Link } from "react-router-dom";

export default function Homepage() {
  const { data } = useQuery({ queryKey: ["getEvents"], queryFn: getEvents });

  const events = (data?.items || []).map((event) => {
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
  });

  return (
    <>
      <p className="uppercase mb-3 text-red-700 italic text-xl">
        i-oooooh, i-oooooooh!!!!!
      </p>
      <p className="text-sm mb-4">
        donkey horse doesnt understand you
        <br />
        atm in alpha, if you want to add your events sniff{" "}
        <a href="mailto:gianmaria@tuta.com" className="underline">
          here
        </a>
      </p>
      <div className="text-center">
        <div className="text-left inline-block">{events}</div>
      </div>
    </>
  );
}
