import { useState, useMemo } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

/* ── Initial Data ─────────────────────────────────────────────── */
const INIT_PRODUCTS = [
  {
    id: 1,
    sku: "TWS-301",
    name: "Teak Wood Sofa 3-Seater",
    category: "Sofa",
    description:
      "Premium teak wood frame with high-density foam cushions. Water-resistant fabric.",
    costPrice: 18000,
    sellPrice: 28500,
    discountPrice: 26000,
    stock: 18,
    minStock: 5,
    brand: "WoodCraft",
    material: "Teak Wood",
    color: "Walnut Brown",
    dimensions: "220×90×85 cm",
    img: "🛋️",
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    sku: "ODT-612",
    name: "Oak Dining Table 6-Person",
    category: "Dining",
    description:
      "Solid oak dining table with smooth lacquer finish. Seats 6 comfortably.",
    costPrice: 26000,
    sellPrice: 42000,
    discountPrice: null,
    stock: 11,
    minStock: 4,
    brand: "OakMaster",
    material: "Oak Wood",
    color: "Natural Oak",
    dimensions: "180×90×76 cm",
    img: "🪑",
    isActive: true,
    createdAt: "2026-01-20",
  },
  {
    id: 3,
    sku: "WDB-204",
    name: "Walnut Double Bed Frame",
    category: "Bedroom",
    description:
      "King-size walnut bed frame with headboard and storage drawers.",
    costPrice: 22000,
    sellPrice: 35000,
    discountPrice: 32000,
    stock: 20,
    minStock: 3,
    brand: "SleepWell",
    material: "Walnut Wood",
    color: "Dark Walnut",
    dimensions: "200×160×110 cm",
    img: "🛏️",
    isActive: true,
    createdAt: "2026-02-01",
  },
  {
    id: 4,
    sku: "BBL-104",
    name: "Bamboo Bookshelf Large",
    category: "Storage",
    description:
      "Eco-friendly 5-tier bamboo bookshelf with adjustable shelves.",
    costPrice: 7500,
    sellPrice: 12500,
    discountPrice: 11000,
    stock: 25,
    minStock: 8,
    brand: "EcoFurn",
    material: "Bamboo",
    color: "Natural",
    dimensions: "80×30×180 cm",
    img: "📚",
    isActive: true,
    createdAt: "2026-02-10",
  },
  {
    id: 5,
    sku: "RAC-110",
    name: "Rattan Armchair Premium",
    category: "Chair",
    description:
      "Handwoven rattan armchair with plush cushion. Indoor/outdoor use.",
    costPrice: 5500,
    sellPrice: 9800,
    discountPrice: null,
    stock: 37,
    minStock: 10,
    brand: "RattanCo",
    material: "Rattan",
    color: "Natural Rattan",
    dimensions: "75×80×90 cm",
    img: "🪑",
    isActive: true,
    createdAt: "2026-02-15",
  },
  {
    id: 6,
    sku: "MCT-405",
    name: "Mahogany Coffee Table",
    category: "Table",
    description: "Round mahogany coffee table with hidden storage compartment.",
    costPrice: 9200,
    sellPrice: 15200,
    discountPrice: 14000,
    stock: 16,
    minStock: 6,
    brand: "WoodCraft",
    material: "Mahogany",
    color: "Deep Brown",
    dimensions: "90×90×45 cm",
    img: "☕",
    isActive: true,
    createdAt: "2026-02-20",
  },
  {
    id: 7,
    sku: "PIN-801",
    name: "Pine Wood Nightstand",
    category: "Bedroom",
    description: "Minimalist pine nightstand with 2 drawers and open shelf.",
    costPrice: 3800,
    sellPrice: 6500,
    discountPrice: null,
    stock: 29,
    minStock: 8,
    brand: "PineLife",
    material: "Pine Wood",
    color: "Antique White",
    dimensions: "45×35×60 cm",
    img: "🌙",
    isActive: true,
    createdAt: "2026-03-01",
  },
  {
    id: 8,
    sku: "TKW-702",
    name: "Teak Wood Wardrobe 3-Door",
    category: "Storage",
    description:
      "3-door wardrobe with mirrored center panel and internal drawers.",
    costPrice: 35000,
    sellPrice: 55000,
    discountPrice: 50000,
    stock: 7,
    minStock: 2,
    brand: "WoodCraft",
    material: "Teak Wood",
    color: "Golden Teak",
    dimensions: "150×60×210 cm",
    img: "🚪",
    isActive: true,
    createdAt: "2026-03-05",
  },
  {
    id: 9,
    sku: "ELC-201",
    name: "Elm Corner Sofa L-Shape",
    category: "Sofa",
    description:
      "Sectional L-shape sofa in premium elm wood frame. Stain-resistant fabric.",
    costPrice: 42000,
    sellPrice: 68000,
    discountPrice: 62000,
    stock: 4,
    minStock: 2,
    brand: "WoodCraft",
    material: "Elm Wood",
    color: "Charcoal Grey",
    dimensions: "280×200×88 cm",
    img: "🛋️",
    isActive: true,
    createdAt: "2026-03-10",
  },
  {
    id: 10,
    sku: "RSD-301",
    name: "Rosewood Study Desk",
    category: "Desk",
    description:
      "Executive study desk with cable management and side storage unit.",
    costPrice: 11000,
    sellPrice: 18500,
    discountPrice: null,
    stock: 19,
    minStock: 5,
    brand: "DeskPro",
    material: "Rosewood",
    color: "Rich Rosewood",
    dimensions: "140×65×76 cm",
    img: "📖",
    isActive: false,
    createdAt: "2026-03-15",
  },
];

const CATEGORIES_LIST = [
  "Sofa",
  "Dining",
  "Bedroom",
  "Storage",
  "Chair",
  "Table",
  "Desk",
  "Outdoor",
  "Kids",
];
const BRANDS_LIST = [
  "WoodCraft",
  "OakMaster",
  "SleepWell",
  "EcoFurn",
  "RattanCo",
  "PineLife",
  "DeskPro",
  "Other",
];
const MATERIALS_LIST = [
  "Teak Wood",
  "Oak Wood",
  "Walnut Wood",
  "Pine Wood",
  "Elm Wood",
  "Rosewood",
  "Mahogany",
  "Bamboo",
  "Rattan",
  "MDF",
  "Metal & Wood",
];

/* ── Product Form (Create/Edit) ─────────────────────────────── */
const EMPTY_FORM = {
  sku: "",
  name: "",
  category: "Sofa",
  description: "",
  costPrice: "",
  sellPrice: "",
  discountPrice: "",
  stock: "",
  minStock: "",
  brand: "WoodCraft",
  material: "Teak Wood",
  color: "",
  dimensions: "",
  img: "🛋️",
  isActive: true,
};

const PRODUCT_EMOJIS = [
  "🛋️",
  "🪑",
  "🛏️",
  "📚",
  "☕",
  "🌙",
  "🚪",
  "📖",
  "🪞",
  "🛁",
  "🏮",
  "🪟",
  "🗄️",
  "🪴",
  "🎋",
];

const ProductModal = ({ product, onClose, onSave, mode }) => {
  const [form, setForm] = useState(product || EMPTY_FORM);
  const [tab, setTab] = useState("basic");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setVal = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.sku.trim()) e.sku = "SKU is required";
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.costPrice || isNaN(form.costPrice))
      e.costPrice = "Valid cost price required";
    if (!form.sellPrice || isNaN(form.sellPrice))
      e.sellPrice = "Valid sell price required";
    if (!form.stock || isNaN(form.stock))
      e.stock = "Valid stock quantity required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      costPrice: parseFloat(form.costPrice),
      sellPrice: parseFloat(form.sellPrice),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
      stock: parseInt(form.stock),
      minStock: parseInt(form.minStock) || 0,
      id: product?.id || Date.now(),
      createdAt: product?.createdAt || new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  const margin =
    form.sellPrice && form.costPrice
      ? (((form.sellPrice - form.costPrice) / form.costPrice) * 100).toFixed(1)
      : 0;

  const fieldStyle = (key) => ({
    display: "flex",
    flexDirection: "column",
    gap: 5,
  });
  const labelStyle = {
    color: T.textSub,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.07em",
  };
  const inputStyle = (hasError) => ({
    width: "100%",
    background: T.bg3,
    border: `1px solid ${hasError ? T.red : T.border}`,
    borderRadius: 9,
    padding: "9px 11px",
    color: T.text,
    fontSize: 12.5,
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  });

  const TABS = [
    { id: "basic", label: "Basic Info", icon: "📋" },
    { id: "pricing", label: "Pricing", icon: "💰" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "specs", label: "Specifications", icon: "📐" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(6px)",
        padding: "16px",
      }}
    >
      <div
        style={{
          ...card(),
          width: "100%",
          maxWidth: 620,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          animation: "modalIn .28s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <style>{`
          @keyframes modalIn { from { opacity:0; transform:scale(.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
          @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
          input::placeholder, textarea::placeholder { color: ${T.textMut}; }
          select option { background: ${T.bg3}; }
        `}</style>

        {/* Header */}
        <div
          style={{
            padding: "20px 22px 0",
            borderBottom: `1px solid ${T.border}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Emoji picker trigger */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setEmojiOpen((p) => !p)}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "rgba(139,90,43,0.2)",
                    border: `2px solid ${emojiOpen ? T.gold : "rgba(139,90,43,0.35)"}`,
                    fontSize: 28,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .18s",
                  }}
                >
                  {form.img}
                </button>
                {emojiOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: 58,
                      left: 0,
                      background: "#1a0e06",
                      border: `1px solid ${T.border}`,
                      borderRadius: 12,
                      padding: "10px",
                      display: "grid",
                      gridTemplateColumns: "repeat(5,1fr)",
                      gap: 4,
                      zIndex: 10,
                      boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                      animation: "fadeIn .15s ease",
                    }}
                  >
                    {PRODUCT_EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => {
                          setVal("img", e);
                          setEmojiOpen(false);
                        }}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 7,
                          background:
                            form.img === e
                              ? "rgba(205,133,63,0.25)"
                              : "transparent",
                          border: `1px solid ${form.img === e ? T.gold : "transparent"}`,
                          fontSize: 20,
                          cursor: "pointer",
                          transition: "all .12s",
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h2
                    style={{
                      color: T.text,
                      fontWeight: 900,
                      fontSize: 17,
                      margin: 0,
                    }}
                  >
                    {mode === "create" ? "Add New Product" : "Edit Product"}
                  </h2>
                  {mode === "edit" && (
                    <Badge color="blue" small>
                      EDITING
                    </Badge>
                  )}
                </div>
                <p
                  style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}
                >
                  {mode === "create"
                    ? "Fill in the details to add a new product to inventory"
                    : `Updating: ${product?.name}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.25)",
                color: T.red,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Ic.Close />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "9px 9px 0 0",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 11.5,
                  background: tab === t.id ? T.bg3 : "transparent",
                  border: `1px solid ${tab === t.id ? T.border : "transparent"}`,
                  borderBottom:
                    tab === t.id
                      ? `1px solid ${T.bg3}`
                      : `1px solid ${T.border}`,
                  color: tab === t.id ? T.text : T.textSub,
                  transition: "all .15s",
                  gap: 5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13 }}>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 22px",
            scrollbarWidth: "thin",
            scrollbarColor: "#3a2010 transparent",
          }}
        >
          {/* ── Basic Info ── */}
          {tab === "basic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={fieldStyle("sku")}>
                  <label style={labelStyle}>SKU CODE *</label>
                  <input
                    value={form.sku}
                    onChange={set("sku")}
                    placeholder="e.g. TWS-301"
                    style={inputStyle(errors.sku)}
                    onFocus={(e) => (e.target.style.borderColor = T.gold)}
                    onBlur={(e) =>
                      (e.target.style.borderColor = errors.sku
                        ? T.red
                        : T.border)
                    }
                  />
                  {errors.sku && (
                    <span style={{ color: T.red, fontSize: 10 }}>
                      ⚠ {errors.sku}
                    </span>
                  )}
                </div>
                <div style={fieldStyle("category")}>
                  <label style={labelStyle}>CATEGORY *</label>
                  <select
                    value={form.category}
                    onChange={set("category")}
                    style={inputStyle(false)}
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={fieldStyle("name")}>
                <label style={labelStyle}>PRODUCT NAME *</label>
                <input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Full product name"
                  style={inputStyle(errors.name)}
                  onFocus={(e) => (e.target.style.borderColor = T.gold)}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.name
                      ? T.red
                      : T.border)
                  }
                />
                {errors.name && (
                  <span style={{ color: T.red, fontSize: 10 }}>
                    ⚠ {errors.name}
                  </span>
                )}
              </div>

              <div style={fieldStyle("desc")}>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  rows={3}
                  placeholder="Product description, features, highlights..."
                  style={{
                    ...inputStyle(false),
                    resize: "vertical",
                    lineHeight: 1.55,
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={fieldStyle("brand")}>
                  <label style={labelStyle}>BRAND</label>
                  <select
                    value={form.brand}
                    onChange={set("brand")}
                    style={inputStyle(false)}
                  >
                    {BRANDS_LIST.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={fieldStyle("color")}>
                  <label style={labelStyle}>COLOR</label>
                  <input
                    value={form.color}
                    onChange={set("color")}
                    placeholder="e.g. Walnut Brown"
                    style={inputStyle(false)}
                  />
                </div>
              </div>

              {/* Status toggle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: form.isActive
                    ? "rgba(74,222,128,0.07)"
                    : "rgba(248,113,113,0.07)",
                  border: `1px solid ${form.isActive ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                  borderRadius: 10,
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      color: T.text,
                      fontWeight: 700,
                      fontSize: 12.5,
                      margin: 0,
                    }}
                  >
                    Product Status
                  </p>
                  <p
                    style={{
                      color: T.textSub,
                      fontSize: 10.5,
                      margin: "2px 0 0",
                    }}
                  >
                    {form.isActive
                      ? "Product is live and visible in sales"
                      : "Product is hidden from sales"}
                  </p>
                </div>
                <button
                  onClick={() => setVal("isActive", !form.isActive)}
                  style={{
                    width: 48,
                    height: 26,
                    borderRadius: 13,
                    cursor: "pointer",
                    border: "none",
                    position: "relative",
                    background: form.isActive ? T.green : T.textMut,
                    transition: "background .25s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: form.isActive ? 25 : 3,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left .25s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    }}
                  />
                </button>
                <Badge color={form.isActive ? "green" : "red"} small>
                  {form.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
            </div>
          )}

          {/* ── Pricing ── */}
          {tab === "pricing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Margin preview card */}
              <div
                style={{
                  padding: "14px 16px",
                  background: "linear-gradient(135deg,#1e1208,#2a1a09)",
                  borderRadius: 12,
                  border: `1px solid ${T.border}`,
                  display: "flex",
                  gap: 16,
                }}
              >
                {[
                  {
                    label: "Cost Price",
                    value: form.costPrice
                      ? `৳${parseFloat(form.costPrice).toLocaleString()}`
                      : "—",
                    color: T.blue,
                  },
                  {
                    label: "Sell Price",
                    value: form.sellPrice
                      ? `৳${parseFloat(form.sellPrice).toLocaleString()}`
                      : "—",
                    color: T.green,
                  },
                  {
                    label: "Gross Margin",
                    value: `${margin}%`,
                    color:
                      parseFloat(margin) > 30
                        ? T.green
                        : parseFloat(margin) > 15
                          ? T.yellow
                          : T.red,
                  },
                  {
                    label: "Profit/Unit",
                    value:
                      form.sellPrice && form.costPrice
                        ? `৳${(parseFloat(form.sellPrice) - parseFloat(form.costPrice)).toLocaleString()}`
                        : "—",
                    color: T.amber,
                  },
                ].map((k) => (
                  <div key={k.label} style={{ flex: 1, textAlign: "center" }}>
                    <p
                      style={{
                        color: T.textMut,
                        fontSize: 9.5,
                        margin: 0,
                        letterSpacing: "0.07em",
                      }}
                    >
                      {k.label.toUpperCase()}
                    </p>
                    <p
                      style={{
                        color: k.color,
                        fontSize: 18,
                        fontWeight: 900,
                        margin: "4px 0 0",
                      }}
                    >
                      {k.value}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={fieldStyle("costPrice")}>
                  <label style={labelStyle}>COST PRICE (৳) *</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 11,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: T.textMut,
                        fontSize: 12,
                      }}
                    >
                      ৳
                    </span>
                    <input
                      type="number"
                      value={form.costPrice}
                      onChange={set("costPrice")}
                      placeholder="0"
                      style={{
                        ...inputStyle(errors.costPrice),
                        paddingLeft: 24,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = T.gold)}
                      onBlur={(e) =>
                        (e.target.style.borderColor = errors.costPrice
                          ? T.red
                          : T.border)
                      }
                    />
                  </div>
                  {errors.costPrice && (
                    <span style={{ color: T.red, fontSize: 10 }}>
                      ⚠ {errors.costPrice}
                    </span>
                  )}
                </div>
                <div style={fieldStyle("sellPrice")}>
                  <label style={labelStyle}>SELLING PRICE (৳) *</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 11,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: T.textMut,
                        fontSize: 12,
                      }}
                    >
                      ৳
                    </span>
                    <input
                      type="number"
                      value={form.sellPrice}
                      onChange={set("sellPrice")}
                      placeholder="0"
                      style={{
                        ...inputStyle(errors.sellPrice),
                        paddingLeft: 24,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = T.gold)}
                      onBlur={(e) =>
                        (e.target.style.borderColor = errors.sellPrice
                          ? T.red
                          : T.border)
                      }
                    />
                  </div>
                  {errors.sellPrice && (
                    <span style={{ color: T.red, fontSize: 10 }}>
                      ⚠ {errors.sellPrice}
                    </span>
                  )}
                </div>
              </div>

              <div style={fieldStyle("discountPrice")}>
                <label style={labelStyle}>DISCOUNT PRICE (৳) — Optional</label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 11,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: T.textMut,
                      fontSize: 12,
                    }}
                  >
                    ৳
                  </span>
                  <input
                    type="number"
                    value={form.discountPrice || ""}
                    onChange={set("discountPrice")}
                    placeholder="Leave empty if no discount"
                    style={{ ...inputStyle(false), paddingLeft: 24 }}
                    onFocus={(e) => (e.target.style.borderColor = T.gold)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
                {form.discountPrice && form.sellPrice && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{
                        color: T.green,
                        fontSize: 10.5,
                        fontWeight: 600,
                      }}
                    >
                      ✓ Discount: ৳
                      {(
                        parseFloat(form.sellPrice) -
                        parseFloat(form.discountPrice)
                      ).toLocaleString()}{" "}
                      off (
                      {Math.round(
                        (1 -
                          parseFloat(form.discountPrice) /
                            parseFloat(form.sellPrice)) *
                          100,
                      )}
                      % savings)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Inventory ── */}
          {tab === "inventory" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={fieldStyle("stock")}>
                  <label style={labelStyle}>CURRENT STOCK *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={set("stock")}
                    placeholder="0"
                    style={inputStyle(errors.stock)}
                    onFocus={(e) => (e.target.style.borderColor = T.gold)}
                    onBlur={(e) =>
                      (e.target.style.borderColor = errors.stock
                        ? T.red
                        : T.border)
                    }
                  />
                  {errors.stock && (
                    <span style={{ color: T.red, fontSize: 10 }}>
                      ⚠ {errors.stock}
                    </span>
                  )}
                </div>
                <div style={fieldStyle("minStock")}>
                  <label style={labelStyle}>MINIMUM STOCK LEVEL</label>
                  <input
                    type="number"
                    value={form.minStock}
                    onChange={set("minStock")}
                    placeholder="0"
                    style={inputStyle(false)}
                  />
                </div>
              </div>

              {/* Stock health visual */}
              {form.stock && form.minStock && (
                <div
                  style={{
                    padding: "13px 15px",
                    background: T.bg3,
                    borderRadius: 10,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <p
                    style={{
                      color: T.textMut,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      margin: "0 0 10px",
                    }}
                  >
                    STOCK LEVEL INDICATOR
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ color: T.textSub, fontSize: 11 }}>
                      Current:{" "}
                      <strong
                        style={{
                          color:
                            parseInt(form.stock) <= parseInt(form.minStock)
                              ? T.red
                              : T.green,
                        }}
                      >
                        {form.stock}
                      </strong>{" "}
                      units
                    </span>
                    <span style={{ color: T.textSub, fontSize: 11 }}>
                      Min: {form.minStock} units
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: T.bg,
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, (parseInt(form.stock) / Math.max(parseInt(form.stock), 50)) * 100)}%`,
                        height: "100%",
                        borderRadius: 4,
                        background:
                          parseInt(form.stock) <= parseInt(form.minStock)
                            ? T.red
                            : parseInt(form.stock) <=
                                parseInt(form.minStock) * 1.5
                              ? T.yellow
                              : T.green,
                        transition: "width .4s ease",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      color:
                        parseInt(form.stock) <= parseInt(form.minStock)
                          ? T.red
                          : T.green,
                      fontSize: 10.5,
                      fontWeight: 600,
                      margin: "5px 0 0",
                    }}
                  >
                    {parseInt(form.stock) === 0
                      ? "⛔ Out of Stock"
                      : parseInt(form.stock) <= parseInt(form.minStock)
                        ? "⚠️ Below minimum — reorder needed"
                        : "✅ Healthy stock level"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Specs ── */}
          {tab === "specs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={fieldStyle("material")}>
                  <label style={labelStyle}>MATERIAL</label>
                  <select
                    value={form.material}
                    onChange={set("material")}
                    style={inputStyle(false)}
                  >
                    {MATERIALS_LIST.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={fieldStyle("dimensions")}>
                  <label style={labelStyle}>DIMENSIONS (W×D×H cm)</label>
                  <input
                    value={form.dimensions}
                    onChange={set("dimensions")}
                    placeholder="e.g. 220×90×85 cm"
                    style={inputStyle(false)}
                  />
                </div>
              </div>

              {/* Preview card */}
              {(form.name || form.material || form.dimensions) && (
                <div
                  style={{
                    padding: "14px 16px",
                    background:
                      "linear-gradient(135deg,rgba(139,90,43,0.12),rgba(205,133,63,0.06))",
                    borderRadius: 12,
                    border: `1px solid rgba(139,90,43,0.25)`,
                  }}
                >
                  <p
                    style={{
                      color: T.textMut,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      margin: "0 0 12px",
                    }}
                  >
                    PRODUCT PREVIEW
                  </p>
                  <div
                    style={{ display: "flex", gap: 14, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        background: "rgba(139,90,43,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 30,
                        flexShrink: 0,
                      }}
                    >
                      {form.img}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          color: T.text,
                          fontWeight: 800,
                          fontSize: 13.5,
                          margin: 0,
                        }}
                      >
                        {form.name || "Product Name"}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          flexWrap: "wrap",
                          marginTop: 6,
                        }}
                      >
                        {form.category && (
                          <Badge color="purple" small>
                            {form.category}
                          </Badge>
                        )}
                        {form.brand && (
                          <Badge color="blue" small>
                            {form.brand}
                          </Badge>
                        )}
                        {form.material && (
                          <Badge color="gold" small>
                            {form.material}
                          </Badge>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                        {form.sellPrice && (
                          <div>
                            <p
                              style={{
                                color: T.textMut,
                                fontSize: 9,
                                margin: 0,
                              }}
                            >
                              PRICE
                            </p>
                            <p
                              style={{
                                color: T.amber,
                                fontWeight: 800,
                                fontSize: 14,
                                margin: 0,
                              }}
                            >
                              ৳{parseFloat(form.sellPrice).toLocaleString()}
                            </p>
                          </div>
                        )}
                        {form.stock && (
                          <div>
                            <p
                              style={{
                                color: T.textMut,
                                fontSize: 9,
                                margin: 0,
                              }}
                            >
                              STOCK
                            </p>
                            <p
                              style={{
                                color: T.green,
                                fontWeight: 800,
                                fontSize: 14,
                                margin: 0,
                              }}
                            >
                              {form.stock}
                            </p>
                          </div>
                        )}
                        {form.dimensions && (
                          <div>
                            <p
                              style={{
                                color: T.textMut,
                                fontSize: 9,
                                margin: 0,
                              }}
                            >
                              SIZE
                            </p>
                            <p
                              style={{
                                color: T.text,
                                fontWeight: 600,
                                fontSize: 12,
                                margin: 0,
                              }}
                            >
                              {form.dimensions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {Object.keys(errors).length > 0 && (
              <span
                style={{
                  color: T.red,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Ic.Alert /> {Object.keys(errors).length} field
                {Object.keys(errors).length > 1 ? "s" : ""} need attention
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" onClick={onClose}>
              Cancel
            </Btn>
            <Btn onClick={handleSave}>
              <Ic.Check /> {mode === "create" ? "Add Product" : "Save Changes"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Delete Confirmation ─────────────────────────────────────── */
const DeleteModal = ({ product, onClose, onConfirm }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.82)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(5px)",
    }}
  >
    <div
      style={{
        ...card(),
        width: 420,
        padding: "28px 26px",
        boxShadow: "0 28px 70px rgba(0,0,0,0.5)",
        animation: "deleteIn .25s cubic-bezier(.16,1,.3,1)",
        textAlign: "center",
      }}
    >
      <style>{`@keyframes deleteIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}`}</style>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: "rgba(239,68,68,0.12)",
          border: "2px solid rgba(239,68,68,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          margin: "0 auto 18px",
        }}
      >
        🗑️
      </div>
      <h3
        style={{
          color: T.text,
          fontWeight: 900,
          fontSize: 18,
          margin: "0 0 8px",
        }}
      >
        Delete Product?
      </h3>
      <p
        style={{
          color: T.textSub,
          fontSize: 13,
          margin: "0 0 20px",
          lineHeight: 1.5,
        }}
      >
        You're about to permanently delete{" "}
        <strong style={{ color: T.text }}>"{product.name}"</strong>. This action
        cannot be undone.
      </p>
      <div
        style={{
          padding: "12px 14px",
          background: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.22)",
          borderRadius: 10,
          marginBottom: 20,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>{product.img}</span>
          <div>
            <p
              style={{
                color: T.text,
                fontWeight: 700,
                fontSize: 12.5,
                margin: 0,
              }}
            >
              {product.name}
            </p>
            <p style={{ color: T.textSub, fontSize: 10.5, margin: "2px 0 0" }}>
              {product.sku} • Stock: {product.stock} units
            </p>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn
          variant="ghost"
          onClick={onClose}
          style={{ flex: 1, justifyContent: "center" }}
        >
          Cancel
        </Btn>
        <button
          onClick={() => {
            onConfirm(product.id);
            onClose();
          }}
          style={{
            flex: 1,
            padding: "9px",
            background: "linear-gradient(135deg,#dc2626,#991b1b)",
            border: "none",
            borderRadius: 9,
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            transition: "all .18s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-1px)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        >
          <Ic.Trash /> Delete Forever
        </button>
      </div>
    </div>
  </div>
);

/* ── Product Detail Modal ─────────────────────────────────────── */
const ViewModal = ({ product, onClose, onEdit }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.78)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(5px)",
      padding: "16px",
    }}
  >
    <div
      style={{
        ...card(),
        width: "100%",
        maxWidth: 560,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 28px 70px rgba(0,0,0,0.5)",
        animation: "viewIn .25s ease",
      }}
    >
      <style>{`@keyframes viewIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>

      {/* Hero */}
      <div
        style={{
          padding: "22px 22px 16px",
          background: "linear-gradient(135deg,#1e1208,#2d1a09)",
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 15,
                background: "rgba(139,90,43,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                border: "2px solid rgba(139,90,43,0.3)",
              }}
            >
              {product.img}
            </div>
            <div>
              <Badge color={product.isActive ? "green" : "red"} small>
                {product.isActive ? "ACTIVE" : "INACTIVE"}
              </Badge>
              <h2
                style={{
                  color: T.text,
                  fontWeight: 900,
                  fontSize: 16,
                  margin: "6px 0 4px",
                  lineHeight: 1.2,
                }}
              >
                {product.name}
              </h2>
              <p
                style={{
                  color: T.gold,
                  fontSize: 11,
                  fontFamily: "monospace",
                  margin: 0,
                }}
              >
                {product.sku}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: T.red,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ic.Close />
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Badge color="purple" small>
            {product.category}
          </Badge>
          <Badge color="blue" small>
            {product.brand}
          </Badge>
          <Badge color="gold" small>
            {product.material}
          </Badge>
        </div>
      </div>

      <div
        style={{
          padding: "18px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Pricing */}
        <div>
          <p
            style={{
              color: T.textMut,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.09em",
              margin: "0 0 10px",
            }}
          >
            PRICING
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
            }}
          >
            {[
              {
                label: "Cost Price",
                value: `৳${product.costPrice.toLocaleString()}`,
                color: T.blue,
              },
              {
                label: "Sell Price",
                value: `৳${product.sellPrice.toLocaleString()}`,
                color: T.green,
              },
              {
                label: "Discount",
                value: product.discountPrice
                  ? `৳${product.discountPrice.toLocaleString()}`
                  : "—",
                color: product.discountPrice ? T.yellow : T.textMut,
              },
            ].map((k) => (
              <div
                key={k.label}
                style={{
                  padding: "10px 12px",
                  background: T.bg3,
                  borderRadius: 9,
                  border: `1px solid ${T.border}`,
                  textAlign: "center",
                }}
              >
                <p style={{ color: T.textSub, fontSize: 9.5, margin: 0 }}>
                  {k.label.toUpperCase()}
                </p>
                <p
                  style={{
                    color: k.color,
                    fontSize: 16,
                    fontWeight: 800,
                    margin: "4px 0 0",
                  }}
                >
                  {k.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Info grid */}
        <div>
          <p
            style={{
              color: T.textMut,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.09em",
              margin: "0 0 10px",
            }}
          >
            DETAILS
          </p>
          {[
            ["Color", product.color || "—"],
            ["Dimensions", product.dimensions || "—"],
            ["Min Stock", `${product.minStock} units`],
            ["Added", product.createdAt],
          ].map(([l, v]) => (
            <div
              key={l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <span style={{ color: T.textSub, fontSize: 12 }}>{l}</span>
              <span style={{ color: T.text, fontWeight: 600, fontSize: 12 }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        {product.description && (
          <div
            style={{
              padding: "12px 14px",
              background: T.bg3,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
            }}
          >
            <p
              style={{
                color: T.textMut,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                margin: "0 0 6px",
              }}
            >
              DESCRIPTION
            </p>
            <p
              style={{
                color: T.text,
                fontSize: 12.5,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {product.description}
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            Close
          </Btn>
          <Btn
            onClick={() => {
              onEdit(product);
              onClose();
            }}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Ic.Edit /> Edit Product
          </Btn>
        </div>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   ALL PRODUCTS PAGE
════════════════════════════════════════════════════════════════ */
export default function Products() {
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryF, setCategoryF] = useState("All");
  const [statusF, setStatusF] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Modals
  const [modalMode, setModalMode] = useState(null); // null | "create" | "edit" | "view" | "delete"
  const [activeProduct, setActiveProduct] = useState(null);

  const cats = ["All", ...CATEGORIES_LIST];

  const filtered = useMemo(
    () =>
      products
        .filter((p) => {
          const ms =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase()) ||
            p.brand?.toLowerCase().includes(search.toLowerCase());
          const mc = categoryF === "All" || p.category === categoryF;
          const mst =
            statusF === "all" ||
            (statusF === "active" ? p.isActive : !p.isActive);
          return ms && mc && mst;
        })
        .sort((a, b) => {
          let va = a[sortField],
            vb = b[sortField];
          if (sortField === "sellPrice" || sortField === "stock")
            return sortDir === "asc" ? va - vb : vb - va;
          return sortDir === "asc"
            ? String(va).localeCompare(String(vb))
            : String(vb).localeCompare(String(va));
        }),
    [products, search, categoryF, statusF, sortField, sortDir],
  );

  const openCreate = () => {
    setActiveProduct(null);
    setModalMode("create");
  };
  const openEdit = (p) => {
    setActiveProduct(p);
    setModalMode("edit");
  };
  const openView = (p) => {
    setActiveProduct(p);
    setModalMode("view");
  };
  const openDelete = (p) => {
    setActiveProduct(p);
    setModalMode("delete");
  };
  const closeModal = () => {
    setModalMode(null);
    setActiveProduct(null);
  };

  const handleSave = (data) => {
    if (modalMode === "create") setProducts((prev) => [data, ...prev]);
    else setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
  };
  const handleDelete = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));
  const handleToggleStatus = (id) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );

  const toggleAll = () =>
    setSelectedRows((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((p) => p.id)),
    );
  const toggleRow = (id) =>
    setSelectedRows((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const bulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !selectedRows.has(p.id)));
    setSelectedRows(new Set());
  };
  const bulkToggle = (active) => {
    setProducts((prev) =>
      prev.map((p) =>
        selectedRows.has(p.id) ? { ...p, isActive: active } : p,
      ),
    );
    setSelectedRows(new Set());
  };

  const sortBy = (f) => {
    setSortField(f);
    setSortDir((p) => (f === sortField && p === "asc" ? "desc" : "asc"));
  };
  const SortArrow = ({ f }) => (
    <span
      style={{
        color: sortField === f ? T.amber : T.textMut,
        fontSize: 9,
        marginLeft: 3,
      }}
    >
      {sortField === f ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  const totalValue = products.reduce((s, p) => s + p.sellPrice * p.stock, 0);
  const activeCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`
        ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#3a2010;border-radius:99px}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        @keyframes rowIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
        @keyframes cardIn{from{opacity:0;transform:translateY(10px)scale(.97)}to{opacity:1;transform:none}}
      `}</style>

      {/* ── KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Products",
            value: products.length,
            sub: `${activeCount} active`,
            color: T.gold,
            icon: "📦",
          },
          {
            label: "Inventory Value",
            value: `৳${(totalValue / 100000).toFixed(1)}L`,
            sub: "At sell price",
            color: T.green,
            icon: "💰",
          },
          {
            label: "Low Stock",
            value: lowStockCount,
            sub: "Need restock",
            color: T.red,
            icon: "⚠️",
          },
          {
            label: "Categories",
            value: CATEGORIES_LIST.length,
            sub: "Product types",
            color: T.blue,
            icon: "🗂️",
          },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              ...card(),
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "all .2s",
              cursor: "default",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = k.color + "55";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.transform = "none";
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -10,
                top: -10,
                fontSize: 64,
                opacity: 0.05,
              }}
            >
              {k.icon}
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: k.color + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {k.icon}
            </div>
            <div>
              <p
                style={{
                  color: T.textSub,
                  fontSize: 9.5,
                  margin: 0,
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                }}
              >
                {k.label.toUpperCase()}
              </p>
              <p
                style={{
                  color: T.text,
                  fontSize: 22,
                  fontWeight: 900,
                  margin: "2px 0 2px",
                  letterSpacing: "-0.02em",
                }}
              >
                {k.value}
              </p>
              <p style={{ color: T.textMut, fontSize: 10, margin: 0 }}>
                {k.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters row ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input
            icon={<Ic.Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or brand..."
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryF(c)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 11,
                background:
                  categoryF === c
                    ? "linear-gradient(135deg,#c0712a,#8b3e10)"
                    : "rgba(139,90,43,0.1)",
                border: `1px solid ${categoryF === c ? "transparent" : T.border}`,
                color: categoryF === c ? "#fff" : T.textSub,
                transition: "all .15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <Select
          value={statusF}
          onChange={(e) => setStatusF(e.target.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        <div style={{ display: "flex", gap: 5 }}>
          {["grid", "table"].map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${viewMode === v ? T.gold : T.border}`,
                background: viewMode === v ? "rgba(205,133,63,0.15)" : T.bg3,
                color: viewMode === v ? T.gold : T.textSub,
                cursor: "pointer",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {v === "grid" ? "⊞" : "☰"}
            </button>
          ))}
        </div>
        <Btn onClick={openCreate}>
          <Ic.Plus /> Add Product
        </Btn>
      </div>

      {/* ── Bulk action bar ── */}
      {selectedRows.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "10px 16px",
            background: "rgba(205,133,63,0.07)",
            borderColor: "rgba(205,133,63,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: T.amber,
              boxShadow: `0 0 8px ${T.amber}`,
            }}
          />
          <span style={{ color: T.text, fontWeight: 700, fontSize: 12.5 }}>
            {selectedRows.size} products selected
          </span>
          <div style={{ flex: 1 }} />
          <Btn variant="success" size="sm" onClick={() => bulkToggle(true)}>
            <Ic.Check /> Activate
          </Btn>
          <Btn variant="ghost" size="sm" onClick={() => bulkToggle(false)}>
            <Ic.Close /> Deactivate
          </Btn>
          <Btn variant="danger" size="sm" onClick={bulkDelete}>
            <Ic.Trash /> Delete Selected
          </Btn>
          <button
            onClick={() => setSelectedRows(new Set())}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textMut,
            }}
          >
            <Ic.Close />
          </button>
        </div>
      )}

      {/* ── Results ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
          Showing <strong style={{ color: T.text }}>{filtered.length}</strong>{" "}
          of {products.length} products
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => sortBy("name")}
            style={{
              padding: "4px 11px",
              borderRadius: 20,
              background:
                sortField === "name"
                  ? "rgba(205,133,63,0.15)"
                  : "rgba(139,90,43,0.08)",
              border: `1px solid ${sortField === "name" ? "rgba(205,133,63,0.3)" : T.border}`,
              color: sortField === "name" ? T.gold : T.textSub,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Name <SortArrow f="name" />
          </button>
          <button
            onClick={() => sortBy("sellPrice")}
            style={{
              padding: "4px 11px",
              borderRadius: 20,
              background:
                sortField === "sellPrice"
                  ? "rgba(205,133,63,0.15)"
                  : "rgba(139,90,43,0.08)",
              border: `1px solid ${sortField === "sellPrice" ? "rgba(205,133,63,0.3)" : T.border}`,
              color: sortField === "sellPrice" ? T.gold : T.textSub,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Price <SortArrow f="sellPrice" />
          </button>
          <button
            onClick={() => sortBy("stock")}
            style={{
              padding: "4px 11px",
              borderRadius: 20,
              background:
                sortField === "stock"
                  ? "rgba(205,133,63,0.15)"
                  : "rgba(139,90,43,0.08)",
              border: `1px solid ${sortField === "stock" ? "rgba(205,133,63,0.3)" : T.border}`,
              color: sortField === "stock" ? T.gold : T.textSub,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Stock <SortArrow f="stock" />
          </button>
        </div>
      </div>

      {/* ── GRID VIEW ── */}
      {viewMode === "grid" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
            gap: 13,
          }}
        >
          {filtered.map((p, idx) => {
            const isSel = selectedRows.has(p.id);
            const isLow = p.stock <= p.minStock;
            const margin = (
              ((p.sellPrice - p.costPrice) / p.costPrice) *
              100
            ).toFixed(0);
            return (
              <div
                key={p.id}
                style={{
                  ...card(),
                  padding: "16px",
                  borderLeft: `3px solid ${!p.isActive ? T.textMut : isLow ? T.red : T.gold}`,
                  background: isSel ? "rgba(205,133,63,0.06)" : T.card,
                  borderColor: isSel ? "rgba(205,133,63,0.35)" : T.border,
                  transition: "all .22s",
                  animation: `cardIn .3s ease ${idx * 0.03}s both`,
                }}
                onMouseEnter={(e) => {
                  if (!isSel) {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 3 }}
                  >
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleRow(p.id)}
                      style={{
                        cursor: "pointer",
                        accentColor: T.gold,
                        width: 14,
                        height: 14,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {!p.isActive && (
                      <Badge color="red" small>
                        INACTIVE
                      </Badge>
                    )}
                    {isLow && p.isActive && (
                      <Badge color="red" small>
                        LOW STOCK
                      </Badge>
                    )}
                    {!isLow && p.isActive && (
                      <Badge color="green" small>
                        ACTIVE
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Product emoji + name */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 13,
                      background: "rgba(139,90,43,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      flexShrink: 0,
                      border: "1px solid rgba(139,90,43,0.2)",
                    }}
                  >
                    {p.img}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: T.text,
                        fontWeight: 800,
                        fontSize: 13,
                        margin: 0,
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.name}
                    </p>
                    <p
                      style={{
                        color: T.gold,
                        fontSize: 10.5,
                        fontFamily: "monospace",
                        margin: "3px 0 5px",
                      }}
                    >
                      {p.sku}
                    </p>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      <Badge color="purple" small>
                        {p.category}
                      </Badge>
                      <Badge color="blue" small>
                        {p.material}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <div
                    style={{
                      flex: 1,
                      padding: "9px 10px",
                      background: T.bg3,
                      borderRadius: 9,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <p
                      style={{
                        color: T.textMut,
                        fontSize: 9,
                        margin: 0,
                        letterSpacing: "0.06em",
                      }}
                    >
                      SELL PRICE
                    </p>
                    <p
                      style={{
                        color: T.amber,
                        fontSize: 15,
                        fontWeight: 900,
                        margin: "2px 0 0",
                      }}
                    >
                      ৳{p.sellPrice.toLocaleString()}
                    </p>
                    {p.discountPrice && (
                      <p
                        style={{
                          color: T.textSub,
                          fontSize: 9.5,
                          margin: "2px 0 0",
                          textDecoration: "line-through",
                        }}
                      >
                        ৳{p.discountPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "9px 10px",
                      background:
                        parseFloat(margin) > 30
                          ? "rgba(74,222,128,0.08)"
                          : "rgba(251,191,36,0.08)",
                      border: `1px solid ${parseFloat(margin) > 30 ? "rgba(74,222,128,0.2)" : "rgba(251,191,36,0.2)"}`,
                      borderRadius: 9,
                    }}
                  >
                    <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                      MARGIN
                    </p>
                    <p
                      style={{
                        color: parseFloat(margin) > 30 ? T.green : T.yellow,
                        fontSize: 16,
                        fontWeight: 900,
                        margin: "2px 0 0",
                      }}
                    >
                      {margin}%
                    </p>
                  </div>
                </div>

                {/* Stock bar */}
                <div style={{ marginBottom: 13 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: T.textSub, fontSize: 10 }}>
                      Stock
                    </span>
                    <span
                      style={{
                        color: isLow ? T.red : T.green,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      {p.stock} units
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: T.bg,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, (p.stock / Math.max(p.stock, 30)) * 100)}%`,
                        height: "100%",
                        background: isLow ? T.red : T.green,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => openView(p)}
                    title="View"
                    style={{
                      flex: 1,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(96,165,250,0.1)",
                      border: "1px solid rgba(96,165,250,0.2)",
                      color: T.blue,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(96,165,250,0.18)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(96,165,250,0.1)")
                    }
                  >
                    <Ic.Eye /> View
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    title="Edit"
                    style={{
                      flex: 1,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(205,133,63,0.12)",
                      border: `1px solid ${T.border}`,
                      color: T.gold,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(205,133,63,0.22)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(205,133,63,0.12)")
                    }
                  >
                    <Ic.Edit /> Edit
                  </button>
                  <button
                    onClick={() => openDelete(p)}
                    title="Delete"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(248,113,113,0.1)",
                      border: "1px solid rgba(248,113,113,0.2)",
                      color: T.red,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(248,113,113,0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(248,113,113,0.1)")
                    }
                  >
                    <Ic.Trash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {viewMode === "table" && (
        <div style={{ ...card(), overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 900,
              }}
            >
              <thead style={{ background: T.bg2 }}>
                <tr>
                  <th style={{ padding: "11px 14px", width: 34 }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.size === filtered.length &&
                        filtered.length > 0
                      }
                      onChange={toggleAll}
                      style={{ cursor: "pointer", accentColor: T.gold }}
                    />
                  </th>
                  {[
                    ["Product", "name"],
                    ["SKU", null],
                    ["Category", "category"],
                    ["Sell Price", "sellPrice"],
                    ["Cost", null],
                    ["Margin", null],
                    ["Stock", "stock"],
                    ["Status", null],
                    ["Actions", null],
                  ].map(([h, f]) => (
                    <th
                      key={h}
                      onClick={f ? () => sortBy(f) : undefined}
                      style={{
                        padding: "11px 9px",
                        color: T.textMut,
                        fontSize: 9.5,
                        fontWeight: 700,
                        textAlign: "left",
                        letterSpacing: "0.07em",
                        borderBottom: `1px solid ${T.border}`,
                        cursor: f ? "pointer" : "default",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h.toUpperCase()}
                      {f && <SortArrow f={f} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => {
                  const isSel = selectedRows.has(p.id);
                  const isLow = p.stock <= p.minStock;
                  const margin = (
                    ((p.sellPrice - p.costPrice) / p.costPrice) *
                    100
                  ).toFixed(0);
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: `1px solid ${T.border}`,
                        background: isSel
                          ? "rgba(205,133,63,0.06)"
                          : "transparent",
                        transition: "background .12s",
                        animation: `rowIn .25s ease ${idx * 0.02}s both`,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSel)
                          e.currentTarget.style.background =
                            "rgba(139,90,43,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSel)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td style={{ padding: "11px 14px" }}>
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleRow(p.id)}
                          style={{ cursor: "pointer", accentColor: T.gold }}
                        />
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 9,
                              background: "rgba(139,90,43,0.15)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 18,
                              flexShrink: 0,
                            }}
                          >
                            {p.img}
                          </div>
                          <div>
                            <p
                              style={{
                                color: T.text,
                                fontWeight: 700,
                                fontSize: 12,
                                margin: 0,
                              }}
                            >
                              {p.name}
                            </p>
                            <p
                              style={{
                                color: T.textSub,
                                fontSize: 10,
                                margin: 0,
                              }}
                            >
                              {p.brand} • {p.material}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <span
                          style={{
                            color: T.gold,
                            fontWeight: 700,
                            fontSize: 11,
                            fontFamily: "monospace",
                            background: "rgba(205,133,63,0.1)",
                            padding: "2px 7px",
                            borderRadius: 5,
                          }}
                        >
                          {p.sku}
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <Badge color="purple" small>
                          {p.category}
                        </Badge>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <p
                          style={{
                            color: T.amber,
                            fontWeight: 800,
                            fontSize: 13,
                            margin: 0,
                          }}
                        >
                          ৳{p.sellPrice.toLocaleString()}
                        </p>
                        {p.discountPrice && (
                          <p
                            style={{
                              color: T.textMut,
                              fontSize: 10,
                              margin: 0,
                              textDecoration: "line-through",
                            }}
                          >
                            ৳{p.discountPrice.toLocaleString()}
                          </p>
                        )}
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <span style={{ color: T.textSub, fontSize: 12 }}>
                          ৳{p.costPrice.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <span
                          style={{
                            color: parseFloat(margin) > 30 ? T.green : T.yellow,
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {margin}%
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              color: isLow ? T.red : T.text,
                              fontWeight: 700,
                              fontSize: 13,
                            }}
                          >
                            {p.stock}
                          </span>
                          {isLow && (
                            <Badge color="red" small>
                              LOW
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <button
                          onClick={() => handleToggleStatus(p.id)}
                          style={{
                            cursor: "pointer",
                            background: "none",
                            border: "none",
                            padding: 0,
                          }}
                        >
                          <Badge color={p.isActive ? "green" : "red"} small>
                            {p.isActive ? "ACTIVE" : "INACTIVE"}
                          </Badge>
                        </button>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            onClick={() => openView(p)}
                            style={{
                              width: 27,
                              height: 27,
                              borderRadius: 7,
                              background: "rgba(96,165,250,0.1)",
                              border: "1px solid rgba(96,165,250,0.2)",
                              color: T.blue,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ic.Eye />
                          </button>
                          <button
                            onClick={() => openEdit(p)}
                            style={{
                              width: 27,
                              height: 27,
                              borderRadius: 7,
                              background: "rgba(205,133,63,0.1)",
                              border: `1px solid ${T.border}`,
                              color: T.gold,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ic.Edit />
                          </button>
                          <button
                            onClick={() => openDelete(p)}
                            style={{
                              width: 27,
                              height: 27,
                              borderRadius: 7,
                              background: "rgba(248,113,113,0.1)",
                              border: "1px solid rgba(248,113,113,0.2)",
                              color: T.red,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ic.Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ ...card(), padding: "56px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🔍</div>
          <p
            style={{
              color: T.textSub,
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
            }}
          >
            No products found
          </p>
          <Btn onClick={openCreate} style={{ marginTop: 16 }}>
            <Ic.Plus /> Add First Product
          </Btn>
        </div>
      )}

      {/* ── Modals ── */}
      {(modalMode === "create" || modalMode === "edit") && (
        <ProductModal
          product={activeProduct}
          mode={modalMode}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
      {modalMode === "view" && activeProduct && (
        <ViewModal
          product={activeProduct}
          onClose={closeModal}
          onEdit={openEdit}
        />
      )}
      {modalMode === "delete" && activeProduct && (
        <DeleteModal
          product={activeProduct}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
