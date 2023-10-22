import { V0Logo } from "./v0logo";

const Footer = () => (
  <footer>
    <div className="custom-screen pt-16">
      <div className="mt-10 flex items-center justify-between border-t py-10">
        <p className="text-gray-600">
          Created by{" "}
          <a
            href="https://twitter.com/nutlope"
            className="transition hover:underline"
          >
            Hassan
          </a>{" "}
          and{" "}
          <a
            href="https://twitter.com/kevinhou22"
            className="transition hover:underline"
          >
            Kevin
          </a>
          .
        </p>
        <div className="flex items-center gap-x-6 text-gray-400">
          <a
            className="flex gap-1 rounded-md border border-slate-200 px-3 py-1 tracking-tight transition hover:scale-105"
            href="https://v0.dev/"
            target="_blank"
          >
            <span className="text-gray-500">Built with</span>
            <V0Logo width={25} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
