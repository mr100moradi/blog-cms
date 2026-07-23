import {
  MagnifyingGlassIcon,
  PlusIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../data/AuthContext";
import logo from "../../assets/logo.png";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") || "");
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e) => {
      const tag =
        e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
      const typing =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (e.target && e.target.isContentEditable);
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const input = document.querySelector('input[type="search"]');
        if (input) {
          e.preventDefault();
          input.focus();
        }
      } else if (
        !typing &&
        e.key.toLowerCase() === "n" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        navigate("/admin/new");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-100 transition-transform duration-700 ease-out delay-200 ${entered ? "translate-y-0" : "-translate-y-20"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden btn-outline"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          {/* <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">B</div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">Simple</p>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Blog CMS</h1>
          </div> */}
          <img src={logo} width={150} height={150} alt="logo" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                const next = new URLSearchParams(params);
                if (val) next.set("q", val);
                else next.delete("q");
                setParams(next, { replace: true });
              }}
              className="w-64 rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
          <button
            onClick={() => navigate("/")}
            className="btn-outline"
            title="View Site"
          >
            <HomeIcon className="h-5 w-5" />
            <span className="hidden sm:inline">View Site</span>
          </button>
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="btn-outline"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="btn-outline"
            aria-label="Logout"
            title={`Logout (${currentUser?.firstName} ${currentUser?.lastName})`}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
