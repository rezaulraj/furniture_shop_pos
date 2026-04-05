import { useState, useMemo } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

/* ── Data ─────────────────────────────────────────────────────── */
const INIT_SUPPLIERS = [
  {
    id: 1,
    code: "SUP-001",
    name: "Teak Palace Suppliers",
    contact: "Rahim Uddin",
    phone: "01711-111222",
    email: "teak@supply.com",
    address: "Industrial Area, Gazipur",
    gst: "GST-BD-001",
    terms: "Net 30",
    type: "Primary",
    totalOrders: 48,
    totalValue: 2840000,
    pendingDue: 0,
    isActive: true,
    rating: 5,
    joinDate: "2025-01-15",
    notes: "Best quality teak. On-time delivery always.",
  },
  {
    id: 2,
    code: "SUP-002",
    name: "BambooCraft Wholesale",
    contact: "Karim Ahmed",
    phone: "01812-222333",
    email: "bamb@supply.com",
    address: "Keraniganj, Dhaka",
    gst: "GST-BD-002",
    terms: "Net 15",
    type: "Regular",
    totalOrders: 22,
    totalValue: 680000,
    pendingDue: 43000,
    isActive: true,
    rating: 4,
    joinDate: "2025-03-20",
    notes: "Good eco materials, occasional delays.",
  },
  {
    id: 3,
    code: "SUP-003",
    name: "Royal Wood Imports",
    contact: "Nazia Begum",
    phone: "01613-333444",
    email: "royal@supply.com",
    address: "Chittagong Port, CTG",
    gst: "GST-BD-003",
    terms: "Net 45",
    type: "Primary",
    totalOrders: 35,
    totalValue: 5200000,
    pendingDue: 199000,
    isActive: true,
    rating: 5,
    joinDate: "2025-02-10",
    notes: "Imports premium wood. Excellent quality.",
  },
  {
    id: 4,
    code: "SUP-004",
    name: "Dhaka Timber Co.",
    contact: "Selim Khan",
    phone: "01514-444555",
    email: "dhaka@supply.com",
    address: "Old Dhaka",
    gst: "GST-BD-004",
    terms: "Advance",
    type: "Regular",
    totalOrders: 18,
    totalValue: 1420000,
    pendingDue: 0,
    isActive: true,
    rating: 3,
    joinDate: "2025-04-05",
    notes: "Advance payment required. Prices negotiable.",
  },
  {
    id: 5,
    code: "SUP-005",
    name: "EcoFurn Materials",
    contact: "Parveen Sultana",
    phone: "01915-555666",
    email: "eco@supply.com",
    address: "Narsingdi",
    gst: "GST-BD-005",
    terms: "Net 30",
    type: "Regular",
    totalOrders: 14,
    totalValue: 520000,
    pendingDue: 0,
    isActive: true,
    rating: 4,
    joinDate: "2025-05-12",
    notes: "Sustainable materials. Good for bamboo and rattan.",
  },
  {
    id: 6,
    code: "SUP-006",
    name: "Premium Upholstery BD",
    contact: "Nasir Hossain",
    phone: "01616-666777",
    email: "upholstery@supply.com",
    address: "Mirpur, Dhaka",
    gst: "GST-BD-006",
    terms: "Net 15",
    type: "Occasional",
    totalOrders: 8,
    totalValue: 185000,
    pendingDue: 0,
    isActive: true,
    rating: 4,
    joinDate: "2025-07-18",
    notes: "Fabrics and cushion materials.",
  },
  {
    id: 7,
    code: "SUP-007",
    name: "Sylhet Wood Works",
    contact: "Faruk Ahmed",
    phone: "01717-777888",
    email: "sylww@supply.com",
    address: "Sylhet Sadar",
    gst: "GST-BD-007",
    terms: "Net 30",
    type: "Occasional",
    totalOrders: 6,
    totalValue: 280000,
    pendingDue: 67000,
    isActive: false,
    rating: 2,
    joinDate: "2025-08-01",
    notes: "Account suspended due to quality issues.",
  },
];

const TYPE_CONFIG = {
  Primary: {
    color: "#f5a623",
    bg: "rgba(245,166,35,0.15)",
    border: "rgba(245,166,35,0.3)",
  },
  Regular: {
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.25)",
  },
  Occasional: {
    color: "#c084fc",
    bg: "rgba(192,132,252,0.12)",
    border: "rgba(192,132,252,0.25)",
  },
};

const StarRating = ({ value }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        style={{ fontSize: 12, color: i <= value ? T.amber : T.bg3 }}
      >
        ★
      </span>
    ))}
  </div>
);

/* ── Supplier Modal (View/Edit/Create) ─────────────────────────── */
const SupplierModal = ({ supplier, mode, onClose, onSave }) => {
  const EMPTY = {
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    gst: "",
    terms: "Net 30",
    type: "Regular",
    notes: "",
    isActive: true,
    rating: 4,
  };
  const [form, setForm] = useState(supplier || EMPTY);
  const [errors, setErrors] = useState({});
  const [tab, setTab] = useState("info");
  const [editRating, setEditRating] = useState(form.rating || 4);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setVal = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Supplier name required";
    if (!form.phone.trim()) e.phone = "Phone required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      rating: editRating,
      id: supplier?.id || Date.now(),
      code:
        supplier?.code ||
        `SUP-${String(Math.floor(Math.random() * 900) + 100)}`,
      totalOrders: supplier?.totalOrders || 0,
      totalValue: supplier?.totalValue || 0,
      pendingDue: supplier?.pendingDue || 0,
      joinDate: supplier?.joinDate || new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  const isView = mode === "view";
  const tc = TYPE_CONFIG[form.type] || TYPE_CONFIG.Regular;

  const inputStyle = (err) => ({
    width: "100%",
    background: isView ? T.bg2 : T.bg3,
    border: `1px solid ${err ? T.red : T.border}`,
    borderRadius: 9,
    padding: "9px 11px",
    color: T.text,
    fontSize: 12.5,
    outline: "none",
    transition: "border-color .15s",
    boxSizing: "border-box",
    cursor: isView ? "default" : "text",
  });

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
        padding: 16,
      }}
    >
      <div
        style={{
          ...card(),
          width: "100%",
          maxWidth: 560,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          animation: "supIn .28s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <style>{`@keyframes supIn{from{opacity:0;transform:scale(.94)translateY(14px)}to{opacity:1;transform:none}} input::placeholder,textarea::placeholder{color:${T.textMut}} select option{background:${T.bg3}}`}</style>

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
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: `linear-gradient(135deg,${tc.color},${T.goldD})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 20,
                  flexShrink: 0,
                  boxShadow: `0 4px 14px ${tc.color}40`,
                }}
              >
                {form.name ? form.name[0].toUpperCase() : "?"}
              </div>
              <div>
                <h2
                  style={{
                    color: T.text,
                    fontWeight: 900,
                    fontSize: 16,
                    margin: 0,
                  }}
                >
                  {mode === "create"
                    ? "New Supplier"
                    : mode === "edit"
                      ? "Edit Supplier"
                      : "Supplier Details"}
                </h2>
                <p
                  style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}
                >
                  {supplier?.code || "New registration"}
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

          <div style={{ display: "flex", gap: 2 }}>
            {[
              ["info", "🏭", "Info"],
              ["financial", "💰", "Financial"],
              ["rating", "⭐", "Rating & Notes"],
            ].map(([id, icon, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "8px 8px 0 0",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: tab === id ? T.bg3 : "transparent",
                  border: `1px solid ${tab === id ? T.border : "transparent"}`,
                  borderBottom:
                    tab === id ? `1px solid ${T.bg3}` : `1px solid ${T.border}`,
                  color: tab === id ? T.text : T.textSub,
                  transition: "all .15s",
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 22px",
            scrollbarWidth: "thin",
            scrollbarColor: "#3a2010 transparent",
          }}
        >
          {/* ── Info Tab ── */}
          {tab === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label
                  style={{
                    color: T.textSub,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  SUPPLIER NAME *
                </label>
                <input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Company or supplier name"
                  readOnly={isView}
                  style={inputStyle(errors.name)}
                  onFocus={(e) =>
                    !isView && (e.target.style.borderColor = T.gold)
                  }
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      color: T.textSub,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    CONTACT PERSON
                  </label>
                  <input
                    value={form.contact}
                    onChange={set("contact")}
                    placeholder="Person name"
                    readOnly={isView}
                    style={inputStyle(false)}
                    onFocus={(e) =>
                      !isView && (e.target.style.borderColor = T.gold)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
                <div>
                  <label
                    style={{
                      color: T.textSub,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    SUPPLIER TYPE
                  </label>
                  <select
                    value={form.type}
                    onChange={set("type")}
                    disabled={isView}
                    style={{
                      ...inputStyle(false),
                      cursor: isView ? "default" : "pointer",
                    }}
                  >
                    {["Primary", "Regular", "Occasional"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      color: T.textSub,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    PHONE *
                  </label>
                  <input
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+880-1XXX-XXXXXX"
                    readOnly={isView}
                    style={inputStyle(errors.phone)}
                    onFocus={(e) =>
                      !isView && (e.target.style.borderColor = T.gold)
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = errors.phone
                        ? T.red
                        : T.border)
                    }
                  />
                  {errors.phone && (
                    <span style={{ color: T.red, fontSize: 10 }}>
                      ⚠ {errors.phone}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    style={{
                      color: T.textSub,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    EMAIL
                  </label>
                  <input
                    value={form.email}
                    onChange={set("email")}
                    placeholder="supplier@email.com"
                    type="email"
                    readOnly={isView}
                    style={inputStyle(false)}
                    onFocus={(e) =>
                      !isView && (e.target.style.borderColor = T.gold)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      color: T.textSub,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    GST / TAX NUMBER
                  </label>
                  <input
                    value={form.gst}
                    onChange={set("gst")}
                    placeholder="GST-BD-XXXX"
                    readOnly={isView}
                    style={inputStyle(false)}
                    onFocus={(e) =>
                      !isView && (e.target.style.borderColor = T.gold)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
                <div>
                  <label
                    style={{
                      color: T.textSub,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    PAYMENT TERMS
                  </label>
                  <select
                    value={form.terms}
                    onChange={set("terms")}
                    disabled={isView}
                    style={{
                      ...inputStyle(false),
                      cursor: isView ? "default" : "pointer",
                    }}
                  >
                    {["Advance", "Net 15", "Net 30", "Net 45", "Net 60"].map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label
                  style={{
                    color: T.textSub,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  ADDRESS
                </label>
                <input
                  value={form.address}
                  onChange={set("address")}
                  placeholder="Full address"
                  readOnly={isView}
                  style={inputStyle(false)}
                  onFocus={(e) =>
                    !isView && (e.target.style.borderColor = T.gold)
                  }
                  onBlur={(e) => (e.target.style.borderColor = T.border)}
                />
              </div>

              {!isView && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    background: form.isActive
                      ? "rgba(74,222,128,0.07)"
                      : "rgba(248,113,113,0.07)",
                    border: `1px solid ${form.isActive ? "rgba(74,222,128,0.22)" : "rgba(248,113,113,0.22)"}`,
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
                      Supplier Status
                    </p>
                    <p
                      style={{
                        color: T.textSub,
                        fontSize: 10.5,
                        margin: "2px 0 0",
                      }}
                    >
                      {form.isActive
                        ? "Active — can receive purchase orders"
                        : "Inactive — excluded from PO workflow"}
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
                      }}
                    />
                  </button>
                  <Badge color={form.isActive ? "green" : "red"} small>
                    {form.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* ── Financial Tab ── */}
          {tab === "financial" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {isView && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 10,
                  }}
                >
                  {[
                    {
                      label: "Total Orders",
                      value: supplier.totalOrders,
                      color: T.blue,
                    },
                    {
                      label: "Total Value",
                      value: `৳${((supplier.totalValue || 0) / 100000).toFixed(1)}L`,
                      color: T.green,
                    },
                    {
                      label: "Pending Due",
                      value: `৳${(supplier.pendingDue || 0).toLocaleString()}`,
                      color: (supplier.pendingDue || 0) > 0 ? T.red : T.textMut,
                    },
                  ].map((k) => (
                    <div
                      key={k.label}
                      style={{
                        padding: "12px",
                        background: T.bg3,
                        borderRadius: 10,
                        border: `1px solid ${T.border}`,
                        textAlign: "center",
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
              )}
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
                    margin: "0 0 8px",
                  }}
                >
                  PAYMENT TERMS
                </p>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Advance", "Net 15", "Net 30", "Net 45", "Net 60"].map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => !isView && setVal("terms", t)}
                        style={{
                          flex: 1,
                          padding: "8px 4px",
                          borderRadius: 8,
                          cursor: isView ? "default" : "pointer",
                          fontWeight: 700,
                          fontSize: 11,
                          background:
                            form.terms === t
                              ? "linear-gradient(135deg,#c0712a,#8b3e10)"
                              : "rgba(139,90,43,0.08)",
                          border: `1px solid ${form.terms === t ? "transparent" : T.border}`,
                          color: form.terms === t ? "#fff" : T.textSub,
                          transition: "all .15s",
                        }}
                      >
                        {t}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Rating & Notes Tab ── */}
          {tab === "rating" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                    margin: "0 0 12px",
                  }}
                >
                  SUPPLIER RATING
                </p>
                <div
                  style={{ display: "flex", gap: 10, justifyContent: "center" }}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => !isView && setEditRating(i)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: isView ? "default" : "pointer",
                        fontSize: 36,
                        transition: "transform .15s",
                        transform: editRating >= i ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      <span
                        style={{
                          color: editRating >= i ? T.amber : T.bg3,
                          filter:
                            editRating >= i
                              ? "drop-shadow(0 0 8px #f5a62360)"
                              : "none",
                        }}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                <p
                  style={{
                    color: T.textSub,
                    fontSize: 12,
                    textAlign: "center",
                    margin: "10px 0 0",
                  }}
                >
                  {editRating === 5
                    ? "Excellent"
                    : editRating === 4
                      ? "Very Good"
                      : editRating === 3
                        ? "Good"
                        : editRating === 2
                          ? "Fair"
                          : "Poor"}
                </p>
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
                  NOTES & REMARKS
                </label>
                <textarea
                  value={form.notes}
                  onChange={set("notes")}
                  readOnly={isView}
                  rows={5}
                  placeholder="Quality feedback, reliability notes, delivery performance..."
                  style={{
                    width: "100%",
                    background: isView ? T.bg2 : T.bg3,
                    border: `1px solid ${T.border}`,
                    borderRadius: 9,
                    padding: "9px 11px",
                    color: T.text,
                    fontSize: 12,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) =>
                    !isView && (e.target.style.borderColor = T.gold)
                  }
                  onBlur={(e) => (e.target.style.borderColor = T.border)}
                />
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "14px 22px",
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {isView ? (
            <>
              <Btn
                variant="ghost"
                onClick={onClose}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Close
              </Btn>
              <Btn style={{ flex: 1, justifyContent: "center" }}>
                <Ic.Edit /> Edit
              </Btn>
            </>
          ) : (
            <>
              <Btn
                variant="ghost"
                onClick={onClose}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Cancel
              </Btn>
              <Btn
                onClick={handleSave}
                style={{ flex: 1, justifyContent: "center" }}
              >
                <Ic.Check />{" "}
                {mode === "create" ? "Add Supplier" : "Save Changes"}
              </Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Delete Modal ─────────────────────────────────────────────── */
const DeleteModal = ({ supplier, onClose, onConfirm }) => (
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
        width: 400,
        padding: "26px 24px",
        boxShadow: "0 28px 70px rgba(0,0,0,0.5)",
        animation: "delIn .25s cubic-bezier(.16,1,.3,1)",
        textAlign: "center",
      }}
    >
      <style>{`@keyframes delIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}`}</style>
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: 18,
          background: "rgba(239,68,68,0.12)",
          border: "2px solid rgba(239,68,68,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          margin: "0 auto 16px",
        }}
      >
        🗑️
      </div>
      <h3
        style={{
          color: T.text,
          fontWeight: 900,
          fontSize: 17,
          margin: "0 0 8px",
        }}
      >
        Remove Supplier?
      </h3>
      <p
        style={{
          color: T.textSub,
          fontSize: 12.5,
          margin: "0 0 16px",
          lineHeight: 1.5,
        }}
      >
        Remove <strong style={{ color: T.text }}>"{supplier.name}"</strong> from
        your supplier list?
        {supplier.pendingDue > 0 && (
          <>
            <br />
            <span style={{ color: T.red }}>
              ⚠ There is ৳{supplier.pendingDue.toLocaleString()} pending due.
            </span>
          </>
        )}
      </p>
      <div
        style={{
          padding: "10px 13px",
          background: "rgba(248,113,113,0.07)",
          border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 9,
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 10,
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: `linear-gradient(135deg,${TYPE_CONFIG[supplier.type]?.color || T.gold},${T.goldD})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 900,
            fontSize: 14,
          }}
        >
          {supplier.name[0]}
        </div>
        <div>
          <p
            style={{ color: T.text, fontWeight: 700, fontSize: 12, margin: 0 }}
          >
            {supplier.name}
          </p>
          <p style={{ color: T.textSub, fontSize: 10.5, margin: "2px 0 0" }}>
            {supplier.code} • {supplier.totalOrders} orders
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 9 }}>
        <Btn
          variant="ghost"
          onClick={onClose}
          style={{ flex: 1, justifyContent: "center" }}
        >
          Cancel
        </Btn>
        <button
          onClick={() => {
            onConfirm(supplier.id);
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
          }}
        >
          <Ic.Trash /> Remove
        </button>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   ALL SUPPLIERS PAGE
════════════════════════════════════════════════════════════════ */
export default function AllSuppliers() {
  const [suppliers, setSuppliers] = useState(INIT_SUPPLIERS);
  const [search, setSearch] = useState("");
  const [typeF, setTypeF] = useState("All");
  const [statusF, setStatusF] = useState("all");
  const [sortF, setSortF] = useState("name");
  const [sortD, setSortD] = useState("asc");
  const [viewMode, setViewMode] = useState("table");
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal] = useState(null);
  const [activeSupplier, setActiveSupplier] = useState(null);

  const filtered = useMemo(
    () =>
      suppliers
        .filter((s) => {
          const ms =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.code.toLowerCase().includes(search.toLowerCase()) ||
            (s.contact || "").toLowerCase().includes(search.toLowerCase()) ||
            s.phone.includes(search);
          const mt = typeF === "All" || s.type === typeF;
          const mst =
            statusF === "all" ||
            (statusF === "active" ? s.isActive : !s.isActive);
          return ms && mt && mst;
        })
        .sort((a, b) => {
          const [va, vb] = [a[sortF], b[sortF]];
          if (
            sortF === "totalValue" ||
            sortF === "totalOrders" ||
            sortF === "pendingDue"
          )
            return sortD === "asc"
              ? (va || 0) - (vb || 0)
              : (vb || 0) - (va || 0);
          return sortD === "asc"
            ? String(va || "").localeCompare(String(vb || ""))
            : String(vb || "").localeCompare(String(va || ""));
        }),
    [suppliers, search, typeF, statusF, sortF, sortD],
  );

  const openCreate = () => {
    setActiveSupplier(null);
    setModal("create");
  };
  const openView = (s) => {
    setActiveSupplier(s);
    setModal("view");
  };
  const openEdit = (s) => {
    setActiveSupplier(s);
    setModal("edit");
  };
  const openDelete = (s) => {
    setActiveSupplier(s);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setActiveSupplier(null);
  };

  const handleSave = (data) => {
    if (modal === "create") setSuppliers((prev) => [data, ...prev]);
    else setSuppliers((prev) => prev.map((s) => (s.id === data.id ? data : s)));
  };
  const handleDelete = (id) =>
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  const handleToggle = (id) =>
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
    );

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((s) => s.id)),
    );
  const toggleRow = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const sortBy = (f) => {
    setSortF(f);
    setSortD((p) => (f === sortF && p === "asc" ? "desc" : "asc"));
  };
  const SA = ({ f }) => (
    <span
      style={{
        color: sortF === f ? T.amber : T.textMut,
        fontSize: 9,
        marginLeft: 3,
      }}
    >
      {sortF === f ? (sortD === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  const totalOrders = suppliers.reduce((s, sup) => s + sup.totalOrders, 0);
  const totalValue = suppliers.reduce((s, sup) => s + sup.totalValue, 0);
  const totalDue = suppliers.reduce((s, sup) => s + sup.pendingDue, 0);
  const primaryCount = suppliers.filter((s) => s.type === "Primary").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`
        ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#3a2010;border-radius:99px}
        @keyframes rowIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
        @keyframes cardIn{from{opacity:0;transform:translateY(10px)scale(.97)}to{opacity:1;transform:none}}
      `}</style>

      {/* ── KPIs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Suppliers",
            value: suppliers.length,
            sub: `${suppliers.filter((s) => s.isActive).length} active`,
            color: T.gold,
            icon: "🏭",
          },
          {
            label: "Total Orders",
            value: totalOrders,
            sub: "All time POs",
            color: T.blue,
            icon: "📦",
          },
          {
            label: "Total Purchased",
            value: `৳${(totalValue / 100000).toFixed(1)}L`,
            sub: "All time value",
            color: T.green,
            icon: "💰",
          },
          {
            label: "Pending Dues",
            value: `৳${(totalDue / 1000).toFixed(0)}K`,
            sub: `${suppliers.filter((s) => s.pendingDue > 0).length} suppliers`,
            color: T.red,
            icon: "⚠️",
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
              position: "relative",
              overflow: "hidden",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = k.color + "50";
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
                  fontSize: 21,
                  fontWeight: 900,
                  margin: "2px 0 2px",
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

      {/* ── Filters ── */}
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
            placeholder="Search name, code, contact, phone..."
          />
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {["All", "Primary", "Regular", "Occasional"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeF(t)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 11,
                background:
                  typeF === t
                    ? "linear-gradient(135deg,#c0712a,#8b3e10)"
                    : "rgba(139,90,43,0.1)",
                border: `1px solid ${typeF === t ? "transparent" : T.border}`,
                color: typeF === t ? "#fff" : T.textSub,
                transition: "all .15s",
              }}
            >
              {t}
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
          {["table", "grid"].map((v) => (
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
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {v === "table" ? "☰" : "⊞"}
            </button>
          ))}
        </div>
        <Btn onClick={openCreate}>
          <Ic.Plus /> Add Supplier
        </Btn>
      </div>

      {/* ── Bulk bar ── */}
      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "9px 14px",
            background: "rgba(205,133,63,0.07)",
            borderColor: "rgba(205,133,63,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Badge color="gold">{selected.size} selected</Badge>
          <div style={{ flex: 1 }} />
          <Btn variant="ghost" size="sm">
            <Ic.Download /> Export CSV
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Print /> Print List
          </Btn>
          <button
            onClick={() => setSelected(new Set())}
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

      {/* Sort row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
          Showing <strong style={{ color: T.text }}>{filtered.length}</strong>{" "}
          of {suppliers.length} suppliers
        </p>
        <div style={{ display: "flex", gap: 5 }}>
          {[
            ["Name", "name"],
            ["Orders", "totalOrders"],
            ["Value", "totalValue"],
          ].map(([l, f]) => (
            <button
              key={f}
              onClick={() => sortBy(f)}
              style={{
                padding: "4px 10px",
                borderRadius: 20,
                background:
                  sortF === f
                    ? "rgba(205,133,63,0.15)"
                    : "rgba(139,90,43,0.08)",
                border: `1px solid ${sortF === f ? "rgba(205,133,63,0.3)" : T.border}`,
                color: sortF === f ? T.gold : T.textSub,
                fontSize: 10.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {l} <SA f={f} />
            </button>
          ))}
        </div>
      </div>

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
                        selected.size === filtered.length && filtered.length > 0
                      }
                      onChange={toggleAll}
                      style={{ cursor: "pointer", accentColor: T.gold }}
                    />
                  </th>
                  {[
                    ["Supplier", "name"],
                    ["Code", null],
                    ["Contact", null],
                    ["Type", null],
                    ["Terms", null],
                    ["Orders", "totalOrders"],
                    ["Total Value", "totalValue"],
                    ["Due", "pendingDue"],
                    ["Rating", null],
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
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h.toUpperCase()}
                      {f && <SA f={f} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => {
                  const isSel = selected.has(s.id);
                  const tc = TYPE_CONFIG[s.type] || TYPE_CONFIG.Regular;
                  return (
                    <tr
                      key={s.id}
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
                          onChange={() => toggleRow(s.id)}
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
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: `linear-gradient(135deg,${tc.color},${T.goldD})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: 900,
                              fontSize: 14,
                              flexShrink: 0,
                            }}
                          >
                            {s.name[0]}
                          </div>
                          <div>
                            <p
                              style={{
                                color: T.text,
                                fontWeight: 700,
                                fontSize: 12.5,
                                margin: 0,
                              }}
                            >
                              {s.name}
                            </p>
                            <p
                              style={{
                                color: T.textSub,
                                fontSize: 10,
                                margin: 0,
                              }}
                            >
                              {s.contact}
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
                          {s.code}
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <p style={{ color: T.text, fontSize: 12, margin: 0 }}>
                          {s.phone}
                        </p>
                        <p
                          style={{
                            color: T.textSub,
                            fontSize: 10,
                            margin: "1px 0 0",
                          }}
                        >
                          {s.email}
                        </p>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 9px",
                            borderRadius: 20,
                            background: tc.bg,
                            color: tc.color,
                            border: `1px solid ${tc.border}`,
                          }}
                        >
                          {s.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <Badge color="gold" small>
                          {s.terms}
                        </Badge>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <span
                          style={{
                            color: T.blue,
                            fontWeight: 700,
                            fontSize: 12.5,
                          }}
                        >
                          {s.totalOrders}
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <span
                          style={{
                            color: T.green,
                            fontWeight: 700,
                            fontSize: 12.5,
                          }}
                        >
                          ৳{((s.totalValue || 0) / 1000).toFixed(0)}K
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <span
                          style={{
                            color: (s.pendingDue || 0) > 0 ? T.red : T.textMut,
                            fontWeight: (s.pendingDue || 0) > 0 ? 700 : 400,
                            fontSize: 12,
                          }}
                        >
                          ৳{(s.pendingDue || 0).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <StarRating value={s.rating || 0} />
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <button
                          onClick={() => handleToggle(s.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          <Badge color={s.isActive ? "green" : "red"} small>
                            {s.isActive ? "ACTIVE" : "INACTIVE"}
                          </Badge>
                        </button>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            onClick={() => openView(s)}
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
                            onClick={() => openEdit(s)}
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
                            onClick={() => openDelete(s)}
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

      {/* ── GRID VIEW ── */}
      {viewMode === "grid" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
            gap: 12,
          }}
        >
          {filtered.map((s, idx) => {
            const tc = TYPE_CONFIG[s.type] || TYPE_CONFIG.Regular;
            const isSel = selected.has(s.id);
            return (
              <div
                key={s.id}
                style={{
                  ...card(),
                  padding: "16px",
                  borderLeft: `3px solid ${tc.color}`,
                  background: isSel ? "rgba(205,133,63,0.06)" : T.card,
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleRow(s.id)}
                      style={{
                        cursor: "pointer",
                        accentColor: T.gold,
                        width: 14,
                        height: 14,
                      }}
                    />
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `linear-gradient(135deg,${tc.color},${T.goldD})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 18,
                      }}
                    >
                      {s.name[0]}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      alignItems: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: tc.bg,
                        color: tc.color,
                        border: `1px solid ${tc.border}`,
                      }}
                    >
                      {s.type.toUpperCase()}
                    </span>
                    <Badge color={s.isActive ? "green" : "red"} small>
                      {s.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                </div>
                <h3
                  style={{
                    color: T.text,
                    fontWeight: 800,
                    fontSize: 13.5,
                    margin: "0 0 2px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.name}
                </h3>
                <p
                  style={{
                    color: T.gold,
                    fontSize: 10.5,
                    fontFamily: "monospace",
                    margin: "0 0 3px",
                  }}
                >
                  {s.code}
                </p>
                <p
                  style={{
                    color: T.textSub,
                    fontSize: 11.5,
                    margin: "0 0 8px",
                  }}
                >
                  👤 {s.contact}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    marginBottom: 10,
                  }}
                >
                  <p style={{ color: T.textSub, fontSize: 11.5, margin: 0 }}>
                    📞 {s.phone}
                  </p>
                  <p style={{ color: T.textSub, fontSize: 11, margin: 0 }}>
                    💳 {s.terms}
                  </p>
                </div>
                <StarRating value={s.rating || 0} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    margin: "10px 0 12px",
                  }}
                >
                  <div
                    style={{
                      padding: "7px 9px",
                      background: T.bg3,
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                      ORDERS
                    </p>
                    <p
                      style={{
                        color: T.blue,
                        fontSize: 14,
                        fontWeight: 800,
                        margin: "2px 0 0",
                      }}
                    >
                      {s.totalOrders}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "7px 9px",
                      background: T.bg3,
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                      VALUE
                    </p>
                    <p
                      style={{
                        color: T.green,
                        fontSize: 14,
                        fontWeight: 800,
                        margin: "2px 0 0",
                      }}
                    >
                      ৳{((s.totalValue || 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => openView(s)}
                    style={{
                      flex: 1,
                      height: 30,
                      borderRadius: 7,
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
                    }}
                  >
                    <Ic.Eye /> View
                  </button>
                  <button
                    onClick={() => openEdit(s)}
                    style={{
                      flex: 1,
                      height: 30,
                      borderRadius: 7,
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
                    }}
                  >
                    <Ic.Edit /> Edit
                  </button>
                  <button
                    onClick={() => openDelete(s)}
                    style={{
                      width: 30,
                      height: 30,
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
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ ...card(), padding: "56px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🏭</div>
          <p
            style={{
              color: T.textSub,
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
            }}
          >
            No suppliers found
          </p>
          <Btn onClick={openCreate} style={{ marginTop: 16 }}>
            <Ic.Plus /> Add Supplier
          </Btn>
        </div>
      )}

      {(modal === "create" || modal === "edit") && (
        <SupplierModal
          supplier={activeSupplier}
          mode={modal}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
      {modal === "view" && activeSupplier && (
        <SupplierModal
          supplier={activeSupplier}
          mode="view"
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
      {modal === "delete" && activeSupplier && (
        <DeleteModal
          supplier={activeSupplier}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
