import { Home, ChevronRight } from "lucide-react";

const Breadcrumb = ({ pages }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center text-sm text-[#454545]">
        <li>
          <a href="/landing" className="hover:text-white flex items-center gap-1">
            <span className="sr-only">Home</span>
            Home
          </a>
        </li>
        {pages?.length>0&&pages.map((page, index) => (
          <li key={page.name} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-2" />
            <a
              href={page.href}
              className={`hover:text-white ${page.current ? "text-white font-medium" : "text-[#454545]"}`}
              aria-current={page.current ? "page" : undefined}
            >
              {page.name}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
