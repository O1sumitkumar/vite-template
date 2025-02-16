import { Link } from "@heroui/link";
import { FC } from "react";

import { Navbar } from "@/components/navbar";

interface DefaultLayoutProps {
  children: React.ReactNode;
  pt?: number;
  isCenter?: boolean;
}

const DefaultLayout: FC<DefaultLayoutProps> = ({
  children,
  pt = 16,
  isCenter = false,
}) => {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main
        className={`container mx-auto max-w-7xl px-6 flex-grow pt-${pt} ${isCenter ? "flex items-center justify-center" : ""}`}
      >
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com"
          title="heroui.com homepage"
        >
          <span className="text-default-600">©</span>
          <p className="text-primary">Atlantis Software Inc.</p>
        </Link>
      </footer>
    </div>
  );
};

export default DefaultLayout;
