import { useQuery } from "@tanstack/react-query";
import { getEventsList } from "../../api/api";

export default function Homepage() {
  const { data } = useQuery({
    queryKey: ["getEventsList"],
    queryFn: getEventsList,
  });

  console.log(data);

  return <></>;
}
