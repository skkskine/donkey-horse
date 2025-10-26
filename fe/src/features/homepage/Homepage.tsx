import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../api/events";
import ListItem from "./components/ListItem";
import { useAuth } from "../../contexts/AuthContext";

export default function Homepage() {
  const { isAuthenticated } = useAuth();
  const { data } = useQuery({ queryKey: ["getEvents"], queryFn: getEvents });

  const events = (data?.items || []).map((event) => (
    <ListItem
      key={event.id}
      isAuthenticated={isAuthenticated}
      event={event}
    ></ListItem>
  ));

  return (
    <>
      <p className="uppercase mb-3 text-red-700 italic text-xl">
        i-oooooh, i-oooooooh!!!!!
      </p>
      <p className="text-sm mb-4">
        donkey horse doesnt understand you
        <br />
        atm in alpha, if you want to add your events look{" "}
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
