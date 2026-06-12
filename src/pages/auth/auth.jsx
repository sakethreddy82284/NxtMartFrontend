import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import "./auth.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/Context/User";

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#ef4444", "#f59e0b", "#a855f7", "#7c3aed"];

/* ─── Helpers ─── */
function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8)           s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw))  s++;
  return s;
}

/* ─── Sub-components ─── */
function PasswordStrength({ password }) {
  const score = getStrength(password);
  const color = STRENGTH_COLORS[score];
  return (
    <div className="zt-strength">
      <div className="zt-strength-bar">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="zt-strength-seg"
            style={{ background: i <= score ? color : undefined }}
          />
        ))}
      </div>
      {password && (
        <span className="zt-strength-label" style={{ color }}>
          {STRENGTH_LABELS[score]}
        </span>
      )}
    </div>
  );
}

function EyeBtn({ show, onToggle }) {
  return (
    <button
      type="button"
      className="zt-eye-btn"
      onClick={onToggle}
      aria-label="Toggle password visibility"
    >
      {show ? "🙈" : "👁"}
    </button>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="zt-field-err">⚠ {msg}</p>;
}

function BannerError({ msg }) {
  if (!msg) return null;
  return <div className="zt-banner-err">⚠ {msg}</div>;
}

/* ─── Left Panel ─── */
function LeftPanel() {
  return (
    <div className="zt-left">
      <div className="zt-left-overlay"></div>
      
      {/* Brand */}
      <div className="zt-brand">
        <div className="zt-brand-mark">N</div>
        <span className="zt-brand-name">NxtMart</span>
      </div>

      {/* Hero copy */}
      <div className="zt-hero">
        <h1>
          Fresh groceries,<br />
          delivered fast.
        </h1>
        <p>
          Experience the finest quality produce and daily essentials, brought to your door in minutes.
        </p>
      </div>
    </div>
  );
}

/* ─── Login Form ─── */
const LoginForm = ({ setView }) => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();
  const { getUser } = useAuth(); // Added

  const validate = () => {
    const e = {};
    if (!email.trim()) e.phone    = "Phone or email is required";
    if (!password)     e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.message || "Invalid credentials" });
        return;
      }
      
      // Sync state with backend
      await getUser();
      
      // Role-based navigation
      const role = data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'manager') navigate('/manager/home');
      else if (role === 'delivery') navigate('/delivery');
      else navigate('/customer');
    } catch (err) {
      console.error("Sign in error details:", err);
      setErrors({ general: "Server not reachable. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="zt-form-head">
        <div className="zt-eyebrow">Welcome back 👋</div>
        <h2 className="zt-form-title">Sign in to NxtMart</h2>
        <p className="zt-form-sub">Your cart is waiting for you.</p>
      </div>

      <BannerError msg={errors.general} />

      <div className="zt-field">
        <label className="zt-label" htmlFor="zt-phone"> Email</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">📱</span>
          <input
            id="zt-phone"
            className={`zt-input${errors.phone ? " error" : ""}`}
            type="text"
            placeholder="+91 98765 43210 or you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <FieldError msg={errors.phone} />
      </div>

      <div className="zt-field">
        <label className="zt-label" htmlFor="zt-pass">Password</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">🔐</span>
          <input
            id="zt-pass"
            className={`zt-input${errors.password ? " error" : ""}`}
            type={showPass ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <EyeBtn show={showPass} onToggle={() => setShowPass((v) => !v)} />
        </div>
        <FieldError msg={errors.password} />
      </div>

      <div className="zt-row-opts">
        <label className="zt-remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Remember me</span>
        </label>
        <button 
          type="button" 
          className="zt-forgot"
          onClick={() => setView("forgot")}
        >
          Forgot password?
        </button>
      </div>

      <button className="zt-cta" type="submit" disabled={loading}>
        {loading ? (
          <span className="zt-spinner" />
        ) : (
          <>
            <span>Sign In</span>
            <span className="zt-cta-arrow">→</span>
          </>
        )}
      </button>



      <p className="zt-switch">
        New to NxtMart?&nbsp;
        <button type="button" onClick={() => setView("signup")}>
          Create account
        </button>
      </p>
    </form>
  );
}

function ForgotPasswordForm({ setView, onTokenCreated }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || "Could not process request" });
      } else {
        onTokenCreated(data.resetToken || "");
        setView("reset");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setErrors({ general: "Server not reachable. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="zt-form-head">
        <div className="zt-eyebrow">Reset password</div>
        <h2 className="zt-form-title">Forgot your password?</h2>
        <p className="zt-form-sub">Enter your email to receive a reset token.</p>
      </div>

      <BannerError msg={errors.general} />

      <div className="zt-field">
        <label className="zt-label" htmlFor="fp-email">Email address</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">✉️</span>
          <input
            id="fp-email"
            className={`zt-input${errors.email ? " error" : ""}`}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <FieldError msg={errors.email} />
      </div>

      <button className="zt-cta" type="submit" disabled={loading}>
        {loading ? <span className="zt-spinner" /> : <span>Send reset token</span>}
      </button>

      <p className="zt-switch">
        Remembered your password?&nbsp;
        <button type="button" onClick={() => setView("login")}>Sign in</button>
      </p>
    </form>
  );
}

function ResetPasswordForm({ setView, token }) {
  const [resetToken, setResetToken] = useState(token || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!resetToken.trim()) e.token = "Reset token is required";
    if (!password) e.password = "Password is required";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: resetToken, password, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || "Could not reset password" });
      } else {
        setView("login");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setErrors({ general: "Server not reachable. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="zt-form-head">
        <div className="zt-eyebrow">Reset password</div>
        <h2 className="zt-form-title">Set a new password</h2>
        <p className="zt-form-sub">Paste your reset token and choose a new password.</p>
      </div>

      <BannerError msg={errors.general} />

      <div className="zt-field">
        <label className="zt-label" htmlFor="rp-token">Reset token</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">🔑</span>
          <input
            id="rp-token"
            className={`zt-input${errors.token ? " error" : ""}`}
            type="text"
            placeholder="Enter your reset token"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
          />
        </div>
        <FieldError msg={errors.token} />
      </div>

      <div className="zt-field">
        <label className="zt-label" htmlFor="rp-pass">New password</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">🔐</span>
          <input
            id="rp-pass"
            className={`zt-input${errors.password ? " error" : ""}`}
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <FieldError msg={errors.password} />
      </div>

      <div className="zt-field">
        <label className="zt-label" htmlFor="rp-confirm">Confirm password</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">🔐</span>
          <input
            id="rp-confirm"
            className={`zt-input${errors.confirmPassword ? " error" : ""}`}
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <FieldError msg={errors.confirmPassword} />
      </div>

      <button className="zt-cta" type="submit" disabled={loading}>
        {loading ? <span className="zt-spinner" /> : <span>Reset password</span>}
      </button>

      <p className="zt-switch">
        Need a new token?&nbsp;
        <button type="button" onClick={() => setView("forgot")}>Request again</button>
      </p>
    </form>
  );
}

/* ─── Signup Form ─── */
function SignupForm({ setView }) {
  const [name,        setName]        = useState("");
  const [phone,       setPhone]       = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [role,        setRole]        = useState("customer");
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed,      setAgreed]      = useState(false);
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const { getUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!name.trim()) {
      e.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      e.name = "Name must contain only letters";
    }
    
    if (!phone.trim()) {
      e.phone = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      e.phone = "Enter a valid 10-digit Indian phone number";
    }

    if (!email.trim())                         e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))      e.email    = "Enter a valid email";
    
    if (!password) {
      e.password = "Password is required";
    } else if (password.length < 8) {
      e.password = "Minimum 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      e.password = "Must include Uppercase, Lowercase, Number & Special Char";
    }

    if (password !== confirm)                  e.confirm  = "Passwords do not match";
    if (!agreed)                               e.terms    = "Please agree to continue";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || { general: data.message || "Something went wrong" });
        return;
      }
      // Sync state with backend (since backend sets cookie during signup)
      await getUser();
      navigate('/');
    } catch (err) {
      console.error("Sign up error details:", err);
      setErrors({ general: "Server not reachable. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="zt-form-head">
        <div className="zt-eyebrow">Get started 🚀</div>
        <h2 className="zt-form-title">Create account</h2>
        <p className="zt-form-sub">Join 10 million+ happy customers.</p>
      </div>

      <BannerError msg={errors.general} />

      <div className="zt-field">
        <label className="zt-label" htmlFor="su-name">Name</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">👤</span>
          <input
            id="su-name"
            className={`zt-input${errors.name ? " error" : ""}`}
            type="text"
            placeholder="Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <FieldError msg={errors.name} />
      </div>

      <div className="zt-field">
        <label className="zt-label" htmlFor="su-phone">Phone number</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">📱</span>
          <input
            id="su-phone"
            className={`zt-input${errors.phone ? " error" : ""}`}
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
        <FieldError msg={errors.phone} />
      </div>

      <div className="zt-field">
        <label className="zt-label" htmlFor="su-email">Email address</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">✉️</span>
          <input
            id="su-email"
            className={`zt-input${errors.email ? " error" : ""}`}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <FieldError msg={errors.email} />
      </div>

      <div className="zt-field">
        <label className="zt-label" htmlFor="su-pass">Password</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">🔐</span>
          <input
            id="su-pass"
            className={`zt-input${errors.password ? " error" : ""}`}
            type={showPass ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <EyeBtn show={showPass} onToggle={() => setShowPass((v) => !v)} />
        </div>
        <PasswordStrength password={password} />
        <FieldError msg={errors.password} />
      </div>

      <div className="zt-field">
        <label className="zt-label" htmlFor="su-confirm">Confirm password</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">🔐</span>
          <input
            id="su-confirm"
            className={`zt-input${errors.confirm ? " error" : ""}`}
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          <EyeBtn show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
        </div>
        <FieldError msg={errors.confirm} />
      </div>

      <div className="zt-field">
        <label className="zt-label" htmlFor="su-role">Account Type</label>
        <div className="zt-input-wrap">
          <span className="zt-icon">🏢</span>
          <select
            id="su-role"
            className="zt-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="manager">Store Manager</option>
            <option value="delivery">Delivery Partner</option>
          </select>
        </div>
      </div>

      <label className="zt-terms">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          {" "}and{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
        </span>
      </label>
      <FieldError msg={errors.terms} />

      <button className="zt-cta" type="submit" disabled={loading}>
        {loading ? (
          <span className="zt-spinner" />
        ) : (
          <>
            <span>Create Account</span>
            <span className="zt-cta-arrow">→</span>
          </>
        )}
      </button>

      <p className="zt-switch">
        Already have an account?&nbsp;
        <button type="button" onClick={() => setView("login")}>Sign in</button>
      </p>
    </form>
  );
}

/* ─── Root ─── */
export default function AuthPage() {
  const [view, setView] = useState("login");
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/'); 
    }
  }, [user, loading, navigate]);

  return (
    <div className="zt-page">
      <LeftPanel />

      <div className="zt-right">
        {/* Mobile-only brand */}
        <div className="zt-mobile-brand">
          <div className="zt-mobile-mark">N</div>
          <span className="zt-mobile-name">NxtMart</span>
        </div>

        <div className="zt-card">
          {view === "login" ? (
            <LoginForm setView={setView} />
          ) : view === "signup" ? (
            <SignupForm setView={setView} />
          ) : view === "forgot" ? (
            <ForgotPasswordForm setView={setView} onTokenCreated={setResetToken} />
          ) : (
            <ResetPasswordForm setView={setView} token={resetToken} />
          )}
        </div>
      </div>
    </div>
  );
}