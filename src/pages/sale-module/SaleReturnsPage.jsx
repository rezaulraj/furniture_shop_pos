import { useState } from "react";
import { card, T } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { RETURNS } from "../../data/sampleData";

export default function SaleReturnsPage() {
  const [selected, setSelected] = useState(new Set());
  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === RETURNS.length
        ? new Set()
        : new Set(RETURNS.map((r) => r.id)),
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          { label: "Total Returns", value: RETURNS.length, color: T.amber },
          {
            label: "Refund Amount",
            value: `৳${RETURNS.reduce((a, r) => a + r.amount, 0).toLocaleString()}`,
            color: T.red,
          },
          {
            label: "Approved",
            value: RETURNS.filter((r) => r.status === "approved").length,
            color: T.yellow,
          },
          {
            label: "Completed",
            value: RETURNS.filter((r) => r.status === "completed").length,
            color: T.green,
          },
        ].map((k, i) => (
          <div key={i} style={{ ...card(), padding: "14px 16px" }}>
            <p style={{ color: T.textSub, fontSize: 10, margin: 0 }}>
              {k.label}
            </p>
            <p
              style={{
                color: k.color,
                fontSize: 20,
                fontWeight: 800,
                margin: "4px 0 0",
              }}
            >
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "10px 16px",
            background: "rgba(205,133,63,0.08)",
            borderColor: "rgba(205,133,63,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Badge color="gold">{selected.size} selected</Badge>
          <div style={{ flex: 1 }} />
          <Btn variant="success" size="sm">
            <Ic.Check /> Bulk Approve
          </Btn>
          <Btn variant="danger" size="sm">
            <Ic.Close /> Bulk Reject
          </Btn>
        </div>
      )}

      <div style={{ ...card(), overflow: "hidden" }}>
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{ color: T.text, fontWeight: 700, fontSize: 13, margin: 0 }}
          >
            Sale Returns
          </h3>
          <Btn size="sm">
            <Ic.Plus /> New Return
          </Btn>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              <th style={{ padding: "11px 14px", width: 32 }}>
                <input
                  type="checkbox"
                  checked={selected.size === RETURNS.length}
                  onChange={toggleAll}
                  style={{ cursor: "pointer", accentColor: T.gold }}
                />
              </th>
              {[
                "Return ID",
                "Invoice",
                "Customer",
                "Product",
                "Qty",
                "Refund",
                "Reason",
                "Status",
                "Date",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "11px 10px",
                    color: T.textMut,
                    fontSize: 9.5,
                    fontWeight: 600,
                    textAlign: "left",
                    letterSpacing: "0.07em",
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RETURNS.map((r) => (
              <tr
                key={r.id}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  background: selected.has(r.id)
                    ? "rgba(205,133,63,0.06)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!selected.has(r.id))
                    e.currentTarget.style.background = "rgba(139,90,43,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!selected.has(r.id))
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "10px 14px" }}>
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                    style={{ cursor: "pointer", accentColor: T.gold }}
                  />
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{
                      color: T.red,
                      fontWeight: 700,
                      fontSize: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    {r.ret}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ color: T.gold, fontSize: 11 }}>{r.inv}</span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ color: T.text, fontSize: 12 }}>
                    {r.customer}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ color: T.text, fontSize: 11 }}>
                    {r.product}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <Badge color="yellow" small>
                    {r.qty} unit{r.qty > 1 ? "s" : ""}
                  </Badge>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ color: T.red, fontWeight: 700, fontSize: 12 }}>
                    ৳{r.amount.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ color: T.textSub, fontSize: 11 }}>
                    {r.reason}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <StatusBadge status={r.status} />
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ color: T.textSub, fontSize: 11 }}>
                    {r.date}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {r.status === "pending" && (
                      <>
                        <button
                          title="Approve"
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 6,
                            background: "rgba(74,222,128,0.1)",
                            border: "1px solid rgba(74,222,128,0.2)",
                            color: T.green,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ic.Check />
                        </button>
                        <button
                          title="Reject"
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 6,
                            background: "rgba(248,113,113,0.1)",
                            border: "1px solid rgba(248,113,113,0.2)",
                            color: T.red,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ic.Close />
                        </button>
                      </>
                    )}
                    <button
                      title="View"
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
