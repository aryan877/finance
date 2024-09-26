import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  return (
    <nav className="bg-background border-b w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <span className="mr-2">💼</span>
            <span className="hidden sm:inline">
              Aryan & Janhavi&apos;s Finance Blog
            </span>
            <span className="sm:hidden">Finance Hub</span>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
