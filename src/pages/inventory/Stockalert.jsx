import { useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

/* ── Alert Data ─────────────────────────────────────────────────── */
const ALERT_ITEMS = [
  {
    id: 1,
    sku: "ELC-201",
    name: "Elm Corner Sofa L-Shape",
    category: "Sofa",
    img: "🛋️",
    costPrice: 42000,
    sellPrice: 68000,
    store: "Branch — Sylhet",
    qty: 0,
    min: 2,
    max: 5,
    location: "C-22",
    lastSale: "2026-04-03",
    avgSalesPerWeek: 1.2,
    severity: "critical",
  },
  {
    id: 2,
    sku: "ODT-612",
    name: "Oak Dining Table 6-Person",
    category: "Dining",
    img: "🪑",
    costPrice: 26000,
    sellPrice: 42000,
    store: "Branch — Sylhet",
    qty: 1,
    min: 3,
    max: 8,
    location: "C-04",
    lastSale: "2026-04-01",
    avgSalesPerWeek: 1.8,
    severity: "critical",
  },
  {
    id: 3,
    sku: "TKW-702",
    name: "Teak Wood Wardrobe 3-Door",
    category: "Storage",
    img: "🚪",
    costPrice: 35000,
    sellPrice: 55000,
    store: "Branch — Chittagong",
    qty: 1,
    min: 2,
    max: 8,
    location: "B-20",
    lastSale: "2026-04-02",
    avgSalesPerWeek: 0.8,
    severity: "critical",
  },
  {
    id: 4,
    sku: "ELC-201",
    name: "Elm Corner Sofa L-Shape",
    category: "Sofa",
    img: "🛋️",
    costPrice: 42000,
    sellPrice: 68000,
    store: "Branch — Chittagong",
    qty: 1,
    min: 2,
    max: 5,
    location: "B-22",
    lastSale: "2026-03-30",
    avgSalesPerWeek: 0.9,
    severity: "critical",
  },
  {
    id: 5,
    sku: "BBL-104",
    name: "Bamboo Bookshelf Large",
    category: "Storage",
    img: "📚",
    costPrice: 7500,
    sellPrice: 12500,
    store: "Branch — Chittagong",
    qty: 2,
    min: 5,
    max: 20,
    location: "B-10",
    lastSale: "2026-04-01",
    avgSalesPerWeek: 3.5,
    severity: "low",
  },
  {
    id: 6,
    sku: "WDB-204",
    name: "Walnut Double Bed Frame",
    category: "Bedroom",
    img: "🛏️",
    costPrice: 22000,
    sellPrice: 35000,
    store: "Branch — Sylhet",
    qty: 3,
    min: 3,
    max: 10,
    location: "C-06",
    lastSale: "2026-04-03",
    avgSalesPerWeek: 2.1,
    severity: "warning",
  },
  {
    id: 7,
    sku: "MCT-405",
    name: "Mahogany Coffee Table",
    category: "Table",
    img: "☕",
    costPrice: 9200,
    sellPrice: 15200,
    store: "Branch — Sylhet",
    qty: 3,
    min: 3,
    max: 10,
    location: "C-14",
    lastSale: "2026-04-02",
    avgSalesPerWeek: 2.8,
    severity: "warning",
  },
  {
    id: 8,
    sku: "TWS-301",
    name: "Teak Wood Sofa 3-Seater",
    category: "Sofa",
    img: "🛋️",
    costPrice: 18000,
    sellPrice: 28500,
    store: "Branch — Sylhet",
    qty: 2,
    min: 3,
    max: 10,
    location: "C-01",
    lastSale: "2026-04-04",
    avgSalesPerWeek: 1.5,
    severity: "warning",
  },
];

const SEVERITY_CONFIG = {
  critical: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    label: "CRITICAL",
    bar: "#ef4444",
    icon: "🚨",
  },
  low: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
    label: "LOW",
    bar: "#f87171",
    icon: "⚠️",
  },
  warning: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
    label: "WARNING",
    bar: "#fbbf24",
    icon: "⚡",
  },
};

/* ── Reorder Modal ──────────────────────────────────────────────── */
const ReorderModal = ({ item, onClose }) => {
  const [qty, setQty] = useState(String(item.max - item.qty));
  const [supplier, setSupplier] = useState("Teak Palace Suppliers");
  const [urgent, setUrgent] = useState(item.severity === "critical");
  const totalCost = (parseInt(qty) || 0) * item.costPrice;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          ...card(),
          width: 440,
          padding: "22px 24px",
          boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
          animation: "slideUp .25s ease",
        }}
      >
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
          }}
        >
          <div>
            <h3
              style={{
                color: T.text,
                fontWeight: 900,
                fontSize: 15,
                margin: 0,
              }}
            >
              Create Reorder
            </h3>
            <p style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}>
              {item.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textSub,
            }}
          >
            <Ic.Close />
          </button>
        </div>

        {/* Alert banner */}
        {item.severity === "critical" && (
          <div
            style={{
              padding: "10px 12px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 9,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <span style={{ fontSize: 18 }}>🚨</span>
            <div>
              <p
                style={{
                  color: "#ef4444",
                  fontWeight: 700,
                  fontSize: 12,
                  margin: 0,
                }}
              >
                {item.qty === 0 ? "Out of Stock!" : "Critically Low Stock"}
              </p>
              <p style={{ color: T.textSub, fontSize: 10, margin: 0 }}>
                Avg. {item.avgSalesPerWeek} sales/week —{" "}
                {item.qty === 0
                  ? "0"
                  : Math.floor((item.qty / item.avgSalesPerWeek) * 7)}{" "}
                days remaining
              </p>
            </div>
          </div>
        )}

        {/* Product info */}
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "11px 13px",
            background: T.bg3,
            borderRadius: 10,
            border: `1px solid ${T.border}`,
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 28 }}>{item.img}</div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                color: T.text,
                fontWeight: 700,
                fontSize: 12.5,
                margin: 0,
              }}
            >
              {item.name}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Badge color="gold" small>
                {item.sku}
              </Badge>
              <span style={{ color: T.textSub, fontSize: 10 }}>
                Current:{" "}
                <strong
                  style={{ color: item.qty === 0 ? "#ef4444" : "#fbbf24" }}
                >
                  {item.qty}
                </strong>{" "}
                / Min: {item.min}
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                color: T.amber,
                fontWeight: 800,
                fontSize: 14,
                margin: 0,
              }}
            >
              ৳{item.costPrice.toLocaleString()}
            </p>
            <p style={{ color: T.textMut, fontSize: 9.5, margin: 0 }}>
              per unit
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Input
            label="Reorder Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            type="number"
          />
          <Select
            label="Supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            options={[
              "Teak Palace Suppliers",
              "Royal Wood Imports",
              "BambooCraft Wholesale",
              "Dhaka Timber Co.",
            ]}
          />

          {/* Cost preview */}
          <div
            style={{
              padding: "11px 13px",
              background: T.bg3,
              borderRadius: 9,
              border: `1px solid ${T.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: T.textSub, fontSize: 12 }}>
              Estimated Cost
            </span>
            <span style={{ color: T.amber, fontWeight: 900, fontSize: 18 }}>
              ৳{totalCost.toLocaleString()}
            </span>
          </div>

          {/* Urgent toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: urgent ? "rgba(239,68,68,0.08)" : T.bg3,
              border: `1px solid ${urgent ? "rgba(239,68,68,0.3)" : T.border}`,
              borderRadius: 9,
            }}
          >
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              id="urgent-chk"
              style={{
                width: 16,
                height: 16,
                cursor: "pointer",
                accentColor: "#ef4444",
              }}
            />
            <label
              htmlFor="urgent-chk"
              style={{
                color: urgent ? "#ef4444" : T.textSub,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🚨 Mark as Urgent Order
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </Btn>
          <Btn onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>
            <Ic.Package /> Create Purchase Order
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   STOCK ALERT PAGE
════════════════════════════════════════════════════════════════ */
export default function StockAlert() {
  const [items, setItems] = useState(ALERT_ITEMS);
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [reorderTarget, setReorderTarget] = useState(null);
  const [dismissed, setDismissed] = useState(new Set());

  const active = items.filter((i) => !dismissed.has(i.id));
  const filtered = active.filter((i) => {
    const ms =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase());
    const mst = storeFilter === "all" || i.store === storeFilter;
    const msv = severityFilter === "all" || i.severity === severityFilter;
    return ms && mst && msv;
  });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((i) => i.id)),
    );
  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const dismiss = (id) => {
    setDismissed((prev) => new Set([...prev, id]));
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  };
  const bulkDismiss = () => {
    selected.forEach((id) => dismiss(id));
    setSelected(new Set());
  };

  const criticals = active.filter((i) => i.severity === "critical");
  const lows = active.filter((i) => i.severity === "low");
  const warnings = active.filter((i) => i.severity === "warning");
  const outOfStock = active.filter((i) => i.qty === 0);

  const STORES = [
    "all",
    "Main Store — Dhaka",
    "Branch — Chittagong",
    "Branch — Sylhet",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Emergency Banner ── */}
      {outOfStock.length > 0 && (
        <div
          style={{
            padding: "14px 18px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.35)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 14,
            animation: "pulse 2s infinite",
          }}
        >
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.85}}`}</style>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "rgba(239,68,68,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            🚨
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                color: "#ef4444",
                fontWeight: 900,
                fontSize: 14,
                margin: 0,
              }}
            >
              {outOfStock.length} Product{outOfStock.length > 1 ? "s" : ""} Out
              of Stock
            </p>
            <p style={{ color: T.textSub, fontSize: 11.5, margin: "3px 0 0" }}>
              {outOfStock
                .map((i) => `${i.name} @ ${i.store.split(" — ")[0]}`)
                .join(" • ")}
            </p>
          </div>
          <Btn
            onClick={() => outOfStock.forEach((i) => setReorderTarget(i))}
            style={{ flexShrink: 0 }}
          >
            <Ic.Package /> Reorder Now
          </Btn>
        </div>
      )}

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
            label: "Total Alerts",
            value: active.length,
            sub: "Active alerts",
            color: T.amber,
            icon: "🔔",
            badge: active.length,
          },
          {
            label: "Critical",
            value: criticals.length,
            sub: "Immediate action",
            color: "#ef4444",
            icon: "🚨",
          },
          {
            label: "Low Stock",
            value: lows.length,
            sub: "Order soon",
            color: T.red,
            icon: "⚠️",
          },
          {
            label: "Warnings",
            value: warnings.length,
            sub: "Monitor closely",
            color: T.yellow,
            icon: "⚡",
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
                right: -8,
                top: -8,
                fontSize: 60,
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
                }}
              >
                {k.label.toUpperCase()}
              </p>
              <p
                style={{
                  color: k.color,
                  fontSize: 26,
                  fontWeight: 900,
                  margin: "2px 0 0",
                  letterSpacing: "-0.03em",
                }}
              >
                {k.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Severity breakdown ── */}
      <div style={{ ...card(), padding: "14px 18px" }}>
        <p
          style={{
            color: T.textMut,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.09em",
            margin: "0 0 12px",
          }}
        >
          ALERT BREAKDOWN BY SEVERITY
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
          {["critical", "low", "warning"].map((s) => {
            const sc = SEVERITY_CONFIG[s];
            const count = active.filter((i) => i.severity === s).length;
            const pct = active.length
              ? Math.round((count / active.length) * 100)
              : 0;
            return (
              <div
                key={s}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  background: sc.bg,
                  border: `1px solid ${sc.border}`,
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 7 }}
                  >
                    <span style={{ fontSize: 16 }}>{sc.icon}</span>
                    <span
                      style={{
                        color: sc.color,
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {sc.label}
                    </span>
                  </div>
                  <span
                    style={{ color: sc.color, fontWeight: 900, fontSize: 20 }}
                  >
                    {count}
                  </span>
                </div>
                <div
                  style={{
                    height: 5,
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: sc.bar,
                      borderRadius: 3,
                      transition: "width .6s ease",
                    }}
                  />
                </div>
                <p
                  style={{
                    color: sc.color,
                    fontSize: 10,
                    margin: "5px 0 0",
                    opacity: 0.8,
                  }}
                >
                  {pct}% of all alerts
                </p>
              </div>
            );
          })}
        </div>
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
        <div style={{ flex: 1, minWidth: 180 }}>
          <Input
            icon={<Ic.Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product or SKU..."
          />
        </div>
        <Select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          options={[
            { value: "all", label: "All Stores" },
            ...STORES.slice(1).map((s) => ({ value: s, label: s })),
          ]}
        />
        <Select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          options={[
            { value: "all", label: "All Severity" },
            { value: "critical", label: "🚨 Critical" },
            { value: "low", label: "⚠️ Low Stock" },
            { value: "warning", label: "⚡ Warning" },
          ]}
        />
        <Btn variant="ghost" size="sm">
          <Ic.Download /> Export
        </Btn>
        <Btn size="sm">
          <Ic.Package /> Bulk Reorder
        </Btn>
      </div>

      {/* ── Bulk bar ── */}
      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "9px 14px",
            background: "rgba(239,68,68,0.07)",
            borderColor: "rgba(239,68,68,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: `0 0 8px #ef4444`,
            }}
          />
          <span style={{ color: T.text, fontWeight: 700, fontSize: 12.5 }}>
            {selected.size} alerts selected
          </span>
          <div style={{ flex: 1 }} />
          <Btn size="sm">
            <Ic.Package /> Reorder Selected
          </Btn>
          <Btn variant="ghost" size="sm" onClick={bulkDismiss}>
            <Ic.Close /> Dismiss
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

      {/* ── Alert Cards ── */}
      {["critical", "low", "warning"].map((severity) => {
        const sItems = filtered.filter((i) => i.severity === severity);
        if (!sItems.length) return null;
        const sc = SEVERITY_CONFIG[severity];

        return (
          <div key={severity}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 16 }}>{sc.icon}</span>
              <h3
                style={{
                  color: sc.color,
                  fontWeight: 800,
                  fontSize: 13,
                  margin: 0,
                  letterSpacing: "0.04em",
                }}
              >
                {sc.label} ALERTS
              </h3>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 9px",
                  borderRadius: 20,
                  background: sc.bg,
                  color: sc.color,
                  border: `1px solid ${sc.border}`,
                }}
              >
                {sItems.length}
              </span>
              <div style={{ flex: 1, height: 1, background: sc.border }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sItems.map((item) => {
                const isSel = selected.has(item.id);
                const daysLeft =
                  item.qty === 0
                    ? 0
                    : Math.floor((item.qty / item.avgSalesPerWeek) * 7);
                const fillPct = Math.min(
                  100,
                  Math.round((item.qty / item.max) * 100),
                );

                return (
                  <div
                    key={item.id}
                    style={{
                      ...card(),
                      padding: "14px 16px",
                      borderLeft: `4px solid ${sc.color}`,
                      background: isSel ? sc.bg : T.card,
                      borderColor: isSel ? sc.border : T.border,
                      transition: "all .15s",
                      display: "grid",
                      gridTemplateColumns: "32px 1fr auto auto auto auto",
                      alignItems: "center",
                      gap: 14,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSel)
                        e.currentTarget.style.transform = "translateX(3px)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "none")
                    }
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggle(item.id)}
                      style={{
                        cursor: "pointer",
                        accentColor: sc.color,
                        width: 16,
                        height: 16,
                      }}
                    />

                    {/* Product info */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background: sc.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          flexShrink: 0,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {item.img}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            color: T.text,
                            fontWeight: 700,
                            fontSize: 12.5,
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: 7,
                            marginTop: 3,
                            flexWrap: "wrap",
                          }}
                        >
                          <Badge color="gold" small>
                            {item.sku}
                          </Badge>
                          <Badge color="blue" small>
                            {item.category}
                          </Badge>
                          <span style={{ color: T.textSub, fontSize: 10 }}>
                            📍 {item.store}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stock level visual */}
                    <div style={{ width: 120, flexShrink: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            color: sc.color,
                            fontWeight: 900,
                            fontSize: 15,
                          }}
                        >
                          {item.qty}
                        </span>
                        <span style={{ color: T.textSub, fontSize: 10 }}>
                          /{item.max}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "rgba(0,0,0,0.25)",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${fillPct}%`,
                            height: "100%",
                            background: sc.bar,
                            borderRadius: 3,
                            transition: "width .5s",
                          }}
                        />
                      </div>
                      <p
                        style={{
                          color: T.textMut,
                          fontSize: 9.5,
                          margin: "3px 0 0",
                        }}
                      >
                        Min: {item.min} units
                      </p>
                    </div>

                    {/* Days left */}
                    <div
                      style={{
                        textAlign: "center",
                        padding: "8px 12px",
                        background:
                          item.qty === 0
                            ? "rgba(239,68,68,0.12)"
                            : "rgba(251,191,36,0.1)",
                        borderRadius: 9,
                        border: `1px solid ${item.qty === 0 ? "rgba(239,68,68,0.25)" : "rgba(251,191,36,0.2)"}`,
                        flexShrink: 0,
                      }}
                    >
                      <p
                        style={{
                          color: item.qty === 0 ? "#ef4444" : T.yellow,
                          fontWeight: 900,
                          fontSize: 18,
                          margin: 0,
                          lineHeight: 1,
                        }}
                      >
                        {daysLeft}
                      </p>
                      <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                        days left
                      </p>
                    </div>

                    {/* Suggest reorder qty */}
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <p style={{ color: T.textMut, fontSize: 9.5, margin: 0 }}>
                        Suggest
                      </p>
                      <p
                        style={{
                          color: T.blue,
                          fontWeight: 800,
                          fontSize: 14,
                          margin: "2px 0 0",
                        }}
                      >
                        +{item.max - item.qty}
                      </p>
                      <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                        units
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <Btn
                        size="sm"
                        onClick={() => setReorderTarget(item)}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <Ic.Package /> Reorder
                      </Btn>
                      <button
                        title="Dismiss"
                        onClick={() => dismiss(item.id)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background: "rgba(139,90,43,0.1)",
                          border: `1px solid ${T.border}`,
                          color: T.textMut,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ic.Close />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ ...card(), padding: "56px", textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 14 }}>✅</div>
          <p
            style={{ color: T.green, fontSize: 16, fontWeight: 700, margin: 0 }}
          >
            All Clear! No stock alerts
          </p>
          <p style={{ color: T.textSub, fontSize: 12, margin: "6px 0 0" }}>
            All inventory levels are within acceptable ranges
          </p>
        </div>
      )}

      {reorderTarget && (
        <ReorderModal
          item={reorderTarget}
          onClose={() => setReorderTarget(null)}
        />
      )}
    </div>
  );
}
