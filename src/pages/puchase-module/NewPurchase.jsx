import { useState, useRef, useEffect } from "react";
import { T, card } from "../../theme/colors";
import { PRODUCTS } from "../../data/sampleData";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

/* ── Suppliers ─────────────────────────────────────────────────── */
const SUPPLIERS = [
  {
    id: 1,
    code: "SUP-001",
    name: "Teak Palace Suppliers",
    contact: "Rahim Uddin",
    phone: "01711-111222",
    email: "teak@supply.com",
    gst: "GST-001",
    terms: "Net 30",
    type: "Primary",
  },
  {
    id: 2,
    code: "SUP-002",
    name: "BambooCraft Wholesale",
    contact: "Karim Ahmed",
    phone: "01812-222333",
    email: "bamb@supply.com",
    gst: "GST-002",
    terms: "Net 15",
    type: "Regular",
  },
  {
    id: 3,
    code: "SUP-003",
    name: "Royal Wood Imports",
    contact: "Nazia Begum",
    phone: "01613-333444",
    email: "royal@supply.com",
    gst: "GST-003",
    terms: "Net 45",
    type: "Primary",
  },
  {
    id: 4,
    code: "SUP-004",
    name: "Dhaka Timber Co.",
    contact: "Selim Khan",
    phone: "01514-444555",
    email: "dhaka@supply.com",
    gst: "GST-004",
    terms: "Advance",
    type: "Occasional",
  },
  {
    id: 5,
    code: "SUP-005",
    name: "EcoFurn Materials",
    contact: "Parveen Sultana",
    phone: "01915-555666",
    email: "eco@supply.com",
    gst: "GST-005",
    terms: "Net 30",
    type: "Regular",
  },
];

/* ── PO Invoice Print Modal ─────────────────────────────────────── */
const POModal = ({ po, onClose }) => {
  const {
    items,
    supplier,
    discount,
    vat,
    paid,
    due,
    paymentType,
    orderedBy,
    storeName,
    orderDate,
    expectedDelivery,
    notes,
  } = po;
  const subtotal = items.reduce((s, i) => s + i.qtyOrdered * i.costPrice, 0);
  const discAmt =
    discount.type === "percentage"
      ? subtotal * (parseFloat(discount.value) / 100 || 0)
      : parseFloat(discount.value) || 0;
  const vatAmt = Math.round(
    (subtotal - discAmt) * (parseFloat(vat) / 100 || 0),
  );
  const netTotal = Math.round(subtotal - discAmt + vatAmt);
  const paidNum = parseFloat(paid) || 0;
  const change = paidNum > netTotal ? paidNum - netTotal : 0;
  const dueNum = paidNum < netTotal ? netTotal - paidNum : 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: 420,
          borderRadius: 14,
          overflow: "hidden",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg,#1a0d04,#7a3e10)",
            padding: "18px 22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  color: "#f5deb3",
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                }}
              >
                WoodCraft
              </div>
              <div
                style={{
                  color: "rgba(245,222,179,0.6)",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                FURNITURE SOLUTIONS
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  color: "rgba(245,222,179,0.7)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                PURCHASE ORDER
              </div>
              <div
                style={{
                  color: "#f5a623",
                  fontSize: 15,
                  fontWeight: 900,
                  fontFamily: "monospace",
                }}
              >
                {po.poNumber}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
              fontSize: 10.5,
            }}
          >
            {[
              ["Store", storeName],
              ["Order Date", orderDate],
              ["Supplier", supplier?.name || "—"],
              ["Expected Delivery", expectedDelivery || "—"],
              ["Contact", supplier?.phone || "—"],
              ["Ordered By", orderedBy],
            ].map(([l, v]) => (
              <div key={l}>
                <span
                  style={{ color: "rgba(245,222,179,0.55)", marginRight: 4 }}
                >
                  {l}:
                </span>
                <span style={{ color: "#f5deb3", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div style={{ padding: "16px 20px" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #2d1a08" }}>
                {["Product", "SKU", "Cost/Unit", "Qty", "Total"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "5px 4px",
                      textAlign: "left",
                      color: "#2d1a08",
                      fontWeight: 800,
                      fontSize: 10,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f0e8d8" }}>
                  <td
                    style={{
                      padding: "7px 4px",
                      color: "#1a0d05",
                      fontWeight: 600,
                    }}
                  >
                    {it.name}
                  </td>
                  <td
                    style={{
                      padding: "7px 4px",
                      color: "#8b5e3c",
                      fontSize: 10,
                      fontFamily: "monospace",
                    }}
                  >
                    {it.sku}
                  </td>
                  <td style={{ padding: "7px 4px", color: "#2d1a08" }}>
                    ৳{it.costPrice.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "7px 4px",
                      color: "#2d1a08",
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {it.qtyOrdered}
                  </td>
                  <td
                    style={{
                      padding: "7px 4px",
                      color: "#2d1a08",
                      fontWeight: 800,
                    }}
                  >
                    ৳{(it.qtyOrdered * it.costPrice).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div
            style={{
              marginTop: 14,
              borderTop: "2px solid #2d1a08",
              paddingTop: 10,
            }}
          >
            {[
              ["Subtotal", `৳${subtotal.toLocaleString()}`, "#2d1a08"],
              [
                "Discount",
                `-৳${Math.round(discAmt).toLocaleString()}`,
                "#b45309",
              ],
              [`VAT (${vat}%)`, `৳${vatAmt.toLocaleString()}`, "#1d4ed8"],
            ].map(([l, v, c]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "3px 0",
                  fontSize: 11.5,
                }}
              >
                <span style={{ color: "#6b4a2a" }}>{l}</span>
                <span style={{ color: c, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0 5px",
                borderTop: "1px dashed #c4a07a",
                marginTop: 6,
              }}
            >
              <span style={{ color: "#2d1a08", fontWeight: 900, fontSize: 14 }}>
                NET TOTAL
              </span>
              <span style={{ color: "#8b4513", fontWeight: 900, fontSize: 18 }}>
                ৳{netTotal.toLocaleString()}
              </span>
            </div>
            {[
              [
                "Payment Method",
                paymentType === "cash"
                  ? "Cash"
                  : paymentType === "bank_transfer"
                    ? "Bank Transfer"
                    : "Mixed",
                "#2d1a08",
              ],
              ["Paid Amount", `৳${paidNum.toLocaleString()}`, "#16a34a"],
              ...(change > 0
                ? [["Change", `৳${change.toLocaleString()}`, "#2563eb"]]
                : []),
              ...(dueNum > 0
                ? [["Due Amount", `৳${dueNum.toLocaleString()}`, "#dc2626"]]
                : []),
            ].map(([l, v, c]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "3px 0",
                  fontSize: 11.5,
                }}
              >
                <span style={{ color: "#6b4a2a" }}>{l}</span>
                <span style={{ color: c, fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>

          {notes && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: "#fdf6ed",
                borderRadius: 8,
                fontSize: 11,
                color: "#7a5030",
              }}
            >
              <strong>Notes: </strong>
              {notes}
            </div>
          )}

          <div
            style={{
              marginTop: 14,
              padding: "10px",
              background: "#fdf6ed",
              borderRadius: 8,
              textAlign: "center",
              fontSize: 10.5,
              color: "#8b5e3c",
            }}
          >
            Authorized Signature: ____________________
            <br />
            <span style={{ fontSize: 9.5, color: "#a07850" }}>
              WoodCraft Furniture — Purchase Department
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, padding: "0 20px 20px" }}>
          <button
            onClick={() => window.print()}
            style={{
              flex: 1,
              padding: "10px",
              background: "linear-gradient(135deg,#1a0d04,#8b4513)",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              fontWeight: 700,
              fontSize: 12.5,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            <Ic.Print /> Print PO
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              background: "#f0e8d8",
              color: "#2d1a08",
              border: "none",
              borderRadius: 9,
              fontWeight: 700,
              fontSize: 12.5,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Supplier Create Modal ───────────────────────────────────────── */
const SupplierModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    gst: "",
    terms: "Net 30",
    type: "Regular",
  });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
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
          width: 500,
          padding: "24px",
          boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
          animation: "slideUp .25s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                color: T.text,
                fontWeight: 900,
                fontSize: 16,
                margin: 0,
              }}
            >
              Add New Supplier
            </h3>
            <p style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}>
              Register a new supplier in the system
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textSub,
              padding: 4,
            }}
          >
            <Ic.Close />
          </button>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div style={{ gridColumn: "1/-1" }}>
            <Input
              label="Supplier / Company Name *"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Teak Palace Suppliers"
              icon={<Ic.Package />}
            />
          </div>
          <Input
            label="Contact Person"
            value={form.contact}
            onChange={set("contact")}
            placeholder="Contact name"
            icon={<Ic.User />}
          />
          <Input
            label="Phone *"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+880-1XXX-XXXXXX"
          />
          <Input
            label="Email"
            value={form.email}
            onChange={set("email")}
            placeholder="supplier@email.com"
            type="email"
          />
          <Input
            label="GST / Tax Number"
            value={form.gst}
            onChange={set("gst")}
            placeholder="GST-XXXX"
          />
          <Select
            label="Supplier Type"
            value={form.type}
            onChange={set("type")}
            options={["Primary", "Regular", "Occasional"]}
          />
          <Select
            label="Payment Terms"
            value={form.terms}
            onChange={set("terms")}
            options={["Advance", "Net 15", "Net 30", "Net 45", "Net 60"]}
          />
          <div style={{ gridColumn: "1/-1" }}>
            <Input
              label="Address"
              value={form.address}
              onChange={set("address")}
              placeholder="Full address"
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 9,
            marginTop: 20,
          }}
        >
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn
            onClick={() => {
              if (form.name && form.phone) {
                onSave({
                  ...form,
                  id: Date.now(),
                  code: `SUP-${String(Math.floor(Math.random() * 900) + 100)}`,
                });
                onClose();
              }
            }}
            disabled={!form.name || !form.phone}
          >
            <Ic.Check /> Save Supplier
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   NEW PURCHASE PAGE
════════════════════════════════════════════════════════════════ */
export default function NewPurchase() {
  /* ─ state ─ */
  const [productSearch, setProductSearch] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [selectedItems, setSelectedItems] = useState([
    {
      ...PRODUCTS[0],
      qtyOrdered: 10,
      qtyReceived: 0,
      costPrice: PRODUCTS[0].cost,
    },
    {
      ...PRODUCTS[2],
      qtyOrdered: 5,
      qtyReceived: 0,
      costPrice: PRODUCTS[2].cost,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [previewProduct, setPreviewProduct] = useState(selectedItems[0]);

  const [supplier, setSupplier] = useState(null);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [showSupplierDrop, setShowSupplierDrop] = useState(false);
  const [allSuppliers, setAllSuppliers] = useState(SUPPLIERS);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const [store, setStore] = useState("Main Store — Dhaka");
  const [orderedBy, setOrderedBy] = useState("Admin");
  const [orderDate, setOrderDate] = useState("2026-04-04");
  const [expectedDelivery, setExpectedDelivery] = useState("2026-04-11");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [notes, setNotes] = useState("");

  const [paymentType, setPaymentType] = useState("bank_transfer");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("0");
  const [vat, setVat] = useState("0");
  const [paidAmount, setPaidAmount] = useState("");

  const [showPO, setShowPO] = useState(false);
  const supplierDropRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (
        supplierDropRef.current &&
        !supplierDropRef.current.contains(e.target)
      )
        setShowSupplierDrop(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (selectedItems.length) setPreviewProduct(selectedItems[0]);
  }, [selectedItems]);

  /* ─ calculations ─ */
  const subtotal = selectedItems.reduce(
    (s, i) => s + i.qtyOrdered * i.costPrice,
    0,
  );
  const discAmt =
    discountType === "percentage"
      ? subtotal * (parseFloat(discountValue) / 100 || 0)
      : parseFloat(discountValue) || 0;
  const vatAmt = Math.round(
    (subtotal - discAmt) * (parseFloat(vat) / 100 || 0),
  );
  const netTotal = Math.round(subtotal - discAmt + vatAmt);
  const paid = parseFloat(paidAmount) || 0;
  const change = paid > netTotal ? paid - netTotal : 0;
  const due = paid < netTotal ? netTotal - paid : 0;
  const totalQty = selectedItems.reduce((s, i) => s + i.qtyOrdered, 0);

  /* ─ handlers ─ */
  const addProduct = (p) => {
    setSelectedItems((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      if (ex)
        return prev.map((i) =>
          i.id === p.id ? { ...i, qtyOrdered: i.qtyOrdered + 1 } : i,
        );
      return [
        ...prev,
        { ...p, qtyOrdered: 1, qtyReceived: 0, costPrice: p.cost },
      ];
    });
    setPreviewProduct(p);
    setShowProductSearch(false);
    setProductSearch("");
  };

  const updateField = (id, field, val) =>
    setSelectedItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: val } : i)),
    );
  const removeItem = (id) =>
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
  const removeSelected = () => {
    setSelectedItems((prev) => prev.filter((i) => !selectedRows.has(i.id)));
    setSelectedRows(new Set());
  };
  const toggleRow = (id) =>
    setSelectedRows((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelectedRows(
      selectedRows.size === selectedItems.length
        ? new Set()
        : new Set(selectedItems.map((i) => i.id)),
    );

  const filteredProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()),
  );
  const filteredSuppliers = allSuppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(supplierSearch.toLowerCase()),
  );

  const handleSave = () => {
    if (!selectedItems.length) return;
    if (!paidAmount) setPaidAmount("0");
    setShowPO(true);
  };

  const poData = {
    poNumber: `PO-${Date.now().toString().slice(-4)}`,
    items: selectedItems.map((i) => ({
      name: i.name,
      sku: i.sku,
      costPrice: i.costPrice,
      qtyOrdered: i.qtyOrdered,
    })),
    supplier,
    storeName: store,
    orderedBy,
    orderDate,
    expectedDelivery,
    notes,
    discount: { type: discountType, value: discountValue },
    vat: parseFloat(vat) || 0,
    paid: paidAmount,
    due,
    paymentType,
  };

  /* ─ styles ─ */
  const cardS = { ...card(), overflow: "hidden" };
  const sectionLabel = {
    color: T.textMut,
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: "0.09em",
    margin: "0 0 10px",
    textTransform: "uppercase",
  };
  const iconBtn = (color, bg) => ({
    width: 26,
    height: 26,
    borderRadius: 6,
    background: bg,
    border: `1px solid ${color}30`,
    color,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        height: "calc(100vh - 110px)",
        overflow: "hidden",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}`}</style>

      {/* ══════ LEFT — Items Panel ══════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Search bar */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: T.bg3,
                border: `1px solid ${showProductSearch ? T.gold : T.border}`,
                borderRadius: 10,
                padding: "0 14px",
                height: 40,
                transition: "border-color .15s",
                cursor: "text",
              }}
              onClick={() => setShowProductSearch(true)}
            >
              <span style={{ color: T.textMut, display: "flex" }}>
                <Ic.Search />
              </span>
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onFocus={() => setShowProductSearch(true)}
                placeholder="Search product to add to purchase order..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: T.text,
                  fontSize: 13,
                }}
              />
              <Badge color="blue" small>
                PO Items
              </Badge>
            </div>
            {showProductSearch && (
              <div
                style={{
                  position: "absolute",
                  top: 44,
                  left: 0,
                  right: 0,
                  zIndex: 60,
                  background: "#160e04",
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => addProduct(p)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 16px",
                      cursor: "pointer",
                      borderBottom: `1px solid ${T.border}`,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(139,90,43,0.12)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span style={{ fontSize: 26 }}>{p.img}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: T.text,
                          fontWeight: 600,
                          fontSize: 12.5,
                        }}
                      >
                        {p.name}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                        <span
                          style={{
                            color: T.gold,
                            fontSize: 10,
                            fontFamily: "monospace",
                          }}
                        >
                          {p.sku}
                        </span>
                        <span style={{ color: T.textMut, fontSize: 10 }}>
                          •
                        </span>
                        <span style={{ color: T.textSub, fontSize: 10 }}>
                          Current Stock: {p.stock}
                        </span>
                        <span style={{ color: T.textMut, fontSize: 10 }}>
                          •
                        </span>
                        <span style={{ color: T.textSub, fontSize: 10 }}>
                          {p.category}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          color: T.amber,
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        ৳{p.cost.toLocaleString()}
                      </div>
                      <div style={{ color: T.textSub, fontSize: 10 }}>
                        Cost price
                      </div>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div
                    style={{
                      padding: "20px",
                      color: T.textSub,
                      textAlign: "center",
                      fontSize: 12.5,
                    }}
                  >
                    No products found
                  </div>
                )}
                <div
                  style={{
                    padding: "8px 16px",
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  <button
                    onClick={() => setShowProductSearch(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: T.textSub,
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    ← Close search
                  </button>
                </div>
              </div>
            )}
          </div>
          {selectedRows.size > 0 && (
            <Btn variant="danger" size="sm" onClick={removeSelected}>
              <Ic.Trash /> Remove {selectedRows.size}
            </Btn>
          )}
        </div>

        {/* Items table */}
        <div
          style={{
            ...cardS,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3
                style={{
                  color: T.text,
                  fontWeight: 800,
                  fontSize: 13.5,
                  margin: 0,
                }}
              >
                Purchase Order Items
              </h3>
              {selectedItems.length > 0 && (
                <Badge color="blue" small>
                  {selectedItems.length} products • {totalQty} total units
                </Badge>
              )}
            </div>
            {selectedRows.size > 0 && (
              <Badge color="yellow" small>
                {selectedRows.size} selected
              </Badge>
            )}
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#3a2010 transparent",
            }}
          >
            {selectedItems.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 14,
                  padding: 48,
                }}
              >
                <div style={{ fontSize: 64, opacity: 0.6 }}>📦</div>
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      color: T.textSub,
                      fontSize: 14,
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    No items in this purchase order
                  </p>
                  <p
                    style={{
                      color: T.textMut,
                      fontSize: 12,
                      margin: "5px 0 0",
                    }}
                  >
                    Search and add products above to create your PO
                  </p>
                </div>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    background: T.bg2,
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th style={{ padding: "10px 14px", width: 34 }}>
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.size === selectedItems.length &&
                          selectedItems.length > 0
                        }
                        onChange={toggleAll}
                        style={{ cursor: "pointer", accentColor: T.gold }}
                      />
                    </th>
                    {[
                      "Product Name",
                      "SKU Code",
                      "Cost Price",
                      "Qty Ordered",
                      "Qty Received",
                      "Item Total",
                      "",
                    ].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "10px 10px",
                          color: T.textMut,
                          fontSize: 9.5,
                          fontWeight: 700,
                          textAlign: "left",
                          letterSpacing: "0.07em",
                          borderBottom: `1px solid ${T.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item) => {
                    const isSel = selectedRows.has(item.id);
                    const isPrev = previewProduct?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setPreviewProduct(item)}
                        style={{
                          borderBottom: `1px solid ${T.border}`,
                          background: isSel
                            ? "rgba(96,165,250,0.06)"
                            : isPrev
                              ? "rgba(139,90,43,0.05)"
                              : "transparent",
                          cursor: "pointer",
                          transition: "background .12s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSel && !isPrev)
                            e.currentTarget.style.background =
                              "rgba(139,90,43,0.04)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSel && !isPrev)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <td style={{ padding: "10px 14px" }}>
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => toggleRow(item.id)}
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: "pointer", accentColor: T.gold }}
                          />
                        </td>
                        {/* Product */}
                        <td style={{ padding: "10px 10px" }}>
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
                              {item.img}
                            </div>
                            <div>
                              <div
                                style={{
                                  color: T.text,
                                  fontWeight: 700,
                                  fontSize: 12,
                                }}
                              >
                                {item.name}
                              </div>
                              <div style={{ color: T.textSub, fontSize: 10 }}>
                                {item.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* SKU */}
                        <td style={{ padding: "10px 10px" }}>
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
                            {item.sku}
                          </span>
                        </td>
                        {/* Cost price editable */}
                        <td
                          style={{ padding: "10px 10px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <span style={{ color: T.textMut, fontSize: 11 }}>
                              ৳
                            </span>
                            <input
                              value={item.costPrice}
                              type="number"
                              min="0"
                              onChange={(e) =>
                                updateField(
                                  item.id,
                                  "costPrice",
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              style={{
                                width: 80,
                                background: T.bg3,
                                border: `1px solid ${T.border}`,
                                borderRadius: 7,
                                padding: "5px 8px",
                                color: T.amber,
                                fontSize: 12,
                                fontWeight: 700,
                                outline: "none",
                                textAlign: "right",
                              }}
                              onFocus={(e) =>
                                (e.target.style.borderColor = T.gold)
                              }
                              onBlur={(e) =>
                                (e.target.style.borderColor = T.border)
                              }
                            />
                          </div>
                        </td>
                        {/* Qty Ordered */}
                        <td
                          style={{ padding: "10px 10px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <button
                              onClick={() =>
                                updateField(
                                  item.id,
                                  "qtyOrdered",
                                  Math.max(1, item.qtyOrdered - 1),
                                )
                              }
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                background: "rgba(139,90,43,0.18)",
                                border: "none",
                                color: T.gold,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Ic.Minus />
                            </button>
                            <input
                              value={item.qtyOrdered}
                              type="number"
                              min="1"
                              onChange={(e) =>
                                updateField(
                                  item.id,
                                  "qtyOrdered",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              style={{
                                width: 42,
                                textAlign: "center",
                                background: T.bg3,
                                border: `1px solid ${T.border}`,
                                borderRadius: 7,
                                color: T.text,
                                fontSize: 12.5,
                                fontWeight: 800,
                                padding: "3px",
                                outline: "none",
                              }}
                            />
                            <button
                              onClick={() =>
                                updateField(
                                  item.id,
                                  "qtyOrdered",
                                  item.qtyOrdered + 1,
                                )
                              }
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                background: "rgba(139,90,43,0.18)",
                                border: "none",
                                color: T.gold,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Ic.Plus />
                            </button>
                          </div>
                        </td>
                        {/* Qty Received */}
                        <td
                          style={{ padding: "10px 10px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            value={item.qtyReceived}
                            type="number"
                            min="0"
                            max={item.qtyOrdered}
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "qtyReceived",
                                Math.min(
                                  parseInt(e.target.value) || 0,
                                  item.qtyOrdered,
                                ),
                              )
                            }
                            style={{
                              width: 52,
                              textAlign: "center",
                              background: T.bg3,
                              border: `1px solid rgba(74,222,128,0.2)`,
                              borderRadius: 7,
                              color:
                                item.qtyReceived >= item.qtyOrdered
                                  ? T.green
                                  : T.textSub,
                              fontSize: 12,
                              fontWeight: 700,
                              padding: "5px",
                              outline: "none",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = T.green)
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor =
                                "rgba(74,222,128,0.2)")
                            }
                          />
                        </td>
                        {/* Item total */}
                        <td style={{ padding: "10px 10px" }}>
                          <span
                            style={{
                              color: T.text,
                              fontWeight: 800,
                              fontSize: 13,
                            }}
                          >
                            ৳
                            {(
                              item.qtyOrdered * item.costPrice
                            ).toLocaleString()}
                          </span>
                        </td>
                        {/* Delete */}
                        <td style={{ padding: "10px 10px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(item.id);
                            }}
                            style={iconBtn(
                              `${T.red}`,
                              "rgba(248,113,113,0.08)",
                            )}
                          >
                            <Ic.Trash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Footer totals */}
                <tfoot style={{ background: T.bg2 }}>
                  <tr>
                    <td colSpan={3} />
                    <td style={{ padding: "10px 10px" }}>
                      <span
                        style={{
                          color: T.textSub,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.07em",
                        }}
                      >
                        TOTAL UNITS
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px" }}>
                      <span
                        style={{ color: T.blue, fontWeight: 900, fontSize: 14 }}
                      >
                        {totalQty}
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px" }} />
                    <td style={{ padding: "10px 10px" }}>
                      <span
                        style={{
                          color: T.amber,
                          fontWeight: 900,
                          fontSize: 14,
                        }}
                      >
                        ৳{subtotal.toLocaleString()}
                      </span>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ══════ RIGHT — Config Panel ══════ */}
      <div
        style={{
          width: 332,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflow: "hidden",
        }}
      >
        {/* Product Preview */}
        {previewProduct && (
          <div style={{ ...card(), padding: "13px 14px", flexShrink: 0 }}>
            <p style={sectionLabel}>Selected Item Preview</p>
            <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 11,
                  background:
                    "linear-gradient(135deg,rgba(139,90,43,0.22),rgba(205,133,63,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  flexShrink: 0,
                  border: `1px solid ${T.border}`,
                }}
              >
                {previewProduct.img}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    color: T.text,
                    fontWeight: 700,
                    fontSize: 12.5,
                    margin: "0 0 4px",
                    lineHeight: 1.2,
                  }}
                >
                  {previewProduct.name}
                </p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  <Badge color="gold" small>
                    {previewProduct.sku}
                  </Badge>
                  <Badge color="purple" small>
                    {previewProduct.category}
                  </Badge>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 7 }}>
                  <div>
                    <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                      COST PRICE
                    </p>
                    <p
                      style={{
                        color: T.amber,
                        fontWeight: 900,
                        fontSize: 14,
                        margin: 0,
                      }}
                    >
                      ৳{previewProduct.costPrice ?? previewProduct.cost}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                      IN STOCK
                    </p>
                    <p
                      style={{
                        color: previewProduct.stock <= 4 ? T.red : T.green,
                        fontWeight: 900,
                        fontSize: 14,
                        margin: 0,
                      }}
                    >
                      {previewProduct.stock}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                      SELL PRICE
                    </p>
                    <p
                      style={{
                        color: T.blue,
                        fontWeight: 900,
                        fontSize: 14,
                        margin: 0,
                      }}
                    >
                      ৳{previewProduct.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable section */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            scrollbarWidth: "thin",
            scrollbarColor: "#3a2010 transparent",
          }}
        >
          {/* Supplier */}
          <div style={{ ...card(), padding: "12px 14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <p style={sectionLabel}>Supplier</p>
              <button
                onClick={() => setShowSupplierModal(true)}
                style={{
                  background: "rgba(96,165,250,0.1)",
                  border: "1px solid rgba(96,165,250,0.25)",
                  color: T.blue,
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                  cursor: "pointer",
                }}
              >
                + New Supplier
              </button>
            </div>
            {supplier ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 11px",
                  background: "rgba(74,222,128,0.06)",
                  borderRadius: 9,
                  border: "1px solid rgba(74,222,128,0.18)",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {supplier.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: T.text,
                      fontWeight: 700,
                      fontSize: 12,
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {supplier.name}
                  </p>
                  <p style={{ color: T.textSub, fontSize: 10, margin: 0 }}>
                    {supplier.phone} • {supplier.terms}
                  </p>
                </div>
                <button
                  onClick={() => setSupplier(null)}
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
            ) : (
              <div ref={supplierDropRef} style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: T.bg3,
                    border: `1px solid ${showSupplierDrop ? T.gold : T.border}`,
                    borderRadius: 8,
                    padding: "8px 11px",
                    transition: "border-color .15s",
                  }}
                >
                  <span style={{ color: T.textMut, display: "flex" }}>
                    <Ic.Package />
                  </span>
                  <input
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                    onFocus={() => setShowSupplierDrop(true)}
                    placeholder="Search supplier..."
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: T.text,
                      fontSize: 12,
                    }}
                  />
                </div>
                {showSupplierDrop && (
                  <div
                    style={{
                      position: "absolute",
                      top: 40,
                      left: 0,
                      right: 0,
                      background: "#160e04",
                      border: `1px solid ${T.border}`,
                      borderRadius: 9,
                      zIndex: 55,
                      maxHeight: 210,
                      overflowY: "auto",
                      boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
                    }}
                  >
                    {filteredSuppliers.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSupplier(s);
                          setShowSupplierDrop(false);
                          setSupplierSearch("");
                        }}
                        style={{
                          padding: "9px 13px",
                          cursor: "pointer",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(139,90,43,0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <div
                          style={{
                            color: T.text,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {s.name}
                        </div>
                        <div style={{ color: T.textSub, fontSize: 10 }}>
                          {s.code} • {s.contact} • {s.terms}
                        </div>
                      </div>
                    ))}
                    {filteredSuppliers.length === 0 && (
                      <div
                        style={{
                          padding: "14px",
                          color: T.textSub,
                          textAlign: "center",
                          fontSize: 12,
                        }}
                      >
                        No suppliers found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PO Details */}
          <div style={{ ...card(), padding: "12px 14px" }}>
            <p style={sectionLabel}>Purchase Order Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Select
                label="Store"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                options={[
                  "Main Store — Dhaka",
                  "Branch — Chittagong",
                  "Branch — Sylhet",
                ]}
              />
              <Select
                label="Ordered By"
                value={orderedBy}
                onChange={(e) => setOrderedBy(e.target.value)}
                options={["Admin", "Manager", "Procurement Officer"]}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <Input
                  label="Order Date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  type="date"
                />
                <Input
                  label="Expected Delivery"
                  value={expectedDelivery}
                  onChange={(e) => setExpectedDelivery(e.target.value)}
                  type="date"
                />
              </div>
              <Select
                label="Payment Terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                options={["Advance", "Net 15", "Net 30", "Net 45", "Net 60"]}
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
                  NOTES / REMARKS
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Special instructions for this PO..."
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
          </div>

          {/* Payment */}
          <div style={{ ...card(), padding: "12px 14px" }}>
            <p style={sectionLabel}>Payment & Discounts</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {/* Payment type */}
              <div>
                <label
                  style={{
                    color: T.textSub,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  PAYMENT METHOD
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    ["cash", "💵 Cash"],
                    ["bank_transfer", "🏦 Bank"],
                    ["mixed", "⚡ Mixed"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => setPaymentType(val)}
                      style={{
                        flex: 1,
                        padding: "7px 4px",
                        borderRadius: 7,
                        cursor: "pointer",
                        fontSize: 10.5,
                        fontWeight: 700,
                        background:
                          paymentType === val
                            ? "linear-gradient(135deg,#1d4ed8,#1e3a8a)"
                            : "rgba(96,165,250,0.08)",
                        border: `1px solid ${paymentType === val ? "transparent" : "rgba(96,165,250,0.2)"}`,
                        color: paymentType === val ? "#fff" : T.blue,
                        transition: "all .15s",
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              {/* Discount */}
              <div>
                <label
                  style={{
                    color: T.textSub,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  DISCOUNT
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    style={{
                      background: T.bg3,
                      border: `1px solid ${T.border}`,
                      borderRadius: 7,
                      padding: "7px 8px",
                      color: T.text,
                      fontSize: 11,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="percentage" style={{ background: T.bg3 }}>
                      %
                    </option>
                    <option value="fixed" style={{ background: T.bg3 }}>
                      ৳ Fixed
                    </option>
                  </select>
                  <input
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    type="number"
                    min="0"
                    style={{
                      flex: 1,
                      background: T.bg3,
                      border: `1px solid ${T.border}`,
                      borderRadius: 7,
                      padding: "7px 10px",
                      color: T.yellow,
                      fontSize: 13,
                      fontWeight: 700,
                      outline: "none",
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      color: T.textSub,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    VAT (%)
                  </label>
                  <input
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                    type="number"
                    min="0"
                    style={{
                      width: "100%",
                      background: T.bg3,
                      border: `1px solid ${T.border}`,
                      borderRadius: 7,
                      padding: "7px 10px",
                      color: T.text,
                      fontSize: 12,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      color: T.textSub,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    ADVANCE PAID (৳)
                  </label>
                  <input
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    type="number"
                    min="0"
                    placeholder="0"
                    style={{
                      width: "100%",
                      background: T.bg3,
                      border: "1px solid rgba(74,222,128,0.3)",
                      borderRadius: 7,
                      padding: "7px 10px",
                      color: T.green,
                      fontSize: 12,
                      fontWeight: 700,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div
            style={{
              ...card(),
              padding: "12px 14px",
              background: "linear-gradient(135deg,#1a1208,#251a09)",
            }}
          >
            <p style={sectionLabel}>Order Summary</p>
            {[
              ["Subtotal", `৳${subtotal.toLocaleString()}`, T.text],
              [
                "Discount",
                `-৳${Math.round(discAmt).toLocaleString()}`,
                T.yellow,
              ],
              [`VAT (${vat || 0}%)`, `৳${vatAmt.toLocaleString()}`, T.blue],
            ].map(([l, v, c]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 0",
                }}
              >
                <span style={{ color: T.textSub, fontSize: 12 }}>{l}</span>
                <span style={{ color: c, fontWeight: 600, fontSize: 12 }}>
                  {v}
                </span>
              </div>
            ))}
            <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 0",
              }}
            >
              <span style={{ color: T.text, fontWeight: 900, fontSize: 14.5 }}>
                NET TOTAL
              </span>
              <span style={{ color: T.amber, fontWeight: 900, fontSize: 19 }}>
                ৳{netTotal.toLocaleString()}
              </span>
            </div>
            <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
            {[
              ["Total Units", String(totalQty), T.text],
              ["Advance Paid", `৳${paid.toLocaleString()}`, T.green],
              ...(change > 0
                ? [["Change", `৳${change.toLocaleString()}`, T.blue]]
                : []),
              ...(due > 0
                ? [["Balance Due", `৳${due.toLocaleString()}`, T.red]]
                : []),
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
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 7,
            flexShrink: 0,
          }}
        >
          <Btn
            onClick={handleSave}
            disabled={!selectedItems.length}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "11px",
              fontSize: 13,
              borderRadius: 10,
            }}
          >
            <Ic.Receipt /> Generate PO & Save
          </Btn>
          <div style={{ display: "flex", gap: 7 }}>
            <Btn
              variant="ghost"
              style={{ flex: 1, justifyContent: "center", padding: "9px" }}
            >
              <Ic.Print /> Preview
            </Btn>
            <Btn
              variant="danger"
              style={{ flex: 1, justifyContent: "center", padding: "9px" }}
              onClick={() => {
                setSelectedItems([]);
                setSupplier(null);
                setPaidAmount("");
                setSelectedRows(new Set());
              }}
            >
              <Ic.Close /> Cancel
            </Btn>
          </div>
        </div>
      </div>

      {showSupplierModal && (
        <SupplierModal
          onClose={() => setShowSupplierModal(false)}
          onSave={(s) => {
            setAllSuppliers((p) => [...p, s]);
            setSupplier(s);
          }}
        />
      )}
      {showPO && <POModal po={poData} onClose={() => setShowPO(false)} />}
    </div>
  );
}
