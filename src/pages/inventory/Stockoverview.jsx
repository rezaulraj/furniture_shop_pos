import { useState, useMemo } from "react";
import { T, card } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

/* ── Data ─────────────────────────────────────────────────────── */
const STORES = ["Main Store — Dhaka", "Branch — Chittagong", "Branch — Sylhet"];

const INVENTORY = [
  {
    id: 1,
    sku: "TWS-301",
    name: "Teak Wood Sofa 3-Seater",
    category: "Sofa",
    img: "🛋️",
    costPrice: 18000,
    sellPrice: 28500,
    stores: {
      "Main Store — Dhaka": { qty: 12, min: 5, max: 30, location: "A-01" },
      "Branch — Chittagong": { qty: 4, min: 3, max: 15, location: "B-02" },
      "Branch — Sylhet": { qty: 2, min: 3, max: 10, location: "C-01" },
    },
  },
  {
    id: 2,
    sku: "ODT-612",
    name: "Oak Dining Table 6-Person",
    category: "Dining",
    img: "🪑",
    costPrice: 26000,
    sellPrice: 42000,
    stores: {
      "Main Store — Dhaka": { qty: 7, min: 5, max: 20, location: "A-04" },
      "Branch — Chittagong": { qty: 3, min: 4, max: 12, location: "B-05" },
      "Branch — Sylhet": { qty: 1, min: 3, max: 8, location: "C-04" },
    },
  },
  {
    id: 3,
    sku: "WDB-204",
    name: "Walnut Double Bed Frame",
    category: "Bedroom",
    img: "🛏️",
    costPrice: 22000,
    sellPrice: 35000,
    stores: {
      "Main Store — Dhaka": { qty: 9, min: 4, max: 20, location: "A-07" },
      "Branch — Chittagong": { qty: 5, min: 3, max: 12, location: "B-07" },
      "Branch — Sylhet": { qty: 6, min: 3, max: 10, location: "C-06" },
    },
  },
  {
    id: 4,
    sku: "BBL-104",
    name: "Bamboo Bookshelf Large",
    category: "Storage",
    img: "📚",
    costPrice: 7500,
    sellPrice: 12500,
    stores: {
      "Main Store — Dhaka": { qty: 15, min: 8, max: 40, location: "A-10" },
      "Branch — Chittagong": { qty: 2, min: 5, max: 20, location: "B-10" },
      "Branch — Sylhet": { qty: 8, min: 5, max: 15, location: "C-09" },
    },
  },
  {
    id: 5,
    sku: "RAC-110",
    name: "Rattan Armchair Premium",
    category: "Chair",
    img: "🪑",
    costPrice: 5500,
    sellPrice: 9800,
    stores: {
      "Main Store — Dhaka": { qty: 20, min: 10, max: 50, location: "A-13" },
      "Branch — Chittagong": { qty: 6, min: 5, max: 20, location: "B-12" },
      "Branch — Sylhet": { qty: 11, min: 5, max: 18, location: "C-12" },
    },
  },
  {
    id: 6,
    sku: "MCT-405",
    name: "Mahogany Coffee Table",
    category: "Table",
    img: "☕",
    costPrice: 9200,
    sellPrice: 15200,
    stores: {
      "Main Store — Dhaka": { qty: 9, min: 6, max: 25, location: "A-15" },
      "Branch — Chittagong": { qty: 4, min: 4, max: 15, location: "B-14" },
      "Branch — Sylhet": { qty: 3, min: 3, max: 10, location: "C-14" },
    },
  },
  {
    id: 7,
    sku: "PIN-801",
    name: "Pine Wood Nightstand",
    category: "Bedroom",
    img: "🌙",
    costPrice: 3800,
    sellPrice: 6500,
    stores: {
      "Main Store — Dhaka": { qty: 18, min: 8, max: 40, location: "A-18" },
      "Branch — Chittagong": { qty: 7, min: 5, max: 20, location: "B-17" },
      "Branch — Sylhet": { qty: 4, min: 4, max: 12, location: "C-17" },
    },
  },
  {
    id: 8,
    sku: "TKW-702",
    name: "Teak Wood Wardrobe 3-Door",
    category: "Storage",
    img: "🚪",
    costPrice: 35000,
    sellPrice: 55000,
    stores: {
      "Main Store — Dhaka": { qty: 4, min: 3, max: 12, location: "A-20" },
      "Branch — Chittagong": { qty: 1, min: 2, max: 8, location: "B-20" },
      "Branch — Sylhet": { qty: 2, min: 2, max: 6, location: "C-20" },
    },
  },
  {
    id: 9,
    sku: "ELC-201",
    name: "Elm Corner Sofa L-Shape",
    category: "Sofa",
    img: "🛋️",
    costPrice: 42000,
    sellPrice: 68000,
    stores: {
      "Main Store — Dhaka": { qty: 3, min: 2, max: 8, location: "A-22" },
      "Branch — Chittagong": { qty: 1, min: 2, max: 5, location: "B-22" },
      "Branch — Sylhet": { qty: 0, min: 2, max: 5, location: "C-22" },
    },
  },
  {
    id: 10,
    sku: "RSD-301",
    name: "Rosewood Study Desk",
    category: "Desk",
    img: "📖",
    costPrice: 11000,
    sellPrice: 18500,
    stores: {
      "Main Store — Dhaka": { qty: 11, min: 5, max: 25, location: "A-24" },
      "Branch — Chittagong": { qty: 5, min: 4, max: 15, location: "B-24" },
      "Branch — Sylhet": { qty: 3, min: 3, max: 10, location: "C-24" },
    },
  },
];

const CATEGORIES = ["All", ...new Set(INVENTORY.map((p) => p.category))];

const getStockStatus = (qty, min) => {
  if (qty === 0) return "out";
  if (qty <= min) return "low";
  if (qty <= min * 1.5) return "warning";
  return "ok";
};

const stockStatusConfig = {
  out: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    label: "OUT OF STOCK",
    badge: "red",
  },
  low: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    label: "LOW STOCK",
    badge: "red",
  },
  warning: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    label: "WARNING",
    badge: "yellow",
  },
  ok: {
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
    label: "HEALTHY",
    badge: "green",
  },
};

/* ── Adjust Stock Modal ─────────────────────────────────────────── */
const AdjustModal = ({ product, store, onClose }) => {
  const [adjType, setAdjType] = useState("add");
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState("");
  const current = product.stores[store]?.qty ?? 0;
  const preview =
    adjType === "add"
      ? current + (parseInt(qty) || 0)
      : Math.max(0, current - (parseInt(qty) || 0));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
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
          width: 420,
          padding: "22px 24px",
          boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
          animation: "slideUp .25s ease",
        }}
      >
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
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
              Adjust Stock
            </h3>
            <p style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}>
              {product.name} • {store}
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

        {/* Current stock display */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              flex: 1,
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
                letterSpacing: "0.07em",
              }}
            >
              CURRENT
            </p>
            <p
              style={{
                color: T.text,
                fontSize: 24,
                fontWeight: 900,
                margin: "4px 0 0",
              }}
            >
              {current}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: T.textMut,
              fontSize: 18,
            }}
          >
            →
          </div>
          <div
            style={{
              flex: 1,
              padding: "12px",
              background:
                adjType === "add"
                  ? "rgba(74,222,128,0.08)"
                  : "rgba(248,113,113,0.08)",
              borderRadius: 10,
              border: `1px solid ${adjType === "add" ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: T.textMut,
                fontSize: 9.5,
                margin: 0,
                letterSpacing: "0.07em",
              }}
            >
              AFTER
            </p>
            <p
              style={{
                color: adjType === "add" ? T.green : T.red,
                fontSize: 24,
                fontWeight: 900,
                margin: "4px 0 0",
              }}
            >
              {preview}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[
            ["add", "➕ Add Stock"],
            ["remove", "➖ Remove Stock"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setAdjType(v)}
              style={{
                flex: 1,
                padding: "9px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 12,
                background:
                  adjType === v
                    ? v === "add"
                      ? "rgba(74,222,128,0.15)"
                      : "rgba(248,113,113,0.15)"
                    : T.bg3,
                border: `1px solid ${adjType === v ? (v === "add" ? "rgba(74,222,128,0.35)" : "rgba(248,113,113,0.35)") : T.border}`,
                color:
                  adjType === v ? (v === "add" ? T.green : T.red) : T.textSub,
                transition: "all .15s",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Input
            label="Quantity *"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            type="number"
            placeholder="1"
          />
          <div>
            <label
              style={{
                color: T.textSub,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.07em",
                display: "block",
                marginBottom: 5,
              }}
            >
              REASON
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Reason for adjustment..."
              style={{
                width: "100%",
                background: T.bg3,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "8px 10px",
                color: T.text,
                fontSize: 12,
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = T.gold)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
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
          <Btn
            onClick={onClose}
            variant={adjType === "add" ? "success" : "danger"}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Ic.Check /> Apply Adjustment
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   STOCK OVERVIEW PAGE
════════════════════════════════════════════════════════════════ */
export default function StockOverview() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [storeFilter, setStoreFilter] = useState("All Stores");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // "table" | "card"
  const [adjustTarget, setAdjustTarget] = useState(null); // {product, store}
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [expandedRow, setExpandedRow] = useState(null);

  /* Derived inventory with aggregated totals */
  const enriched = useMemo(
    () =>
      INVENTORY.map((p) => {
        const storeSummary = Object.entries(p.stores).map(([store, d]) => ({
          store,
          ...d,
          status: getStockStatus(d.qty, d.min),
        }));
        const totalQty = storeSummary.reduce((s, x) => s + x.qty, 0);
        const totalValue = totalQty * p.costPrice;
        const worstStatus = storeSummary.some((s) => s.status === "out")
          ? "out"
          : storeSummary.some((s) => s.status === "low")
            ? "low"
            : storeSummary.some((s) => s.status === "warning")
              ? "warning"
              : "ok";
        return { ...p, storeSummary, totalQty, totalValue, worstStatus };
      }),
    [],
  );

  const filtered = useMemo(
    () =>
      enriched
        .filter((p) => {
          const ms =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase());
          const mc = category === "All" || p.category === category;
          const mst =
            storeFilter === "All Stores" ||
            p.storeSummary.some((s) => s.store === storeFilter);
          const mss = statusFilter === "all" || p.worstStatus === statusFilter;
          return ms && mc && mst && mss;
        })
        .sort((a, b) => {
          let va = a[sortField],
            vb = b[sortField];
          if (sortField === "totalQty" || sortField === "totalValue")
            return sortDir === "asc" ? va - vb : vb - va;
          return sortDir === "asc"
            ? String(va).localeCompare(String(vb))
            : String(vb).localeCompare(String(va));
        }),
    [enriched, search, category, storeFilter, statusFilter, sortField, sortDir],
  );

  /* KPIs */
  const totalItems = enriched.length;
  const totalUnits = enriched.reduce((s, p) => s + p.totalQty, 0);
  const totalValue = enriched.reduce((s, p) => s + p.totalValue, 0);
  const lowStockCount = enriched.filter(
    (p) => p.worstStatus === "low" || p.worstStatus === "out",
  ).length;

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

  const thStyle = (f) => ({
    padding: "11px 10px",
    color: T.textMut,
    fontSize: 9.5,
    fontWeight: 700,
    textAlign: "left",
    letterSpacing: "0.07em",
    borderBottom: `1px solid ${T.border}`,
    cursor: f ? "pointer" : "default",
    whiteSpace: "nowrap",
    userSelect: "none",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
            value: totalItems,
            sub: `${CATEGORIES.length - 1} categories`,
            color: T.gold,
            icon: "📦",
          },
          {
            label: "Total Units",
            value: totalUnits.toLocaleString(),
            sub: "Across all stores",
            color: T.blue,
            icon: "📊",
          },
          {
            label: "Inventory Value",
            value: `৳${(totalValue / 100000).toFixed(1)}L`,
            sub: "At cost price",
            color: T.green,
            icon: "💰",
          },
          {
            label: "Low Stock Items",
            value: lowStockCount,
            sub: "Need restocking",
            color: T.red,
            icon: "⚠️",
          },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              ...card(),
              padding: "15px 17px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "all .2s",
              cursor: "default",
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
                right: -10,
                top: -10,
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
            <div style={{ position: "relative" }}>
              <p
                style={{
                  color: T.textSub,
                  fontSize: 10,
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

      {/* ── Store health bar ── */}
      <div style={{ ...card(), padding: "14px 18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <p
            style={{
              color: T.textMut,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.09em",
              margin: 0,
            }}
          >
            STORE STOCK HEALTH
          </p>
          <Badge color="gold" small>
            All Stores
          </Badge>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
          }}
        >
          {STORES.map((store) => {
            const storeInv = enriched.map((p) => ({
              ...p,
              storeData: p.stores[store],
            }));
            const total = storeInv.reduce(
              (s, p) => s + (p.storeData?.qty || 0),
              0,
            );
            const lowCount = storeInv.filter(
              (p) =>
                p.storeData &&
                getStockStatus(p.storeData.qty, p.storeData.min) !== "ok",
            ).length;
            const health = Math.round(
              ((storeInv.length - lowCount) / storeInv.length) * 100,
            );
            return (
              <div
                key={store}
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
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: T.text,
                        fontWeight: 700,
                        fontSize: 12,
                        margin: 0,
                      }}
                    >
                      {store.split(" — ")[0]}
                    </p>
                    <p
                      style={{
                        color: T.textSub,
                        fontSize: 10,
                        margin: "2px 0 0",
                      }}
                    >
                      {store.split(" — ")[1] || store}
                    </p>
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
                      {total}
                    </p>
                    <p style={{ color: T.textMut, fontSize: 9.5, margin: 0 }}>
                      units
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    height: 5,
                    background: T.bg,
                    borderRadius: 3,
                    overflow: "hidden",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      width: `${health}%`,
                      height: "100%",
                      background:
                        health > 80 ? T.green : health > 60 ? T.yellow : T.red,
                      borderRadius: 3,
                      transition: "width .6s ease",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      color:
                        health > 80 ? T.green : health > 60 ? T.yellow : T.red,
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {health}% healthy
                  </span>
                  {lowCount > 0 && (
                    <Badge color="red" small>
                      {lowCount} alerts
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
        <div style={{ flex: 1, minWidth: 180 }}>
          <Input
            icon={<Ic.Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name or SKU..."
          />
        </div>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={CATEGORIES}
        />
        <Select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          options={["All Stores", ...STORES]}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "out", label: "Out of Stock" },
            { value: "low", label: "Low Stock" },
            { value: "warning", label: "Warning" },
            { value: "ok", label: "Healthy" },
          ]}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["table", "card"].map((v) => (
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
          <Btn variant="ghost" size="sm">
            <Ic.Download /> Export
          </Btn>
        </div>
      </div>

      {/* ── Bulk bar ── */}
      {selectedRows.size > 0 && (
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
          <Badge color="gold">{selectedRows.size} selected</Badge>
          <div style={{ flex: 1 }} />
          <Btn variant="ghost" size="sm">
            <Ic.Print /> Print Labels
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Download /> Export
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

      {/* ── Results info ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
          Showing <strong style={{ color: T.text }}>{filtered.length}</strong>{" "}
          of {enriched.length} products
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["out", "red"],
            ["low", "red"],
            ["warning", "yellow"],
            ["ok", "green"],
          ].map(([s, c]) => {
            const cnt = filtered.filter((p) => p.worstStatus === s).length;
            if (!cnt) return null;
            return (
              <Badge key={s} color={c} small>
                {cnt} {stockStatusConfig[s].label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* ── Table View ── */}
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
                  <th style={thStyle("name")} onClick={() => sortBy("name")}>
                    PRODUCT <SortArrow f="name" />
                  </th>
                  <th style={thStyle(null)}>CATEGORY</th>
                  <th
                    style={thStyle("totalQty")}
                    onClick={() => sortBy("totalQty")}
                  >
                    TOTAL QTY <SortArrow f="totalQty" />
                  </th>
                  {STORES.map((s) => (
                    <th key={s} style={thStyle(null)}>
                      {s
                        .split(" — ")[0]
                        .replace("Main Store", "Main")
                        .replace("Branch", "Branch")}
                    </th>
                  ))}
                  <th
                    style={thStyle("totalValue")}
                    onClick={() => sortBy("totalValue")}
                  >
                    VALUE <SortArrow f="totalValue" />
                  </th>
                  <th style={thStyle(null)}>STATUS</th>
                  <th style={thStyle(null)}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isExp = expandedRow === p.id;
                  const isSel = selectedRows.has(p.id);
                  const sc = stockStatusConfig[p.worstStatus];
                  return (
                    <>
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: `1px solid ${T.border}`,
                          background: isSel
                            ? "rgba(205,133,63,0.06)"
                            : "transparent",
                          transition: "background .12s",
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
                        <td style={{ padding: "11px 10px" }}>
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
                                  color: T.gold,
                                  fontSize: 10,
                                  fontFamily: "monospace",
                                  margin: 0,
                                }}
                              >
                                {p.sku}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "11px 10px" }}>
                          <Badge color="purple" small>
                            {p.category}
                          </Badge>
                        </td>
                        <td style={{ padding: "11px 10px" }}>
                          <span
                            style={{
                              color: T.amber,
                              fontWeight: 900,
                              fontSize: 16,
                            }}
                          >
                            {p.totalQty}
                          </span>
                          <button
                            onClick={() => setExpandedRow(isExp ? null : p.id)}
                            style={{
                              marginLeft: 6,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: T.textMut,
                              fontSize: 10,
                            }}
                          >
                            {isExp ? "▲" : "▼"}
                          </button>
                        </td>
                        {STORES.map((store) => {
                          const sd = p.stores[store];
                          const st = getStockStatus(sd.qty, sd.min);
                          const stc = stockStatusConfig[st];
                          return (
                            <td key={store} style={{ padding: "11px 10px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  align: "center",
                                  gap: 5,
                                }}
                              >
                                <span
                                  style={{
                                    color: stc.color,
                                    fontWeight: 700,
                                    fontSize: 13,
                                  }}
                                >
                                  {sd.qty}
                                </span>
                                <span
                                  style={{ color: T.textMut, fontSize: 10 }}
                                >
                                  /{sd.min}
                                </span>
                                <div
                                  style={{
                                    width: 4,
                                    height: 14,
                                    background: stc.color,
                                    borderRadius: 2,
                                    alignSelf: "center",
                                    opacity: 0.7,
                                  }}
                                />
                              </div>
                            </td>
                          );
                        })}
                        <td style={{ padding: "11px 10px" }}>
                          <span
                            style={{
                              color: T.text,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            ৳{(p.totalValue / 1000).toFixed(0)}K
                          </span>
                        </td>
                        <td style={{ padding: "11px 10px" }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 20,
                              background: sc.bg,
                              color: sc.color,
                              border: `1px solid ${sc.color}40`,
                            }}
                          >
                            {sc.label}
                          </span>
                        </td>
                        <td style={{ padding: "11px 10px" }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              title="Adjust Stock"
                              onClick={() =>
                                setAdjustTarget({
                                  product: p,
                                  store: "Main Store — Dhaka",
                                })
                              }
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
                              title="View Details"
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
                          </div>
                        </td>
                      </tr>
                      {/* Expanded row */}
                      {isExp && (
                        <tr
                          key={`${p.id}-exp`}
                          style={{
                            background: T.bg2,
                            borderBottom: `1px solid ${T.border}`,
                          }}
                        >
                          <td colSpan={9} style={{ padding: "12px 24px" }}>
                            <div style={{ display: "flex", gap: 12 }}>
                              {p.storeSummary.map((sd) => {
                                const stc = stockStatusConfig[sd.status];
                                const fillPct = Math.min(
                                  100,
                                  Math.round((sd.qty / (sd.max || 1)) * 100),
                                );
                                return (
                                  <div
                                    key={sd.store}
                                    style={{
                                      flex: 1,
                                      padding: "12px 14px",
                                      background: T.card,
                                      borderRadius: 10,
                                      border: `1px solid ${stc.color}30`,
                                    }}
                                  >
                                    <p
                                      style={{
                                        color: T.text,
                                        fontWeight: 700,
                                        fontSize: 11.5,
                                        margin: "0 0 8px",
                                      }}
                                    >
                                      {sd.store}
                                    </p>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 6,
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: T.textSub,
                                          fontSize: 10,
                                        }}
                                      >
                                        Qty:{" "}
                                        <strong style={{ color: stc.color }}>
                                          {sd.qty}
                                        </strong>
                                      </span>
                                      <span
                                        style={{
                                          color: T.textSub,
                                          fontSize: 10,
                                        }}
                                      >
                                        Min: {sd.min} / Max: {sd.max}
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        height: 6,
                                        background: T.bg,
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        marginBottom: 6,
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: `${fillPct}%`,
                                          height: "100%",
                                          background: stc.color,
                                          borderRadius: 3,
                                        }}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: T.textMut,
                                          fontSize: 10,
                                        }}
                                      >
                                        📍 {sd.location}
                                      </span>
                                      <button
                                        onClick={() =>
                                          setAdjustTarget({
                                            product: p,
                                            store: sd.store,
                                          })
                                        }
                                        style={{
                                          background: "rgba(205,133,63,0.15)",
                                          border:
                                            "1px solid rgba(205,133,63,0.3)",
                                          color: T.gold,
                                          fontSize: 9.5,
                                          fontWeight: 700,
                                          padding: "2px 8px",
                                          borderRadius: 6,
                                          cursor: "pointer",
                                        }}
                                      >
                                        Adjust
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
              <tfoot style={{ background: T.bg2 }}>
                <tr style={{ borderTop: `2px solid ${T.border}` }}>
                  <td colSpan={3} style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        color: T.textMut,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                      }}
                    >
                      TOTALS — {filtered.length} PRODUCTS
                    </span>
                  </td>
                  <td style={{ padding: "10px 10px" }}>
                    <span
                      style={{ color: T.amber, fontSize: 14, fontWeight: 900 }}
                    >
                      {filtered.reduce((s, p) => s + p.totalQty, 0)}
                    </span>
                  </td>
                  {STORES.map((st) => (
                    <td key={st} style={{ padding: "10px 10px" }}>
                      <span
                        style={{
                          color: T.textSub,
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {filtered.reduce(
                          (s, p) => s + (p.stores[st]?.qty || 0),
                          0,
                        )}
                      </span>
                    </td>
                  ))}
                  <td style={{ padding: "10px 10px" }}>
                    <span
                      style={{ color: T.green, fontSize: 13, fontWeight: 800 }}
                    >
                      ৳
                      {(
                        filtered.reduce((s, p) => s + p.totalValue, 0) / 100000
                      ).toFixed(1)}
                      L
                    </span>
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── Card View ── */}
      {viewMode === "card" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 12,
          }}
        >
          {filtered.map((p) => {
            const sc = stockStatusConfig[p.worstStatus];
            return (
              <div
                key={p.id}
                style={{
                  ...card(),
                  padding: "16px",
                  transition: "all .2s",
                  borderLeft: `3px solid ${sc.color}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.3)`;
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
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: "rgba(139,90,43,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      {p.img}
                    </div>
                    <div>
                      <p
                        style={{
                          color: T.text,
                          fontWeight: 700,
                          fontSize: 12.5,
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        {p.name}
                      </p>
                      <p
                        style={{
                          color: T.gold,
                          fontSize: 10,
                          fontFamily: "monospace",
                          margin: "3px 0 0",
                        }}
                      >
                        {p.sku}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 20,
                      background: sc.bg,
                      color: sc.color,
                      border: `1px solid ${sc.color}40`,
                    }}
                  >
                    {sc.label}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "8px",
                      background: T.bg3,
                      borderRadius: 8,
                    }}
                  >
                    <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                      TOTAL QTY
                    </p>
                    <p
                      style={{
                        color: T.amber,
                        fontSize: 20,
                        fontWeight: 900,
                        margin: "2px 0 0",
                      }}
                    >
                      {p.totalQty}
                    </p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "8px",
                      background: T.bg3,
                      borderRadius: 8,
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
                        margin: "4px 0 0",
                      }}
                    >
                      ৳{(p.totalValue / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  {p.storeSummary.map((sd) => {
                    const stc = stockStatusConfig[sd.status];
                    return (
                      <div
                        key={sd.store}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            color: T.textSub,
                            fontSize: 10,
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {sd.store.split(" — ")[0]}
                        </span>
                        <div
                          style={{
                            width: 60,
                            height: 4,
                            background: T.bg,
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(100, (sd.qty / (sd.max || 1)) * 100)}%`,
                              height: "100%",
                              background: stc.color,
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            color: stc.color,
                            fontWeight: 700,
                            fontSize: 11,
                            width: 20,
                            textAlign: "right",
                          }}
                        >
                          {sd.qty}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setAdjustTarget({
                        product: p,
                        store: "Main Store — Dhaka",
                      })
                    }
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    <Ic.Edit /> Adjust
                  </Btn>
                  <button
                    style={{
                      flex: 1,
                      padding: "5px",
                      borderRadius: 8,
                      background: "rgba(96,165,250,0.1)",
                      border: "1px solid rgba(96,165,250,0.2)",
                      color: T.blue,
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    View Detail
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ ...card(), padding: "52px", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📦</div>
          <p
            style={{
              color: T.textSub,
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
            }}
          >
            No products match your filters
          </p>
        </div>
      )}

      {adjustTarget && (
        <AdjustModal
          product={adjustTarget.product}
          store={adjustTarget.store}
          onClose={() => setAdjustTarget(null)}
        />
      )}
    </div>
  );
}
