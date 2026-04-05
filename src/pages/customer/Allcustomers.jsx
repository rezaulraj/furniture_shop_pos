import { useState, useMemo } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

/* ── Data ─────────────────────────────────────────────────────── */
const INIT_CUSTOMERS = [
  {
    id: 1,
    code: "CUS-001",
    name: "Rahman Furniture House",
    email: "rahman@email.com",
    phone: "01711-234567",
    address: "42 Dhanmondi R/A, Dhaka",
    dob: "1985-03-15",
    type: "Wholesale",
    creditLimit: 500000,
    totalPurchase: 842000,
    totalDue: 48700,
    isActive: true,
    joinDate: "2025-06-10",
    notes: "Preferred wholesale client, bulk orders monthly.",
  },
  {
    id: 2,
    code: "CUS-002",
    name: "Dhaka Home Decor Ltd.",
    email: "dhaka@email.com",
    phone: "01812-345678",
    address: "15 Gulshan Ave, Dhaka",
    dob: null,
    type: "Retail",
    creditLimit: 200000,
    totalPurchase: 320000,
    totalDue: 62000,
    isActive: true,
    joinDate: "2025-07-22",
    notes: "",
  },
  {
    id: 3,
    code: "CUS-003",
    name: "Khan Interior Solutions",
    email: "khan@email.com",
    phone: "01613-456789",
    address: "7 Banani, Dhaka 1213",
    dob: "1979-11-20",
    type: "Wholesale",
    creditLimit: 350000,
    totalPurchase: 615000,
    totalDue: 54000,
    isActive: true,
    joinDate: "2025-08-01",
    notes: "Interior design firm, quarterly orders.",
  },
  {
    id: 4,
    code: "CUS-004",
    name: "Modern Living BD",
    email: "modern@email.com",
    phone: "01914-567890",
    address: "Mirpur-12, Dhaka",
    dob: null,
    type: "Retail",
    creditLimit: 150000,
    totalPurchase: 98000,
    totalDue: 0,
    isActive: true,
    joinDate: "2025-09-14",
    notes: "",
  },
  {
    id: 5,
    code: "CUS-005",
    name: "Sultana & Sons Trading",
    email: "sultana@email.com",
    phone: "01515-678901",
    address: "Chittagong Port Area",
    dob: "1972-05-08",
    type: "Wholesale",
    creditLimit: 400000,
    totalPurchase: 1250000,
    totalDue: 0,
    isActive: true,
    joinDate: "2025-05-30",
    notes: "Top wholesale customer. Monthly bulk shipments.",
  },
  {
    id: 6,
    code: "CUS-006",
    name: "Nazia Premium Interiors",
    email: "nazia@email.com",
    phone: "01716-789012",
    address: "Sylhet City",
    dob: "1990-08-25",
    type: "VIP",
    creditLimit: 800000,
    totalPurchase: 2100000,
    totalDue: 120000,
    isActive: true,
    joinDate: "2025-04-15",
    notes: "VIP client. Always pays within 15 days.",
  },
  {
    id: 7,
    code: "CUS-007",
    name: "Ahmed Home Centre",
    email: "ahmed@email.com",
    phone: "01617-890123",
    address: "Comilla Town",
    dob: null,
    type: "Retail",
    creditLimit: 100000,
    totalPurchase: 45000,
    totalDue: 0,
    isActive: false,
    joinDate: "2025-10-01",
    notes: "Account suspended.",
  },
  {
    id: 8,
    code: "CUS-008",
    name: "ফার্নিচার বাজার",
    email: "fbazar@email.com",
    phone: "01818-901234",
    address: "Narayanganj",
    dob: null,
    type: "Wholesale",
    creditLimit: 250000,
    totalPurchase: 380000,
    totalDue: 18000,
    isActive: true,
    joinDate: "2025-11-05",
    notes: "",
  },
];

const TYPE_CONFIG = {
  VIP: {
    color: "#f5a623",
    bg: "rgba(245,166,35,0.15)",
    border: "rgba(245,166,35,0.3)",
  },
  Wholesale: {
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.25)",
  },
  Retail: {
    color: "#c084fc",
    bg: "rgba(192,132,252,0.12)",
    border: "rgba(192,132,252,0.25)",
  },
};

/* ── View/Edit Modal ─────────────────────────────────────────── */
const CustomerModal = ({ customer, mode, onClose, onSave }) => {
  const EMPTY = {
    code: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    type: "Retail",
    creditLimit: "",
    notes: "",
    isActive: true,
  };
  const [form, setForm] = useState(customer || EMPTY);
  const [errors, setErrors] = useState({});
  const [tab, setTab] = useState("info");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setVal = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      id: customer?.id || Date.now(),
      code:
        customer?.code ||
        `CUS-${String(Math.floor(Math.random() * 900) + 100)}`,
      creditLimit: parseFloat(form.creditLimit) || 0,
      totalPurchase: customer?.totalPurchase || 0,
      totalDue: customer?.totalDue || 0,
      joinDate: customer?.joinDate || new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  const isView = mode === "view";

  const fieldStyle = { display: "flex", flexDirection: "column", gap: 5 };
  const labelStyle = {
    color: T.textSub,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.07em",
  };
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
          animation: "custIn .28s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <style>{`@keyframes custIn{from{opacity:0;transform:scale(.94)translateY(14px)}to{opacity:1;transform:none}} input::placeholder,textarea::placeholder{color:${T.textMut}} select option{background:${T.bg3}}`}</style>

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
                  background: `linear-gradient(135deg,${TYPE_CONFIG[form.type]?.color || T.gold},${T.goldD})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 20,
                  flexShrink: 0,
                  boxShadow: `0 4px 14px ${TYPE_CONFIG[form.type]?.color || T.gold}40`,
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
                    ? "New Customer"
                    : mode === "edit"
                      ? "Edit Customer"
                      : "Customer Details"}
                </h2>
                <p
                  style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}
                >
                  {customer?.code || "New registration"}
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

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2 }}>
            {[
              ["info", "👤", "Info"],
              ["financial", "💰", "Financial"],
              ["notes", "📝", "Notes"],
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

        {/* Body */}
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={fieldStyle}>
                  <label style={labelStyle}>FULL NAME *</label>
                  <input
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Customer name"
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
                <div style={fieldStyle}>
                  <label style={labelStyle}>CUSTOMER TYPE</label>
                  <select
                    value={form.type}
                    onChange={set("type")}
                    disabled={isView}
                    style={{
                      ...inputStyle(false),
                      cursor: isView ? "default" : "pointer",
                    }}
                  >
                    {["Retail", "Wholesale", "VIP"].map((t) => (
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
                <div style={fieldStyle}>
                  <label style={labelStyle}>PHONE *</label>
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
                <div style={fieldStyle}>
                  <label style={labelStyle}>EMAIL</label>
                  <input
                    value={form.email}
                    onChange={set("email")}
                    placeholder="email@example.com"
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

              <div style={fieldStyle}>
                <label style={labelStyle}>ADDRESS</label>
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={fieldStyle}>
                  <label style={labelStyle}>DATE OF BIRTH</label>
                  <input
                    value={form.dob || ""}
                    onChange={set("dob")}
                    type="date"
                    readOnly={isView}
                    style={inputStyle(false)}
                    onFocus={(e) =>
                      !isView && (e.target.style.borderColor = T.gold)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
                {isView && (
                  <div style={fieldStyle}>
                    <label style={labelStyle}>JOIN DATE</label>
                    <input
                      value={customer?.joinDate || ""}
                      readOnly
                      style={inputStyle(false)}
                    />
                  </div>
                )}
              </div>

              {/* Status */}
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
                      Account Status
                    </p>
                    <p
                      style={{
                        color: T.textSub,
                        fontSize: 10.5,
                        margin: "2px 0 0",
                      }}
                    >
                      {form.isActive
                        ? "Customer account is active"
                        : "Account is suspended"}
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
                      label: "Total Purchase",
                      value: `৳${(customer.totalPurchase || 0).toLocaleString()}`,
                      color: T.green,
                    },
                    {
                      label: "Total Due",
                      value: `৳${(customer.totalDue || 0).toLocaleString()}`,
                      color: customer.totalDue > 0 ? T.red : T.textMut,
                    },
                    {
                      label: "Credit Used",
                      value: `${customer.creditLimit ? Math.round((customer.totalDue / customer.creditLimit) * 100) : 0}%`,
                      color: T.amber,
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
              <div style={fieldStyle}>
                <label style={labelStyle}>CREDIT LIMIT (৳)</label>
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
                    value={form.creditLimit}
                    onChange={set("creditLimit")}
                    placeholder="0"
                    readOnly={isView}
                    style={{ ...inputStyle(false), paddingLeft: 24 }}
                    onFocus={(e) =>
                      !isView && (e.target.style.borderColor = T.gold)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
              </div>
              {isView && form.creditLimit && (
                <div
                  style={{
                    padding: "12px 14px",
                    background: T.bg3,
                    borderRadius: 10,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ color: T.textSub, fontSize: 11 }}>
                      Credit utilisation
                    </span>
                    <span
                      style={{ color: T.text, fontWeight: 700, fontSize: 11 }}
                    >
                      ৳{(customer.totalDue || 0).toLocaleString()} / ৳
                      {(customer.creditLimit || 0).toLocaleString()}
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
                        width: `${Math.min(100, customer.creditLimit ? ((customer.totalDue || 0) / customer.creditLimit) * 100 : 0)}%`,
                        height: "100%",
                        background: T.red,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Notes Tab ── */}
          {tab === "notes" && (
            <div>
              <label style={labelStyle}>NOTES & REMARKS</label>
              <textarea
                value={form.notes}
                onChange={set("notes")}
                readOnly={isView}
                rows={6}
                placeholder="Add notes about this customer..."
                style={{
                  ...inputStyle(false),
                  marginTop: 6,
                  resize: "vertical",
                  lineHeight: 1.6,
                  fontFamily: "inherit",
                }}
                onFocus={(e) =>
                  !isView && (e.target.style.borderColor = T.gold)
                }
                onBlur={(e) => (e.target.style.borderColor = T.border)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
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
              <Btn
                onClick={() => {
                  onClose(); /* trigger edit from parent */
                }}
                style={{ flex: 1, justifyContent: "center" }}
              >
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
                {mode === "create" ? "Add Customer" : "Save Changes"}
              </Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Delete Modal ─────────────────────────────────────────────── */
const DeleteModal = ({ customer, onClose, onConfirm }) => (
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
        Delete Customer?
      </h3>
      <p
        style={{
          color: T.textSub,
          fontSize: 12.5,
          margin: "0 0 16px",
          lineHeight: 1.5,
        }}
      >
        Permanently delete{" "}
        <strong style={{ color: T.text }}>"{customer.name}"</strong>? All their
        transaction history will remain but the account will be removed.
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
            background: `linear-gradient(135deg,${TYPE_CONFIG[customer.type]?.color || T.gold},${T.goldD})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 900,
            fontSize: 14,
          }}
        >
          {customer.name[0]}
        </div>
        <div>
          <p
            style={{ color: T.text, fontWeight: 700, fontSize: 12, margin: 0 }}
          >
            {customer.name}
          </p>
          <p style={{ color: T.textSub, fontSize: 10.5, margin: "2px 0 0" }}>
            {customer.code} • {customer.type}
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
            onConfirm(customer.id);
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
          <Ic.Trash /> Delete
        </button>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   ALL CUSTOMERS PAGE
════════════════════════════════════════════════════════════════ */
export default function AllCustomers() {
  const [customers, setCustomers] = useState(INIT_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [typeF, setTypeF] = useState("All");
  const [statusF, setStatusF] = useState("all");
  const [sortF, setSortF] = useState("name");
  const [sortD, setSortD] = useState("asc");
  const [viewMode, setViewMode] = useState("table");
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal] = useState(null);
  const [activeCustomer, setActiveCustomer] = useState(null);

  const filtered = useMemo(
    () =>
      customers
        .filter((c) => {
          const ms =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.code.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            (c.email || "").toLowerCase().includes(search.toLowerCase());
          const mt = typeF === "All" || c.type === typeF;
          const mst =
            statusF === "all" ||
            (statusF === "active" ? c.isActive : !c.isActive);
          return ms && mt && mst;
        })
        .sort((a, b) => {
          const [va, vb] = [a[sortF], b[sortF]];
          if (
            sortF === "totalPurchase" ||
            sortF === "totalDue" ||
            sortF === "creditLimit"
          )
            return sortD === "asc"
              ? (va || 0) - (vb || 0)
              : (vb || 0) - (va || 0);
          return sortD === "asc"
            ? String(va || "").localeCompare(String(vb || ""))
            : String(vb || "").localeCompare(String(va || ""));
        }),
    [customers, search, typeF, statusF, sortF, sortD],
  );

  const openCreate = () => {
    setActiveCustomer(null);
    setModal("create");
  };
  const openView = (c) => {
    setActiveCustomer(c);
    setModal("view");
  };
  const openEdit = (c) => {
    setActiveCustomer(c);
    setModal("edit");
  };
  const openDelete = (c) => {
    setActiveCustomer(c);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setActiveCustomer(null);
  };

  const handleSave = (data) => {
    if (modal === "create") setCustomers((prev) => [data, ...prev]);
    else setCustomers((prev) => prev.map((c) => (c.id === data.id ? data : c)));
  };
  const handleDelete = (id) =>
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  const handleToggle = (id) =>
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    );

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((c) => c.id)),
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

  const totalPurchase = customers.reduce(
    (s, c) => s + (c.totalPurchase || 0),
    0,
  );
  const totalDue = customers.reduce((s, c) => s + (c.totalDue || 0), 0);
  const vipCount = customers.filter((c) => c.type === "VIP").length;

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
            label: "Total Customers",
            value: customers.length,
            sub: `${customers.filter((c) => c.isActive).length} active`,
            color: T.gold,
            icon: "👥",
          },
          {
            label: "Total Revenue",
            value: `৳${(totalPurchase / 100000).toFixed(1)}L`,
            sub: "All time sales",
            color: T.green,
            icon: "💰",
          },
          {
            label: "Outstanding Dues",
            value: `৳${(totalDue / 1000).toFixed(0)}K`,
            sub: `${customers.filter((c) => c.totalDue > 0).length} with balance`,
            color: T.red,
            icon: "⚠️",
          },
          {
            label: "VIP Clients",
            value: vipCount,
            sub: "Premium accounts",
            color: T.amber,
            icon: "⭐",
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
            placeholder="Search name, code, phone, email..."
          />
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {["All", "VIP", "Wholesale", "Retail"].map((t) => (
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
          <Ic.Plus /> Add Customer
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
          <Btn
            variant="success"
            size="sm"
            onClick={() => {
              setCustomers((prev) =>
                prev.map((c) =>
                  selected.has(c.id) ? { ...c, isActive: true } : c,
                ),
              );
              setSelected(new Set());
            }}
          >
            <Ic.Check /> Activate
          </Btn>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => {
              setCustomers((prev) =>
                prev.map((c) =>
                  selected.has(c.id) ? { ...c, isActive: false } : c,
                ),
              );
              setSelected(new Set());
            }}
          >
            <Ic.Close /> Suspend
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Download /> Export
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
          of {customers.length} customers
        </p>
        <div style={{ display: "flex", gap: 5 }}>
          {[
            ["Name", "name"],
            ["Purchase", "totalPurchase"],
            ["Due", "totalDue"],
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
                minWidth: 850,
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
                    ["Customer", "name"],
                    ["Code", null],
                    ["Contact", null],
                    ["Type", null],
                    ["Total Purchase", "totalPurchase"],
                    ["Due", "totalDue"],
                    ["Credit Limit", "creditLimit"],
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
                {filtered.map((c, idx) => {
                  const isSel = selected.has(c.id);
                  const tc = TYPE_CONFIG[c.type] || TYPE_CONFIG.Retail;
                  return (
                    <tr
                      key={c.id}
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
                          onChange={() => toggleRow(c.id)}
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
                            {c.name[0]}
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
                              {c.name}
                            </p>
                            <p
                              style={{
                                color: T.textSub,
                                fontSize: 10,
                                margin: 0,
                              }}
                            >
                              Joined {c.joinDate}
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
                          {c.code}
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <p style={{ color: T.text, fontSize: 12, margin: 0 }}>
                          {c.phone}
                        </p>
                        <p
                          style={{
                            color: T.textSub,
                            fontSize: 10,
                            margin: "1px 0 0",
                          }}
                        >
                          {c.email || "—"}
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
                          {c.type.toUpperCase()}
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
                          ৳{(c.totalPurchase || 0).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <span
                          style={{
                            color: (c.totalDue || 0) > 0 ? T.red : T.textMut,
                            fontWeight: (c.totalDue || 0) > 0 ? 700 : 400,
                            fontSize: 12.5,
                          }}
                        >
                          ৳{(c.totalDue || 0).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <span style={{ color: T.textSub, fontSize: 12 }}>
                          ৳{(c.creditLimit || 0).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <button
                          onClick={() => handleToggle(c.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          <Badge color={c.isActive ? "green" : "red"} small>
                            {c.isActive ? "ACTIVE" : "INACTIVE"}
                          </Badge>
                        </button>
                      </td>
                      <td style={{ padding: "11px 9px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            onClick={() => openView(c)}
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
                            onClick={() => openEdit(c)}
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
                            onClick={() => openDelete(c)}
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
          {filtered.map((c, idx) => {
            const tc = TYPE_CONFIG[c.type] || TYPE_CONFIG.Retail;
            const isSel = selected.has(c.id);
            return (
              <div
                key={c.id}
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
                    style={{ display: "flex", alignItems: "center", gap: 11 }}
                  >
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleRow(c.id)}
                      style={{
                        cursor: "pointer",
                        accentColor: T.gold,
                        width: 14,
                        height: 14,
                        flexShrink: 0,
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
                      {c.name[0]}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
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
                      {c.type.toUpperCase()}
                    </span>
                    <Badge color={c.isActive ? "green" : "red"} small>
                      {c.isActive ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>
                <h3
                  style={{
                    color: T.text,
                    fontWeight: 800,
                    fontSize: 13.5,
                    margin: "0 0 3px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.name}
                </h3>
                <p
                  style={{
                    color: T.gold,
                    fontSize: 10.5,
                    fontFamily: "monospace",
                    margin: "0 0 8px",
                  }}
                >
                  {c.code}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginBottom: 12,
                  }}
                >
                  <p style={{ color: T.textSub, fontSize: 11.5, margin: 0 }}>
                    📞 {c.phone}
                  </p>
                  {c.email && (
                    <p
                      style={{
                        color: T.textSub,
                        fontSize: 11,
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ✉️ {c.email}
                    </p>
                  )}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      padding: "8px 10px",
                      background: T.bg3,
                      borderRadius: 8,
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
                      PURCHASES
                    </p>
                    <p
                      style={{
                        color: T.green,
                        fontSize: 14,
                        fontWeight: 800,
                        margin: "2px 0 0",
                      }}
                    >
                      ৳{((c.totalPurchase || 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      background:
                        (c.totalDue || 0) > 0
                          ? "rgba(248,113,113,0.08)"
                          : T.bg3,
                      border: `1px solid ${(c.totalDue || 0) > 0 ? "rgba(248,113,113,0.22)" : T.border}`,
                      borderRadius: 8,
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
                      DUE
                    </p>
                    <p
                      style={{
                        color: (c.totalDue || 0) > 0 ? T.red : T.textMut,
                        fontSize: 14,
                        fontWeight: 800,
                        margin: "2px 0 0",
                      }}
                    >
                      ৳{((c.totalDue || 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => openView(c)}
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
                    onClick={() => openEdit(c)}
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
                    onClick={() => openDelete(c)}
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
          <div style={{ fontSize: 56, marginBottom: 14 }}>👥</div>
          <p
            style={{
              color: T.textSub,
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
            }}
          >
            No customers found
          </p>
          <Btn onClick={openCreate} style={{ marginTop: 16 }}>
            <Ic.Plus /> Add Customer
          </Btn>
        </div>
      )}

      {/* Modals */}
      {(modal === "create" || modal === "edit") && (
        <CustomerModal
          customer={activeCustomer}
          mode={modal}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
      {modal === "view" && activeCustomer && (
        <CustomerModal
          customer={activeCustomer}
          mode="view"
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
      {modal === "delete" && activeCustomer && (
        <DeleteModal
          customer={activeCustomer}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
