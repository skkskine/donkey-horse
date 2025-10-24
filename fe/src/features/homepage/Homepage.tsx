import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../api/api";
import ListItem from "./components/ListItem";

export default function Homepage() {
  const { data } = useQuery({ queryKey: ["getEvents"], queryFn: getEvents });

  const events = (data?.items || []).map((event) => (
    <ListItem event={event}></ListItem>
  ));

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
