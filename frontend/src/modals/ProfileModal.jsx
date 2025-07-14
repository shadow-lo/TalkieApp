import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Pencil, User, Mail, X, MessageSquareText } from "lucide-react";

function ProfileModal() {
  const location = useLocation();
  const prevLocation = useRef(location.pathname);

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      document.getElementById("profileModal")?.close();
    }
  }, [location]);

  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [nameInput, setNameInput] = useState(authUser?.fullName || "");
  const [emailInput, setEmailInput] = useState(authUser?.email || "");
  const [descInput, setDescInput] = useState(authUser?.description || "");

  useEffect(() => {
    if (authUser && authUser.fullName !== nameInput) {
      setNameInput(authUser.fullName);
    }
    if (authUser && authUser.email !== emailInput) {
      setEmailInput(authUser.email);
    }
    if (authUser && authUser.description !== descInput) {
      setDescInput(authUser.description);
    }
  }, [authUser]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setSelectedImg(reader.result);
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const updateData = {};
      if (selectedImg !== null) {
        updateData.profilePic = selectedImg;
      }

      if (nameInput !== authUser?.fullName) {
        updateData.fullName = nameInput;
      }

      if (emailInput !== authUser?.email) {
        updateData.email = emailInput;
      }

      if (descInput !== authUser?.description) {
        updateData.description = descInput;
      }

      if (Object.keys(updateData).length === 0) {
        return;
      }
      await updateProfile(updateData);
      document.getElementById("profileModal")?.close();
    },
    [selectedImg, nameInput, emailInput, descInput, authUser, updateProfile]
  );

  return (
    <dialog id="profileModal" className="modal">
      <div className="modal-box w-[400px] max-lg:w-full">
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          aria-label="Close modal"
          onClick={() => document.getElementById("profileModal")?.close()}
        >
          <X />
        </button>

        <h3 className="text-2xl text-center mb-4">Profil</h3>

        <div className="flex justify-center">
          <div className="relative size-32 group">
            <img
              src={selectedImg || authUser?.profilePic || "/avatar.png"}
              alt="Profile"
              className="absolute w-full h-full rounded-full object-cover border-2"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute hidden group-hover:visible cursor-pointer group-hover:flex justify-center bg-[#0000006b] rounded-full items-center w-full h-full ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
              aria-label="Upload profile picture"
            >
              <Pencil className="absolute" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <ProfileField
            icon={<User className="w-4 h-4" />}
            label="İsim"
            inputType="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            disabled={isUpdatingProfile}
          />

          <ProfileField
            icon={<Mail className="w-4 h-4" />}
            label="E-Posta"
            inputType="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            disabled={isUpdatingProfile}
          />

          <ProfileField
            icon={<MessageSquareText className="w-4 h-4" />}
            label="Durum"
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
            disabled={isUpdatingProfile}
          />

          <div className="modal-action mt-6 justify-between">
            <Link to={"/take-data"} replace className="btn btn-accent">
              Verileri İndir
            </Link>

            <button
              type="submit"
              className="btn btn-primary border-none"
              disabled={isUpdatingProfile}
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

function ProfileField({
  icon,
  label,
  value,
  onChange,
  inputType = "text",
  disabled = false,
  readOnly = false,
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm text-base-content/60 flex items-center gap-2">
        {icon}
        {label}
      </div>
      {readOnly ? (
        <p className="px-4 py-2.5 bg-base-200 rounded-lg border font-thin">
          {value}
        </p>
      ) : (
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="input w-full font-thin outline-none!"
        />
      )}
    </div>
  );
}

export default ProfileModal;
