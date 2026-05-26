import { useState } from "react";
import imgTitle from "@/imports/Mermaid_Marketplace-1.png";

const TEAL       = "#0fbab5";
const CARD_TEAL  = "#57dfcf";
const montserrat = "'Montserrat', sans-serif";

export default function LoginPage({ onSignIn }: { onSignIn: () => void }) {
  const [email, setEmail] = useState("");

  return (
    <main
      className="flex items-center justify-center py-10 px-6 min-h-[calc(100vh-72px)]"
      style={{ background: "linear-gradient(to right, #fff6f9, #ffedf3)" }}
    >
      {/* Sign-in card — compact enough to fit in the viewport */}
      <div
        className="w-full max-w-[480px] flex flex-col items-center px-10 py-8 relative"
        style={{
          background: "linear-gradient(to bottom, rgba(173,238,217,0.7), rgba(87,223,207,0.7))",
          border: `2px solid ${CARD_TEAL}`,
          borderRadius: "20px",
          boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
        }}
      >
        {/* Title image — inverted to solid white so it's opaque on any teal background */}
        <div className="mb-4" style={{ width: "260px" }}>
          <img
            src={imgTitle}
            alt="Mermaid Marketplace"
            className="w-full object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>

        {/* Headings */}
        <div className="w-full mb-4">
          <p style={{ color: TEAL, fontFamily: montserrat, fontWeight: 600, fontSize: "24px", lineHeight: 1.3 }}>
            Sign in
          </p>
          <p style={{ color: TEAL, fontFamily: montserrat, fontWeight: 400, fontSize: "15px", marginTop: "3px", opacity: 0.9 }}>
            Sign in or create an account
          </p>
        </div>

        {/* Email field */}
        <div className="w-full mb-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none"
            style={{
              background: "rgba(173,238,217,0.7)",
              border: `2px solid ${CARD_TEAL}`,
              borderRadius: "14px",
              padding: "13px 20px",
              color: TEAL,
              fontFamily: montserrat,
              fontWeight: 600,
              fontSize: "17px",
            }}
          />
        </div>

        {/* Continue button */}
        <button
          onClick={onSignIn}
          className="w-full hover:opacity-90 active:scale-[0.99] transition-all mt-1"
          style={{
            background: CARD_TEAL,
            border: `2px solid ${CARD_TEAL}`,
            borderRadius: "14px",
            padding: "13px 20px",
            color: TEAL,
            fontFamily: montserrat,
            fontWeight: 600,
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Continue
        </button>

        {/* Terms */}
        <p
          className="text-center mt-4 leading-relaxed"
          style={{ color: TEAL, fontFamily: montserrat, fontWeight: 400, fontSize: "12px", opacity: 0.85 }}
        >
          By continuing you agree to our{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>
            Terms and services
          </span>
        </p>

        {/* Skip / bypass */}
        <button
          onClick={onSignIn}
          className="mt-3 hover:opacity-70 transition-opacity"
          style={{
            background: "none",
            border: "none",
            color: TEAL,
            fontFamily: montserrat,
            fontWeight: 500,
            fontSize: "13px",
            cursor: "pointer",
            textDecoration: "underline",
            opacity: 0.75,
          }}
        >
          Skip for now →
        </button>
      </div>
    </main>
  );
}
