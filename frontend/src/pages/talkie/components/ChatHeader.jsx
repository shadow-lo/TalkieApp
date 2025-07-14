import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";

import { X } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, removeFriend, blockFriend } = useAuthStore();

  const handleUnfriend = async () => {
    setSelectedUser(null);
    removeFriend(selectedUser._id);
  };

  const handleBlock = async () => {
    setSelectedUser(null);
    blockFriend(selectedUser._id);
  };

  return (
    <div className="flex justify-between px-3 py-5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <button
          popoverTarget="userDropdown"
          className="flex cursor-pointer"
          style={{ anchorName: "--anchor-2" }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative avatar">
              <div className="size-10 rounded-full relative">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                />
              </div>
              {onlineUsers.includes(selectedUser._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-success 
                  rounded-full ring-1 ring-zinc-900"
                />
              )}
            </div>

            {/* User info */}
            <div className="text-left">
              <h3 className="font-medium">{selectedUser.fullName}</h3>
              <p className="text-sm font-thin">{selectedUser.description}</p>
            </div>
          </div>
        </button>
      </div>

      <ProfileDropdown
        id="userDropdown"
        user={selectedUser}
        style={{ positionAnchor: "--anchor-2" }}
        handleUnfriend={handleUnfriend}
        handleBlock={handleBlock}
      />

      {/* Close button */}
      <div className="flex items-center gap-2 pr-2">
        <button
          onClick={() => setSelectedUser(null)}
          className="cursor-pointer"
        >
          <X />
        </button>
      </div>
    </div>
  );
}
export default ChatHeader;
