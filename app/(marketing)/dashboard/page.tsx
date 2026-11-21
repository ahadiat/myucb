
"use client";

import { FormEvent, useState } from "react";

type Student = {
  name: string;
  matric: string;
  phone?: string;
  email?: string;
};

type LoginResponse = {
  success: boolean;
  message?: string;
  student?: Student;
  uuid?: string;
};

const API_URL = "/api/registration";
const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP;

export default function StudentLoginPage() {
  const [matric, setMatric] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "authenticateEdit",
          matric: matric.trim(),
          password,
        }),
      });

      const result: LoginResponse = await response.json();

      if (!response.ok || !result.success || !result.student) {
        setError(result.message || "Nombor matrik atau password tidak sah.");
        return;
      }

      setStudent(result.student);
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      setError("Tidak dapat menghubungi server. Sila cuba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setStudent(null);
    setMatric("");
    setPassword("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-900 text-2xl font-bold text-white">
            UCB
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Student Portal
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Log masuk untuk melihat maklumat pendaftaran makanan anda.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          {!student ? (
            <>
              <h2 className="mb-1 text-lg font-semibold text-slate-900">
                Student Login
              </h2>

              <p className="mb-6 text-sm text-slate-500">
                Masukkan nombor matrik dan password anda.
              </p>

              <form onSubmit={handleLogin} className="space-y-5">

                {/* Matric */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Nombor Matrik
                  </label>

                  <input
                    type="text"
                    value={matric}
                    onChange={(e) => setMatric(e.target.value)}
                    placeholder="Contoh: BIF00238"
                    required
                    autoComplete="username"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !matric.trim() || !password}
                  className="w-full rounded-xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="my-6 border-t border-slate-100" />

              <div className="text-center">
                <p className="mb-3 text-xs text-slate-500">
                  Menghadapi masalah untuk log masuk?
                </p>

                {ADMIN_WHATSAPP ? (
                  <a
                    href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
                      "Assalamualaikum, saya memerlukan bantuan untuk log masuk ke Student Portal."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-600 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                  >
                    <span>WhatsApp Admin</span>
                  </a>
                ) : (
                  <p className="text-xs text-slate-400">
                    Sila hubungi pihak pentadbiran.
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Student Profile */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Welcome back,
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">
                    {student.name}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-900">
                  {student.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Nombor Matrik</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {student.matric}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Nama Pelajar</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {student.name}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Nombor Telefon</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {student.phone || "Belum direkodkan"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="mt-1 break-all font-semibold text-slate-900">
                    {student.email || "Belum direkodkan"}
                  </p>
                </div>
              </div>

              <div className="my-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-900">
                  Login berjaya!
                </p>
                <p className="mt-1 text-xs text-blue-700">
                  Maklumat pendaftaran pelajar berjaya diperoleh.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          University College Bestari · Student Portal
        </p>
      </div>
    </main>
  );
}
