import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools, faImage, faCog } from "@fortawesome/free-solid-svg-icons";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl dark:bg-black/70 dark:border-white/10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faTools} className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">ToolSuite</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            href="/tools/add-white-bg"
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
          >
            <FontAwesomeIcon icon={faImage} className="h-4 w-4" />
            <span>Add White Bg</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
          >
            <FontAwesomeIcon icon={faCog} className="h-4 w-4" />
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
