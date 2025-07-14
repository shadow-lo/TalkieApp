import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

import { PaletteSvg } from "./svg";

function ThemeDropdown({ pos }) {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className={"dropdown " + pos}>
      <div
        tabIndex="0"
        role="button"
        className="btn group gap-1.5 px-1.5 btn-ghost border-none"
        aria-label="Change Theme"
      >
        <PaletteSvg />
        <svg
          width="12px"
          height="12px"
          className="mt-px hidden size-2 fill-current opacity-60 sm:inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <div
        tabIndex="0"
        className="dropdown-content bg-base-200 text-base-content rounded-box top-px h-auto max-h-[calc(100vh-100vh*0.6)] overflow-y-auto border border-white/5 shadow-2xl outline-1 outline-black/5 mt-10"
      >
        <ul className="menu w-56">
          <li className="menu-title text-xs">Temalar</li>
          {THEMES.map((t) => (
            <li key={t}>
              <button
                className="gap-3 px-2"
                data-set-theme={t}
                onClick={() => setTheme(t)}
              >
                <div
                  data-theme={t}
                  className="bg-base-100 grid grid-cols-2 gap-0.5 rounded-box p-1 shadow-sm"
                >
                  <div className="bg-base-content size-1 rounded-full"></div>
                  <div className="bg-primary size-1 rounded-full"></div>
                  <div className="bg-secondary size-1 rounded-full"></div>
                  <div className="bg-accent size-1 rounded-full"></div>
                </div>
                <div className="w-32 truncate">{t}</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`${
                    t == theme ? "visible" : "invisible"
                  } h-3 w-3 shrink-0`}
                >
                  <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ThemeDropdown;
