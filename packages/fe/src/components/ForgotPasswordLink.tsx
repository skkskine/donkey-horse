import { Link } from "react-router-dom";

export default function ForgotPasswordLink() {
  return (
    <>
      <Link
        to="/forgot-password"
        className=" text-gray-400 mt-3 italic text-xs hover:cursor-pointer hover:underline hover:text-white"
      >
        forgot my password
      </Link>
    </>
  );
}
