import { Link } from "react-router-dom";
import packageJson from "../../package.json";

export default function Footer() {
  return (
    <footer className="text-xs p-3">
      donkey horse {packageJson.version} -{" "}
      <a href="https://github.com/skkskine/donkey-horse" target="_blank">
        github
      </a>
      {" - "}
      <Link to="/contacts">contacts</Link>
    </footer>
  );
}
