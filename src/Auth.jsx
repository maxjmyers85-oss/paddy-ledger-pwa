import React, { useState } from "react";
import { supabase } from "./supabase";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.07)", border: "1px solid #3a4a1a",
    color: "#e8e0c8", padding: "11px 14px", fontSize: 15,
    fontFamily: "Georgia, serif", borderRadius: 2, outline: "none",
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else setMessage("Check your email for a confirmation link, then come back to log in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) setError(error.message);
        else setMessage("Password reset email sent — check your inbox.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #1a1a0f 0%, #2c2c14 50%, #1a1a0f 100%)", fontFamily: "Georgia, serif", color: "#e8e0c8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🌾</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "0.04em", color: "#c8d86e" }}>GOLDEN STATE GROWER</h1>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#7a8e4a", letterSpacing: "0.2em", textTransform: "uppercase" }}>Rice Record Tracker</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #3a4a1a", borderRadius: 4, padding: "32px 28px" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a9e5a" }}>
            {mode === "login" ? "▸ Sign In" : mode === "signup" ? "▸ Create Account" : "▸ Reset Password"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a8e4a", marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} autoComplete="email" />
            </div>

            {mode !== "reset" && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a8e4a", marginBottom: 6 }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} />
              </div>
            )}

            {error && <p style={{ margin: "0 0 16px", fontSize: 13, color: "#e08870", background: "rgba(200,80,60,0.1)", border: "1px solid rgba(200,80,60,0.3)", padding: "8px 12px", borderRadius: 2 }}>{error}</p>}
            {message && <p style={{ margin: "0 0 16px", fontSize: 13, color: "#8dcc6e", background: "rgba(80,180,60,0.1)", border: "1px solid rgba(80,180,60,0.3)", padding: "8px 12px", borderRadius: 2 }}>{message}</p>}

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "#4a6a10" : "#7a9a2a", border: "none", color: "#fff", padding: "12px", fontSize: 14, fontFamily: "inherit", cursor: loading ? "default" : "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2, transition: "background 0.2s" }}>
              {loading ? "…" : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Email"}
            </button>
          </form>

          {/* Mode switchers */}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            {mode === "login" && <>
              <button onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
                style={{ background: "none", border: "none", color: "#7a9e4a", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                No account? Sign up
              </button>
              <button onClick={() => { setMode("reset"); setError(""); setMessage(""); }}
                style={{ background: "none", border: "none", color: "#5a7a3a", fontSize: 12, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                Forgot password?
              </button>
            </>}
            {mode !== "login" && (
              <button onClick={() => { setMode("login"); setError(""); setMessage(""); }}
                style={{ background: "none", border: "none", color: "#7a9e4a", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
