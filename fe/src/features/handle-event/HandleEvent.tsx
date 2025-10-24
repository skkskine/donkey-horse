import { useMutation, useQuery } from "@tanstack/react-query";
import { addEvent, deleteEvent, getEvent, updateEvent } from "../../api/events";
import { useEffect, useState } from "react";
import type { Event } from "../../types/events";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";

interface Prop {
  type: "add" | "edit";
}

export default function HandleEvent({ type }: Prop) {
  const initialValue = { name: "", venue: "", eventdate: "", link: "" };

  const [formData, setFormData] = useState<Event>(initialValue);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // edit mode
  const { data } = useQuery({
    queryKey: ["getEvent", id],
    queryFn: () => getEvent(id || ""),
    enabled: type === "edit" && !!id,
  });

  const editMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      setIsSubmitting(false);
      setFormData(initialValue);
      navigate("/");
    },
    onError: () => setIsSubmitting(false),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      setIsSubmitting(false);
      setFormData(initialValue);
      navigate("/");
    },
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
    onSuccess: () => {
      setFormData(initialValue);
      navigate("/");
    },
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
  }

  function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (id) {
      deleteMutation.mutate({ id });
    }
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
          disabled={isSubmitting}
          onChange={handleChange}
        ></input>
        <input
          name="venue"
          placeholder="venue"
          required
          value={formData.venue}
          disabled={isSubmitting}
          onChange={handleChange}
        ></input>
        <input
          name="eventdate"
          placeholder="event date"
          type="date"
          className="w-full"
          required
          value={formData.eventdate}
          disabled={isSubmitting}
          onChange={handleChange}
        ></input>
        <input
          name="link"
          placeholder="link"
          value={formData.link}
          disabled={isSubmitting}
          onChange={handleChange}
        ></input>
        <Button type="submit" className="mt-4" disabled={isSubmitting}>
          {type} event
        </Button>
        {type === "edit" && (
          <Button styleType="danger" onClick={() => handleDelete}>
            delete event
          </Button>
        )}
      </form>
    </>
  );
}
