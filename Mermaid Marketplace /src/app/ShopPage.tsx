import { useState } from "react";
import { ChevronDown, Heart } from "lucide-react";
import ProductModal from "@/app/ProductModal";

const MINT       = "#adeed9";
const BTN_TEAL   = "#0fbab5";
const CARD_TEAL  = "#57dfcf";
const CREAM      = "#ffedf3";
const montserrat = "'Montserrat', sans-serif";
const display    = "'Cormorant Garamond', serif";

const CATEGORIES  = ["Shop All", "Furniture", "Clothing", "Electronics"];
const COLLEGES    = ["Revelle", "Muir", "Marshall", "Warren", "Roosevelt", "Sixth", "Seventh", "Eighth"];
const SORT_OPTIONS = ["Relevance", "Price"];
const ITEMS_PER_PAGE = 8;

export interface Product {
  id: number;
  name: string;
  seller: string;
  price: string;
}

export const ALL_PRODUCTS: Product[] = [
  { id: 1,  name: "Brand New Car",      seller: "Sixth College",    price: "$00.00" },
  { id: 2,  name: "Macbook Air",         seller: "Seventh College",  price: "$00.00" },
  { id: 3,  name: "Hoodie Collection",   seller: "Warren College",   price: "$00.00" },
  { id: 4,  name: "Vintage Lamp",        seller: "Revelle College",  price: "$00.00" },
  { id: 5,  name: "Study Desk",          seller: "Muir College",     price: "$00.00" },
  { id: 6,  name: "Textbook Bundle",     seller: "Marshall College", price: "$00.00" },
  { id: 7,  name: "Skateboard",          seller: "Roosevelt College",price: "$00.00" },
  { id: 8,  name: "Mini Fridge",         seller: "Eighth College",   price: "$00.00" },
  { id: 9,  name: "Hoodie Collection",   seller: "Warren College",   price: "$00.00" },
  { id: 10, name: "Macbook Air",         seller: "Seventh College",  price: "$00.00" },
  { id: 11, name: "Brand New Car",       seller: "Sixth College",    price: "$00.00" },
  { id: 12, name: "Bluetooth Speaker",   seller: "Revelle College",  price: "$00.00" },
  { id: 13, name: "Desk Chair",          seller: "Muir College",     price: "$00.00" },
  { id: 14, name: "Graphic Tee",         seller: "Marshall College", price: "$00.00" },
  { id: 15, name: "Longboard",           seller: "Roosevelt College",price: "$00.00" },
  { id: 16, name: "Coffee Maker",        seller: "Eighth College",   price: "$00.00" },
];

function ShopCard({
  product,
  isFavorited,
  onToggleFavorite,
  onClick,
}: {
  product: Product;
  isFavorited: boolean;
  onToggleFavorite: (id: number) => void;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer relative"
      style={{ background: BTN_TEAL, borderRadius: "20px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}
    >
      <div style={{ background: CREAM, margin: "16px 16px 0", borderRadius: "10px", minHeight: "200px" }} />
      <div className="px-5 pt-3 pb-5 relative">
        <p style={{ color: MINT, fontFamily: montserrat, fontWeight: 700, fontSize: "16px", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ color: MINT, fontFamily: montserrat, fontWeight: 400, fontSize: "13px", marginTop: "2px", opacity: 0.9 }}>{product.seller}</p>
        <p style={{ color: MINT, fontFamily: montserrat, fontWeight: 500, fontSize: "22px", marginTop: "6px" }}>{product.price}</p>

        {/* Heart favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          className="absolute bottom-5 right-5 hover:scale-110 transition-transform"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <Heart
            size={22}
            strokeWidth={2}
            color={isFavorited ? CREAM : MINT}
            fill={isFavorited ? CREAM : "none"}
          />
        </button>
      </div>
    </div>
  );
}

interface ShopPageProps {
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onMessageSeller: (product: Product) => void;
}

export default function ShopPage({ favorites, onToggleFavorite, onMessageSeller }: ShopPageProps) {
  const [activeCategory, setActiveCategory] = useState("Shop All");
  const [sortOpen, setSortOpen]   = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy]       = useState("Relevance");
  const [filterBy, setFilterBy]   = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const totalPages = Math.ceil(ALL_PRODUCTS.length / ITEMS_PER_PAGE);
  const pageProducts = ALL_PRODUCTS.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const headingText = activeCategory === "Shop All" ? "shop all" : activeCategory.toLowerCase();

  const labelStyle: React.CSSProperties = {
    color: CARD_TEAL,
    fontFamily: montserrat,
    fontWeight: 600,
    fontSize: "15px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const dropdownStyle: React.CSSProperties = {
    background: "linear-gradient(to bottom, rgba(173,238,217,0.97), rgba(87,223,207,0.97))",
    border: `2px solid ${CARD_TEAL}`,
    borderRadius: "14px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    minWidth: "160px",
    position: "absolute",
    left: 0,
    top: "calc(100% + 8px)",
    zIndex: 20,
    overflow: "hidden",
  };

  return (
    <main
      className="min-h-screen py-10"
      style={{ background: "linear-gradient(to right, #fff6f9, #ffedf3)" }}
    >
      <div className="max-w-6xl mx-auto px-10">

        {/* Category filter tabs */}
        <div className="flex gap-4 flex-wrap mb-6">
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                style={{
                  padding: "10px 24px",
                  background: active ? "rgba(173,238,217,0.7)" : "rgba(173,238,217,0.25)",
                  border: `2px solid ${CARD_TEAL}`,
                  borderRadius: "20px",
                  color: BTN_TEAL,
                  fontFamily: montserrat,
                  fontWeight: 600,
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* heading */}
        <h1
          style={{
            color: BTN_TEAL,
            fontFamily: display,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(44px, 5vw, 72px)",
            lineHeight: 1,
            marginBottom: "12px",
          }}
        >
          {headingText}
        </h1>

        {/* Filter / Sort row */}
        <div className="flex items-center gap-6 mb-8">

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }}
              style={labelStyle}
            >
              Filter{filterBy ? `: ${filterBy}` : ""}
              <ChevronDown
                size={15}
                color={CARD_TEAL}
                strokeWidth={2.5}
                style={{ transition: "transform 0.2s", transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            {filterOpen && (
              <div style={dropdownStyle}>
                {filterBy && (
                  <button
                    onClick={() => { setFilterBy(null); setFilterOpen(false); setCurrentPage(1); }}
                    className="w-full text-left hover:bg-white/20 transition-colors"
                    style={{ padding: "10px 18px", color: CREAM, fontFamily: montserrat, fontWeight: 500, fontSize: "14px", background: "none", border: "none", cursor: "pointer", borderBottom: `1px solid rgba(255,255,255,0.25)` }}
                  >
                    Clear filter
                  </button>
                )}
                {COLLEGES.map((col) => (
                  <button
                    key={col}
                    onClick={() => { setFilterBy(col); setFilterOpen(false); setCurrentPage(1); }}
                    className="w-full text-left hover:bg-white/20 transition-colors"
                    style={{
                      padding: "10px 18px",
                      color: col === filterBy ? BTN_TEAL : CREAM,
                      fontFamily: montserrat,
                      fontWeight: col === filterBy ? 700 : 500,
                      fontSize: "14px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {col}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort by dropdown */}
          <div className="relative">
            <button
              onClick={() => { setSortOpen(o => !o); setFilterOpen(false); }}
              style={labelStyle}
            >
              Sort by: {sortBy}
              <ChevronDown
                size={15}
                color={CARD_TEAL}
                strokeWidth={2.5}
                style={{ transition: "transform 0.2s", transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            {sortOpen && (
              <div style={dropdownStyle}>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setSortOpen(false); }}
                    className="w-full text-left hover:bg-white/20 transition-colors"
                    style={{
                      padding: "10px 18px",
                      color: opt === sortBy ? BTN_TEAL : CREAM,
                      fontFamily: montserrat,
                      fontWeight: opt === sortBy ? 700 : 500,
                      fontSize: "14px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {pageProducts.map((p) => (
            <ShopCard
              key={p.id}
              product={p}
              isFavorited={favorites.has(p.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={() => setSelectedProduct(p)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "8px 22px",
              background: currentPage === 1 ? "rgba(173,238,217,0.2)" : "rgba(173,238,217,0.5)",
              border: `2px solid ${CARD_TEAL}`,
              borderRadius: "14px",
              color: currentPage === 1 ? "rgba(15,186,181,0.4)" : BTN_TEAL,
              fontFamily: montserrat,
              fontWeight: 600,
              fontSize: "14px",
              cursor: currentPage === 1 ? "default" : "pointer",
              transition: "background 0.2s",
            }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: n === currentPage ? BTN_TEAL : "rgba(173,238,217,0.3)",
                border: `2px solid ${CARD_TEAL}`,
                color: n === currentPage ? CREAM : BTN_TEAL,
                fontFamily: montserrat,
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 22px",
              background: currentPage === totalPages ? "rgba(173,238,217,0.2)" : "rgba(173,238,217,0.5)",
              border: `2px solid ${CARD_TEAL}`,
              borderRadius: "14px",
              color: currentPage === totalPages ? "rgba(15,186,181,0.4)" : BTN_TEAL,
              fontFamily: montserrat,
              fontWeight: 600,
              fontSize: "14px",
              cursor: currentPage === totalPages ? "default" : "pointer",
              transition: "background 0.2s",
            }}
          >
            Next →
          </button>
        </div>

      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isFavorited={favorites.has(selectedProduct.id)}
          onToggleFavorite={onToggleFavorite}
          onMessageSeller={(p) => { setSelectedProduct(null); onMessageSeller(p); }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
