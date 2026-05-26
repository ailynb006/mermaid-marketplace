import { useState, useRef, useEffect } from "react";
import { Send, Package, ShoppingBag, MessageCircle, ChevronRight } from "lucide-react";

const MINT       = "#adeed9";
const BTN_TEAL   = "#0fbab5";
const CARD_TEAL  = "#57dfcf";
const CREAM      = "#ffedf3";
const CARD_BG    = "rgba(173,238,217,0.25)";
const montserrat = "'Montserrat', sans-serif";
const display    = "'Cormorant Garamond', serif";

export interface ChatMessage {
  from: "you" | "seller";
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  productId: number;
  productName: string;
  sellerName: string;
  messages: ChatMessage[];
}

const MOCK_PURCHASES = [
  { id: 101, name: "Hoodie Collection", seller: "Warren College",  price: "$45.00", date: "May 12, 2026" },
  { id: 102, name: "Textbook Bundle",   seller: "Marshall College",price: "$28.00", date: "May 8, 2026"  },
  { id: 103, name: "Mini Fridge",       seller: "Eighth College",  price: "$85.00", date: "Apr 30, 2026" },
];

const MOCK_SOLD = [
  { id: 201, name: "Study Desk",      buyer: "Revelle College",  price: "$60.00", date: "May 18, 2026" },
  { id: 202, name: "Bluetooth Speaker",buyer:"Muir College",     price: "$35.00", date: "May 3, 2026"  },
];

type Tab = "purchases" | "sold" | "messages";

function ItemCard({ name, counterparty, price, date, label }: { name: string; counterparty: string; price: string; date: string; label: string }) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 hover:brightness-105 transition-all cursor-pointer"
      style={{
        background: "rgba(173,238,217,0.3)",
        border: `1.5px solid ${CARD_TEAL}`,
        borderRadius: "16px",
      }}
    >
      {/* image thumb */}
      <div style={{ width: "64px", height: "64px", background: CREAM, borderRadius: "10px", flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p style={{ color: BTN_TEAL, fontFamily: montserrat, fontWeight: 700, fontSize: "15px", lineHeight: 1.3 }}>{name}</p>
        <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontWeight: 500, fontSize: "12px", marginTop: "2px" }}>
          {label}: {counterparty}
        </p>
        <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontWeight: 400, fontSize: "11px", marginTop: "2px", opacity: 0.8 }}>{date}</p>
      </div>
      <p style={{ color: BTN_TEAL, fontFamily: montserrat, fontWeight: 700, fontSize: "18px", flexShrink: 0 }}>{price}</p>
    </div>
  );
}

function MessagesTab({
  conversations,
  openConvId,
  onSelectConv,
  onSendMessage,
}: {
  conversations: Conversation[];
  openConvId: number | null;
  onSelectConv: (id: number) => void;
  onSendMessage: (convId: number, text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeConv = conversations.find(c => c.id === openConvId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  function handleSend() {
    if (!draft.trim() || !openConvId) return;
    onSendMessage(openConvId, draft.trim());
    setDraft("");
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <MessageCircle size={48} color={CARD_TEAL} strokeWidth={1.5} />
        <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontWeight: 500, fontSize: "16px", opacity: 0.8 }}>
          No messages yet. Message a seller from any listing to start a conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4" style={{ minHeight: "480px" }}>
      {/* Conversation list */}
      <div
        className="flex flex-col gap-2 overflow-y-auto"
        style={{ width: "260px", flexShrink: 0 }}
      >
        {conversations.map(conv => {
          const last = conv.messages[conv.messages.length - 1];
          const isActive = conv.id === openConvId;
          return (
            <button
              key={conv.id}
              onClick={() => onSelectConv(conv.id)}
              className="text-left hover:brightness-105 transition-all"
              style={{
                background: isActive ? "rgba(15,186,181,0.2)" : "rgba(173,238,217,0.2)",
                border: `1.5px solid ${isActive ? BTN_TEAL : CARD_TEAL}`,
                borderRadius: "14px",
                padding: "12px 14px",
                cursor: "pointer",
              }}
            >
              <p style={{ color: BTN_TEAL, fontFamily: montserrat, fontWeight: 700, fontSize: "13px", lineHeight: 1.3 }}>
                {conv.productName}
              </p>
              <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontWeight: 500, fontSize: "11px", marginTop: "2px" }}>
                {conv.sellerName}
              </p>
              {last && (
                <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontWeight: 400, fontSize: "11px", marginTop: "4px", opacity: 0.75, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {last.from === "you" ? "You: " : ""}{last.text}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Thread view */}
      <div
        className="flex-1 flex flex-col"
        style={{
          background: "rgba(173,238,217,0.15)",
          border: `1.5px solid ${CARD_TEAL}`,
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >
        {activeConv ? (
          <>
            {/* Thread header */}
            <div
              className="px-5 py-4 flex flex-col"
              style={{ borderBottom: `1.5px solid rgba(87,223,207,0.4)` }}
            >
              <p style={{ color: BTN_TEAL, fontFamily: montserrat, fontWeight: 700, fontSize: "15px" }}>
                {activeConv.productName}
              </p>
              <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontWeight: 500, fontSize: "12px" }}>
                {activeConv.sellerName}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {activeConv.messages.length === 0 ? (
                <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontWeight: 400, fontSize: "13px", opacity: 0.7, textAlign: "center", marginTop: "32px" }}>
                  Say hello — start the conversation!
                </p>
              ) : (
                activeConv.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "you" ? "justify-end" : "justify-start"}`}>
                    <div
                      style={{
                        maxWidth: "70%",
                        background: msg.from === "you" ? BTN_TEAL : "rgba(255,255,255,0.45)",
                        borderRadius: msg.from === "you" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        padding: "10px 14px",
                      }}
                    >
                      <p style={{ color: msg.from === "you" ? CREAM : BTN_TEAL, fontFamily: montserrat, fontWeight: 400, fontSize: "13px", lineHeight: 1.5 }}>
                        {msg.text}
                      </p>
                      <p style={{ color: msg.from === "you" ? "rgba(255,255,255,0.6)" : CARD_TEAL, fontFamily: montserrat, fontSize: "10px", marginTop: "4px", textAlign: "right" }}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-4 py-3 flex gap-2"
              style={{ borderTop: `1.5px solid rgba(87,223,207,0.4)` }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="flex-1 outline-none"
                style={{
                  background: "rgba(255,255,255,0.3)",
                  border: `1.5px solid ${CARD_TEAL}`,
                  borderRadius: "12px",
                  padding: "10px 14px",
                  color: BTN_TEAL,
                  fontFamily: montserrat,
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!draft.trim()}
                className="flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
                style={{
                  width: "42px",
                  height: "42px",
                  background: draft.trim() ? BTN_TEAL : "rgba(15,186,181,0.3)",
                  borderRadius: "12px",
                  border: "none",
                  cursor: draft.trim() ? "pointer" : "default",
                  flexShrink: 0,
                }}
              >
                <Send size={17} color={CREAM} strokeWidth={2.2} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontWeight: 500, fontSize: "14px", opacity: 0.7 }}>
              Select a conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface AccountPageProps {
  conversations: Conversation[];
  openConvId: number | null;
  initialTab: Tab;
  onSendMessage: (convId: number, text: string) => void;
  onSelectConv: (id: number) => void;
}

export default function AccountPage({ conversations, openConvId, initialTab, onSendMessage, onSelectConv }: AccountPageProps) {
  const [tab, setTab] = useState<Tab>(initialTab);

  // Sync if parent changes initialTab (e.g. after navigating from Message Seller)
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "purchases", label: "Purchases",   icon: <ShoppingBag size={16} strokeWidth={2} /> },
    { key: "sold",      label: "Sold Items",  icon: <Package      size={16} strokeWidth={2} /> },
    { key: "messages",  label: "Messages",    icon: <MessageCircle size={16} strokeWidth={2} /> },
  ];

  return (
    <main
      className="min-h-screen py-10"
      style={{ background: "linear-gradient(to right, #fff6f9, #ffedf3)" }}
    >
      <div className="max-w-4xl mx-auto px-10">

        {/* Heading */}
        <h1
          style={{
            color: BTN_TEAL,
            fontFamily: display,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(44px, 5vw, 64px)",
            lineHeight: 1,
            marginBottom: "28px",
          }}
        >
          my account
        </h1>

        {/* Tab bar */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {tabs.map(t => {
            const active = tab === t.key;
            const msgCount = t.key === "messages" ? conversations.length : 0;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex items-center gap-2 transition-all"
                style={{
                  padding: "10px 22px",
                  background: active ? BTN_TEAL : "rgba(173,238,217,0.3)",
                  border: `2px solid ${active ? BTN_TEAL : CARD_TEAL}`,
                  borderRadius: "20px",
                  color: active ? CREAM : BTN_TEAL,
                  fontFamily: montserrat,
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {t.icon}
                {t.label}
                {msgCount > 0 && (
                  <span
                    style={{
                      background: active ? "rgba(255,255,255,0.3)" : BTN_TEAL,
                      color: active ? CREAM : CREAM,
                      borderRadius: "99px",
                      padding: "1px 8px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {msgCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "purchases" && (
          <div className="flex flex-col gap-3">
            {MOCK_PURCHASES.length === 0 ? (
              <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontSize: "15px", opacity: 0.7 }}>No purchases yet.</p>
            ) : (
              MOCK_PURCHASES.map(p => (
                <ItemCard key={p.id} name={p.name} counterparty={p.seller} price={p.price} date={p.date} label="From" />
              ))
            )}
          </div>
        )}

        {tab === "sold" && (
          <div className="flex flex-col gap-3">
            {MOCK_SOLD.length === 0 ? (
              <p style={{ color: CARD_TEAL, fontFamily: montserrat, fontSize: "15px", opacity: 0.7 }}>No sold items yet.</p>
            ) : (
              MOCK_SOLD.map(p => (
                <ItemCard key={p.id} name={p.name} counterparty={p.buyer} price={p.price} date={p.date} label="To" />
              ))
            )}
          </div>
        )}

        {tab === "messages" && (
          <MessagesTab
            conversations={conversations}
            openConvId={openConvId}
            onSelectConv={onSelectConv}
            onSendMessage={onSendMessage}
          />
        )}
      </div>
    </main>
  );
}
