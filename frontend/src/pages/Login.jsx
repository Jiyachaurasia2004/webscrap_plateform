import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10 relative">

  {/* ================= LOGO ================= */}
  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
    <Link
      to="/"
      className="flex items-center gap-2 text-white text-lg sm:text-xl font-bold"
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
        <Search size={19} className="sm:w-5 sm:h-5" />
      </div>

      <span>WebScrape</span>
    </Link>
  </div>


  {/* ================= LOGIN CONTAINER ================= */}
  <div className="w-full max-w-md sm:max-w-lg mt-14 sm:mt-10">

    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 md:p-8">

      {/* ================= HEADER ================= */}
      <div className="text-center mb-6 sm:mb-8">

        <div className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center">
          <Search
            className="text-blue-600"
            size={24}
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Welcome Back
        </h1>

        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Login to your WebScrape account
        </p>

      </div>


      {/* ================= ERROR ================= */}
      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 break-words">
          {error}
        </div>
      )}


      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5"
      >

        {/* Email */}
        <div>

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 text-sm sm:text-base border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

          </div>

        </div>


        {/* Password */}
        <div>

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 text-sm sm:text-base border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

          </div>

        </div>


        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition active:scale-[0.98]"
        >
          {loading
            ? "Logging in..."
            : "Login"}

          {!loading && (
            <ArrowRight size={18} />
          )}
        </button>

      </form>


      {/* ================= REGISTER LINK ================= */}
      <p className="text-center text-sm text-slate-500 mt-6 sm:mt-7">
        Don't have an account?{" "}

        <Link
          to="/register"
          className="text-blue-600 font-semibold hover:underline"
        >
          Create Account
        </Link>
      </p>

    </div>


    {/* ================= COPYRIGHT ================= */}
    <p className="text-center text-slate-400 text-xs sm:text-sm mt-5 sm:mt-6 px-2">
      © 2026 WebScrape Search Platform
    </p>

  </div>

</div>
  );
};

export default Login;