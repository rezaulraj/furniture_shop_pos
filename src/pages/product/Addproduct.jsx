import { useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

const CATEGORIES = [
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
const BRANDS = [
  "WoodCraft",
  "OakMaster",
  "SleepWell",
  "EcoFurn",
  "RattanCo",
  "PineLife",
  "DeskPro",
  "Other",
];
const MATERIALS = [
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
const COLORS_PRESET = [
  "Walnut Brown",
  "Natural Oak",
  "Dark Walnut",
  "Natural",
  "Natural Rattan",
  "Deep Brown",
  "Antique White",
  "Golden Teak",
  "Charcoal Grey",
  "Rich Rosewood",
];
const EMOJIS = [
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
  "🪵",
];

const STEPS = [
  { id: 1, label: "Basic Info", icon: "📋", desc: "Name, SKU, category" },
  { id: 2, label: "Pricing", icon: "💰", desc: "Cost, sell, discount" },
  { id: 3, label: "Inventory", icon: "📦", desc: "Stock levels" },
  { id: 4, label: "Specs", icon: "📐", desc: "Material, dimensions" },
  { id: 5, label: "Preview", icon: "👁️", desc: "Review & confirm" },
];

const EMPTY = {
  sku: "",
  name: "",
  category: "Sofa",
  description: "",
  costPrice: "",
  sellPrice: "",
  discountPrice: "",
  stock: "",
  minStock: "5",
  maxStock: "",
  brand: "WoodCraft",
  material: "Teak Wood",
  color: "",
  dimensions: "",
  img: "🛋️",
  isActive: true,
};

export default function AddProduct({ onSave, onCancel }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setVal = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const margin =
    form.sellPrice && form.costPrice
      ? (
          ((parseFloat(form.sellPrice) - parseFloat(form.costPrice)) /
            parseFloat(form.costPrice)) *
          100
        ).toFixed(1)
      : null;
  const profitPerUnit =
    form.sellPrice && form.costPrice
      ? parseFloat(form.sellPrice) - parseFloat(form.costPrice)
      : null;

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.sku.trim()) e.sku = "Required";
      if (!form.name.trim()) e.name = "Required";
    }
    if (s === 2) {
      if (
        !form.costPrice ||
        isNaN(form.costPrice) ||
        parseFloat(form.costPrice) <= 0
      )
        e.costPrice = "Enter valid cost";
      if (
        !form.sellPrice ||
        isNaN(form.sellPrice) ||
        parseFloat(form.sellPrice) <= 0
      )
        e.sellPrice = "Enter valid price";
      if (parseFloat(form.sellPrice) <= parseFloat(form.costPrice))
        e.sellPrice = "Sell price must exceed cost";
    }
    if (s === 3) {
      if (!form.stock || isNaN(form.stock)) e.stock = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => Math.min(5, s + 1));
  };
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = () => {
    const product = {
      ...form,
      id: Date.now(),
      costPrice: parseFloat(form.costPrice),
      sellPrice: parseFloat(form.sellPrice),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
      stock: parseInt(form.stock),
      minStock: parseInt(form.minStock) || 5,
      maxStock: form.maxStock ? parseInt(form.maxStock) : null,
      createdAt: new Date().toISOString().split("T")[0],
    };
    onSave?.(product);
    setSaved(true);
  };

  const reset = () => {
    setForm(EMPTY);
    setStep(1);
    setSaved(false);
    setErrors({});
  };

  const fi = (key, label, placeholder, type = "text", opts = {}) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          color: T.textSub,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.07em",
        }}
      >
        {label.toUpperCase()}
        {opts.required && " *"}
      </label>
      <div style={{ position: "relative" }}>
        {opts.prefix && (
          <span
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              color: T.textMut,
              fontSize: 13,
            }}
          >
            {opts.prefix}
          </span>
        )}
        <input
          type={type}
          value={form[key]}
          onChange={set(key)}
          placeholder={placeholder}
          style={{
            width: "100%",
            background: T.bg3,
            border: `1px solid ${errors[key] ? T.red : T.border}`,
            borderRadius: 9,
            padding: `9px ${opts.prefix ? "11px 11px 26px" : "11px"}`,
            color: T.text,
            fontSize: 13,
            outline: "none",
            transition: "border-color .15s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = T.gold)}
          onBlur={(e) =>
            (e.target.style.borderColor = errors[key] ? T.red : T.border)
          }
        />
      </div>
      {errors[key] && (
        <span style={{ color: T.red, fontSize: 10.5 }}>⚠ {errors[key]}</span>
      )}
    </div>
  );

  const fsel = (key, label, options) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          color: T.textSub,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.07em",
        }}
      >
        {label.toUpperCase()}
      </label>
      <select
        value={form[key]}
        onChange={set(key)}
        style={{
          background: T.bg3,
          border: `1px solid ${T.border}`,
          borderRadius: 9,
          padding: "9px 11px",
          color: T.text,
          fontSize: 13,
          outline: "none",
          cursor: "pointer",
        }}
        onFocus={(e) => (e.target.style.borderColor = T.gold)}
        onBlur={(e) => (e.target.style.borderColor = T.border)}
      >
        {options.map((o) => (
          <option
            key={o.value ?? o}
            value={o.value ?? o}
            style={{ background: T.bg3 }}
          >
            {o.label ?? o}
          </option>
        ))}
      </select>
    </div>
  );

  /* ── Success State ── */
  if (saved)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 500,
          gap: 20,
        }}
      >
        <style>{`@keyframes successPop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "rgba(74,222,128,0.12)",
            border: "3px solid rgba(74,222,128,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            animation: "successPop .5s cubic-bezier(.16,1,.3,1)",
          }}
        >
          ✅
        </div>
        <div
          style={{
            textAlign: "center",
            animation: "fadeUp .4s ease .15s both",
          }}
        >
          <h2
            style={{
              color: T.text,
              fontWeight: 900,
              fontSize: 22,
              margin: "0 0 8px",
            }}
          >
            Product Added!
          </h2>
          <p style={{ color: T.textSub, fontSize: 13, margin: "0 0 6px" }}>
            <strong style={{ color: T.amber }}>{form.name}</strong> has been
            successfully added to inventory.
          </p>
          <p style={{ color: T.textMut, fontSize: 11.5, margin: 0 }}>
            SKU: {form.sku} • Stock: {form.stock} units
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            animation: "fadeUp .4s ease .3s both",
          }}
        >
          <Btn variant="ghost" onClick={reset}>
            <Ic.Plus /> Add Another
          </Btn>
          <Btn onClick={onCancel}>
            <Ic.Eye /> View All Products
          </Btn>
        </div>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes stepIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
        input::placeholder,textarea::placeholder{color:${T.textMut}}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        select option{background:${T.bg3}}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#3a2010;border-radius:99px}
      `}</style>

      {/* ── Page header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: "linear-gradient(135deg,#cd853f,#7a3e10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(139,69,19,0.45)",
            fontSize: 22,
          }}
        >
          📦
        </div>
        <div>
          <h1
            style={{ color: T.text, fontWeight: 900, fontSize: 20, margin: 0 }}
          >
            Add New Product
          </h1>
          <p style={{ color: T.textSub, fontSize: 11.5, margin: "3px 0 0" }}>
            Complete all steps to add a new furniture product to the inventory
            system
          </p>
        </div>
        {onCancel && (
          <Btn
            variant="ghost"
            onClick={onCancel}
            style={{ marginLeft: "auto" }}
          >
            <Ic.Close /> Cancel
          </Btn>
        )}
      </div>

      {/* ── Stepper ── */}
      <div
        style={{
          ...card(),
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 0,
        }}
      >
        {STEPS.map((s, i) => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                flex: i < STEPS.length - 1 ? 1 : 0,
              }}
            >
              <div
                onClick={() => isDone && setStep(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  cursor: isDone ? "pointer" : "default",
                  padding: "5px 8px",
                  borderRadius: 10,
                  transition: "all .18s",
                  background: isActive
                    ? "rgba(205,133,63,0.15)"
                    : "transparent",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isDone ? 16 : 14,
                    fontWeight: 800,
                    flexShrink: 0,
                    background: isDone ? T.green : isActive ? T.gold : T.bg3,
                    color: isDone || isActive ? "#fff" : T.textMut,
                    border: `2px solid ${isDone ? T.green : isActive ? T.gold : T.border}`,
                    transition: "all .25s",
                  }}
                >
                  {isDone ? "✓" : s.icon}
                </div>
                <div style={{ display: isActive || isDone ? "block" : "none" }}>
                  <p
                    style={{
                      color: isActive ? T.amber : isDone ? T.green : T.textSub,
                      fontWeight: 700,
                      fontSize: 11.5,
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    {s.label}
                  </p>
                  <p style={{ color: T.textMut, fontSize: 9.5, margin: 0 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: step > s.id ? T.green : T.border,
                    margin: "0 4px",
                    borderRadius: 2,
                    transition: "background .4s",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step Content ── */}
      <div
        style={{
          ...card(),
          padding: "24px 26px",
          animation: "stepIn .3s ease",
          minHeight: 380,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div>
            <h2
              style={{
                color: T.text,
                fontWeight: 900,
                fontSize: 16,
                margin: 0,
              }}
            >
              {STEPS[step - 1].icon} {STEPS[step - 1].label}
            </h2>
            <p style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}>
              Step {step} of {STEPS.length}
            </p>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {STEPS.map((s) => (
              <div
                key={s.id}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: step >= s.id ? T.gold : T.bg3,
                  transition: "background .25s",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Step 1: Basic Info ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Emoji picker */}
            <div>
              <label
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                PRODUCT ICON
              </label>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setVal("img", e)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background:
                        form.img === e ? "rgba(205,133,63,0.2)" : T.bg3,
                      border: `2px solid ${form.img === e ? T.gold : T.border}`,
                      fontSize: 22,
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                    onMouseEnter={(x) => {
                      if (form.img !== e)
                        x.currentTarget.style.background =
                          "rgba(139,90,43,0.15)";
                    }}
                    onMouseLeave={(x) => {
                      if (form.img !== e)
                        x.currentTarget.style.background = T.bg3;
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {fi("sku", "SKU Code", "e.g. TWS-301", "text", {
                required: true,
              })}
              {fsel("category", "Category", CATEGORIES)}
            </div>
            {fi("name", "Product Name", "Full product name", "text", {
              required: true,
            })}
            <div>
              <label
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                DESCRIPTION
              </label>
              <textarea
                value={form.description}
                onChange={set("description")}
                rows={4}
                placeholder="Describe your product: materials used, key features, dimensions notes, care instructions..."
                style={{
                  width: "100%",
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  borderRadius: 9,
                  padding: "10px 12px",
                  color: T.text,
                  fontSize: 13,
                  outline: "none",
                  resize: "vertical",
                  lineHeight: 1.6,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = T.gold)}
                onBlur={(e) => (e.target.style.borderColor = T.border)}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {fsel("brand", "Brand", BRANDS)}
              {fi("color", "Color", "e.g. Walnut Brown")}
            </div>
            {/* Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 16px",
                background: form.isActive
                  ? "rgba(74,222,128,0.07)"
                  : "rgba(248,113,113,0.07)",
                border: `1px solid ${form.isActive ? "rgba(74,222,128,0.22)" : "rgba(248,113,113,0.22)"}`,
                borderRadius: 11,
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: T.text,
                    fontWeight: 700,
                    fontSize: 13,
                    margin: 0,
                  }}
                >
                  Product Status
                </p>
                <p
                  style={{ color: T.textSub, fontSize: 11, margin: "2px 0 0" }}
                >
                  {form.isActive
                    ? "Product will be live and available for sale"
                    : "Product will be hidden from sales"}
                </p>
              </div>
              <button
                onClick={() => setVal("isActive", !form.isActive)}
                style={{
                  width: 50,
                  height: 28,
                  borderRadius: 14,
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
                    top: 4,
                    left: form.isActive ? 26 : 4,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left .25s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Pricing ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Live margin calculator */}
            {margin !== null && (
              <div
                style={{
                  padding: "16px 18px",
                  background: "linear-gradient(135deg,#1e1208,#2d1a09)",
                  borderRadius: 12,
                  border: `1px solid ${T.border}`,
                }}
              >
                <p
                  style={{
                    color: T.textMut,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.09em",
                    margin: "0 0 12px",
                  }}
                >
                  LIVE PROFIT ANALYSIS
                </p>
                <div style={{ display: "flex", gap: 0 }}>
                  {[
                    {
                      label: "Cost Price",
                      value: `৳${parseFloat(form.costPrice).toLocaleString()}`,
                      color: T.blue,
                      icon: "📥",
                    },
                    {
                      label: "Sell Price",
                      value: `৳${parseFloat(form.sellPrice).toLocaleString()}`,
                      color: T.green,
                      icon: "📤",
                    },
                    {
                      label: "Profit / Unit",
                      value: `৳${profitPerUnit?.toLocaleString()}`,
                      color: T.amber,
                      icon: "💵",
                    },
                    {
                      label: "Gross Margin",
                      value: `${margin}%`,
                      color:
                        parseFloat(margin) > 40
                          ? T.green
                          : parseFloat(margin) > 20
                            ? T.yellow
                            : T.red,
                      icon: "📈",
                    },
                  ].map((k, i) => (
                    <div
                      key={k.label}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "10px 8px",
                        borderRight: i < 3 ? `1px solid ${T.border}` : "none",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{k.icon}</span>
                      <p
                        style={{
                          color: T.textMut,
                          fontSize: 9.5,
                          margin: "5px 0 3px",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {k.label.toUpperCase()}
                      </p>
                      <p
                        style={{
                          color: k.color,
                          fontSize: 18,
                          fontWeight: 900,
                          margin: 0,
                        }}
                      >
                        {k.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {fi("costPrice", "Cost Price (৳)", "0.00", "number", {
                required: true,
                prefix: "৳",
              })}
              {fi("sellPrice", "Selling Price (৳)", "0.00", "number", {
                required: true,
                prefix: "৳",
              })}
            </div>

            <div>
              <label
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                DISCOUNT PRICE (৳) — Optional
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: T.textMut,
                    fontSize: 13,
                  }}
                >
                  ৳
                </span>
                <input
                  type="number"
                  value={form.discountPrice}
                  onChange={set("discountPrice")}
                  placeholder="Leave blank if no discount"
                  style={{
                    width: "100%",
                    background: T.bg3,
                    border: `1px solid ${T.border}`,
                    borderRadius: 9,
                    padding: "9px 11px 9px 26px",
                    color: T.text,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = T.gold)}
                  onBlur={(e) => (e.target.style.borderColor = T.border)}
                />
              </div>
              {form.discountPrice &&
                form.sellPrice &&
                parseFloat(form.discountPrice) < parseFloat(form.sellPrice) && (
                  <div
                    style={{
                      marginTop: 6,
                      padding: "8px 11px",
                      background: "rgba(74,222,128,0.08)",
                      border: "1px solid rgba(74,222,128,0.22)",
                      borderRadius: 8,
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>🏷️</span>
                    <span
                      style={{
                        color: T.green,
                        fontSize: 11.5,
                        fontWeight: 600,
                      }}
                    >
                      Discount: ৳
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
                      % savings for customers)
                    </span>
                  </div>
                )}
            </div>

            {/* Margin health indicator */}
            {margin !== null && (
              <div
                style={{
                  padding: "13px 15px",
                  background: T.bg3,
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: T.textSub, fontSize: 11.5 }}>
                    Profit margin health
                  </span>
                  <span
                    style={{
                      color:
                        parseFloat(margin) > 40
                          ? T.green
                          : parseFloat(margin) > 20
                            ? T.yellow
                            : T.red,
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {parseFloat(margin) > 40
                      ? "✅ Excellent"
                      : parseFloat(margin) > 20
                        ? "⚡ Moderate"
                        : "⚠️ Low margin"}
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
                      width: `${Math.min(100, parseFloat(margin))}%`,
                      height: "100%",
                      background:
                        parseFloat(margin) > 40
                          ? T.green
                          : parseFloat(margin) > 20
                            ? T.yellow
                            : T.red,
                      borderRadius: 4,
                      transition: "width .5s ease",
                    }}
                  />
                </div>
                <p
                  style={{
                    color: T.textMut,
                    fontSize: 10.5,
                    margin: "6px 0 0",
                  }}
                >
                  Target: 30%+ for furniture products
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Inventory ── */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 14,
              }}
            >
              {fi("stock", "Opening Stock *", "0", "number", {
                required: true,
              })}
              {fi("minStock", "Minimum Stock", "5", "number")}
              {fi("maxStock", "Maximum Stock", "100", "number")}
            </div>

            {/* Stock level visual */}
            {form.stock && (
              <div
                style={{
                  padding: "16px",
                  background: T.bg3,
                  borderRadius: 12,
                  border: `1px solid ${T.border}`,
                }}
              >
                <p
                  style={{
                    color: T.textMut,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    margin: "0 0 14px",
                  }}
                >
                  STOCK LEVEL VISUALIZATION
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  {["minStock", "stock", "maxStock"].map((key) => {
                    const val =
                      parseInt(form[key]) ||
                      (key === "maxStock" ? 100 : key === "minStock" ? 5 : 0);
                    const isStock = key === "stock";
                    const labels = {
                      minStock: "Minimum",
                      stock: "Opening Stock",
                      maxStock: "Maximum",
                    };
                    const colors = {
                      minStock: T.red,
                      stock: T.green,
                      maxStock: T.blue,
                    };
                    return (
                      <div key={key} style={{ flex: 1, textAlign: "center" }}>
                        <div
                          style={{
                            height: 80,
                            background: T.bg,
                            borderRadius: 8,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "flex-end",
                            margin: "0 auto",
                            maxWidth: 60,
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: `${Math.min(100, (val / Math.max(parseInt(form.maxStock) || 100, val)) * 100)}%`,
                              background: colors[key],
                              borderRadius: "4px 4px 0 0",
                              transition: "height .5s ease",
                              opacity: isStock ? 1 : 0.5,
                            }}
                          />
                        </div>
                        <p
                          style={{
                            color: colors[key],
                            fontSize: 20,
                            fontWeight: 900,
                            margin: "8px 0 2px",
                          }}
                        >
                          {val}
                        </p>
                        <p
                          style={{ color: T.textMut, fontSize: 10, margin: 0 }}
                        >
                          {labels[key]}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    padding: "9px 12px",
                    background:
                      parseInt(form.stock) <= parseInt(form.minStock)
                        ? "rgba(248,113,113,0.1)"
                        : "rgba(74,222,128,0.07)",
                    border: `1px solid ${parseInt(form.stock) <= parseInt(form.minStock) ? "rgba(248,113,113,0.25)" : "rgba(74,222,128,0.2)"}`,
                    borderRadius: 8,
                  }}
                >
                  <p
                    style={{
                      color:
                        parseInt(form.stock) <= parseInt(form.minStock || 0)
                          ? T.red
                          : T.green,
                      fontSize: 12,
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {parseInt(form.stock) === 0
                      ? "⛔ Will be out of stock immediately — consider increasing opening stock"
                      : parseInt(form.stock) <= parseInt(form.minStock || 0)
                        ? "⚠️ Opening stock is at or below minimum — system will alert for reorder"
                        : `✅ Healthy opening stock — ${parseInt(form.stock) - parseInt(form.minStock || 0)} units above minimum threshold`}
                  </p>
                </div>
              </div>
            )}

            <div
              style={{
                padding: "13px 16px",
                background: "rgba(96,165,250,0.06)",
                border: "1px solid rgba(96,165,250,0.2)",
                borderRadius: 10,
              }}
            >
              <p
                style={{
                  color: T.blue,
                  fontWeight: 700,
                  fontSize: 12,
                  margin: "0 0 5px",
                }}
              >
                ℹ️ About Stock Levels
              </p>
              <p
                style={{
                  color: T.textSub,
                  fontSize: 11.5,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                <strong>Minimum:</strong> System alerts you when stock drops
                below this level.
                <br />
                <strong>Maximum:</strong> Upper capacity — helps plan purchase
                orders.
                <br />
                <strong>Opening Stock:</strong> Initial quantity being added to
                inventory today.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 4: Specs ── */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {fsel("material", "Material", MATERIALS)}
              {fi("dimensions", "Dimensions (W×D×H)", "e.g. 220×90×85 cm")}
            </div>

            {/* Color presets */}
            <div>
              <label
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                COLOR
              </label>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                {COLORS_PRESET.map((c) => (
                  <button
                    key={c}
                    onClick={() => setVal("color", c)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 20,
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      background:
                        form.color === c ? "rgba(205,133,63,0.2)" : T.bg3,
                      border: `1px solid ${form.color === c ? T.gold : T.border}`,
                      color: form.color === c ? T.gold : T.textSub,
                      transition: "all .12s",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                value={form.color}
                onChange={set("color")}
                placeholder="Or type custom color..."
                style={{
                  width: "100%",
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  borderRadius: 9,
                  padding: "9px 11px",
                  color: T.text,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = T.gold)}
                onBlur={(e) => (e.target.style.borderColor = T.border)}
              />
            </div>
          </div>
        )}

        {/* ── Step 5: Preview ── */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                padding: "20px",
                background: "linear-gradient(135deg,#1e1208,#2a1a09)",
                borderRadius: 14,
                border: `1px solid rgba(139,90,43,0.3)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 18,
                    background: "rgba(139,90,43,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 38,
                    flexShrink: 0,
                    border: "2px solid rgba(139,90,43,0.3)",
                  }}
                >
                  {form.img}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <Badge color={form.isActive ? "green" : "red"} small>
                      {form.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                    <Badge color="purple" small>
                      {form.category}
                    </Badge>
                  </div>
                  <h2
                    style={{
                      color: T.text,
                      fontWeight: 900,
                      fontSize: 18,
                      margin: "0 0 4px",
                    }}
                  >
                    {form.name || "—"}
                  </h2>
                  <p
                    style={{
                      color: T.gold,
                      fontSize: 12,
                      fontFamily: "monospace",
                      margin: 0,
                    }}
                  >
                    {form.sku || "SKU not set"}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                {[
                  {
                    l: "Sell Price",
                    v: form.sellPrice
                      ? `৳${parseFloat(form.sellPrice).toLocaleString()}`
                      : "—",
                    c: T.amber,
                  },
                  {
                    l: "Cost Price",
                    v: form.costPrice
                      ? `৳${parseFloat(form.costPrice).toLocaleString()}`
                      : "—",
                    c: T.blue,
                  },
                  { l: "Margin", v: margin ? `${margin}%` : "—", c: T.green },
                  { l: "Stock", v: form.stock || "—", c: T.green },
                ].map((k) => (
                  <div
                    key={k.l}
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      background: "rgba(139,90,43,0.12)",
                      borderRadius: 9,
                      border: `1px solid rgba(139,90,43,0.2)`,
                    }}
                  >
                    <p
                      style={{
                        color: T.textMut,
                        fontSize: 9.5,
                        margin: 0,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {k.l.toUpperCase()}
                    </p>
                    <p
                      style={{
                        color: k.c,
                        fontSize: 17,
                        fontWeight: 900,
                        margin: "4px 0 0",
                      }}
                    >
                      {k.v}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 8,
                  fontSize: 12,
                }}
              >
                {[
                  ["Brand", form.brand],
                  ["Material", form.material],
                  ["Color", form.color || "—"],
                  ["Dimensions", form.dimensions || "—"],
                  ["Min Stock", form.minStock],
                  ["Max Stock", form.maxStock || "—"],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "7px 10px",
                      background: "rgba(139,90,43,0.08)",
                      borderRadius: 7,
                    }}
                  >
                    <span style={{ color: T.textSub }}>{l}</span>
                    <span style={{ color: T.text, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {form.description && (
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
                    letterSpacing: "0.08em",
                    margin: "0 0 6px",
                  }}
                >
                  DESCRIPTION
                </p>
                <p
                  style={{
                    color: T.text,
                    fontSize: 13,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {form.description}
                </p>
              </div>
            )}

            <div
              style={{
                padding: "12px 15px",
                background: "rgba(74,222,128,0.06)",
                border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 20 }}>✅</span>
              <p
                style={{
                  color: T.green,
                  fontSize: 12,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Everything looks good! Click "Add Product" to confirm and add
                this product to your inventory.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Btn variant="ghost" onClick={prevStep} disabled={step === 1}>
          <Ic.ChevDown open={false} /> Previous
        </Btn>
        <div style={{ display: "flex", gap: 8 }}>
          {step < 5 ? (
            <Btn onClick={nextStep}>
              Next: {STEPS[step].label} <Ic.ChevDown open={true} />
            </Btn>
          ) : (
            <Btn onClick={handleSubmit}>
              <Ic.Check /> Add Product to Inventory
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
