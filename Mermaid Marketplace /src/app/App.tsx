import { useRef, useState, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import LoginPage from "@/app/LoginPage";
import ShopPage from "@/app/ShopPage";
import SellPage from "@/app/SellPage";
import FavoritesPage from "@/app/FavoritesPage";
import AccountPage, { Conversation } from "@/app/AccountPage";
import ProductModal from "@/app/ProductModal";
import { ALL_PRODUCTS, type Product } from "@/app/ShopPage";
import imgTitle from "@/imports/Mermaid_Marketplace-1.png";
import imgShell from "@/imports/seashell.png";
import imgMermaid from "@/imports/Home-1/6c2f5ff272bfb06aca5261ba51b6c1810af352e5.png";
// SVG path data (previously in svg-ebaggk4ovp.ts, inlined after file was removed)
const svgPaths = {
  p112c1e00: "M37.5565 57.8222L37.1847 58.194L36.7756 57.8222C19.1129 41.7956 7.43693 31.1979 7.43693 20.4516C7.43693 13.0146 13.0146 7.43693 20.4516 7.43693C26.178 7.43693 31.7557 11.1554 33.7265 16.2125H40.6428C42.6136 11.1554 48.1913 7.43693 53.9178 7.43693C61.3547 7.43693 66.9324 13.0146 66.9324 20.4516C66.9324 31.1979 55.2564 41.7956 37.5565 57.8222ZM53.9178 0C47.4476 0 41.2378 3.01196 37.1847 7.73441C33.1315 3.01196 26.9217 0 20.4516 0C8.99869 0 0 8.9615 0 20.4516C0 34.4702 12.6428 45.9602 31.7929 63.3255L37.1847 68.2339L42.5764 63.3255C61.7265 45.9602 74.3693 34.4702 74.3693 20.4516C74.3693 8.9615 65.3706 0 53.9178 0Z",
  p1749a700: "M27.6786 29L21.2917 22.2937M24.7421 13.5833C24.7421 20.3948 19.4832 25.9167 12.996 25.9167C6.50888 25.9167 1.25 20.3948 1.25 13.5833C1.25 6.77182 6.50888 1.25 12.996 1.25C19.4832 1.25 24.7421 6.77182 24.7421 13.5833Z",
  p39969f80: "M25.2969 2.9491C24.6483 2.26777 23.8782 1.7273 23.0307 1.35855C22.1831 0.989796 21.2746 0.8 20.3572 0.8C19.4398 0.8 18.5313 0.989796 17.6837 1.35855C16.8362 1.7273 16.0661 2.26777 15.4175 2.9491L14.0715 4.36243L12.7254 2.9491C11.4154 1.57351 9.63851 0.800713 7.78577 0.800713C5.93303 0.800713 4.15617 1.57351 2.84608 2.9491C1.536 4.32469 0.8 6.19039 0.8 8.13577C0.8 10.0811 1.536 11.9468 2.84608 13.3224L14.0715 25.1091L25.2969 13.3224C25.9458 12.6414 26.4605 11.8329 26.8117 10.9429C27.1629 10.053 27.3436 9.09908 27.3436 8.13577C27.3436 7.17245 27.1629 6.21857 26.8117 5.32863C26.4605 4.43868 25.9458 3.63011 25.2969 2.9491Z",
  p671cc00:  "M37.1847 68.2339L31.7929 63.3255C12.6428 45.9602 0 34.4702 0 20.4516C0 8.9615 8.99869 0 20.4516 0C26.9217 0 33.1315 3.01196 37.1847 7.73441C41.2378 3.01196 47.4476 0 53.9178 0C65.3706 0 74.3693 8.9615 74.3693 20.4516C74.3693 34.4702 61.7265 45.9602 42.5764 63.3255L37.1847 68.2339Z",
};

// ── tokens ────────────────────────────────────────────────────────
const CREAM       = "#ffedf3";
const CARD_TEAL   = "#57dfcf";
const BORDER_MINT = "#adeed9";
const BTN_TEAL    = "#0fbab5";
const CARD_BG     = "rgba(173,238,217,0.25)";
const montserrat  = "'Montserrat', sans-serif";
const display     = "'Cormorant Garamond', serif";

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

// ── noise overlay (fills its nearest positioned ancestor) ─────────
function NoiseLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        backgroundImage: NOISE,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
        opacity: 0.13,
        mixBlendMode: "overlay",
      }}
    />
  );
}

// ── custom cursor ─────────────────────────────────────────────────
// Cursor arrow tip is at (0,0) of the SVG so it aligns exactly with mouse position
const ARROW_PATH = "M0 0 L0 17 L4.5 13 L7.5 20 L10 19 L7 12.5 L13 12.5 Z";
// Trail bubble palette: teal → cream → card-teal, cycling
const BUBBLE_COLORS = [BTN_TEAL, CREAM, CARD_TEAL, CREAM] as const;
// Pixel offset from the arrow tip to its tail (the flat back end of the arrow body)
// Arrow SVG is 16x22px rendered; the horizontal bar sits at approx (8, 13) in screen space
const TAIL_DX = 8;
const TAIL_DY = 13;

function CustomCursor() {
  const [pos, setPos]             = useState({ x: -200, y: -200 });
  const [trail, setTrail]         = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [isPointer, setIsPointer] = useState(false);
  const idRef = useRef(0);

  // Inject cursor:none globally
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setPos({ x, y });
      // Keep last 9 positions for the trail (oldest → newest)
      setTrail(prev => [...prev.slice(-8), { x, y, id: idRef.current++ }]);
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      setIsPointer(!!el.closest("button, a, [role='button'], select, input, textarea, [data-cursor]"));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  // Arrow colors: teal on default, cream on pointer
  const fillColor   = isPointer ? CREAM   : BTN_TEAL;
  const strokeColor = isPointer ? CARD_TEAL : CREAM;

  return (
    <>
      {/* Trailing bubbles — rendered oldest-first so newest sits on top */}
      {trail.map((p, i) => {
        const progress = i / Math.max(trail.length - 1, 1); // 0=oldest, 1=newest
        const opacity  = 0.15 + progress * 0.55;
        const size     = 3 + progress * 7;                  // 3px → 10px
        const color    = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
        return (
          <div
            key={p.id}
            aria-hidden
            style={{
              position: "fixed",
              left: p.x + TAIL_DX - size / 2,
              top:  p.y + TAIL_DY - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity,
              pointerEvents: "none",
              zIndex: 99997,
            }}
          />
        );
      })}

      {/* Arrow cursor — tip at (0,0) = mouse position */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          pointerEvents: "none",
          zIndex: 99999,
        }}
      >
        <svg
          width="16" height="22"
          viewBox="0 0 14 22"
          fill="none"
          style={{ display: "block", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))" }}
        >
          <path
            d={ARROW_PATH}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ transition: "fill 0.12s ease, stroke 0.12s ease" }}
          />
        </svg>
      </div>
    </>
  );
}

// ── icons ─────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg width="22" height="23" fill="none" viewBox="0 0 28.9286 30.25" aria-hidden>
      <path d={svgPaths.p1749a700} stroke={CREAM} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
    </svg>
  );
}

function HeartOutlineIcon() {
  return (
    <svg width="24" height="22" fill="none" viewBox="0 0 28.1436 25.9091" aria-hidden>
      <path d={svgPaths.p39969f80} stroke={CREAM} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function HeartFilledStep({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.918)} fill="none" viewBox="0 0 74.3693 68.2339" aria-hidden>
      <path d={svgPaths.p671cc00} fill={CREAM} />
    </svg>
  );
}

function HeartOutlineStep({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.918)} fill="none" viewBox="0 0 74.3693 68.2339" aria-hidden>
      <path d={svgPaths.p112c1e00} fill={CREAM} />
    </svg>
  );
}

// ── nav ───────────────────────────────────────────────────────────
// No full-width border — HRule is rendered outside below it
type Page = "home" | "login" | "shop" | "sell" | "favorites";

function NavBar({ onNavigate, onAbout }: { onNavigate: (page: Page) => void; onAbout: () => void }) {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center px-8 py-4 relative overflow-hidden"
      style={{ background: "linear-gradient(to right, #ADEED9, #0FBAB5)" }}
    >
      <NoiseLayer />
      <div className="relative z-20 flex items-center w-full">

        {/* LEFT: seashell + search */}
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate("home")} aria-label="Home" className="cursor-pointer">
            <ImageWithFallback
              src={imgShell}
              alt="Home"
              className="w-10 h-10 object-contain"
              style={{ mixBlendMode: "screen" }}
            />
          </button>
          <button className="opacity-90 hover:opacity-100 transition-opacity" aria-label="Search">
            <SearchIcon />
          </button>
        </div>

        {/* CENTER: links */}
        <ul className="flex gap-16 list-none mx-auto">
          {["About", "Shop", "Sell"].map((link) => (
            <li key={link}>
              <button
                onClick={() => {
                  if (link === "About") { onNavigate("home"); setTimeout(onAbout, 50); }
                  else if (link === "Shop") { onNavigate("shop"); }
                  else if (link === "Sell") { onNavigate("sell"); }
                }}
                style={{ color: CREAM, fontFamily: montserrat, fontWeight: 600, fontSize: "16px", letterSpacing: "0.4px" }}
                className="hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
              >
                {link}
              </button>
            </li>
          ))}
        </ul>

        {/* RIGHT: heart + Account */}
        <div className="flex items-center gap-5">
          <button onClick={() => onNavigate("favorites")} className="opacity-90 hover:opacity-100 transition-opacity" aria-label="Favorites">
            <HeartOutlineIcon />
          </button>
          <button
            onClick={() => onNavigate("login")}
            style={{ color: CREAM, fontFamily: montserrat, fontWeight: 600, fontSize: "16px", letterSpacing: "0.3px" }}
            className="hover:opacity-70 transition-opacity whitespace-nowrap bg-transparent border-none cursor-pointer"
          >
            Account
          </button>
        </div>

      </div>
    </nav>
  );
}

// ── hero ──────────────────────────────────────────────────────────
function Hero({ onShop }: { onShop: () => void }) {
  return (
    <section className="relative flex items-start min-h-[480px] px-16 pt-16 pb-16 overflow-hidden">
      {/* mermaid illustration — left, flipped horizontally */}
      <div
        aria-hidden
        className="absolute pointer-events-none select-none"
        style={{
          width: "46%",
          maxWidth: "560px",
          opacity: 1,
          left: "-4%",
          bottom: "-8%",
          transform: "scaleX(-1) rotate(60deg)",
          transformOrigin: "center center",
        }}
      >
        <img src={imgMermaid} alt="" className="w-full h-auto object-contain" />
      </div>

      {/* RIGHT: title + tagline + button */}
      <div className="relative z-20 flex flex-col items-end max-w-[600px] text-right mt-12" style={{ position: "absolute", right: "64px", top: 0, paddingTop: "48px" }}>
        {/* title — slightly smaller */}
        <img
          src={imgTitle}
          alt="Mermaid Marketplace"
          className="w-full max-w-[460px] object-contain"
          style={{ mixBlendMode: "multiply" }}
        />

        <p
          className="mt-3"
          style={{ color: CREAM, fontFamily: montserrat, fontWeight: 400, fontSize: "19px", lineHeight: 1.85, opacity: 0.9, alignSelf: "flex-end", marginRight: "48px" }}
        >
          Dive in.<br />Shop around.
        </p>

        <button
          onClick={onShop}
          className="mt-4 hover:opacity-90 active:scale-[0.98] transition-all"
          style={{
            padding: "9px 32px",
            background: CREAM,
            border: `2px solid ${BTN_TEAL}`,
            borderRadius: "20px",
            color: BTN_TEAL,
            fontFamily: montserrat,
            fontWeight: 400,
            fontSize: "17px",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            alignSelf: "flex-end",
            marginRight: "48px",
          }}
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}

// ── product card ──────────────────────────────────────────────────
function ProductCard({ name, seller, price, onClick }: { name: string; seller: string; price: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer"
      style={{ background: CARD_TEAL, borderRadius: "20px", boxShadow: "0 6px 20px rgba(0,0,0,0.22)" }}
    >
      <div style={{ minHeight: "190px", background: CARD_TEAL }} />
      <div className="px-6 pt-3 pb-6">
        <p style={{ color: CREAM, fontFamily: montserrat, fontWeight: 700, fontSize: "18px" }}>{name}</p>
        <p style={{ color: CREAM, fontFamily: montserrat, fontWeight: 400, fontSize: "14px", opacity: 0.9, marginTop: "2px" }}>{seller}</p>
        <p style={{ color: CREAM, fontFamily: montserrat, fontWeight: 500, fontSize: "24px", marginTop: "6px" }}>{price}</p>
      </div>
    </div>
  );
}

// ── featured ──────────────────────────────────────────────────────
interface FeaturedProps {
  onShop: () => void;
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onMessageSeller: (product: Product) => void;
}

function Featured({ onShop, favorites, onToggleFavorite, onMessageSeller }: FeaturedProps) {
  const [selected, setSelected] = useState<Product | null>(null);
  const featuredProducts = ALL_PRODUCTS.slice(0, 4);

  return (
    <section className="px-10 pt-10 pb-8">
      <p
        className="text-center mb-10"
        style={{ color: CREAM, fontFamily: display, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px, 2.6vw, 36px)", lineHeight: 1.5 }}
      >
        some treasures are closer than you think.
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {featuredProducts.map((p) => (
          <ProductCard key={p.id} name={p.name} seller={p.seller} price={p.price} onClick={() => setSelected(p)} />
        ))}
      </div>
      <div className="text-center mt-8 pb-14">
        <button
          onClick={onShop}
          style={{ color: CREAM, fontFamily: montserrat, fontWeight: 400, fontSize: "16px", textDecoration: "underline", textUnderlineOffset: "4px", background: "none", border: "none", cursor: "pointer" }}
          className="hover:opacity-70 transition-opacity"
        >
          See More
        </button>
      </div>

      {selected && (
        <ProductModal
          product={selected}
          isFavorited={favorites.has(selected.id)}
          onToggleFavorite={onToggleFavorite}
          onMessageSeller={(p) => { setSelected(null); onMessageSeller(p); }}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}

// ── about ─────────────────────────────────────────────────────────
function About() {
  return (
    <div
      className="p-10 h-full flex flex-col"
      style={{ background: CARD_BG, border: `2px solid ${BORDER_MINT}`, borderRadius: "20px" }}
    >
      <h2 style={{ color: CREAM, fontFamily: display, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(44px, 4.5vw, 64px)", lineHeight: 1, marginBottom: "24px" }}>
        about
      </h2>
      <p style={{ color: CREAM, fontFamily: montserrat, fontWeight: 400, fontSize: "clamp(14px, 1.3vw, 18px)", lineHeight: 1.8 }}>
        Mermaid Marketplace is a UCSD-only buy, sell, and trade platform.
        Verified accounts. Designated meetup zones. No strangers, just your campus community.
        Built by women who wanted to design a safe exchange system that works for everyone!
      </p>
    </div>
  );
}

// ── how it works ──────────────────────────────────────────────────
const STEPS = [
  { num: "1", filled: true,  title: "Verify your UCSD email", desc: "Sign up with your campus email only" },
  { num: "2", filled: false, title: "Browse or List",         desc: "Post what you're selling or find what you need." },
  { num: "3", filled: false, title: "Pick a Meetup Zone",     desc: "Choose from pre-approved campus spots." },
  { num: "4", filled: false, title: "Exchange Safely",        desc: "Meet at your zone, rate the exchange, done." },
];

function HowItWorks() {
  return (
    <div
      className="p-10 h-full flex flex-col"
      style={{ background: CARD_BG, border: `2px solid ${BORDER_MINT}`, borderRadius: "20px" }}
    >
      <h2 style={{ color: CREAM, fontFamily: display, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(44px, 4.5vw, 64px)", lineHeight: 1, marginBottom: "32px" }}>
        how it works
      </h2>

      {/* steps — no connecting line */}
      <div className="flex justify-between items-start gap-2">
        {STEPS.map((step) => (
          <div key={step.num} className="flex-1 flex flex-col items-center text-center px-1">
            <div className="relative flex items-center justify-center" style={{ width: 64, height: 59 }}>
              {step.filled ? <HeartFilledStep size={64} /> : <HeartOutlineStep size={64} />}
              <span
                className="absolute inset-0 flex items-center justify-center pb-2"
                style={{ color: step.filled ? BTN_TEAL : CREAM, fontFamily: montserrat, fontWeight: 700, fontSize: "18px" }}
              >
                {step.num}
              </span>
            </div>
            <p style={{ color: CREAM, fontFamily: montserrat, fontWeight: 700, fontSize: "13px", lineHeight: 1.4, marginTop: "10px" }}>
              {step.title}
            </p>
            <p style={{ color: CREAM, fontFamily: montserrat, fontWeight: 400, fontSize: "11px", lineHeight: 1.6, marginTop: "4px", opacity: 0.88 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoSection({ sectionRef }: { sectionRef?: React.RefObject<HTMLElement> }) {
  return (
    <section ref={sectionRef} className="px-10 pb-20 pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
        <About />
        <HowItWorks />
      </div>
    </section>
  );
}

// ── footer (solid #57DFCF bg + noise) ────────────────────────────
function Footer() {
  return (
    <footer className="relative px-10 pt-10 pb-8" style={{ background: CARD_TEAL }}>
      <NoiseLayer />
      <div className="relative z-20 max-w-6xl mx-auto">

        {/* top row: right = title above links */}
        <div className="flex justify-end">
          <div className="flex flex-col items-end gap-2">
            {/* tightly-cropped title image, right-aligned */}
            <img
              src={imgTitle}
              alt="Mermaid Marketplace"
              className="object-contain"
              style={{ width: "240px", mixBlendMode: "multiply" }}
            />
            {/* smaller nav links */}
            <div className="flex flex-col items-end gap-0.5 mt-1">
              {["Shop", "List an item", "FAQ"].map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{ color: CREAM, fontFamily: montserrat, fontWeight: 600, fontSize: "15px", textDecoration: "none" }}
                  className="hover:opacity-70 transition-opacity"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* region badge — left-aligned, sits just above the divider */}
        <div className="mt-6">
          <span
            style={{
              display: "inline-block",
              padding: "8px 18px",
              background: "rgba(173,238,217,0.25)",
              border: `1px solid rgba(255,237,243,0.5)`,
              borderRadius: "20px",
              color: CREAM,
              fontFamily: montserrat,
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.4px",
            }}
          >
            UNITED STATES | USD $
          </span>
        </div>

        {/* divider */}
        <div style={{ height: "2px", background: CREAM, opacity: 0.4, margin: "16px 0 14px" }} />

        {/* bottom: left = copyright, right = legal */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p style={{ color: CREAM, fontFamily: montserrat, fontWeight: 600, fontSize: "11px", opacity: 0.8 }}>
            @ 2026, Women in Computing
          </p>
          <div className="flex gap-6 flex-wrap">
            {["Refund policy", "Privacy policy", "Terms of service"].map((item) => (
              <a
                key={item}
                href="#"
                style={{ color: CREAM, fontFamily: montserrat, fontWeight: 600, fontSize: "11px", opacity: 0.8, textDecoration: "none" }}
                className="hover:opacity-100 transition-opacity"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

// ── home page content ─────────────────────────────────────────────
interface HomePageProps {
  infoRef: React.RefObject<HTMLElement>;
  onShop: () => void;
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onMessageSeller: (product: Product) => void;
}

function HomePage({ infoRef, onShop, favorites, onToggleFavorite, onMessageSeller }: HomePageProps) {
  return (
    <>
      {/* TOP ZONE — horizontal gradient left→right */}
      <div className="relative" style={{ background: "linear-gradient(to right, #ADEED9, #0FBAB5)" }}>
        <NoiseLayer />
        <Hero onShop={onShop} />
      </div>

      {/* MIDDLE ZONE — vertical gradient top→bottom, extended bottom padding */}
      <div className="relative" style={{ background: "linear-gradient(to bottom, #0FBAB5, #188784)" }}>
        <NoiseLayer />
        <Featured onShop={onShop} favorites={favorites} onToggleFavorite={onToggleFavorite} onMessageSeller={onMessageSeller} />
        <InfoSection sectionRef={infoRef} />
      </div>
    </>
  );
}

// ── root ──────────────────────────────────────────────────────────
export default function App() {
  type Page = "home" | "login" | "shop" | "sell" | "favorites";
  const [page, setPage] = useState<Page>("home");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [openConvId, setOpenConvId] = useState<number | null>(null);
  const [accountTab, setAccountTab] = useState<"purchases" | "sold" | "messages">("purchases");
  const infoRef = useRef<HTMLElement>(null);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleMessageSeller = (product: { id: number; name: string; seller: string }) => {
    setConversations(prev => {
      if (prev.find(c => c.productId === product.id)) return prev;
      return [...prev, { id: product.id, productId: product.id, productName: product.name, sellerName: product.seller, messages: [] }];
    });
    setOpenConvId(product.id);
    setAccountTab("messages");
    setPage("account");
  };

  const sendMessage = (convId: number, text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, messages: [...c.messages, { from: "you", text, time }] } : c
    ));
  };

  const scrollToAbout = () => {
    infoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CustomCursor />

      {/* NAV — gradient bg, sticky */}
      <div className="relative" style={{ background: "linear-gradient(to right, #ADEED9, #0FBAB5)" }}>
        <NavBar onNavigate={setPage} onAbout={scrollToAbout} />
        {/* Rule spans px-8 to match nav content edges (seashell left → Account right) */}
        <div className="px-8">
          <div style={{ height: "2px", background: CREAM }} />
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-1">
        {page === "home" ? (
          <HomePage
            infoRef={infoRef}
            onShop={() => setPage("shop")}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onMessageSeller={handleMessageSeller}
          />
        ) : page === "shop" ? (
          <ShopPage favorites={favorites} onToggleFavorite={toggleFavorite} onMessageSeller={handleMessageSeller} />
        ) : page === "sell" ? (
          <SellPage />
        ) : page === "favorites" ? (
          <FavoritesPage favorites={favorites} onToggleFavorite={toggleFavorite} onMessageSeller={handleMessageSeller} />
        ) : page === "account" ? (
          <AccountPage
            conversations={conversations}
            openConvId={openConvId}
            initialTab={accountTab}
            onSendMessage={sendMessage}
            onSelectConv={setOpenConvId}
          />
        ) : (
          <LoginPage onSignIn={() => setPage("account")} />
        )}
      </div>

      {/* constrained rule above footer */}
      <div className="relative" style={{ background: CARD_TEAL }}>
        <div className="px-10 pt-6">
          <div className="max-w-6xl mx-auto" style={{ height: "2px", background: CREAM, opacity: 0.4 }} />
        </div>
      </div>

      {/* FOOTER ZONE — solid #57DFCF */}
      <Footer />

    </div>
  );
}
