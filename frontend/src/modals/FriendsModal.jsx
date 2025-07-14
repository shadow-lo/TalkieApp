import { useState, useCallback } from "react";
import { X } from "lucide-react";

import { AddFriend, FriendRequests, BlockedUsers } from "./components";
import { useAuthStore } from "../store/useAuthStore";

function FriendsModal() {
  const [active, setActive] = useState("friends");
  const { friendRequests } = useAuthStore();

  const components = {
    friends: <AddFriend />,
    requests: <FriendRequests />,
    blocked: <BlockedUsers />,
  };

  const handleSetActive = useCallback((tab) => {
    setActive(tab);
  }, []);

  const renderButton = (tab, label, showBadge = false) => (
    <button
      type="button"
      onClick={() => handleSetActive(tab)}
      aria-pressed={active === tab}
      className="flex flex-1 btn"
    >
      <h2>{label}</h2>
      {showBadge && (
        <div className="inline-grid *:[grid-area:1/1]">
          <div className="status status-accent animate-ping"></div>
          <div className="status status-accent"></div>
        </div>
      )}
    </button>
  );

  return (
    <dialog id="friendsModal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="modal-action m-0! mb-2!">
          <form method="dialog" className="flex items-center">
            <button
              type="submit"
              className="cursor-pointer"
              aria-label="Close modal"
            >
              <X />
            </button>
          </form>
        </div>

        <div className="flex justify-center gap-4">
          {renderButton("friends", "Arkadaş Ekle")}
          {renderButton("requests", "Bekleyenler", friendRequests.length > 0)}
          {renderButton("blocked", "Engellenenler")}
        </div>

        <div className="divider" />

        {components[active]}
      </div>
    </dialog>
  );
}

export default FriendsModal;
