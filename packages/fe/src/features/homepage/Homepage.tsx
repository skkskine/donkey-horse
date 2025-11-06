import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../api/events";
import ListItem from "./components/ListItem";
import { useAuth } from "../../contexts/AuthContext";

export default function Homepage() {
  const { isAuthenticated } = useAuth();

  const { data } = useQuery({
    queryKey: ["getEvents"],
    queryFn: () => getEvents(isAuthenticated ? "full" : "next"),
    enabled: isAuthenticated !== undefined,
  });

  const intro = (
    <>
      <p className="uppercase mb-3 text-red-700 italic text-xl">
        i-oooooh, i-oooooooh!!!!!
      </p>
      <p className="text-sm mb-4">donkey horse doesnt understand you</p>
    </>
  );

  if (isAuthenticated === undefined) {
    return <>{intro}</>;
  }

  const events = (data?.items || []).map((event) => (
    <ListItem
      key={event.id}
      isAuthenticated={isAuthenticated}
      event={event}
    ></ListItem>
  ));

  return (
    <>
      {intro}
      <div className="text-center">
        <div className="text-left inline-block">{events}</div>
      </div>
    </>
  );
}
