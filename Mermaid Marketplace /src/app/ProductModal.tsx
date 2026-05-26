import { X, Heart, MessageCircle, MapPin, Tag } from "lucide-react";
import { Product } from "@/app/ShopPage";

const MINT       = "#adeed9";
const BTN_TEAL   = "#0fbab5";
const CARD_TEAL  = "#57dfcf";
const CREAM      = "#ffedf3";
const montserrat = "'Montserrat', sans-serif";
const display    = "'Cormorant Garamond', serif";

// Placeholder detail data keyed by product id
const DETAILS: Record<number, { category: string; location: string; condition: string; description: string }> = {
  1:  { category: "Vehicles",     location: "Sixth College",     condition: "Used — Good",      description: "Barely used, great condition. Perfect for getting around campus and beyond. All paperwork included." },
  2:  { category: "Electronics",  location: "Seventh College",   condition: "Used — Like New",  description: "M2 chip, 8GB RAM, 256GB SSD. Minor scuff on corner, otherwise flawless. Charger included." },
  3:  { category: "Clothing",     location: "Warren College",    condition: "New with tags",    description: "Full collection of hoodies, sizes S–XL available. Soft fleece interior, embroidered logo." },
  4:  { category: "Furniture",    location: "Revelle College",   condition: "Used — Fair",      description: "Vintage brass floor lamp. Works perfectly, bulb included. Great for dorm or apartment." },
  5:  { category: "Furniture",    location: "Muir College",      condition: "Used — Good",      description: "Sturdy study desk, 120cm wide. Two drawers. Easy to disassemble and transport." },
  6:  { category: "Books",        location: "Marshall College",  condition: "Used — Acceptable","description": "Bundle of STEM textbooks from Fall quarter. Some highlighting, all pages intact." },
  7:  { category: "Sports",       location: "Roosevelt College", condition: "Used — Good",      description: "7-ply maple deck, new wheels and bearings. Trucks are slightly worn but functional." },
  8:  { category: "Appliances",   location: "Eighth College",    condition: "Used — Like New",  description: "3.2 cu ft compact fridge. Quiet motor, adjustable shelves. Barely used." },
  9:  { category: "Clothing",     location: "Warren College",    condition: "New with tags",    description: "Same collection as above — different sizes available. Perfect UCSD merch." },
  10: { category: "Electronics",  location: "Seventh College",   condition: "Used — Good",      description: "Previous gen MacBook Air, runs great. Battery health at 89%. Charger included." },
  11: { category: "Vehicles",     location: "Sixth College",     condition: "Used — Good",      description: "Second listing — see details above. Contact for test drive." },
  12: { category: "Electronics",  location: "Revelle College",   condition: "Used — Like New",  description: "JBL Flip 6. Waterproof, 12hr battery. Only used a handful of times." },
  13: { category: "Furniture",    location: "Muir College",      condition: "Used — Good",      description: "Ergonomic mesh back chair. Adjustable height and armrests. Some wear on seat." },
  14: { category: "Clothing",     location: "Marshall College",  condition: "New with tags",    description: "Limited run graphic tee, size M. Never worn. Washed once." },
  15: { category: "Sports",       location: "Roosevelt College", condition: "Used — Good",      description: "40\" pintail longboard. Good trucks and wheels. Grip tape recently replaced." },
  16: { category: "Appliances",   location: "Eighth College",    condition: "Used — Like New",  description: "12-cup drip coffee maker. Comes with reusable filter. Clean and ready to use." },
};

const DEFAULT_DETAIL = { category: "Other", location: "UCSD", condition: "Used — Good", description: "No additional description provided by the seller." };

interface ProductModalProps {
  product: Product;
  isFavorited: boolean;
  onToggleFavorite: (id: number) => void;
  onMessageSeller: (product: Product) => void;
  onClose: () => void;
}

export default function ProductModal({ product, isFavorited, onToggleFavorite, onMessageSeller, onClose }: ProductModalProps) {
  const detail = DETAILS[product.id] ?? DEFAULT_DETAIL;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[820px] flex flex-col md:flex-row overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, rgba(173,238,217,0.97) 0%, rgba(87,223,207,0.97) 100%)",
          border: `2px solid ${CARD_TEAL}`,
          borderRadius: "24px",
          boxShadow: "0 16px 56px rgba(0,0,0,0.28)",
          maxHeight: "90vh",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center hover:scale-110 transition-transform"
          style={{
            width: "34px", height: "34px",
            background: "rgba(255,255,255,0.3)",
            border: `1.5px solid ${CARD_TEAL}`,
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <X size={18} color={BTN_TEAL} strokeWidth={2.5} />
        </button>

        {/* LEFT — image */}
        <div className="flex-shrink-0 md:w-[340px] p-6 flex flex-col gap-4">
          <div
            style={{
              background: CREAM,
              borderRadius: "16px",
              minHeight: "280px",
              flex: 1,
            }}
          />
          {/* Condition badge */}
          <div
            className="flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.35)",
              border: `1.5px solid ${CARD_TEAL}`,
              borderRadius: "12px",
              padding: "8px 16px",
            }}
          >
            <span style={{ color: BTN_TEAL, fontFamily: montserrat, fontWeight: 600, fontSize: "13px" }}>
              {detail.condition}
            </span>
          </div>
        </div>

        {/* RIGHT — details */}
        <div className="flex-1 p-6 pr-8 flex flex-col overflow-y-auto" style={{ paddingTop: "28px" }}>
          {/* Name */}
          <h2
            style={{
              color: BTN_TEAL,
              fontFamily: display,
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(28px, 4vw, 42px)",
              lineHeight: 1.1,
              marginBottom: "4px",
              paddingRight: "40px",
            }}
          >
            {product.name}
          </h2>

          {/* Price */}
          <p style={{ color: BTN_TEAL, fontFamily: montserrat, fontWeight: 700, fontSize: "26px", marginBottom: "12px" }}>
            {product.price}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} color={CREAM} strokeWidth={2} />
              <span style={{ color: CREAM, fontFamily: montserrat, fontWeight: 500, fontSize: "13px" }}>
                {detail.location}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag size={14} color={CREAM} strokeWidth={2} />
              <span style={{ color: CREAM, fontFamily: montserrat, fontWeight: 500, fontSize: "13px" }}>
                {detail.category}
              </span>
            </div>
          </div>

          {/* Seller */}
          <p style={{ color: BTN_TEAL, fontFamily: montserrat, fontWeight: 600, fontSize: "14px", marginBottom: "14px", opacity: 0.85 }}>
            Listed by <span style={{ fontWeight: 700 }}>{product.seller}</span>
          </p>

          {/* Divider */}
          <div style={{ height: "1.5px", background: "rgba(255,255,255,0.4)", marginBottom: "14px" }} />

          {/* Description */}
          <p style={{ color: BTN_TEAL, fontFamily: montserrat, fontWeight: 400, fontSize: "14px", lineHeight: 1.7, marginBottom: "auto" }}>
            {detail.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6">
            {/* Message seller */}
            <button
              onClick={() => onMessageSeller(product)}
              className="flex items-center gap-2 flex-1 justify-center hover:opacity-90 active:scale-[0.98] transition-all"
              style={{
                background: BTN_TEAL,
                border: `2px solid ${BTN_TEAL}`,
                borderRadius: "14px",
                padding: "12px 20px",
                color: CREAM,
                fontFamily: montserrat,
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              <MessageCircle size={17} color={CREAM} strokeWidth={2} />
              Message Seller
            </button>

            {/* Favorite toggle */}
            <button
              onClick={() => onToggleFavorite(product.id)}
              className="flex items-center justify-center hover:scale-110 transition-transform"
              style={{
                width: "48px",
                height: "48px",
                background: isFavorited ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)",
                border: `2px solid ${isFavorited ? CREAM : CARD_TEAL}`,
                borderRadius: "14px",
                cursor: "pointer",
              }}
            >
              <Heart
                size={20}
                strokeWidth={2}
                color={isFavorited ? CREAM : BTN_TEAL}
                fill={isFavorited ? CREAM : "none"}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
