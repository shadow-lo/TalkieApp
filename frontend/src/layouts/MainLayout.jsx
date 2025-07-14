import { Outlet } from "react-router";

import { FriendsModal, ProfileModal } from "../modals";

function MainLayout() {
  return (
    <div className={`h-dvh flex flex-col`}>
      <div className="flex justify-center items-center h-full min-h-0">
        <Outlet />
      </div>

      <ProfileModal />
      <FriendsModal />
    </div>
  );
}

export default MainLayout;
