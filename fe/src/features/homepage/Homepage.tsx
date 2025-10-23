import { useMutation } from "@tanstack/react-query";
import { addEvent } from "../../api/api";

export default function Homepage() {
  /*const { data } = useQuery({
    queryKey: ["getEventsList"],
    queryFn: getEventsList,
  });

  console.log(data);*/

  const mutation = useMutation({
    mutationFn: addEvent,
  });

  return (
    <>
      <button
        onClick={() =>
          mutation.mutate({
            name: "primo evento",
            venue: "nadir",
            eventDate: new Date(),
            link: "bel link",
          })
        }
      >
        add entry
      </button>
    </>
  );
}
