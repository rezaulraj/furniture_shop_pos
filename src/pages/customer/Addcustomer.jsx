import { useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";

const STEPS = [
  { id: 1, label: "Personal Info", icon: "👤", desc: "Name, contact details" },
  { id: 2, label: "Account Setup", icon: "⚙️", desc: "Type, credit, status" },
  { id: 3, label: "Address & Notes", icon: "📍", desc: "Location, remarks" },
  { id: 4, label: "Review", icon: "✅", desc: "Confirm & save" },
];

const TYPE_CONFIG = {
  VIP: {
    color: "#f5a623",
    bg: "rgba(245,166,35,0.15)",
    desc: "Premium client with highest credit and priority service.",
  },
  Wholesale: {
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    desc: "Bulk buyer with volume discounts and extended credit.",
  },
  Retail: {
    color: "#c084fc",
    bg: "rgba(192,132,252,0.12)",
    desc: "Standard retail customer for single purchases.",
  },
};

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  dob: "",
  type: "Retail",
  creditLimit: "",
  isActive: true,
  address: "",
  city: "",
  notes: "",
};

const fi = (label, value, onChange, opts = {}) => (
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
            fontSize: 12,
          }}
        >
          {opts.prefix}
        </span>
      )}
      <input
        type={opts.type || "text"}
        value={value}
        onChange={onChange}
        placeholder={opts.placeholder || ""}
        readOnly={opts.readOnly}
        style={{
          width: "100%",
          background: opts.readOnly ? T.bg2 : T.bg3,
          border: `1px solid ${opts.error ? T.red : T.border}`,
          borderRadius: 9,
          padding: `9px ${opts.prefix ? "9px 9px 24px" : "11px"}`,
          color: T.text,
          fontSize: 13,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color .15s",
        }}
        onFocus={(e) => !opts.readOnly && (e.target.style.borderColor = T.gold)}
        onBlur={(e) =>
          (e.target.style.borderColor = opts.error ? T.red : T.border)
        }
      />
    </div>
    {opts.error && (
      <span style={{ color: T.red, fontSize: 10.5 }}>⚠ {opts.error}</span>
    )}
  </div>
);

export default function AddCustomer({ onSave, onCancel }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setVal = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = "Full name is required";
      if (!form.phone.trim()) e.phone = "Phone number is required";
    }
    if (s === 2) {
      if (form.creditLimit && isNaN(form.creditLimit))
        e.creditLimit = "Enter a valid number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(4, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const submit = () => {
    const customer = {
      ...form,
      id: Date.now(),
      code: `CUS-${String(Math.floor(Math.random() * 900) + 100)}`,
      creditLimit: parseFloat(form.creditLimit) || 0,
      totalPurchase: 0,
      totalDue: 0,
      joinDate: new Date().toISOString().split("T")[0],
    };
    onSave?.(customer);
    setSaved(true);
  };

  const tc = TYPE_CONFIG[form.type];

  /* ── Success state ── */
  if (saved)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 500,
          gap: 22,
        }}
      >
        <style>{`@keyframes successPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: "rgba(74,222,128,0.12)",
            border: "3px solid rgba(74,222,128,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 46,
            animation: "successPop .55s cubic-bezier(.16,1,.3,1)",
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
            Customer Registered!
          </h2>
          <p style={{ color: T.textSub, fontSize: 13, margin: "0 0 5px" }}>
            <strong style={{ color: tc.color }}>{form.name}</strong> has been
            added successfully.
          </p>
          <p style={{ color: T.textMut, fontSize: 11.5, margin: 0 }}>
            {form.type} customer • {form.phone}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            animation: "fadeUp .4s ease .28s both",
          }}
        >
          <Btn
            variant="ghost"
            onClick={() => {
              setForm(EMPTY);
              setStep(1);
              setSaved(false);
              setErrors({});
            }}
          >
            <Ic.Plus /> Add Another
          </Btn>
          <Btn onClick={onCancel}>
            <Ic.Eye /> View All Customers
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
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes stepIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
        input::placeholder,textarea::placeholder{color:${T.textMut}}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#3a2010;border-radius:99px}
        select option{background:${T.bg3}}
      `}</style>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
            fontSize: 24,
          }}
        >
          👤
        </div>
        <div style={{ flex: 1 }}>
          <h1
            style={{ color: T.text, fontWeight: 900, fontSize: 20, margin: 0 }}
          >
            Add New Customer
          </h1>
          <p style={{ color: T.textSub, fontSize: 11.5, margin: "3px 0 0" }}>
            Register a new customer account in the system
          </p>
        </div>
        {onCancel && (
          <Btn variant="ghost" onClick={onCancel}>
            <Ic.Close /> Cancel
          </Btn>
        )}
      </div>

      {/* Stepper */}
      <div
        style={{
          ...card(),
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {STEPS.map((s, i) => {
          const isAct = step === s.id;
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
                  background: isAct ? "rgba(205,133,63,0.15)" : "transparent",
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
                    fontSize: isDone ? 16 : 15,
                    fontWeight: 800,
                    flexShrink: 0,
                    background: isDone ? T.green : isAct ? T.gold : T.bg3,
                    color: isDone || isAct ? "#fff" : T.textMut,
                    border: `2px solid ${isDone ? T.green : isAct ? T.gold : T.border}`,
                    transition: "all .25s",
                  }}
                >
                  {isDone ? "✓" : s.icon}
                </div>
                <div style={{ display: isAct || isDone ? "block" : "none" }}>
                  <p
                    style={{
                      color: isAct ? T.amber : isDone ? T.green : T.textSub,
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

      {/* Step content */}
      <div
        style={{
          ...card(),
          padding: "24px 26px",
          animation: "stepIn .3s ease",
          minHeight: 360,
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

        {/* ── Step 1: Personal Info ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fi("Full Name", form.name, set("name"), {
              required: true,
              placeholder: "Customer or business name",
              error: errors.name,
            })}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {fi("Phone Number", form.phone, set("phone"), {
                required: true,
                placeholder: "+880-1XXX-XXXXXX",
                error: errors.phone,
              })}
              {fi("Email Address", form.email, set("email"), {
                type: "email",
                placeholder: "email@example.com",
              })}
            </div>
            {fi("Date of Birth", form.dob, set("dob"), { type: "date" })}

            {/* Phone format hint */}
            <div
              style={{
                padding: "11px 14px",
                background: "rgba(96,165,250,0.07)",
                border: "1px solid rgba(96,165,250,0.2)",
                borderRadius: 10,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 16 }}>💡</span>
              <p
                style={{
                  color: T.textSub,
                  fontSize: 11.5,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Enter a valid Bangladeshi phone number. The customer code will
                be auto-generated after saving.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2: Account Setup ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Customer type selector */}
            <div>
              <label
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  display: "block",
                  marginBottom: 10,
                }}
              >
                CUSTOMER TYPE
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {["Retail", "Wholesale", "VIP"].map((t) => {
                  const tc = TYPE_CONFIG[t];
                  const isSelected = form.type === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setVal("type", t)}
                      style={{
                        flex: 1,
                        padding: "14px 12px",
                        borderRadius: 12,
                        cursor: "pointer",
                        border: `2px solid ${isSelected ? tc.color : T.border}`,
                        background: isSelected ? tc.bg : T.bg3,
                        transition: "all .2s",
                        textAlign: "center",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = tc.color + "60";
                          e.currentTarget.style.background = tc.bg;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = T.border;
                          e.currentTarget.style.background = T.bg3;
                        }
                      }}
                    >
                      <p
                        style={{
                          color: tc.color,
                          fontSize: 22,
                          margin: "0 0 6px",
                        }}
                      >
                        {t === "VIP" ? "⭐" : t === "Wholesale" ? "🏭" : "🛒"}
                      </p>
                      <p
                        style={{
                          color: isSelected ? tc.color : T.text,
                          fontWeight: 800,
                          fontSize: 13.5,
                          margin: "0 0 4px",
                        }}
                      >
                        {t}
                      </p>
                      <p
                        style={{
                          color: T.textMut,
                          fontSize: 10,
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {tc.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {fi("Credit Limit (৳)", form.creditLimit, set("creditLimit"), {
              type: "number",
              prefix: "৳",
              placeholder: "e.g. 100000",
              error: errors.creditLimit,
            })}

            {/* Credit tier hints */}
            <div style={{ display: "flex", gap: 8 }}>
              {[
                ["Retail", "50,000-2,00,000", T.purple],
                ["Wholesale", "2,00,000-5,00,000", T.blue],
                ["VIP", "5,00,000+", T.amber],
              ].map(([t, range, color]) => (
                <button
                  key={t}
                  onClick={() => {
                    setVal("type", t);
                    setVal(
                      "creditLimit",
                      t === "Retail"
                        ? "100000"
                        : t === "Wholesale"
                          ? "300000"
                          : "500000",
                    );
                  }}
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderRadius: 9,
                    background: form.type === t ? color + "18" : T.bg3,
                    border: `1px solid ${form.type === t ? color + "35" : T.border}`,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all .15s",
                  }}
                >
                  <p
                    style={{
                      color: color,
                      fontSize: 11,
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {t}
                  </p>
                  <p
                    style={{
                      color: T.textMut,
                      fontSize: 10,
                      margin: "2px 0 0",
                    }}
                  >
                    ৳{range}
                  </p>
                </button>
              ))}
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
                  Account Status
                </p>
                <p
                  style={{ color: T.textSub, fontSize: 11, margin: "2px 0 0" }}
                >
                  {form.isActive
                    ? "Customer will be active from registration"
                    : "Account will start as inactive"}
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
                  }}
                />
              </button>
              <Badge color={form.isActive ? "green" : "red"} small>
                {form.isActive ? "ACTIVE" : "INACTIVE"}
              </Badge>
            </div>
          </div>
        )}

        {/* ── Step 3: Address & Notes ── */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fi("Full Address", form.address, set("address"), {
              placeholder: "Street, area, district",
            })}
            {fi("City / Division", form.city, set("city"), {
              placeholder: "e.g. Dhaka, Chittagong, Sylhet",
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
                NOTES & REMARKS
              </label>
              <textarea
                value={form.notes}
                onChange={set("notes")}
                rows={4}
                placeholder="Any special notes about this customer: payment history, preferences, contact details..."
                style={{
                  width: "100%",
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  borderRadius: 9,
                  padding: "9px 11px",
                  color: T.text,
                  fontSize: 13,
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                }}
                onFocus={(e) => (e.target.style.borderColor = T.gold)}
                onBlur={(e) => (e.target.style.borderColor = T.border)}
              />
            </div>
          </div>
        )}

        {/* ── Step 4: Review ── */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Customer preview card */}
            <div
              style={{
                padding: "20px",
                background: `linear-gradient(135deg,${tc.bg},rgba(139,90,43,0.08))`,
                borderRadius: 14,
                border: `2px solid ${tc.color}30`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: `linear-gradient(135deg,${tc.color},${T.goldD})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 26,
                    boxShadow: `0 4px 16px ${tc.color}50`,
                  }}
                >
                  {form.name ? form.name[0].toUpperCase() : "?"}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 9px",
                        borderRadius: 20,
                        background: tc.bg,
                        color: tc.color,
                        border: `1px solid ${tc.color}40`,
                      }}
                    >
                      {form.type.toUpperCase()}
                    </span>
                    <Badge color={form.isActive ? "green" : "red"} small>
                      {form.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                  <h2
                    style={{
                      color: T.text,
                      fontWeight: 900,
                      fontSize: 18,
                      margin: "0 0 3px",
                    }}
                  >
                    {form.name || "—"}
                  </h2>
                  <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
                    {form.phone}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: 8,
                }}
              >
                {[
                  ["📧 Email", form.email || "—"],
                  ["📍 City", form.city || "—"],
                  ["🏠 Address", form.address || "—"],
                  [
                    "💳 Credit Limit",
                    form.creditLimit
                      ? `৳${parseFloat(form.creditLimit).toLocaleString()}`
                      : "৳0",
                  ],
                  ["🎂 Date of Birth", form.dob || "—"],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    style={{
                      padding: "9px 12px",
                      background: "rgba(139,90,43,0.08)",
                      borderRadius: 9,
                    }}
                  >
                    <p style={{ color: T.textMut, fontSize: 10.5, margin: 0 }}>
                      {l}
                    </p>
                    <p
                      style={{
                        color: T.text,
                        fontWeight: 600,
                        fontSize: 12,
                        margin: "2px 0 0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {form.notes && (
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
                    margin: "0 0 5px",
                  }}
                >
                  NOTES
                </p>
                <p
                  style={{
                    color: T.text,
                    fontSize: 12.5,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {form.notes}
                </p>
              </div>
            )}

            <div
              style={{
                padding: "12px 14px",
                background: "rgba(74,222,128,0.07)",
                border: "1px solid rgba(74,222,128,0.22)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>✅</span>
              <p
                style={{
                  color: T.green,
                  fontSize: 12,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                All looks good! Click "Register Customer" to complete the
                registration.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Btn variant="ghost" onClick={prev} disabled={step === 1}>
          <Ic.ChevDown open={false} /> Previous
        </Btn>
        <div style={{ display: "flex", gap: 8 }}>
          {step < 4 ? (
            <Btn onClick={next}>
              Next: {STEPS[step].label} <Ic.ChevDown open={true} />
            </Btn>
          ) : (
            <Btn onClick={submit}>
              <Ic.Check /> Register Customer
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
