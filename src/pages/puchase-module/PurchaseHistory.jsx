import { useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

/* ── Sample Purchase History Data ──────────────────────────────── */
const PURCHASE_HISTORY = [
  {
    id: 1,
    po: "PO-1041",
    supplier: "Teak Palace Suppliers",
    items: 4,
    subtotal: 210000,
    discount: 10000,
    vat: 0,
    total: 200000,
    paid: 200000,
    due: 0,
    status: "paid",
    date: "2026-04-04",
    orderedBy: "Admin",
    store: "Main Store",
    delivery: "2026-04-07",
    received: true,
  },
  {
    id: 2,
    po: "PO-1040",
    supplier: "Royal Wood Imports",
    items: 6,
    subtotal: 380000,
    discount: 0,
    vat: 19000,
    total: 399000,
    paid: 200000,
    due: 199000,
    status: "partial",
    date: "2026-04-03",
    orderedBy: "Manager",
    store: "Main Store",
    delivery: "2026-04-10",
    received: false,
  },
  {
    id: 3,
    po: "PO-1039",
    supplier: "BambooCraft Wholesale",
    items: 3,
    subtotal: 45000,
    discount: 2000,
    vat: 0,
    total: 43000,
    paid: 0,
    due: 43000,
    status: "pending",
    date: "2026-04-03",
    orderedBy: "Admin",
    store: "Branch — Chittagong",
    delivery: "2026-04-08",
    received: false,
  },
  {
    id: 4,
    po: "PO-1038",
    supplier: "Dhaka Timber Co.",
    items: 8,
    subtotal: 620000,
    discount: 20000,
    vat: 30000,
    total: 630000,
    paid: 630000,
    due: 0,
    status: "paid",
    date: "2026-04-02",
    orderedBy: "Procurement Officer",
    store: "Main Store",
    delivery: "2026-04-05",
    received: true,
  },
  {
    id: 5,
    po: "PO-1037",
    supplier: "EcoFurn Materials",
    items: 2,
    subtotal: 88000,
    discount: 0,
    vat: 4400,
    total: 92400,
    paid: 92400,
    due: 0,
    status: "paid",
    date: "2026-04-01",
    orderedBy: "Admin",
    store: "Branch — Sylhet",
    delivery: "2026-04-06",
    received: true,
  },
  {
    id: 6,
    po: "PO-1036",
    supplier: "Teak Palace Suppliers",
    items: 5,
    subtotal: 145000,
    discount: 5000,
    vat: 7000,
    total: 147000,
    paid: 80000,
    due: 67000,
    status: "partial",
    date: "2026-03-31",
    orderedBy: "Manager",
    store: "Main Store",
    delivery: "2026-04-04",
    received: true,
  },
  {
    id: 7,
    po: "PO-1035",
    supplier: "Royal Wood Imports",
    items: 3,
    subtotal: 260000,
    discount: 0,
    vat: 13000,
    total: 273000,
    paid: 273000,
    due: 0,
    status: "paid",
    date: "2026-03-30",
    orderedBy: "Admin",
    store: "Main Store",
    delivery: "2026-04-02",
    received: true,
  },
  {
    id: 8,
    po: "PO-1034",
    supplier: "BambooCraft Wholesale",
    items: 7,
    subtotal: 110000,
    discount: 0,
    vat: 0,
    total: 110000,
    paid: 0,
    due: 110000,
    status: "pending",
    date: "2026-03-29",
    orderedBy: "Procurement Officer",
    store: "Branch — Chittagong",
    delivery: "2026-04-05",
    received: false,
  },
];

/* ── PO Detail Side Panel ───────────────────────────────────────── */
const PODetailPanel = ({ po, onClose }) => {
  if (!po) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        zIndex: 100,
        backdropFilter: "blur(3px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 400,
          height: "100%",
          ...card(),
          borderRadius: "16px 0 0 16px",
          padding: "24px 20px",
          overflowY: "auto",
          animation: "slideFromRight .28s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes slideFromRight{from{transform:translateX(100%);opacity:0}to{transform:none;opacity:1}}`}</style>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                color: T.blue,
                fontWeight: 900,
                fontSize: 16,
                fontFamily: "monospace",
              }}
            >
              {po.po}
            </div>
            <div style={{ color: T.textSub, fontSize: 11, marginTop: 2 }}>
              Purchase Order Details
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: T.red,
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ic.Close />
          </button>
        </div>

        {/* Status bar */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          <StatusBadge status={po.status} />
          {po.received ? (
            <Badge color="green" small>
              ✓ RECEIVED
            </Badge>
          ) : (
            <Badge color="yellow" small>
              ⏳ PENDING DELIVERY
            </Badge>
          )}
          <Badge color="blue" small>
            {po.items} ITEMS
          </Badge>
        </div>

        {/* Info rows */}
        {[
          ["Supplier", po.supplier],
          ["Store", po.store],
          ["Ordered By", po.orderedBy],
          ["Order Date", po.date],
          ["Expected Delivery", po.delivery],
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

        <div
          style={{
            marginTop: 18,
            padding: "14px",
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
              margin: "0 0 10px",
            }}
          >
            FINANCIAL BREAKDOWN
          </p>
          {[
            ["Subtotal", `৳${po.subtotal.toLocaleString()}`, T.text],
            ["Discount", `-৳${po.discount.toLocaleString()}`, T.yellow],
            ["VAT", `৳${po.vat.toLocaleString()}`, T.blue],
          ].map(([l, v, c]) => (
            <div
              key={l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "3px 0",
              }}
            >
              <span style={{ color: T.textSub, fontSize: 12 }}>{l}</span>
              <span style={{ color: c, fontWeight: 600, fontSize: 12 }}>
                {v}
              </span>
            </div>
          ))}
          <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: T.text, fontWeight: 800, fontSize: 13.5 }}>
              NET TOTAL
            </span>
            <span style={{ color: T.amber, fontWeight: 900, fontSize: 17 }}>
              ৳{po.total.toLocaleString()}
            </span>
          </div>
          <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
          {[
            ["Paid", `৳${po.paid.toLocaleString()}`, T.green],
            [
              "Due",
              `৳${po.due.toLocaleString()}`,
              po.due > 0 ? T.red : T.textMut,
            ],
          ].map(([l, v, c]) => (
            <div
              key={l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "3px 0",
              }}
            >
              <span style={{ color: T.textSub, fontSize: 12 }}>{l}</span>
              <span style={{ color: c, fontWeight: 700, fontSize: 12 }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <Btn style={{ flex: 1, justifyContent: "center" }} size="sm">
            <Ic.Edit /> Edit PO
          </Btn>
          <Btn
            variant="ghost"
            style={{ flex: 1, justifyContent: "center" }}
            size="sm"
          >
            <Ic.Print /> Print
          </Btn>
        </div>
        {po.due > 0 && (
          <Btn
            variant="success"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            size="sm"
          >
            <Ic.Cash /> Record Payment
          </Btn>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   PURCHASE HISTORY PAGE
════════════════════════════════════════════════════════════════ */
export default function PurchaseHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [detailPO, setDetailPO] = useState(null);
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = PURCHASE_HISTORY.filter((p) => {
    const matchSearch =
      p.po.toLowerCase().includes(search.toLowerCase()) ||
      p.supplier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchSupplier =
      supplierFilter === "all" || p.supplier === supplierFilter;
    const matchFrom = !dateFrom || p.date >= dateFrom;
    const matchTo = !dateTo || p.date <= dateTo;
    return matchSearch && matchStatus && matchSupplier && matchFrom && matchTo;
  }).sort((a, b) => {
    if (sortField === "date")
      return sortDir === "desc"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    if (sortField === "total")
      return sortDir === "desc" ? b.total - a.total : a.total - b.total;
    return 0;
  });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((p) => p.id)),
    );
  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const sortBy = (field) => {
    setSortField(field);
    setSortDir((prev) =>
      field === sortField && prev === "desc" ? "asc" : "desc",
    );
  };

  const totalAmount = PURCHASE_HISTORY.reduce((a, p) => a + p.total, 0);
  const totalPaid = PURCHASE_HISTORY.reduce((a, p) => a + p.paid, 0);
  const totalDue = PURCHASE_HISTORY.reduce((a, p) => a + p.due, 0);
  const selectedTotal = filtered
    .filter((p) => selected.has(p.id))
    .reduce((a, p) => a + p.total, 0);

  const uniqueSuppliers = [...new Set(PURCHASE_HISTORY.map((p) => p.supplier))];

  const SortArrow = ({ field }) => (
    <span
      style={{
        color: sortField === field ? T.gold : T.textMut,
        fontSize: 9,
        marginLeft: 3,
      }}
    >
      {sortField === field ? (sortDir === "desc" ? "▼" : "▲") : "⇅"}
    </span>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* ── KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 13,
        }}
      >
        {[
          {
            label: "Total Purchases",
            value: `৳${totalAmount.toLocaleString()}`,
            sub: `${PURCHASE_HISTORY.length} orders`,
            color: T.blue,
            icon: <Ic.Package />,
          },
          {
            label: "Total Paid",
            value: `৳${totalPaid.toLocaleString()}`,
            sub: "Cleared payments",
            color: T.green,
            icon: <Ic.Check />,
          },
          {
            label: "Balance Due",
            value: `৳${totalDue.toLocaleString()}`,
            sub: `${PURCHASE_HISTORY.filter((p) => p.due > 0).length} pending`,
            color: T.red,
            icon: <Ic.Alert />,
          },
          {
            label: "Received Orders",
            value: `${PURCHASE_HISTORY.filter((p) => p.received).length}/${PURCHASE_HISTORY.length}`,
            sub: "Deliveries confirmed",
            color: T.amber,
            icon: <Ic.Receipt />,
          },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              ...card(),
              padding: "15px 17px",
              display: "flex",
              alignItems: "flex-start",
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
                opacity: 0.05,
                color: k.color,
              }}
            >
              <svg
                width={80}
                height={80}
                viewBox="0 0 24 24"
                fill={k.color}
                stroke="none"
              >
                <circle cx={12} cy={12} r={12} />
              </svg>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                background: k.color + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: k.color,
                flexShrink: 0,
              }}
            >
              {k.icon}
            </div>
            <div>
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
                  fontSize: 20,
                  fontWeight: 900,
                  margin: "3px 0 3px",
                  letterSpacing: "-0.02em",
                }}
              >
                {k.value}
              </p>
              <p style={{ color: T.textMut, fontSize: 10.5, margin: 0 }}>
                {k.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div
        style={{
          ...card(),
          padding: "13px 16px",
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
            placeholder="Search PO number or supplier..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "paid", label: "Paid" },
            { value: "partial", label: "Partial" },
            { value: "pending", label: "Pending" },
          ]}
        />
        <Select
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
          options={[
            { value: "all", label: "All Suppliers" },
            ...uniqueSuppliers.map((s) => ({ value: s, label: s })),
          ]}
        />
        <Input
          label="From"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          type="date"
        />
        <Input
          label="To"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          type="date"
        />
        <div style={{ display: "flex", gap: 7 }}>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setSupplierFilter("all");
              setDateFrom("");
              setDateTo("");
            }}
          >
            <Ic.Close /> Clear
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Download /> Export CSV
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Print /> Print
          </Btn>
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "10px 16px",
            background: "rgba(96,165,250,0.07)",
            borderColor: "rgba(96,165,250,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.blue,
              boxShadow: `0 0 8px ${T.blue}`,
            }}
          />
          <span style={{ color: T.text, fontWeight: 700, fontSize: 12.5 }}>
            {selected.size} orders selected
          </span>
          <span style={{ color: T.textSub, fontSize: 12 }}>•</span>
          <span style={{ color: T.textSub, fontSize: 12 }}>
            Total:{" "}
            <strong style={{ color: T.amber }}>
              ৳{selectedTotal.toLocaleString()}
            </strong>
          </span>
          <div style={{ flex: 1 }} />
          <Btn variant="ghost" size="sm">
            <Ic.Print /> Bulk Print PO
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Download /> Export Selected
          </Btn>
          <Btn variant="success" size="sm">
            <Ic.Cash /> Bulk Pay
          </Btn>
          <button
            onClick={() => setSelected(new Set())}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textMut,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Ic.Close />
          </button>
        </div>
      )}

      {/* ── Results count ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
          Showing <strong style={{ color: T.text }}>{filtered.length}</strong>{" "}
          of {PURCHASE_HISTORY.length} orders
        </p>
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          <span style={{ color: T.textMut, fontSize: 11 }}>Sort by:</span>
          <button
            onClick={() => sortBy("date")}
            style={{
              background:
                sortField === "date"
                  ? "rgba(205,133,63,0.15)"
                  : "rgba(139,90,43,0.08)",
              border: `1px solid ${sortField === "date" ? "rgba(205,133,63,0.3)" : T.border}`,
              color: sortField === "date" ? T.gold : T.textSub,
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 11px",
              borderRadius: 20,
              cursor: "pointer",
            }}
          >
            Date <SortArrow field="date" />
          </button>
          <button
            onClick={() => sortBy("total")}
            style={{
              background:
                sortField === "total"
                  ? "rgba(205,133,63,0.15)"
                  : "rgba(139,90,43,0.08)",
              border: `1px solid ${sortField === "total" ? "rgba(205,133,63,0.3)" : T.border}`,
              color: sortField === "total" ? T.gold : T.textSub,
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 11px",
              borderRadius: 20,
              cursor: "pointer",
            }}
          >
            Amount <SortArrow field="total" />
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              <th style={{ padding: "12px 15px", width: 36 }}>
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
                { label: "PO Number", w: "" },
                { label: "Supplier", w: "" },
                { label: "Store", w: "" },
                { label: "Items", w: "60px" },
                { label: "Subtotal", w: "" },
                { label: "Total Amount", w: "" },
                { label: "Paid", w: "" },
                { label: "Due", w: "" },
                { label: "Status", w: "" },
                { label: "Delivery", w: "" },
                { label: "Ordered By", w: "" },
                { label: "Date", w: "" },
                { label: "Actions", w: "100px" },
              ].map((h) => (
                <th
                  key={h.label}
                  style={{
                    padding: "12px 10px",
                    color: T.textMut,
                    fontSize: 9.5,
                    fontWeight: 700,
                    textAlign: "left",
                    letterSpacing: "0.07em",
                    borderBottom: `1px solid ${T.border}`,
                    width: h.w,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h.label.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  background: selected.has(p.id)
                    ? "rgba(96,165,250,0.05)"
                    : "transparent",
                  transition: "background .12s",
                }}
                onMouseEnter={(e) => {
                  if (!selected.has(p.id))
                    e.currentTarget.style.background = "rgba(139,90,43,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!selected.has(p.id))
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "11px 15px" }}>
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                    style={{ cursor: "pointer", accentColor: T.gold }}
                  />
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span
                    style={{
                      color: T.blue,
                      fontWeight: 800,
                      fontSize: 12.5,
                      fontFamily: "monospace",
                      cursor: "pointer",
                    }}
                    onClick={() => setDetailPO(p)}
                  >
                    {p.po}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 11,
                        flexShrink: 0,
                      }}
                    >
                      {p.supplier[0]}
                    </div>
                    <span
                      style={{ color: T.text, fontSize: 12, fontWeight: 600 }}
                    >
                      {p.supplier}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span style={{ color: T.textSub, fontSize: 12 }}>
                    {p.store}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <Badge color="blue" small>
                    {p.items} items
                  </Badge>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span style={{ color: T.textSub, fontSize: 12 }}>
                    ৳{p.subtotal.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span
                    style={{ color: T.text, fontWeight: 800, fontSize: 13 }}
                  >
                    ৳{p.total.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span
                    style={{ color: T.green, fontWeight: 700, fontSize: 12 }}
                  >
                    ৳{p.paid.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span
                    style={{
                      color: p.due > 0 ? T.red : T.textMut,
                      fontWeight: p.due > 0 ? 700 : 400,
                      fontSize: 12,
                    }}
                  >
                    ৳{p.due.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <StatusBadge status={p.status} />
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <span style={{ color: T.text, fontSize: 11 }}>
                      {p.delivery}
                    </span>
                    {p.received ? (
                      <Badge color="green" small>
                        ✓ Received
                      </Badge>
                    ) : (
                      <Badge color="yellow" small>
                        ⏳ Pending
                      </Badge>
                    )}
                  </div>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span style={{ color: T.textSub, fontSize: 11 }}>
                    {p.orderedBy}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span style={{ color: T.textSub, fontSize: 11 }}>
                    {p.date}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button
                      title="View Details"
                      onClick={() => setDetailPO(p)}
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
                      title="Edit"
                      style={{
                        width: 27,
                        height: 27,
                        borderRadius: 7,
                        background: "rgba(139,90,43,0.1)",
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
                      title="Print PO"
                      style={{
                        width: 27,
                        height: 27,
                        borderRadius: 7,
                        background: "rgba(192,132,252,0.1)",
                        border: "1px solid rgba(192,132,252,0.2)",
                        color: T.purple,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ic.Print />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={14}
                  style={{ padding: "48px 20px", textAlign: "center" }}
                >
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                  <p style={{ color: T.textSub, fontSize: 13, margin: 0 }}>
                    No purchase orders match your filters
                  </p>
                </td>
              </tr>
            )}
          </tbody>

          {/* Table footer totals */}
          {filtered.length > 0 && (
            <tfoot style={{ background: T.bg2 }}>
              <tr style={{ borderTop: `2px solid ${T.border}` }}>
                <td colSpan={5} style={{ padding: "11px 15px" }}>
                  <span
                    style={{
                      color: T.textMut,
                      fontSize: 10.5,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                    }}
                  >
                    TOTALS — {filtered.length} ORDERS
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span
                    style={{ color: T.textSub, fontSize: 12, fontWeight: 700 }}
                  >
                    ৳
                    {filtered
                      .reduce((a, p) => a + p.subtotal, 0)
                      .toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span
                    style={{ color: T.amber, fontSize: 14, fontWeight: 900 }}
                  >
                    ৳
                    {filtered.reduce((a, p) => a + p.total, 0).toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span
                    style={{ color: T.green, fontSize: 13, fontWeight: 800 }}
                  >
                    ৳{filtered.reduce((a, p) => a + p.paid, 0).toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "11px 10px" }}>
                  <span style={{ color: T.red, fontSize: 13, fontWeight: 800 }}>
                    ৳{filtered.reduce((a, p) => a + p.due, 0).toLocaleString()}
                  </span>
                </td>
                <td colSpan={5} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {detailPO && (
        <PODetailPanel po={detailPO} onClose={() => setDetailPO(null)} />
      )}
    </div>
  );
}
