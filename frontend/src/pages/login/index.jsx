import { useState } from "react";
import { Link } from "react-router";

import { Loader, Mail, KeyRound } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Eposta adresinizi girin.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Doğru bir eposta girin.");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Şifre girin.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      login(formData);
    }
  };

  //TODO: login sonrası subsribeToMessages yapmıyor.
  return (
    <div className="bg-base-200 card p-20 max-lg:p-10">
      <div className="min-w-[265px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Tekrar hoş geldin!</h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* EPOSTA */}
          <div className="form-control">
            <label className="input !outline-none gap-0">
              <span className="label">
                <Mail className="size-5 text-base-content/40" />
              </span>
              <input
                type="email"
                required
                placeholder="Eposta"
                className="font-light"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </label>
          </div>

          {/* ŞİFRE */}
          <div className="form-control">
            <label className="label">{/* <span>Şifre</span> */}</label>
            <label className="input !outline-none gap-0">
              <span className="label">
                <KeyRound className="size-5 text-base-content/40" />
              </span>
              <input
                type="password"
                required
                placeholder="Şifre"
                className="font-light"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-[16px] mt-5"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader className="size-5 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-base-content/60">
            Bir hesabın yok mu?{" "}
            <Link to="/signup" className="link link-primary" replace>
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
