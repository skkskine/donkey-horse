import { useMutation } from "@tanstack/react-query";
import { addEvent } from "../../api/api";

export default function addNewEvent() {
  const mutation = useMutation({
    mutationFn: addEvent,
  });

  function handleSubmit() {
    mutation.mutate({
      name: "primo evento",
      venue: "nadir",
      eventDate: new Date(),
      link: "bel link",
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <button type="submit">add</button>
      </form>
    </>
  );
}
