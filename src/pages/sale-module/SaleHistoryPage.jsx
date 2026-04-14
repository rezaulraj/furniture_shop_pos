import { useState } from "react";
import { card, T } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Input, Select } from "../../components/Input";
import { Ic } from "../../components/Icons";
import { SALE_HISTORY } from "../../data/sampleData";

export default function SaleHistoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(new Set());

  const filtered = SALE_HISTORY.filter((s) => {
    const matchSearch =
      s.inv.toLowerCase().includes(search.toLowerCase()) ||
      s.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((s) => s.id)),
    );
  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const totalSelected = filtered
    .filter((s) => selected.has(s.id))
    .reduce((acc, s) => acc + s.total, 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* ── Stat cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Sales",
            value: `৳${SALE_HISTORY.reduce((a, s) => a + s.total, 0).toLocaleString()}`,
            color: "var(--green)",
            icon: "📈",
          },
          {
            label: "Total Paid",
            value: `৳${SALE_HISTORY.reduce((a, s) => a + s.paid, 0).toLocaleString()}`,
            color: "#60a5fa",
            icon: "✅",
          },
          {
            label: "Total Due",
            value: `৳${SALE_HISTORY.reduce((a, s) => a + s.due, 0).toLocaleString()}`,
            color: "#f87171",
            icon: "⚠️",
          },
          {
            label: "Invoices",
            value: `${SALE_HISTORY.length}`,
            color: "var(--accent)",
            icon: "🧾",
          },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              ...card(),
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: `${k.color}18`,
                border: `1px solid ${k.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {k.icon}
            </div>
            <div>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 10,
                  margin: 0,
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                }}
              >
                {k.label.toUpperCase()}
              </p>
              <p
                style={{
                  color: k.color,
                  fontSize: 20,
                  fontWeight: 800,
                  margin: "2px 0 0",
                }}
              >
                {k.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div
        style={{
          ...card(),
          padding: "12px 16px",
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
            placeholder="Search invoice, customer..."
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
        <Btn variant="ghost" size="sm">
          <Ic.Download /> Export
        </Btn>
      </div>

      {/* ── Bulk action bar ── */}
      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "10px 16px",
            background: "rgba(172,82,8,0.06)",
            borderColor: "rgba(172,82,8,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: "slideUp 0.2s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <Badge color="accent">{selected.size} selected</Badge>
          <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
            Total:{" "}
            <strong style={{ color: "var(--green)" }}>
              ৳{totalSelected.toLocaleString()}
            </strong>
          </span>
          <div style={{ flex: 1 }} />
          <Btn variant="ghost" size="sm">
            <Ic.Print /> Bulk Print
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Download /> Export CSV
          </Btn>
        </div>
      )}

      {/* ── Table ── */}
      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "var(--bg-secondary)" }}>
            <tr>
              <th style={{ padding: "11px 14px", width: 32 }}>
                <input
                  type="checkbox"
                  checked={
                    selected.size === filtered.length && filtered.length > 0
                  }
                  onChange={toggleAll}
                  style={{ cursor: "pointer", accentColor: "var(--accent)" }}
                />
              </th>
              {[
                "Invoice No.",
                "Customer",
                "Items",
                "Total Amount",
                "Paid",
                "Due",
                "Status",
                "Seller",
                "Date",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "11px 10px",
                    color: "var(--text-muted)",
                    fontSize: 9.5,
                    fontWeight: 700,
                    textAlign: "left",
                    letterSpacing: "0.07em",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: selected.has(s.id)
                    ? "rgba(172,82,8,0.06)"
                    : "transparent",
                  transition: "background .12s",
                }}
                onMouseEnter={(e) => {
                  if (!selected.has(s.id))
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
                onMouseLeave={(e) => {
                  if (!selected.has(s.id))
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "10px 14px" }}>
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggle(s.id)}
                    style={{ cursor: "pointer", accentColor: "var(--accent)" }}
                  />
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{
                      color: "var(--accent)",
                      fontWeight: 700,
                      fontSize: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    {s.inv}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ color: "var(--text-primary)", fontSize: 12 }}>
                    {s.customer}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <Badge color="accent" small>
                    {s.items} items
                  </Badge>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    ৳{s.total.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{
                      color: "var(--green)",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    ৳{s.paid.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{
                      color: s.due > 0 ? "#f87171" : "var(--text-muted)",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    ৳{s.due.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <StatusBadge status={s.status} />
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{ color: "var(--text-secondary)", fontSize: 11 }}
                  >
                    {s.seller}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{ color: "var(--text-secondary)", fontSize: 11 }}
                  >
                    {s.date}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button
                      title="View"
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: "rgba(96,165,250,0.1)",
                        border: "1px solid rgba(96,165,250,0.2)",
                        color: "#60a5fa",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all .15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(96,165,250,0.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(96,165,250,0.1)")
                      }
                    >
                      <Ic.Eye />
                    </button>
                    <button
                      title="Print"
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: "rgba(172,82,8,0.1)",
                        border: "1px solid rgba(172,82,8,0.2)",
                        color: "var(--accent)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all .15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(172,82,8,0.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(172,82,8,0.1)")
                      }
                    >
                      <Ic.Print />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
