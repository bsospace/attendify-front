import { config } from "@/server/config/index";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="w-full px-4 py-2 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} {config.appName}. All rights reserved.</p>
      </div>
    </footer>
  );
}