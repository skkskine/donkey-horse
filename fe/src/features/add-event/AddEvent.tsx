import { useMutation } from "@tanstack/react-query";
import { addEvent } from "../../api/api";
import { useState } from "react";
import type { Event } from "../../../types/events";

export default function addNewEvent() {
  const [formData, setFormData] = useState<Event>({
    name: "",
    venue: "",
    eventDate: "",
    link: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const mutation = useMutation({
    mutationFn: addEvent,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      eventDate: new Date(formData.eventDate).toLocaleDateString("it-IT"),
    };

    mutation.mutate(dataToSend);
  }

  return (
    <>
      <p className="text-sm mb-3">add your event</p>
      <form
        onSubmit={handleSubmit}
        className="text-sm flex w-full mx-auto max-w-60 flex-col items-center gap-3 [&>input]:border-b [&>input]:outline-0 [&>input]:w-full"
      >
        <input
          name="name"
          placeholder="name"
          required
          value={formData.name}
          onChange={handleChange}
        ></input>
        <input
          name="venue"
          placeholder="venue"
          required
          value={formData.venue}
          onChange={handleChange}
        ></input>
        <input
          name="eventDate"
          placeholder="event date"
          type="date"
          className="w-full"
          required
          value={formData.eventDate}
          onChange={handleChange}
        ></input>
        <input
          name="link"
          placeholder="link"
          value={formData.link}
          onChange={handleChange}
        ></input>
        <button
          type="submit"
          className="border p-2 rounded-md mt-3 hover:bg-white hover:text-black hover:cursor-pointer"
        >
          add event
        </button>
      </form>
    </>
  );
}
