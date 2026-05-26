import { useState } from "react";
import { Heart } from "lucide-react";
import { ALL_PRODUCTS, Product } from "@/app/ShopPage";
import ProductModal from "@/app/ProductModal";

const MINT       = "#adeed9";
const BTN_TEAL   = "#0fbab5";
const CARD_TEAL  = "#57dfcf";
const CREAM      = "#ffedf3";
const montserrat = "'Montserrat', sans-serif";
const display    = "'Cormorant Garamond', serif";

function FavoriteCard({
  product,
  onRemove,
  onClick,
}: {
  product: Product;
  onRemove: (id: number) => void;
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

        <button
          onClick={(e) => { e.stopPropagation(); onRemove(product.id); }}
          aria-label="Remove from favorites"
          className="absolute bottom-5 right-5 hover:scale-110 transition-transform"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <Heart size={22} strokeWidth={2} color={CREAM} fill={CREAM} />
        </button>
      </div>
    </div>
  );
}

interface FavoritesPageProps {
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onMessageSeller: (product: Product) => void;
}

export default function FavoritesPage({ favorites, onToggleFavorite, onMessageSeller }: FavoritesPageProps) {
  const favorited = ALL_PRODUCTS.filter((p) => favorites.has(p.id));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main
      className="min-h-screen py-10"
      style={{ background: "linear-gradient(to right, #fff6f9, #ffedf3)" }}
    >
      <div className="max-w-6xl mx-auto px-10">
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
          favorites
        </h1>

        {favorited.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <Heart size={56} color={CARD_TEAL} strokeWidth={1.5} />
            <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontWeight: 500, fontSize: "18px", opacity: 0.8 }}>
              No favorites yet — heart an item on the Shop page to save it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {favorited.map((p) => (
              <FavoriteCard key={p.id} product={p} onRemove={onToggleFavorite} onClick={() => setSelectedProduct(p)} />
            ))}
          </div>
        )}
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
