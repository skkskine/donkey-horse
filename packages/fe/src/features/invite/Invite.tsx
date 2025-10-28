import { useMutation } from "@tanstack/react-query";
import Button from "../../components/Button";
import { createInvitationid } from "../../api/invite";
import { useState } from "react";

export default function Invite() {
  const [invitationId, setInvitationId] = useState("");

  const invitationLink = `https://${document.location.hostname}/register/${invitationId}`;

  const createInvitationidMutation = useMutation({
    mutationFn: createInvitationid,
    onSuccess: ({ item }) => {
      setInvitationId(item.invitationid);
    },
  });

  function handleClick() {
    createInvitationidMutation.mutate();
  }

  return (
    <div className="text-sm">
      <p>generate a link to invite someone to donkey horse</p>
      <Button className="mt-4" onClick={handleClick}>
        generate
      </Button>

      {invitationId && (
        <p className="mt-4">
          <a>{invitationLink}</a>
        </p>
      )}
    </div>
  );
}
