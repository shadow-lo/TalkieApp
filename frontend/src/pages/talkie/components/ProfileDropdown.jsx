import { useNavigate } from "react-router";
import { formatMessageTime } from "../../../lib/utils";
import { useAuthStore } from "../../../store/useAuthStore";

function ProfileDropdown({
  id,
  style,
  user,
  own = false,
  handleUnfriend = () => {},
  handleBlock = () => {},
}) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    const logoutRes = await logout();

    if (logoutRes) {
      navigate("/");
    }
  };

  return (
    <div
      popover="auto"
      id={id}
      className="dropdown text-center bg-base-100 border-primary border-1 rounded-box z-1 w-64 p-6 shadow-sm"
      style={style}
    >
      <div className="w-full flex justify-center">
        <img
          src={user?.profilePic || "/avatar.png"}
          alt="Profile"
          className="w-24 rounded-full object-cover border-base-300 border-1"
        />
      </div>

      <div className="border-base-300 border-t py-3 mt-4">
        <h2>{user?.fullName}</h2>
        <p className="font-light text-sm">{user?.description}</p>
      </div>

      {own ? (
        <div className="space-y-2">
          <button
            onClick={() => document.getElementById("profileModal").showModal()}
            className="btn w-full border border-base-300 font-thin"
          >
            Profili Düzenle
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-error w-full border border-error text-error-content font-thin"
          >
            Çıkış Yap
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => handleUnfriend()}
            className="btn w-full border border-base-300 font-thin"
          >
            Arkadaşlıktan Çıkar
          </button>
          <button
            onClick={() => handleBlock()}
            className="btn w-full border border-base-300 font-thin"
          >
            Engelle
          </button>
        </div>
      )}

      <p className="font-thin text-[12px] opacity-40 mt-3">
        <span className="font-medium">
          {formatMessageTime(user?.createdAt)}
        </span>{" "}
        tarihinden beri üye.
      </p>
    </div>
  );
}

export default ProfileDropdown;
