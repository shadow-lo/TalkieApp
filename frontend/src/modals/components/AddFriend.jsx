import { useState, useRef } from "react";
import toast from "react-hot-toast";

import { useAuthStore } from "../../store/useAuthStore";
import { Loader } from "lucide-react";

function AddFriend() {
  const { sendRequest } = useAuthStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      sendRequest({ email: email });
      emailRef.current.value = "";
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  // TODO: loading true olmuyor
  return (
    <div className="w-full flex flex-col justify-center items-center space-y-5">
      <h2 className="text-2xl">Bir Arkadaş Ekle!</h2>
      <input
        type="text"
        className="input outline-none!"
        placeholder="Arkadaşının E-Postası"
        onChange={(e) => setEmail(e.target.value)}
        ref={emailRef}
      />
      {loading ? (
        <button disabled={true} className="btn btn-primary">
          <Loader className="size-5 animate-spin" />
          Gönderiliyor
        </button>
      ) : (
        <button
          onClick={() => handleSubmit()}
          disabled={!email || !email.trim()}
          className="btn btn-primary"
        >
          Gönder
        </button>
      )}
    </div>
  );
}

export default AddFriend;
