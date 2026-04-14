import { useState, useRef, useEffect } from "react";
import { card, T } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Input, Select } from "../../components/Input";
import { Ic } from "../../components/Icons";
import { PRODUCTS, CUSTOMERS } from "../../data/sampleData";
import CustomerModal from "../../components/CustomerModal";
import InvoiceModal from "../../components/InvoiceModal";

/* ── tiny animation helper ── */
const fadeUp = {
  animation: "slideUp 0.22s cubic-bezier(0.16,1,0.3,1) both",
};

export default function NewSalePage() {
  const [productSearch, setProductSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([
    { ...PRODUCTS[0], qty: 2 },
    { ...PRODUCTS[1], qty: 1 },
  ]);
  const [customer, setCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [allCustomers, setAllCustomers] = useState(CUSTOMERS);
  const [paymentType, setPaymentType] = useState("cash");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("0");
  const [vat, setVat] = useState("5");
  const [paidAmount, setPaidAmount] = useState("");
  const [seller, setSeller] = useState("Admin");
  const [store, setStore] = useState("Main Store — Dhaka");
  const [saleDate, setSaleDate] = useState("2026-04-04");
  const [notes, setNotes] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(selectedItems[0]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const customerDropRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (
        customerDropRef.current &&
        !customerDropRef.current.contains(e.target)
      )
        setShowCustomerDropdown(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (selectedItems.length > 0) setPreviewProduct(selectedItems[0]);
  }, [selectedItems]);

  const subtotal = selectedItems.reduce((s, i) => s + i.qty * i.price, 0);
  const discAmt =
    discountType === "percentage"
      ? subtotal * (parseFloat(discountValue) / 100)
      : parseFloat(discountValue) || 0;
  const vatAmt = Math.round((subtotal - discAmt) * (parseFloat(vat) / 100));
  const netTotal = Math.round(subtotal - discAmt + vatAmt);
  const paid = parseFloat(paidAmount) || 0;
  const change = paid > netTotal ? paid - netTotal : 0;
  const due = paid < netTotal ? netTotal - paid : 0;
  const totalQty = selectedItems.reduce((s, i) => s + i.qty, 0);

  const addProduct = (p) => {
    setSelectedItems((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      if (ex)
        return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
    setPreviewProduct(p);
    setShowProductSearch(false);
    setProductSearch("");
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setSelectedItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i)),
    );
  };

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
  const toggleAll = () => {
    if (selectedRows.size === selectedItems.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(selectedItems.map((i) => i.id)));
  };

  const filteredProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const filteredCustomers = allCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.code.toLowerCase().includes(customerSearch.toLowerCase()),
  );

  const handleSave = () => {
    if (!selectedItems.length) return;
    setPaidAmount(String(netTotal));
    setShowInvoice(true);
  };

  const saleData = {
    invoiceNo: `INV-${Date.now().toString().slice(-4)}`,
    items: selectedItems.map((i) => ({
      name: i.name,
      sku: i.sku,
      price: i.price,
      qty: i.qty,
    })),
    customer,
    storeName: store,
    seller,
    date: saleDate,
    discount: { type: discountType, value: discountValue },
    vat: parseFloat(vat),
    paid,
    due,
    paymentType:
      paymentType === "cash"
        ? "Cash"
        : paymentType === "bank_transfer"
          ? "Bank Transfer"
          : "Mixed",
  };

  /* ── shared inline styles ── */
  const qtyBtn = {
    width: 24,
    height: 24,
    borderRadius: 6,
    background: "rgba(172,82,8,0.15)",
    border: "1px solid rgba(172,82,8,0.25)",
    color: "var(--accent)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .15s",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        height: "calc(100vh - 110px)",
        overflow: "hidden",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* ══ LEFT COLUMN ══════════════════════════════════════════ */}
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
        {/* Product search bar */}
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
                gap: 8,
                background: "var(--surface)",
                border: `1px solid ${showProductSearch ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 9,
                padding: "0 12px",
                height: 40,
                transition: "border-color .15s, box-shadow .15s",
                boxShadow: showProductSearch
                  ? "0 0 0 3px rgba(172,82,8,0.12)"
                  : "none",
                cursor: "pointer",
              }}
              onClick={() => setShowProductSearch(true)}
            >
              <span style={{ color: "var(--text-muted)" }}>
                <Ic.Search />
              </span>
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onFocus={() => setShowProductSearch(true)}
                placeholder="Search product by name or SKU code..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 12.5,
                  fontFamily: "'Open Sans', sans-serif",
                }}
              />
              <kbd
                style={{
                  fontSize: 9,
                  color: "var(--text-muted)",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "2px 6px",
                  letterSpacing: "0.05em",
                }}
              >
                ⌘K
              </kbd>
            </div>

            {showProductSearch && (
              <div
                style={{
                  ...fadeUp,
                  position: "absolute",
                  top: 44,
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  boxShadow: "0 20px 60px rgba(4,13,28,0.6)",
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
                      gap: 10,
                      padding: "10px 14px",
                      cursor: "pointer",
                      borderBottom: "1px solid var(--border)",
                      transition: "background .12s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(172,82,8,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span style={{ fontSize: 24 }}>{p.img}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {p.name}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span
                          style={{
                            color: "var(--accent)",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          {p.sku}
                        </span>
                        <span
                          style={{ color: "var(--text-muted)", fontSize: 10 }}
                        >
                          • Stock: {p.stock}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          color: "var(--green)",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        ৳{p.price.toLocaleString()}
                      </div>
                      <Badge
                        small
                        color={
                          p.stock <= 3
                            ? "red"
                            : p.stock <= 6
                              ? "yellow"
                              : "green"
                        }
                      >
                        {p.stock <= 3 ? "Low" : "In Stock"}
                      </Badge>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div
                    style={{
                      padding: 20,
                      color: "var(--text-muted)",
                      textAlign: "center",
                      fontSize: 12,
                    }}
                  >
                    No products found
                  </div>
                )}
                <div
                  style={{
                    padding: "8px 14px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <button
                    onClick={() => setShowProductSearch(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    ← Close
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

        {/* Items table card */}
        <div
          style={{
            ...card(),
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Table header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: 13,
                  margin: 0,
                }}
              >
                Sale Items
              </h3>
              {selectedItems.length > 0 && (
                <Badge color="green" small>
                  {selectedItems.length} products • {totalQty} qty
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
              scrollbarColor: "rgba(172,82,8,0.3) transparent",
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
                  gap: 12,
                  padding: 40,
                }}
              >
                <span style={{ fontSize: 48 }}>🛒</span>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 13,
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  No items added yet.
                  <br />
                  Search products above to add them to the sale.
                </p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "var(--bg-secondary)",
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th style={{ padding: "10px 14px", width: 32 }}>
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.size === selectedItems.length &&
                          selectedItems.length > 0
                        }
                        onChange={toggleAll}
                        style={{
                          cursor: "pointer",
                          accentColor: "var(--accent)",
                        }}
                      />
                    </th>
                    {[
                      "Product Name",
                      "SKU Code",
                      "Sale Price",
                      "Quantity",
                      "Item Total",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 10px",
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
                    <th style={{ padding: "10px 10px", width: 40 }} />
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item) => {
                    const isSelected = selectedRows.has(item.id);
                    const isPreview = previewProduct?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setPreviewProduct(item)}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          background: isSelected
                            ? "rgba(172,82,8,0.08)"
                            : isPreview
                              ? "rgba(34,197,94,0.05)"
                              : "transparent",
                          cursor: "pointer",
                          transition: "background .12s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected && !isPreview)
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.02)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected && !isPreview)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <td style={{ padding: "10px 14px" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(item.id)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              cursor: "pointer",
                              accentColor: "var(--accent)",
                            }}
                          />
                        </td>
                        <td style={{ padding: "10px 10px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 9,
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: "rgba(34,197,94,0.08)",
                                border: "1px solid rgba(34,197,94,0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                flexShrink: 0,
                              }}
                            >
                              {item.img}
                            </div>
                            <div>
                              <div
                                style={{
                                  color: "var(--text-primary)",
                                  fontWeight: 600,
                                  fontSize: 12,
                                  lineHeight: 1.2,
                                }}
                              >
                                {item.name}
                              </div>
                              <div
                                style={{
                                  color: "var(--text-muted)",
                                  fontSize: 10,
                                }}
                              >
                                {item.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "10px 10px" }}>
                          <span
                            style={{
                              color: "var(--accent)",
                              fontWeight: 700,
                              fontSize: 11,
                              fontFamily: "monospace",
                            }}
                          >
                            {item.sku}
                          </span>
                        </td>
                        <td style={{ padding: "10px 10px" }}>
                          <span
                            style={{
                              color: "var(--green)",
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            ৳{item.price.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: "10px 10px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQty(item.id, item.qty - 1);
                              }}
                              style={qtyBtn}
                            >
                              <Ic.Minus />
                            </button>
                            <input
                              value={item.qty}
                              onChange={(e) =>
                                updateQty(
                                  item.id,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: 38,
                                textAlign: "center",
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border)",
                                borderRadius: 6,
                                color: "var(--text-primary)",
                                fontSize: 12,
                                fontWeight: 700,
                                padding: "3px 4px",
                                outline: "none",
                              }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQty(item.id, item.qty + 1);
                              }}
                              style={qtyBtn}
                            >
                              <Ic.Plus />
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: "10px 10px" }}>
                          <span
                            style={{
                              color: "var(--text-primary)",
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            ৳{(item.qty * item.price).toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: "10px 10px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(item.id);
                            }}
                            style={{
                              background: "rgba(248,113,113,0.08)",
                              border: "1px solid rgba(248,113,113,0.2)",
                              color: "#f87171",
                              borderRadius: 6,
                              width: 26,
                              height: 26,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all .15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                "rgba(248,113,113,0.18)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background =
                                "rgba(248,113,113,0.08)")
                            }
                          >
                            <Ic.Trash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot style={{ background: "var(--bg-secondary)" }}>
                  <tr>
                    <td colSpan={2} />
                    <td style={{ padding: "10px 10px" }}>
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                        }}
                      >
                        TOTAL QTY
                      </span>
                    </td>
                    <td />
                    <td style={{ padding: "10px 10px" }}>
                      <span
                        style={{
                          color: "var(--green)",
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        {totalQty}
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px" }}>
                      <span
                        style={{
                          color: "var(--green)",
                          fontWeight: 800,
                          fontSize: 13,
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

      {/* ══ RIGHT PANEL ══════════════════════════════════════════ */}
      <div
        style={{
          width: 330,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflow: "hidden",
        }}
      >
        {/* Product preview */}
        {previewProduct && (
          <div style={{ ...card(), padding: 14, flexShrink: 0 }}>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                margin: "0 0 8px",
              }}
            >
              SELECTED ITEM PREVIEW
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  flexShrink: 0,
                }}
              >
                {previewProduct.img}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: 12.5,
                    margin: "0 0 4px",
                    lineHeight: 1.2,
                  }}
                >
                  {previewProduct.name}
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge color="accent" small>
                    {previewProduct.sku}
                  </Badge>
                  <Badge color="blue" small>
                    {previewProduct.category}
                  </Badge>
                </div>
                <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                  <div>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: 9,
                        margin: 0,
                        fontWeight: 600,
                        letterSpacing: "0.07em",
                      }}
                    >
                      SELL PRICE
                    </p>
                    <p
                      style={{
                        color: "var(--green)",
                        fontWeight: 800,
                        fontSize: 13,
                        margin: 0,
                      }}
                    >
                      ৳{previewProduct.price.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: 9,
                        margin: 0,
                        fontWeight: 600,
                        letterSpacing: "0.07em",
                      }}
                    >
                      STOCK
                    </p>
                    <p
                      style={{
                        color:
                          previewProduct.stock <= 4
                            ? "#f87171"
                            : "var(--green)",
                        fontWeight: 800,
                        fontSize: 13,
                        margin: 0,
                      }}
                    >
                      {previewProduct.stock}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable right panels */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(172,82,8,0.3) transparent",
          }}
        >
          {/* Customer */}
          <div style={{ ...card(), padding: "12px 14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  margin: 0,
                }}
              >
                CUSTOMER
              </p>
              <button
                onClick={() => setShowCustomerModal(true)}
                style={{
                  background: "rgba(96,165,250,0.1)",
                  border: "1px solid rgba(96,165,250,0.22)",
                  color: "#60a5fa",
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 20,
                  cursor: "pointer",
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                + New Customer
              </button>
            </div>
            {customer ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "8px 10px",
                  background: "rgba(34,197,94,0.07)",
                  borderRadius: 8,
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(135deg,var(--accent),#7a3a06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  {customer.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: 11.5,
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {customer.name}
                  </p>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 10,
                      margin: 0,
                    }}
                  >
                    {customer.phone} • {customer.type}
                  </p>
                </div>
                <button
                  onClick={() => setCustomer(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                  }}
                >
                  <Ic.Close />
                </button>
              </div>
            ) : (
              <div ref={customerDropRef} style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "var(--bg-secondary)",
                    border: `1px solid ${showCustomerDropdown ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 8,
                    padding: "8px 10px",
                    transition: "border-color .15s",
                    boxShadow: showCustomerDropdown
                      ? "0 0 0 3px rgba(172,82,8,0.1)"
                      : "none",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    <Ic.User />
                  </span>
                  <input
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    onFocus={() => setShowCustomerDropdown(true)}
                    placeholder="Search customer or walk-in..."
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: "var(--text-primary)",
                      fontSize: 12,
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  />
                </div>
                {showCustomerDropdown && (
                  <div
                    style={{
                      ...fadeUp,
                      position: "absolute",
                      top: 40,
                      left: 0,
                      right: 0,
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      zIndex: 50,
                      maxHeight: 200,
                      overflowY: "auto",
                      boxShadow: "0 16px 50px rgba(4,13,28,0.6)",
                    }}
                  >
                    <div
                      onClick={() => {
                        setCustomer({
                          name: "Walk-in Customer",
                          phone: "—",
                          type: "Walk-in",
                        });
                        setShowCustomerDropdown(false);
                      }}
                      style={{
                        padding: "9px 12px",
                        cursor: "pointer",
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(172,82,8,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span style={{ fontSize: 16 }}>🚶</span>
                      <span
                        style={{ color: "var(--text-primary)", fontSize: 12 }}
                      >
                        Walk-in Customer
                      </span>
                    </div>
                    {filteredCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setCustomer(c);
                          setShowCustomerDropdown(false);
                          setCustomerSearch("");
                        }}
                        style={{
                          padding: "9px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid var(--border)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(172,82,8,0.08)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <div
                          style={{
                            color: "var(--text-primary)",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {c.name}
                        </div>
                        <div
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: 10,
                          }}
                        >
                          {c.code} • {c.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sale Details */}
          <div style={{ ...card(), padding: "12px 14px" }}>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.1em",
                margin: "0 0 10px",
              }}
            >
              SALE DETAILS
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Select
                label="Store"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                options={[
                  "Main Store — Dhaka",
                  "Branch Store — Chittagong",
                  "Branch Store — Sylhet",
                ]}
              />
              <Select
                label="Sold By"
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                options={["Admin", "Seller 1", "Seller 2", "Manager"]}
              />
              <Input
                label="Sale Date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                type="date"
              />
            </div>
          </div>

          {/* Payment & Discounts */}
          <div style={{ ...card(), padding: "12px 14px" }}>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.1em",
                margin: "0 0 10px",
              }}
            >
              PAYMENT & DISCOUNTS
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Payment type */}
              <div>
                <label
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  PAYMENT TYPE
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
                        fontFamily: "'Open Sans', sans-serif",
                        background:
                          paymentType === val
                            ? "var(--accent)"
                            : "var(--bg-secondary)",
                        border: `1px solid ${paymentType === val ? "var(--accent)" : "var(--border)"}`,
                        color:
                          paymentType === val
                            ? "#fff"
                            : "var(--text-secondary)",
                        transition: "all .15s",
                        boxShadow:
                          paymentType === val
                            ? "0 2px 10px rgba(172,82,8,0.35)"
                            : "none",
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
                    color: "var(--text-secondary)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  DISCOUNT
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: 7,
                      padding: "7px 8px",
                      color: "var(--text-primary)",
                      fontSize: 11,
                      outline: "none",
                      cursor: "pointer",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">৳ Fixed</option>
                  </select>
                  <input
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    type="number"
                    min="0"
                    style={{
                      flex: 1,
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: 7,
                      padding: "7px 10px",
                      color: "var(--accent)",
                      fontSize: 13,
                      fontWeight: 700,
                      outline: "none",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      display: "block",
                      marginBottom: 5,
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
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: 7,
                      padding: "7px 10px",
                      color: "var(--text-primary)",
                      fontSize: 12,
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    PAID (৳)
                  </label>
                  <input
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    type="number"
                    min="0"
                    placeholder={String(netTotal)}
                    style={{
                      width: "100%",
                      background: "var(--bg-secondary)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      borderRadius: 7,
                      padding: "7px 10px",
                      color: "var(--green)",
                      fontSize: 12,
                      fontWeight: 700,
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div
            style={{
              ...card(),
              padding: "12px 14px",
              background: "var(--surface-alt)",
              borderColor: "rgba(34,197,94,0.12)",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.1em",
                margin: "0 0 10px",
              }}
            >
              BILL SUMMARY
            </p>
            {[
              [
                "Subtotal",
                `৳${subtotal.toLocaleString()}`,
                "var(--text-primary)",
              ],
              [
                "Discount",
                `-৳${Math.round(discAmt).toLocaleString()}`,
                "#fbbf24",
              ],
              [`VAT (${vat}%)`, `৳${vatAmt.toLocaleString()}`, "#60a5fa"],
            ].map(([l, v, c]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 0",
                }}
              >
                <span
                  style={{ color: "var(--text-secondary)", fontSize: 11.5 }}
                >
                  {l}
                </span>
                <span style={{ color: c, fontWeight: 600, fontSize: 11.5 }}>
                  {v}
                </span>
              </div>
            ))}
            <div
              style={{
                height: 1,
                background: "var(--border)",
                margin: "8px 0",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 0",
              }}
            >
              <span
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                NET TOTAL
              </span>
              <span
                style={{ color: "var(--green)", fontWeight: 900, fontSize: 20 }}
              >
                ৳{netTotal.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                height: 1,
                background: "var(--border)",
                margin: "8px 0",
              }}
            />
            {[
              ["Total Qty", String(totalQty), "var(--text-primary)"],
              ["Paid Amount", `৳${paid.toLocaleString()}`, "var(--green)"],
              ...(change > 0
                ? [["Change", `৳${change.toLocaleString()}`, "#60a5fa"]]
                : []),
              ...(due > 0
                ? [["Due Amount", `৳${due.toLocaleString()}`, "#f87171"]]
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
                <span
                  style={{ color: "var(--text-secondary)", fontSize: 11.5 }}
                >
                  {l}
                </span>
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
              padding: 11,
              fontSize: 13,
              borderRadius: 10,
            }}
          >
            <Ic.Receipt /> Generate Invoice & Save
          </Btn>
          <div style={{ display: "flex", gap: 7 }}>
            <Btn
              variant="ghost"
              style={{ flex: 1, justifyContent: "center", padding: 9 }}
            >
              <Ic.Print /> Print
            </Btn>
            <Btn
              variant="danger"
              style={{ flex: 1, justifyContent: "center", padding: 9 }}
              onClick={() => {
                setSelectedItems([]);
                setCustomer(null);
                setPaidAmount("");
                setSelectedRows(new Set());
              }}
            >
              <Ic.Close /> Cancel
            </Btn>
          </div>
        </div>
      </div>

      {showCustomerModal && (
        <CustomerModal
          onClose={() => setShowCustomerModal(false)}
          onSave={(c) => {
            setAllCustomers((p) => [...p, c]);
            setCustomer(c);
          }}
        />
      )}
      {showInvoice && (
        <InvoiceModal sale={saleData} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
}
