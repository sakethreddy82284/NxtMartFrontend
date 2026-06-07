import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/Context/User";
import { BASE_URL } from "../../config";
import "./auth.css";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Zap,
  Leaf,
  ShieldCheck,
  Users,
  Star,
  RotateCcw,
  User,
  ArrowRight
} from "lucide-react";

import techDevicesImg from "../../assets/tech_devices.png";
import interiorBlurImg from "../../assets/interior_blur.png";

/* ─── Helpers ─── */
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#ef4444", "#f59e0b", "#10b981", "#059669"];

function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
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
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
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

/* ─── Left Panel (Sidebar) ─── */
function LeftPanel() {
  return (
    <div className="zt-left">
      {/* Brand */}
      <div className="zt-brand">
        <div className="zt-brand-mark">N</div>
        <span className="zt-brand-name">NxtMart Tech</span>
      </div>

      {/* Hero Copy */}
      <div className="zt-hero">
        <h1>
          Tech & Gadgets<br />
          <span className="zt-accent">in</span> minutes,<br />
          not hours.
        </h1>
        <p className="zt-hero-desc">
          Premium laptops, smartphones, audio gear, and accessories — delivered lightning-fast.
        </p>

        {/* Feature List */}
        <div className="zt-features">
          <div className="zt-feature-item">
            <div className="zt-feature-icon-wrap">
              <Zap size={16} />
            </div>
            <div>
              <div className="zt-feature-title">Instant Delivery</div>
              <div className="zt-feature-sub">Ultra-fast local delivery of tech essentials</div>
            </div>
          </div>

          <div className="zt-feature-item">
            <div className="zt-feature-icon-wrap">
              <Smartphone size={16} />
            </div>
            <div>
              <div className="zt-feature-title">Certified Authentic</div>
              <div className="zt-feature-sub">100% genuine products with brand warranty</div>
            </div>
          </div>

          <div className="zt-feature-item">
            <div className="zt-feature-icon-wrap">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="zt-feature-title">Secure Purchase</div>
              <div className="zt-feature-sub">Safe payments & hassle-free returns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Basket Image */}
      <div className="zt-left-image-wrap">
        <img src={techDevicesImg} alt="Tech Devices" className="zt-left-image" />
      </div>
    </div>
  );
}

/* ─── Login Form ─── */
const LoginForm = ({ setView }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getUser } = useAuth();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.phone = "Phone or email is required";
    if (!password) e.password = "Password is required";
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
        <h2 className="zt-form-title">Welcome back 👋</h2>
        <p className="zt-form-sub">Sign in to continue to your account</p>
      </div>

      <BannerError msg={errors.general} />

      <div className="zt-field">
        <label className="zt-label" htmlFor="zt-phone">Email address</label>
        <div className="zt-input-wrap">
          <Mail className="zt-icon" size={16} />
          <input
            id="zt-phone"
            className={`zt-input${errors.phone ? " error" : ""}`}
            type="text"
            placeholder="you@example.com"
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
          <Lock className="zt-icon" size={16} />
          <input
            id="zt-pass"
            className={`zt-input${errors.password ? " error" : ""}`}
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
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
        <button type="button" className="zt-forgot">Forgot password?</button>
      </div>

      <button className="zt-cta" type="submit" disabled={loading}>
        {loading ? (
          <span className="zt-spinner" />
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight size={16} className="zt-cta-arrow" />
          </>
        )}
      </button>

      <div className="zt-divider">
        <div className="zt-div-line" />
        <span>or</span>
        <div className="zt-div-line" />
      </div>

      {/* Social Buttons */}
      <button type="button" className="zt-social-btn zt-google-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span>Continue with Google</span>
      </button>

      <button type="button" className="zt-social-btn zt-otp-btn">
        <Smartphone size={18} />
        <span>Login with OTP</span>
      </button>

      <p className="zt-switch">
        New to NxtMart Tech?&nbsp;
        <button type="button" onClick={() => setView("signup")}>
          Create account
        </button>
      </p>
    </form>
  );
}

/* ─── Signup Form ─── */
function SignupForm({ setView }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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

    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";

    if (!password) {
      e.password = "Password is required";
    } else if (password.length < 8) {
      e.password = "Minimum 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      e.password = "Must include Uppercase, Lowercase, Number & Special Char";
    }

    if (password !== confirm) e.confirm = "Passwords do not match";
    if (!agreed) e.terms = "Please agree to continue";
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
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || { general: data.message || "Something went wrong" });
        return;
      }
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
        <h2 className="zt-form-title">Create account</h2>
        <p className="zt-form-sub">Join 10 million+ happy customers.</p>
      </div>

      <BannerError msg={errors.general} />

      <div className="zt-field">
        <label className="zt-label" htmlFor="su-name">Name</label>
        <div className="zt-input-wrap">
          <User className="zt-icon" size={16} />
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
          <Smartphone className="zt-icon" size={16} />
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
          <Mail className="zt-icon" size={16} />
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
          <Lock className="zt-icon" size={16} />
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
          <Lock className="zt-icon" size={16} />
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
            <ArrowRight size={16} className="zt-cta-arrow" />
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

      <div className="zt-right" style={{ backgroundImage: `url(${interiorBlurImg})` }}>
        {/* Mobile-only brand */}
        <div className="zt-mobile-brand">
          <div className="zt-mobile-mark">N</div>
          <span className="zt-mobile-name">NxtMart Tech</span>
        </div>

        {/* Top Right Promise badge */}
        <div className="zt-promise-badge">
          <div className="zt-promise-icon">⚡</div>
          <span>Lightning-fast delivery in <strong>10 minutes</strong></span>
        </div>

        <div className="zt-card">
          {/* Tab switcher */}
          <div className="zt-tabs">
            <button
              type="button"
              className={`zt-tab${view === "login" ? " active" : ""}`}
              onClick={() => setView("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`zt-tab${view === "signup" ? " active" : ""}`}
              onClick={() => setView("signup")}
            >
              Sign Up
            </button>
          </div>

          {view === "login"
            ? <LoginForm setView={setView} />
            : <SignupForm setView={setView} />
          }
        </div>

        {/* Stats Section on the right column bottom */}
        <div className="zt-stats-bottom">
          <div className="zt-stat-bottom-item">
            <Users className="zt-stat-bottom-icon" size={20} />
            <div>
              <div className="zt-stat-bottom-num">1M+</div>
              <div className="zt-stat-bottom-label">Devices Delivered</div>
            </div>
          </div>
          <div className="zt-stat-bottom-item">
            <Star className="zt-stat-bottom-icon" size={20} />
            <div>
              <div className="zt-stat-bottom-num">4.8 ★</div>
              <div className="zt-stat-bottom-label">App Rating</div>
            </div>
          </div>
          <div className="zt-stat-bottom-item">
            <RotateCcw className="zt-stat-bottom-icon" size={20} />
            <div>
              <div className="zt-stat-bottom-num">Brand Warranty</div>
              <div className="zt-stat-bottom-label">1-Year official warranty</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}