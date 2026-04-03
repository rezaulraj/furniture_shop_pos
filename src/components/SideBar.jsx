import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";

// ── Custom SVG Icons ────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = false, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={stroke ? "none" : "currentColor"}
    stroke={stroke ? "currentColor" : "none"}
    strokeWidth={stroke ? 1.8 : 0}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {Array.isArray(d) ? (
      d.map((p, i) => <path key={i} d={p} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const Icons = {
  Dashboard: () => (
    <Icon
      stroke
      size={20}
      d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"]}
    />
  ),
  Sale: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z",
        "M3 6h18",
        "M16 10a4 4 0 01-8 0",
      ]}
    />
  ),
  Purchase: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
        "M3.27 6.96L12 12.01l8.73-5.05",
        "M12 22.08V12",
      ]}
    />
  ),
  Inventory: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
      ]}
    />
  ),
  Customer: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
        "M23 21v-2a4 4 0 00-3-3.87",
        "M9 3a4 4 0 010 8",
        "M16 3.13a4 4 0 010 7.75",
      ]}
    />
  ),
  Supplier: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z",
        "M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16",
      ]}
    />
  ),
  Transfer: () => (
    <Icon
      stroke
      size={20}
      d={["M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"]}
    />
  ),
  Damage: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      ]}
    />
  ),
  Expense: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      ]}
    />
  ),
  Report: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      ]}
    />
  ),
  Users: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197",
      ]}
    />
  ),
  Store: () => (
    <Icon
      stroke
      size={20}
      d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"]}
    />
  ),
  Product: () => (
    <Icon
      stroke
      size={20}
      d={["M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"]}
    />
  ),
  Chevron: ({ open }) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.25s",
      }}
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Menu: () => <Icon stroke size={22} d="M4 6h16M4 12h16M4 18h16" />,
  Close: () => <Icon stroke size={22} d="M6 18L18 6M6 6l12 12" />,
  Installment: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2",
        "M9 5a2 2 0 002 2h2a2 2 0 002-2",
        "M9 5a2 2 0 012-2h2a2 2 0 012 2",
        "M9 12h6m-6 4h4",
      ]}
    />
  ),
  Return: () => (
    <Icon stroke size={20} d={["M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"]} />
  ),
};

// ── Nav Data ────────────────────────────────────────────────────────
const NAV = [
  {
    id: 1,
    label: "Dashboard",
    icon: <Icons.Dashboard />,
    path: "/dashboard",
  },
  {
    id: 2,
    label: "Sales",
    icon: <Icons.Sale />,
    accent: "sale",
    subBar: [
      { id: 21, label: "New Sale", path: "/sales/new", dot: "amber" },
      { id: 22, label: "Sale History", path: "/sales/history" },
      { id: 23, label: "Sale Returns", path: "/sales/returns" },
      { id: 24, label: "Installments", path: "/sales/installments" },
    ],
  },
  {
    id: 3,
    label: "Purchases",
    icon: <Icons.Purchase />,
    accent: "purchase",
    subBar: [
      { id: 31, label: "New Purchase", path: "/purchases/new", dot: "amber" },
      { id: 32, label: "Purchase History", path: "/purchases/history" },
      { id: 33, label: "Purchase Returns", path: "/purchases/returns" },
    ],
  },
  {
    id: 4,
    label: "Inventory",
    icon: <Icons.Inventory />,
    subBar: [
      { id: 41, label: "Stock Overview", path: "/inventory/overview" },
      {
        id: 42,
        label: "Low Stock Alert",
        path: "/inventory/low-stock",
        badge: "!",
      },
      { id: 43, label: "Stock Transfer", path: "/inventory/transfer" },
      { id: 44, label: "Damage Stock", path: "/inventory/damage" },
    ],
  },
  {
    id: 5,
    label: "Products",
    icon: <Icons.Product />,
    subBar: [
      { id: 51, label: "All Products", path: "/products" },
      { id: 52, label: "Add Product", path: "/products/add" },
      { id: 53, label: "Categories", path: "/products/categories" },
    ],
  },
  {
    id: 6,
    label: "Customers",
    icon: <Icons.Customer />,
    subBar: [
      { id: 61, label: "All Customers", path: "/customers" },
      { id: 62, label: "Add Customer", path: "/customers/add" },
    ],
  },
  {
    id: 7,
    label: "Suppliers",
    icon: <Icons.Supplier />,
    subBar: [
      { id: 71, label: "All Suppliers", path: "/suppliers" },
      { id: 72, label: "Add Supplier", path: "/suppliers/add" },
    ],
  },
  {
    id: 8,
    label: "Expenses",
    icon: <Icons.Expense />,
    subBar: [
      { id: 81, label: "All Expenses", path: "/expenses" },
      { id: 82, label: "Add Expense", path: "/expenses/add" },
      { id: 83, label: "Yearly Tracking", path: "/expenses/yearly" },
    ],
  },
  {
    id: 9,
    label: "Reports",
    icon: <Icons.Report />,
    subBar: [
      { id: 91, label: "Sales Report", path: "/reports/sales" },
      { id: 92, label: "Purchase Report", path: "/reports/purchases" },
      { id: 93, label: "Inventory Report", path: "/reports/inventory" },
      { id: 94, label: "Expense Report", path: "/reports/expenses" },
      { id: 95, label: "Profit & Loss", path: "/reports/profit-loss" },
    ],
  },
  {
    id: 10,
    label: "Users",
    icon: <Icons.Users />,
    subBar: [
      { id: 101, label: "All Users", path: "/users" },
      { id: 102, label: "Add User", path: "/users/add" },
      { id: 103, label: "Roles", path: "/users/roles" },
    ],
  },
  {
    id: 11,
    label: "Stores",
    icon: <Icons.Store />,
    subBar: [
      { id: 111, label: "All Stores", path: "/stores" },
      { id: 112, label: "Add Store", path: "/stores/add" },
    ],
  },
];

// ── Sidebar Component ───────────────────────────────────────────────
const SideBar = ({ isOpen, isMobile, onToggle }) => {
  const [openSubmenus, setOpenSubmenus] = useState({ 2: true });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const toggle = (id) => setOpenSubmenus((p) => ({ ...p, [id]: !p[id] }));

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onToggle();
  };

  const isActive = (item) => {
    if (item.path) return location.pathname === item.path;
    if (item.subBar)
      return item.subBar.some((s) => location.pathname === s.path);
    return false;
  };
  const isSubActive = (sub) => location.pathname === sub.path;

  const tooltip = (label) =>
    ReactDOM.createPortal(
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{
          top: tooltipPos.y,
          left: tooltipPos.x,
          transform: "translateY(-50%)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#2d1f0e,#4a2e0a)",
            color: "#f5deb3",
            fontSize: 12,
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            border: "1px solid rgba(205,133,63,0.3)",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </div>,
      document.body,
    );

  return (
    <div
      className="h-full flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, #1a0f05 0%, #2d1a08 40%, #1e1208 100%)",
        borderRight: "1px solid rgba(139,90,43,0.25)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: isOpen ? "20px 18px 16px" : "20px 0 16px",
          borderBottom: "1px solid rgba(139,90,43,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
        }}
      >
        {isOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg,#cd853f,#8b4513)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(139,69,19,0.5)",
                flexShrink: 0,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fdf3e3"
                strokeWidth="1.8"
              >
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M5 12v7h14v-7" />
                <path d="M8 19v-4h8v4" />
                <path d="M3 8l2-4h14l2 4" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  color: "#f5deb3",
                  fontWeight: 800,
                  fontSize: 15,
                  letterSpacing: "0.03em",
                  lineHeight: 1.1,
                }}
              >
                WoodCraft
              </div>
              <div
                style={{
                  color: "#a07040",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                }}
              >
                POS SYSTEM
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            background: "rgba(139,90,43,0.15)",
            border: "1px solid rgba(139,90,43,0.25)",
            color: "#cd853f",
            borderRadius: 8,
            padding: 7,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(205,133,63,0.25)";
            e.currentTarget.style.color = "#f5deb3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(139,90,43,0.15)";
            e.currentTarget.style.color = "#cd853f";
          }}
        >
          {isOpen ? <Icons.Close /> : <Icons.Menu />}
        </button>
      </div>

      {/* Quick Action Buttons */}
      {isOpen && (
        <div style={{ padding: "14px 14px 8px", display: "flex", gap: 8 }}>
          <button
            onClick={() => handleNav("/sales/new")}
            style={{
              flex: 1,
              padding: "9px 8px",
              borderRadius: 9,
              background: "linear-gradient(135deg,#c0712a,#8b4513)",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              boxShadow: "0 3px 12px rgba(139,69,19,0.45)",
              letterSpacing: "0.03em",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-1px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <Icons.Sale /> New Sale
          </button>
          <button
            onClick={() => handleNav("/purchases/new")}
            style={{
              flex: 1,
              padding: "9px 8px",
              borderRadius: 9,
              background: "rgba(139,90,43,0.18)",
              border: "1px solid rgba(139,90,43,0.35)",
              color: "#cd853f",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              letterSpacing: "0.03em",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(205,133,63,0.25)";
              e.currentTarget.style.color = "#f5deb3";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139,90,43,0.18)";
              e.currentTarget.style.color = "#cd853f";
            }}
          >
            <Icons.Purchase /> Purchase
          </button>
        </div>
      )}

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 10px 8px",
          scrollbarWidth: "thin",
          scrollbarColor: "#4a2e0a transparent",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.id}>
                <div
                  onClick={() =>
                    item.subBar ? toggle(item.id) : handleNav(item.path)
                  }
                  onMouseEnter={(e) => {
                    if (!isOpen) {
                      setHoveredItem(item.id);
                      const r = e.currentTarget.getBoundingClientRect();
                      setTooltipPos({
                        x: r.right + 10,
                        y: r.top + r.height / 2,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isOpen ? "space-between" : "center",
                    padding: isOpen ? "9px 12px" : "10px 0",
                    borderRadius: 10,
                    cursor: "pointer",
                    gap: 10,
                    background: active
                      ? "linear-gradient(135deg,rgba(205,133,63,0.28),rgba(139,69,19,0.22))"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(205,133,63,0.35)"
                      : "1px solid transparent",
                    transition: "all 0.18s",
                  }}
                  onMouseOver={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "rgba(139,90,43,0.15)";
                  }}
                  onMouseOut={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        color: active ? "#f5a623" : "#a07850",
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                        transition: "color 0.18s",
                      }}
                    >
                      {item.icon}
                    </span>
                    {isOpen && (
                      <span
                        style={{
                          color: active ? "#f5deb3" : "#c4a882",
                          fontWeight: active ? 700 : 500,
                          fontSize: 13,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                  {item.subBar && isOpen && (
                    <span style={{ color: "#7a5a35", flexShrink: 0 }}>
                      <Icons.Chevron open={openSubmenus[item.id]} />
                    </span>
                  )}
                </div>

                {!isOpen && hoveredItem === item.id && tooltip(item.label)}

                {item.subBar && openSubmenus[item.id] && isOpen && (
                  <ul
                    style={{
                      listStyle: "none",
                      margin: "2px 0 2px 12px",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {item.subBar.map((sub) => {
                      const sa = isSubActive(sub);
                      return (
                        <li key={sub.id}>
                          <div
                            onClick={() => handleNav(sub.path)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "7px 12px",
                              borderRadius: 8,
                              cursor: "pointer",
                              background: sa
                                ? "rgba(205,133,63,0.18)"
                                : "transparent",
                              borderLeft: sa
                                ? "2px solid #cd853f"
                                : "2px solid transparent",
                              transition: "all 0.15s",
                            }}
                            onMouseOver={(e) => {
                              if (!sa)
                                e.currentTarget.style.background =
                                  "rgba(139,90,43,0.12)";
                            }}
                            onMouseOut={(e) => {
                              if (!sa)
                                e.currentTarget.style.background =
                                  "transparent";
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                flexShrink: 0,
                                background: sa ? "#f5a623" : "#5a3d1e",
                              }}
                            />
                            <span
                              style={{
                                color: sa ? "#f5deb3" : "#9a7a50",
                                fontSize: 12,
                                fontWeight: sa ? 600 : 400,
                                letterSpacing: "0.02em",
                              }}
                            >
                              {sub.label}
                            </span>
                            {sub.badge && (
                              <span
                                style={{
                                  marginLeft: "auto",
                                  background: "#c0392b",
                                  color: "#fff",
                                  fontSize: 9,
                                  fontWeight: 800,
                                  borderRadius: 4,
                                  padding: "1px 5px",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {sub.badge}
                              </span>
                            )}
                            {sub.dot === "amber" && (
                              <span
                                style={{
                                  marginLeft: "auto",
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "#f5a623",
                                  boxShadow: "0 0 6px #f5a623",
                                }}
                              />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(139,90,43,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "#5a3d1e",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.06em",
            }}
          >
            v2.1.0 • WoodCraft POS
          </span>
          <span
            style={{
              background: "rgba(34,197,94,0.15)",
              color: "#4ade80",
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 20,
              border: "1px solid rgba(74,222,128,0.25)",
              letterSpacing: "0.06em",
            }}
          >
            LIVE
          </span>
        </div>
      )}
    </div>
  );
};

export default SideBar;
