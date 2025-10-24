import { useMutation, useQuery } from "@tanstack/react-query";
import { addEvent, getEvent, updateEvent } from "../../api/events";
import { useEffect, useState } from "react";
import type { Event } from "../../types/events";
import { useParams } from "react-router-dom";

interface Prop {
  type: "add" | "edit";
}

export default function HandleEvent({ type }: Prop) {
  const initialValue = { name: "", venue: "", eventdate: "", link: "" };

  const [formData, setFormData] = useState<Event>(initialValue);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id } = useParams();

  // edit mode
  const { data, isLoading } = useQuery({
    queryKey: ["getEvent", id],
    queryFn: () => getEvent(id || ""),
    enabled: type === "edit" && !!id,
  });

  const editMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => setIsSubmitting(false),
    onError: () => setIsSubmitting(false),
  });

  // set the form values with the current event
  useEffect(() => {
    if (type === "edit" && data?.item) {
      const event: Event = {
        name: data.item.name,
        eventdate: new Date(data.item.eventdate)
          .toISOString()
          .split("T")[0] as unknown as string,
        venue: data.item.venue,
        link: data.item.link,
      };

      setFormData(event);
    }
  }, [data]);
  // ----

  // add mode
  const addMutation = useMutation({
    mutationFn: addEvent,
    onSuccess: () => setIsSubmitting(false),
    onError: () => setIsSubmitting(false),
  });
  // ----

  // event handlers
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);

    const dataToSend = {
      ...formData,
      eventDate: new Date(formData.eventdate).toLocaleDateString("it-IT"),
    };

    if (type === "add") {
      addMutation.mutate(dataToSend);
    }

    if (type === "edit" && !!id) {
      editMutation.mutate({ id, event: dataToSend });
    }

    setFormData(initialValue);
  }
  // ----

  return (
    <>
      <p className="text-sm mb-3">{type} your event</p>
      <form
        onSubmit={handleSubmit}
        className="text-sm flex w-full mx-auto max-w-60 flex-col items-center gap-3 [&>input]:border-b [&>input]:outline-0 [&>input]:w-full"
      >
        <input
          name="name"
          placeholder="name"
          required
          value={formData.name}
          disabled={isSubmitting || isLoading}
          onChange={handleChange}
        ></input>
        <input
          name="venue"
          placeholder="venue"
          required
          value={formData.venue}
          disabled={isSubmitting || isLoading}
          onChange={handleChange}
        ></input>
        <input
          name="eventdate"
          placeholder="event date"
          type="date"
          className="w-full"
          required
          value={formData.eventdate}
          disabled={isSubmitting || isLoading}
          onChange={handleChange}
        ></input>
        <input
          name="link"
          placeholder="link"
          value={formData.link}
          disabled={isSubmitting || isLoading}
          onChange={handleChange}
        ></input>
        <button
          type="submit"
          className="border p-2 rounded-md mt-3 hover:bg-white hover:text-black hover:cursor-pointer"
          disabled={isSubmitting || isLoading}
        >
          {type} event
        </button>
      </form>
    </>
  );
}
