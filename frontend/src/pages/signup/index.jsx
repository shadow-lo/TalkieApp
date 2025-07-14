import { useState } from "react";
import { Link } from "react-router";

import { Loader, Mail, User, KeyRound } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("İsminizi girin.");
    if (!formData.email.trim()) return toast.error("Eposta adresinizi girin.");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Doğru bir eposta girin.");
    if (!formData.password.trim()) return toast.error("Şifre girin.");
    if (formData.password.length < 6)
      return toast.error("Şifre en az 6 karakter olmalı.");

    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) {
      signup(formData);
    }
  };

  return (
    <div className="bg-base-200 card p-20 max-lg:p-10">
      <div className="min-w-[265px]">
        {/* BAŞLIK */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Bir hesap oluştur</h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* ISIM INPUT */}
          <div className="form-control">
            <label className="label">
              {/* <span className="label-text">İsim</span> */}
            </label>
            <label className="input validator !outline-none gap-0">
              <span className="label">
                <User className="size-5 text-base-content/40" />
              </span>

              <input
                type="text"
                required
                placeholder="İsmin"
                className="font-light"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </label>
          </div>
          {/* EPOSTA INPUT */}
          <div className="form-control">
            <label className="label">
              {/* <span className="label-text">E-Posta</span> */}
            </label>
            <label className="input validator !outline-none gap-0">
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
            {/* <p className="validator-hint hidden m-0">
              Lütfen doğru bir eposta girin.
            </p> */}
          </div>
          {/* ŞİFRE INPUT */}
          <div className="form-control">
            <label className="label">{/* <span>Şifre</span> */}</label>
            <label className="input validator !outline-none gap-0">
              <span className="label">
                <KeyRound className="size-5 text-base-content/40" />
              </span>
              <input
                type="password"
                required
                placeholder="Şifre"
                className="font-light"
                minLength="6"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </label>
            {/* <p className="validator-hint hidden">
              Şifre en az 6 karakter olmalı.
            </p> */}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full text-[16px] mt-5"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader className="size-5 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              "Oluştur"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-base-content/60">
            Zaten bir hesabın var mı?{" "}
            <Link to="/login" className="link link-primary" replace>
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
