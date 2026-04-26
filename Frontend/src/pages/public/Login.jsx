import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/auth/login", form);

      if (data.success) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful");
        navigate("/dashboard"); 
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-slate-900">
          Admin Login
        </h2>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;