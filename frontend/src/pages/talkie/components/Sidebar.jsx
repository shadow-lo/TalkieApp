import { useEffect, useState } from "react";

import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";

import { Menu, Search, Users } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import ProfileDropdown from "./ProfileDropdown";
import { Logo } from "../../../components/svg";
import { Link } from "react-router";
import ThemeDropdown from "../../../components/ThemeDropdown";

function Sidebar() {
  const {
    users,
    setSelectedUser,
    selectedUser,
    isUserLoading,
    getUnread,
    unreadCounts,
    setUnreadCounts,
    resetUnreadCount,
  } = useChatStore();
  const { authUser, onlineUsers, friendRequests } = useAuthStore();

  const [filter, setFilter] = useState("");
  const filteredUsers = filter.trim()
    ? users.filter((user) =>
        user.fullName.toLowerCase().trim().includes(filter.toLowerCase().trim())
      )
    : users;

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const counts = await getUnread();
      setUnreadCounts(counts);
    };

    fetchUnreadCounts();
  }, [getUnread]);

  return (
    <div className="w-80 max-lg:w-20 lg:drawer-open z-10">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <label
        htmlFor="my-drawer-2"
        className="h-[85px] flex items-center drawer-button lg:hidden cursor-pointer"
      >
        <Menu className="w-full" />
      </label>
      <div className="drawer-side h-full">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <aside className="h-full w-80 max-lg:bg-base-200 border-r border-base-300 flex flex-col">
          <div className="border-b border-base-300 w-full p-5">
            {/* USER */}
            <div className="flex items-center justify-between">
              <button
                popoverTarget="profileDropdown"
                className="flex cursor-pointer"
                style={{ anchorName: "--anchor-1" }}
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  <img
                    src={authUser?.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="min-w-12 w-12 object-cover rounded-full"
                  />
                  <span className="font-medium block">
                    {authUser?.fullName}
                  </span>
                </div>
              </button>

              {/* PROFILE DROPDOWN CONTENT */}
              <ProfileDropdown
                id="profileDropdown"
                style={{ positionAnchor: "--anchor-1" }}
                user={authUser}
                own={true}
              />

              <ThemeDropdown pos={"dropdown-end"} />
            </div>
            {/* SEARCH */}
            <div className="flex items-center mt-3 gap-5">
              <label className="input outline-none!">
                <Search />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="grow"
                  onChange={(e) => setFilter(e.target.value)}
                />
              </label>

              <button
                onClick={() =>
                  document.getElementById("friendsModal").showModal()
                }
                className="cursor-pointer relative"
              >
                {friendRequests.length > 0 ? (
                  <div className="absolute top-[-10px] right-[-5px] text-[12px]">
                    <div className="inline-grid *:[grid-area:1/1]">
                      <div className="status status-accent animate-ping"></div>
                      <div className="status status-accent"></div>
                    </div>
                  </div>
                ) : null}
                <Users />
              </button>
            </div>
          </div>

          {isUserLoading ? (
            <SidebarSkeleton />
          ) : (
            <div className="overflow-y-auto w-full flex-1">
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                    resetUnreadCount(user._id);
                  }}
                  className={`
              w-full px-5 py-3 flex items-center gap-3
              hover:bg-base-200 cursor-pointer transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-primary/20 ring-1 ring-base-300"
                  : ""
              }
            `}
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.name}
                      className="min-w-12 w-12 object-cover rounded-full"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span
                        className="absolute bottom-0 right-0 size-3 bg-success 
                  rounded-full ring-1 ring-zinc-900"
                      />
                    )}
                  </div>
                  {/* User info - only visible on larger screens */}
                  <div className="block text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                    <div className="font-thin text-xs">
                      {onlineUsers.includes(user._id)
                        ? "Çevrim içi"
                        : "Çevrim dışı"}
                    </div>
                  </div>
                  {/* {console.log(unreadCounts[user._id])} */}
                  {unreadCounts[user._id] > 0 && (
                    <div className="flex justify-end flex-1">
                      <div className="inline-grid *:[grid-area:1/1] mr-2">
                        <div className="status status-accent animate-ping"></div>
                        <div className="status status-accent"></div>
                      </div>
                    </div>
                  )}
                </button>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-4 max-lg:text-sm">
                  Hiç arkadaşın yok
                </div>
              )}
            </div>
          )}

          <footer className="flex flex-col items-center p-5">
            <Link to={"/"} replace>
              <Logo />
            </Link>
            <p className="text-xs font-thin text-base-content/80">
              Talkie &copy; 2025. Bütün haklar saklıdır.
            </p>
          </footer>
        </aside>
      </div>
    </div>
  );
}

export default Sidebar;
