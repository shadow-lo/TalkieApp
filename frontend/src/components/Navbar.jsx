import { Logo } from "./svg";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router";
import ThemeDropdown from "./ThemeDropdown";

function Navbar({ hideUserActions = false }) {
  const { authUser, logout } = useAuthStore();

  return (
    <nav>
      <div className="flex justify-around items-center py-4">
        <Link to="/" replace>
          <Logo />
        </Link>
        {!hideUserActions && (
          <div className="flex items-center mb-2 space-x-1">
            {authUser ? (
              <>
                <button
                  className="btn text-[16px] border-none cursor-pointer flex items-center"
                  onClick={() =>
                    document.getElementById("profileModal").showModal()
                  }
                >
                  <User />
                </button>
                <button
                  className="btn text-[16px] border-none cursor-pointer flex items-center"
                  onClick={logout}
                >
                  <LogOut />
                </button>
              </>
            ) : (
              <Link to="/login" replace>
                <button className="btn rounded-full border-none">
                  Giriş Yap
                </button>
              </Link>
            )}

            <ThemeDropdown />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
