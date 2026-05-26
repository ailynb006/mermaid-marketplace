import { useState, useRef } from "react";
import { Pencil, X, Upload } from "lucide-react";

const MINT       = "#adeed9";
const BTN_TEAL   = "#0fbab5";
const CARD_TEAL  = "#57dfcf";
const CREAM      = "#ffedf3";
const montserrat = "'Montserrat', sans-serif";
const display    = "'Cormorant Garamond', serif";

const CATEGORIES = ["Furniture", "Clothing", "Electronics", "Books", "Other"];

interface Listing {
  id: number;
  name: string;
  seller: string;
  price: string;
  image?: string;
}

const INITIAL_LISTINGS: Listing[] = [
  { id: 1, name: "Brand New Car",     seller: "Sixth College",   price: "$00.00" },
  { id: 2, name: "Brand New Car",     seller: "Sixth College",   price: "$00.00" },
  { id: 3, name: "Brand New Car",     seller: "Sixth College",   price: "$00.00" },
];

// ── listing card ──────────────────────────────────────────────────
function ListingCard({ listing, onEdit }: { listing: Listing; onEdit: () => void }) {
  return (
    <div
      className="flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer relative"
      style={{ background: BTN_TEAL, borderRadius: "20px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}
    >
      {/* Pencil edit button */}
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="absolute top-3 right-3 z-10 flex items-center justify-center hover:scale-110 transition-transform"
        style={{
          background: "rgba(255,255,255,0.25)",
          borderRadius: "10px",
          width: "34px",
          height: "34px",
          border: `1.5px solid ${CREAM}`,
        }}
        aria-label="Edit listing"
      >
        <Pencil size={16} color={CREAM} strokeWidth={2.2} />
      </button>

      {/* image placeholder */}
      <div style={{ background: CREAM, margin: "16px 16px 0", borderRadius: "10px", minHeight: "200px", overflow: "hidden" }}>
        {listing.image && (
          <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" style={{ minHeight: "200px" }} />
        )}
      </div>

      <div className="px-5 pt-3 pb-5">
        <p style={{ color: MINT, fontFamily: montserrat, fontWeight: 700, fontSize: "16px", lineHeight: 1.3 }}>{listing.name}</p>
        <p style={{ color: MINT, fontFamily: montserrat, fontWeight: 400, fontSize: "13px", marginTop: "2px", opacity: 0.9 }}>{listing.seller}</p>
        <p style={{ color: MINT, fontFamily: montserrat, fontWeight: 500, fontSize: "22px", marginTop: "6px" }}>{listing.price}</p>
      </div>
    </div>
  );
}

// ── add new listing card ──────────────────────────────────────────
function AddListingCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 transition-all duration-200"
      onClick={onClick}
      style={{
        border: `2px solid ${BTN_TEAL}`,
        borderRadius: "20px",
        minHeight: "340px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        background: "rgba(173,238,217,0.15)",
      }}
    >
      <p style={{ color: CREAM, fontFamily: montserrat, fontWeight: 600, fontSize: "20px", marginBottom: "20px", textAlign: "center" }}>
        Add new listing
      </p>
      <div
        className="flex items-center justify-center"
        style={{
          width: "64px",
          height: "64px",
          border: `2px solid ${CREAM}`,
          borderRadius: "18px",
          background: "rgba(255,255,255,0.15)",
        }}
      >
        <svg width="36" height="36" fill="none" viewBox="0 0 44.9167 44.9167">
          <path
            d="M22.4583 1.75V43.1667M1.75 22.4583H43.1667"
            stroke={CREAM}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.5"
          />
        </svg>
      </div>
    </div>
  );
}

// ── new listing modal ─────────────────────────────────────────────
interface ListingFormData {
  name: string;
  category: string;
  location: string;
  description: string;
  price: string;
  imageFile: File | null;
  imagePreview: string;
}

function NewListingModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: ListingFormData) => void }) {
  const [form, setForm] = useState<ListingFormData>({
    name: "", category: "", location: "", description: "", price: "", imageFile: null, imagePreview: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, imageFile: file, imagePreview: url }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) return;
    onSubmit(form);
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(173,238,217,0.35)",
    border: `2px solid ${CARD_TEAL}`,
    borderRadius: "12px",
    padding: "11px 16px",
    color: BTN_TEAL,
    fontFamily: montserrat,
    fontWeight: 500,
    fontSize: "15px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    color: BTN_TEAL,
    fontFamily: montserrat,
    fontWeight: 600,
    fontSize: "13px",
    marginBottom: "5px",
    display: "block",
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[540px] relative flex flex-col"
        style={{
          background: "linear-gradient(to bottom, rgba(173,238,217,0.92), rgba(87,223,207,0.92))",
          border: `2px solid ${CARD_TEAL}`,
          borderRadius: "24px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4">
          <p style={{ color: BTN_TEAL, fontFamily: montserrat, fontWeight: 700, fontSize: "22px" }}>
            New Listing
          </p>
          <button
            onClick={onClose}
            className="flex items-center justify-center hover:scale-110 transition-transform"
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
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 flex flex-col gap-4">
          {/* Image upload */}
          <div>
            <label style={labelStyle}>Photo</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                border: `2px dashed ${CARD_TEAL}`,
                borderRadius: "14px",
                minHeight: "140px",
                background: form.imagePreview ? "transparent" : "rgba(255,255,255,0.2)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="Preview" className="w-full object-cover" style={{ maxHeight: "200px" }} />
              ) : (
                <div className="flex flex-col items-center gap-2 py-6">
                  <Upload size={28} color={BTN_TEAL} strokeWidth={1.8} />
                  <p style={{ color: BTN_TEAL, fontFamily: montserrat, fontWeight: 500, fontSize: "14px" }}>
                    Click to upload image
                  </p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Item name */}
          <div>
            <label style={labelStyle}>Item Name</label>
            <input
              type="text"
              placeholder="e.g. Macbook Air"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={inputStyle}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="" style={{ color: "#888" }}>Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              placeholder="e.g. Warren College"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Describe your item..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Price */}
          <div>
            <label style={labelStyle}>Price</label>
            <input
              type="text"
              placeholder="$0.00"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              style={inputStyle}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full hover:opacity-90 active:scale-[0.99] transition-all mt-2"
            style={{
              background: BTN_TEAL,
              border: `2px solid ${BTN_TEAL}`,
              borderRadius: "14px",
              padding: "13px 20px",
              color: CREAM,
              fontFamily: montserrat,
              fontWeight: 700,
              fontSize: "17px",
              cursor: "pointer",
            }}
          >
            Post Listing
          </button>
        </form>
      </div>
    </div>
  );
}

// ── sell page ─────────────────────────────────────────────────────
export default function SellPage() {
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  function handleNewListing(data: ListingFormData) {
    const newListing: Listing = {
      id: Date.now(),
      name: data.name,
      seller: data.location || "UCSD",
      price: data.price.startsWith("$") ? data.price : `$${data.price}`,
      image: data.imagePreview || undefined,
    };
    setListings(l => [...l, newListing]);
  }

  return (
    <main
      className="min-h-screen py-10"
      style={{ background: "linear-gradient(to right, #c8f0e5, #adeed9)" }}
    >
      <div className="max-w-6xl mx-auto px-10">
      {/* "listings" heading */}
      <h1
        style={{
          color: BTN_TEAL,
          fontFamily: display,
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(44px, 5vw, 72px)",
          lineHeight: 1,
          marginBottom: "32px",
        }}
      >
        listings
      </h1>

      {/* Cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onEdit={() => setEditingId(listing.id)}
          />
        ))}
        <AddListingCard onClick={() => setModalOpen(true)} />
      </div>

      </div>{/* end max-w-6xl */}

      {/* New listing modal */}
      {modalOpen && (
        <NewListingModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleNewListing}
        />
      )}

      {/* Edit placeholder toast */}
      {editingId !== null && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4"
          style={{
            background: BTN_TEAL,
            borderRadius: "16px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            color: CREAM,
            fontFamily: montserrat,
            fontWeight: 600,
            fontSize: "15px",
          }}
        >
          <Pencil size={18} color={CREAM} />
          Editing: {listings.find(l => l.id === editingId)?.name}
          <button
            onClick={() => setEditingId(null)}
            style={{ marginLeft: "8px", background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={16} color={CREAM} />
          </button>
        </div>
      )}
    </main>
  );
}
