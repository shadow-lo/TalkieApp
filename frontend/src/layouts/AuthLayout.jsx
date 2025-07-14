import { Outlet, useLocation } from "react-router";
import { Footer, Navbar } from "../components";
import { ProfileModal } from "../modals";

const pagesToHideUserActions = ["/login", "/signup"];

function AuthLayout() {
  const location = useLocation();
  const userActionsHidden = pagesToHideUserActions.includes(location.pathname);

  return (
    <div className={`h-dvh flex flex-col`}>
      <Navbar hideUserActions={userActionsHidden} />

      <div className="mx-auto container flex justify-center items-center h-full">
        <Outlet />
      </div>
      <ProfileModal />
      <Footer />
    </div>
  );
}

export default AuthLayout;
