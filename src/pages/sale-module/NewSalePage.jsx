import { useState, useRef, useEffect } from "react";
import { card, T } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Input, Select } from "../../components/Input";
import { Ic } from "../../components/Icons";
import { PRODUCTS, CUSTOMERS } from "../../data/sampleData";
import CustomerModal from "../../components/CustomerModal";
import InvoiceModal from "../../components/InvoiceModal";

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

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        height: "calc(100vh - 110px)",
        overflow: "hidden",
      }}
    >
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
                background: T.bg3,
                border: `1px solid ${showProductSearch ? T.gold : T.border}`,
                borderRadius: 9,
                padding: "0 12px",
                height: 38,
                transition: "border-color .15s",
                cursor: "pointer",
              }}
              onClick={() => setShowProductSearch(true)}
            >
              <span style={{ color: T.textMut }}>
                <Ic.Search />
              </span>
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onFocus={() => setShowProductSearch(true)}
                placeholder="🔍  Search product by name or SKU code..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: T.text,
                  fontSize: 12.5,
                }}
              />
            </div>
            {showProductSearch && (
              <div
                style={{
                  position: "absolute",
                  top: 42,
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  background: "#1a0e06",
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
                  maxHeight: 280,
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
                      borderBottom: `1px solid ${T.border}`,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(139,90,43,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span style={{ fontSize: 24 }}>{p.img}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{ color: T.text, fontWeight: 600, fontSize: 12 }}
                      >
                        {p.name}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ color: T.gold, fontSize: 10 }}>
                          {p.sku}
                        </span>
                        <span style={{ color: T.textMut, fontSize: 10 }}>
                          •
                        </span>
                        <span style={{ color: T.textSub, fontSize: 10 }}>
                          Stock: {p.stock}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          color: T.amber,
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
                      padding: "16px",
                      color: T.textSub,
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

        <div
          style={{
            ...card(),
            flex: 1,
            overflow: "hidden",
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
                  fontWeight: 700,
                  fontSize: 13,
                  margin: 0,
                }}
              >
                Sale Items
              </h3>
              {selectedItems.length > 0 && (
                <Badge color="gold" small>
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
                  gap: 12,
                  padding: 40,
                }}
              >
                <span style={{ fontSize: 50 }}>🛋️</span>
                <p
                  style={{
                    color: T.textSub,
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
                    background: T.bg2,
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
                        style={{ cursor: "pointer", accentColor: T.gold }}
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
                    <th style={{ padding: "10px 10px", width: 40 }}></th>
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
                          borderBottom: `1px solid ${T.border}`,
                          background: isSelected
                            ? "rgba(205,133,63,0.08)"
                            : isPreview
                              ? "rgba(139,90,43,0.06)"
                              : "transparent",
                          cursor: "pointer",
                          transition: "background .12s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected && !isPreview)
                            e.currentTarget.style.background =
                              "rgba(139,90,43,0.05)";
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
                            style={{ cursor: "pointer", accentColor: T.gold }}
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
                                background: "rgba(139,90,43,0.15)",
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
                                  color: T.text,
                                  fontWeight: 600,
                                  fontSize: 12,
                                  lineHeight: 1.2,
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
                        <td style={{ padding: "10px 10px" }}>
                          <span
                            style={{
                              color: T.gold,
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
                              color: T.amber,
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
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                background: "rgba(139,90,43,0.2)",
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
                                background: T.bg3,
                                border: `1px solid ${T.border}`,
                                borderRadius: 6,
                                color: T.text,
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
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                background: "rgba(139,90,43,0.2)",
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
                        <td style={{ padding: "10px 10px" }}>
                          <span
                            style={{
                              color: T.text,
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
                              color: T.red,
                              borderRadius: 6,
                              width: 26,
                              height: 26,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ic.Trash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot style={{ background: T.bg2 }}>
                  <tr>
                    <td colSpan={2} />
                    <td style={{ padding: "10px 10px" }}>
                      <span
                        style={{
                          color: T.textSub,
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        TOTAL QTY
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px" }} />
                    <td style={{ padding: "10px 10px" }}>
                      <span
                        style={{
                          color: T.amber,
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
                          color: T.amber,
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

      <div
        style={{
          width: 330,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflow: "hidden",
        }}
      >
        {previewProduct && (
          <div style={{ ...card(), padding: "14px", flexShrink: 0 }}>
            <p
              style={{
                color: T.textMut,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.08em",
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
                  background:
                    "linear-gradient(135deg,rgba(139,90,43,0.2),rgba(205,133,63,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  flexShrink: 0,
                  border: `1px solid rgba(139,90,43,0.25)`,
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
                    margin: "0 0 3px",
                    lineHeight: 1.2,
                  }}
                >
                  {previewProduct.name}
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge color="gold" small>
                    {previewProduct.sku}
                  </Badge>
                  <Badge color="blue" small>
                    {previewProduct.category}
                  </Badge>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <div>
                    <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                      SELL PRICE
                    </p>
                    <p
                      style={{
                        color: T.amber,
                        fontWeight: 800,
                        fontSize: 13,
                        margin: 0,
                      }}
                    >
                      ৳{previewProduct.price.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                      STOCK
                    </p>
                    <p
                      style={{
                        color: previewProduct.stock <= 4 ? T.red : T.green,
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
                  color: T.textMut,
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                CUSTOMER
              </p>
              <button
                onClick={() => setShowCustomerModal(true)}
                style={{
                  background: "rgba(96,165,250,0.12)",
                  border: "1px solid rgba(96,165,250,0.25)",
                  color: T.blue,
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 20,
                  cursor: "pointer",
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
                  background: "rgba(74,222,128,0.07)",
                  borderRadius: 8,
                  border: "1px solid rgba(74,222,128,0.2)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(135deg,#cd853f,#7a3e10)",
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
                      color: T.text,
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
                  <p style={{ color: T.textSub, fontSize: 10, margin: 0 }}>
                    {customer.phone} • {customer.type}
                  </p>
                </div>
                <button
                  onClick={() => setCustomer(null)}
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
              <div ref={customerDropRef} style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: T.bg3,
                    border: `1px solid ${showCustomerDropdown ? T.gold : T.border}`,
                    borderRadius: 8,
                    padding: "8px 10px",
                    transition: "border-color .15s",
                  }}
                >
                  <span style={{ color: T.textMut }}>
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
                      color: T.text,
                      fontSize: 12,
                    }}
                  />
                </div>
                {showCustomerDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: 38,
                      left: 0,
                      right: 0,
                      background: "#1a0e06",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      zIndex: 50,
                      maxHeight: 200,
                      overflowY: "auto",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
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
                        borderBottom: `1px solid ${T.border}`,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(139,90,43,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span style={{ fontSize: 16 }}>🚶</span>
                      <span style={{ color: T.text, fontSize: 12 }}>
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
                            fontWeight: 600,
                          }}
                        >
                          {c.name}
                        </div>
                        <div style={{ color: T.textSub, fontSize: 10 }}>
                          {c.code} • {c.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ ...card(), padding: "12px 14px" }}>
            <p
              style={{
                color: T.textMut,
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: "0.08em",
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

          <div style={{ ...card(), padding: "12px 14px" }}>
            <p
              style={{
                color: T.textMut,
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: "0.08em",
                margin: "0 0 10px",
              }}
            >
              PAYMENT & DISCOUNTS
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                  PAYMENT TYPE
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    ["cash", "💵 Cash", <Ic.Cash />],
                    ["bank_transfer", "🏦 Bank", <Ic.Card />],
                    ["mixed", "⚡ Mixed", <Ic.Cash />],
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
                            ? "linear-gradient(135deg,#c0712a,#8b3e10)"
                            : "rgba(139,90,43,0.1)",
                        border: `1px solid ${paymentType === val ? "transparent" : T.border}`,
                        color: paymentType === val ? "#fff" : T.textSub,
                        transition: "all .15s",
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

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
                      color: T.amber,
                      fontSize: 13,
                      fontWeight: 700,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ flex: 1 }}>
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
                      background: T.bg3,
                      border: `1px solid rgba(74,222,128,0.3)`,
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

          <div
            style={{
              ...card(),
              padding: "12px 14px",
              background: "linear-gradient(135deg,#1e1208,#2a1a0a)",
            }}
          >
            <p
              style={{
                color: T.textMut,
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: "0.08em",
                margin: "0 0 10px",
              }}
            >
              BILL SUMMARY
            </p>
            {[
              ["Subtotal", `৳${subtotal.toLocaleString()}`, T.text],
              [
                "Discount",
                `-৳${Math.round(discAmt).toLocaleString()}`,
                T.yellow,
              ],
              [`VAT (${vat}%)`, `৳${vatAmt.toLocaleString()}`, T.blue],
            ].map(([l, v, c]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 0",
                }}
              >
                <span style={{ color: T.textSub, fontSize: 11.5 }}>{l}</span>
                <span style={{ color: c, fontWeight: 600, fontSize: 11.5 }}>
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
              <span style={{ color: T.text, fontWeight: 800, fontSize: 14 }}>
                NET TOTAL
              </span>
              <span style={{ color: T.amber, fontWeight: 900, fontSize: 18 }}>
                ৳{netTotal.toLocaleString()}
              </span>
            </div>
            <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
            {[
              ["Total Qty", String(totalQty), T.text],
              ["Paid Amount", `৳${paid.toLocaleString()}`, T.green],
              ...(change > 0
                ? [["Change", `৳${change.toLocaleString()}`, T.blue]]
                : []),
              ...(due > 0
                ? [["Due Amount", `৳${due.toLocaleString()}`, T.red]]
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
                <span style={{ color: T.textSub, fontSize: 11.5 }}>{l}</span>
                <span style={{ color: c, fontWeight: 700, fontSize: 12 }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

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
            <Ic.Receipt /> Generate Invoice & Save
          </Btn>
          <div style={{ display: "flex", gap: 7 }}>
            <Btn
              variant="ghost"
              style={{ flex: 1, justifyContent: "center", padding: "9px" }}
            >
              <Ic.Print /> Print
            </Btn>
            <Btn
              variant="danger"
              style={{ flex: 1, justifyContent: "center", padding: "9px" }}
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
