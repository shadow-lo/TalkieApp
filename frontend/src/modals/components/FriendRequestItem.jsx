import { X, Check } from "lucide-react";

function FriendRequestItem({ user, onRespond, loading }) {
  return (
    <div className="flex items-center justify-center space-x-10">
      <div className="flex items-center space-x-2">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt="Profile"
          className="size-12 rounded-full"
        />
        <h2 className="font-semibold">{user.fullName}</h2>
      </div>

      <div className="space-x-2">
        <button
          onClick={() => onRespond(user._id, true)}
          className="btn btn-success"
          disabled={loading}
        >
          <Check className="stroke-success-content" />
        </button>
        <button
          onClick={() => onRespond(user._id, false)}
          className="btn btn-error"
          disabled={loading}
        >
          <X className="stroke-error-content" />
        </button>
      </div>
    </div>
  );
}

export default FriendRequestItem;
