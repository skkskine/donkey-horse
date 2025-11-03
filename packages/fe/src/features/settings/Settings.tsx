import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../api/settings";
import { useEffect, useState } from "react";
import type SettingsData from "../../types/settings";
import Input from "../../components/Input";

export default function Settings() {
  const [formData, setFormData] = useState<SettingsData>();

  const { data: settings } = useQuery({
    queryKey: ["getSettings"],
    queryFn: getSettings,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    setFormData(updatedFormData as SettingsData);
  };

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  return (
    <form className="text-sm flex flex-col gap-3 mx-auto max-w-60 ">
      <Input
        name="smtp_user"
        placeholder="smtp user"
        value={formData?.smtp_host}
        onChange={handleChange}
      ></Input>
      <Input
        name="smtp_password"
        placeholder="smtp password"
        value={formData?.smtp_password}
        onChange={handleChange}
      ></Input>
      <Input
        name="smtp_host"
        placeholder="smtp host"
        value={formData?.smtp_host}
        onChange={handleChange}
      ></Input>
      <Input
        name="smtp_port"
        placeholder="smtp port"
        value={formData?.smtp_port}
        onChange={handleChange}
      ></Input>
    </form>
  );
}
