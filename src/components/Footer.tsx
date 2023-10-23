import { V0Logo } from "./v0logo";

const Footer = () => (
  <footer>
    <div className="custom-screen pt-16">
      <div className="mt-10 flex items-center justify-between border-t py-10">
        <p className="text-gray-600">
          Created by{" "}
          <a
            href="https://twitter.com/dominik_moehrle"
            className="transition hover:underline"
          >
            Dominik
          </a>
          {""},{" "}
          <a
            href="https://twitter.com/nutlope"
            className="transition hover:underline"
          >
            Ryan
          </a>{" "}
          and{" "}
          <a
            href="https://twitter.com/kevinhou22"
            className="transition hover:underline"
          >
            Rizwaan
          </a>
          .
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
