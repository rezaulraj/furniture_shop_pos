import { useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";

/* ── Data ─────────────────────────────────────────────────────── */
const INIT_CATEGORIES = [
  {
    id: 1,
    name: "Sofa",
    slug: "sofa",
    icon: "🛋️",
    description:
      "All sofa styles including sectionals, loveseats, and sleeper sofas",
    productCount: 12,
    isActive: true,
    color: "#cd853f",
    createdAt: "2026-01-10",
  },
  {
    id: 2,
    name: "Dining",
    slug: "dining",
    icon: "🪑",
    description:
      "Dining tables, chairs, and complete dining room furniture sets",
    productCount: 8,
    isActive: true,
    color: "#8b4513",
    createdAt: "2026-01-10",
  },
  {
    id: 3,
    name: "Bedroom",
    slug: "bedroom",
    icon: "🛏️",
    description:
      "Beds, wardrobes, dressers, and all bedroom furniture essentials",
    productCount: 15,
    isActive: true,
    color: "#4a2e0a",
    createdAt: "2026-01-10",
  },
  {
    id: 4,
    name: "Storage",
    slug: "storage",
    icon: "📚",
    description: "Bookshelves, cabinets, wardrobes, and modular storage units",
    productCount: 10,
    isActive: true,
    color: "#2d6a4f",
    createdAt: "2026-01-15",
  },
  {
    id: 5,
    name: "Chair",
    slug: "chair",
    icon: "🪑",
    description: "Office chairs, accent chairs, armchairs, and lounge seating",
    productCount: 18,
    isActive: true,
    color: "#1d4ed8",
    createdAt: "2026-01-15",
  },
  {
    id: 6,
    name: "Table",
    slug: "table",
    icon: "☕",
    description: "Coffee tables, side tables, console tables, and end tables",
    productCount: 7,
    isActive: true,
    color: "#7c3aed",
    createdAt: "2026-01-20",
  },
  {
    id: 7,
    name: "Desk",
    slug: "desk",
    icon: "📖",
    description:
      "Study desks, writing tables, executive workstations, and standing desks",
    productCount: 5,
    isActive: true,
    color: "#0891b2",
    createdAt: "2026-02-01",
  },
  {
    id: 8,
    name: "Outdoor",
    slug: "outdoor",
    icon: "🌿",
    description:
      "Patio furniture, garden sets, outdoor loungers, and poolside chairs",
    productCount: 3,
    isActive: true,
    color: "#16a34a",
    createdAt: "2026-02-10",
  },
  {
    id: 9,
    name: "Kids",
    slug: "kids",
    icon: "🎠",
    description:
      "Children's beds, study tables, bunk beds, and playroom furniture",
    productCount: 0,
    isActive: false,
    color: "#db2777",
    createdAt: "2026-03-01",
  },
];

const CATEGORY_ICONS = [
  "🛋️",
  "🪑",
  "🛏️",
  "📚",
  "☕",
  "🌙",
  "🚪",
  "📖",
  "🪞",
  "🛁",
  "🌿",
  "🎠",
  "🏮",
  "🪟",
  "🗄️",
  "🪴",
  "🎋",
  "🪵",
  "🏠",
  "⭐",
];
const ACCENT_COLORS = [
  "#cd853f",
  "#8b4513",
  "#4a2e0a",
  "#2d6a4f",
  "#1d4ed8",
  "#7c3aed",
  "#0891b2",
  "#16a34a",
  "#db2777",
  "#dc2626",
  "#0d9488",
  "#b45309",
];

/* ── Category Form Modal ─────────────────────────────────────── */
const CategoryModal = ({ category, mode, onClose, onSave }) => {
  const [form, setForm] = useState(
    category || {
      name: "",
      slug: "",
      icon: "🛋️",
      description: "",
      isActive: true,
      color: "#cd853f",
    },
  );
  const [errors, setErrors] = useState({});
  const [iconOpen, setIconOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setVal = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const autoSlug = (name) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Category name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      id: category?.id || Date.now(),
      productCount: category?.productCount || 0,
      createdAt: category?.createdAt || new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  const isEdit = mode === "edit";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(6px)",
        padding: "16px",
      }}
    >
      <div
        style={{
          ...card(),
          width: "100%",
          maxWidth: 500,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          animation: "catModalIn .28s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <style>{`
          @keyframes catModalIn{from{opacity:0;transform:scale(.94) translateY(14px)}to{opacity:1;transform:none}}
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          input::placeholder,textarea::placeholder{color:${T.textMut}}
          select option{background:${T.bg3}}
        `}</style>

        {/* Header */}
        <div
          style={{
            padding: "20px 22px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexShrink: 0,
          }}
        >
          {/* Color dot + icon picker trigger */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => {
                setIconOpen(!iconOpen);
                setColorOpen(false);
              }}
              style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                cursor: "pointer",
                border: `3px solid ${form.color}40`,
                fontSize: 30,
                background: `linear-gradient(135deg,${form.color}25,${form.color}10)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .18s",
              }}
            >
              {form.icon}
            </button>
            {iconOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 64,
                  left: 0,
                  background: "#1a0e06",
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "10px",
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  gap: 4,
                  zIndex: 10,
                  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  animation: "fadeIn .15s",
                }}
              >
                {CATEGORY_ICONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setVal("icon", e);
                      setIconOpen(false);
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background:
                        form.icon === e ? `${form.color}30` : "transparent",
                      border: `1px solid ${form.icon === e ? form.color : "transparent"}`,
                      fontSize: 20,
                      cursor: "pointer",
                      transition: "all .12s",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                color: T.text,
                fontWeight: 900,
                fontSize: 16,
                margin: 0,
              }}
            >
              {isEdit ? "Edit Category" : "New Category"}
            </h2>
            <p style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}>
              {isEdit
                ? `Updating: ${category?.name}`
                : "Add a new product category"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: T.red,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ic.Close />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Name & Slug */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                CATEGORY NAME *
              </label>
              <input
                value={form.name}
                onChange={(e) => {
                  set("name")(e);
                  if (!isEdit) setVal("slug", autoSlug(e.target.value));
                }}
                placeholder="e.g. Sofa"
                style={{
                  width: "100%",
                  background: T.bg3,
                  border: `1px solid ${errors.name ? T.red : T.border}`,
                  borderRadius: 9,
                  padding: "9px 11px",
                  color: T.text,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = form.color)}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.name ? T.red : T.border)
                }
              />
              {errors.name && (
                <span style={{ color: T.red, fontSize: 10 }}>
                  ⚠ {errors.name}
                </span>
              )}
            </div>
            <div>
              <label
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                URL SLUG *
              </label>
              <input
                value={form.slug}
                onChange={set("slug")}
                placeholder="e.g. sofa"
                style={{
                  width: "100%",
                  background: T.bg3,
                  border: `1px solid ${errors.slug ? T.red : T.border}`,
                  borderRadius: 9,
                  padding: "9px 11px",
                  color: T.gold,
                  fontSize: 12,
                  fontFamily: "monospace",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = form.color)}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.slug ? T.red : T.border)
                }
              />
              {errors.slug && (
                <span style={{ color: T.red, fontSize: 10 }}>
                  ⚠ {errors.slug}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                color: T.textSub,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.07em",
                display: "block",
                marginBottom: 5,
              }}
            >
              DESCRIPTION
            </label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder="Describe this category..."
              style={{
                width: "100%",
                background: T.bg3,
                border: `1px solid ${T.border}`,
                borderRadius: 9,
                padding: "9px 11px",
                color: T.text,
                fontSize: 12,
                outline: "none",
                resize: "vertical",
                lineHeight: 1.55,
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = form.color)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>

          {/* Accent color */}
          <div>
            <label
              style={{
                color: T.textSub,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.07em",
                display: "block",
                marginBottom: 8,
              }}
            >
              ACCENT COLOR
            </label>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setVal("color", c)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: c,
                    border: `3px solid ${form.color === c ? "#fff" : "transparent"}`,
                    cursor: "pointer",
                    transition: "all .15s",
                    boxShadow:
                      form.color === c
                        ? `0 0 0 2px ${c}, 0 0 0 4px rgba(0,0,0,0.3)`
                        : "none",
                    transform: form.color === c ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              background: form.isActive
                ? "rgba(74,222,128,0.07)"
                : "rgba(248,113,113,0.07)",
              border: `1px solid ${form.isActive ? "rgba(74,222,128,0.22)" : "rgba(248,113,113,0.22)"}`,
              borderRadius: 10,
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: T.text,
                  fontWeight: 700,
                  fontSize: 12.5,
                  margin: 0,
                }}
              >
                Category Status
              </p>
              <p
                style={{ color: T.textSub, fontSize: 10.5, margin: "2px 0 0" }}
              >
                {form.isActive
                  ? "Visible in product catalog"
                  : "Hidden from catalog"}
              </p>
            </div>
            <button
              onClick={() => setVal("isActive", !form.isActive)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
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
                  top: 3,
                  left: form.isActive ? 25 : 3,
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

          {/* Live preview */}
          <div
            style={{
              padding: "14px 16px",
              background: `linear-gradient(135deg,${form.color}15,${form.color}08)`,
              borderRadius: 12,
              border: `1px solid ${form.color}30`,
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
              LIVE PREVIEW
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 13,
                  background: `${form.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  border: `2px solid ${form.color}40`,
                }}
              >
                {form.icon}
              </div>
              <div>
                <p
                  style={{
                    color: T.text,
                    fontWeight: 800,
                    fontSize: 14,
                    margin: 0,
                  }}
                >
                  {form.name || "Category Name"}
                </p>
                <p
                  style={{
                    color: form.color,
                    fontSize: 10.5,
                    fontFamily: "monospace",
                    margin: "2px 0 4px",
                  }}
                >
                  /{form.slug || "slug"}
                </p>
                <div style={{ display: "flex", gap: 5 }}>
                  <Badge color={form.isActive ? "green" : "red"} small>
                    {form.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </Btn>
          <button
            onClick={handleSave}
            style={{
              flex: 2,
              padding: "10px",
              borderRadius: 9,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              border: "none",
              color: "#fff",
              background: `linear-gradient(135deg,${form.color},${form.color}99)`,
              boxShadow: `0 4px 14px ${form.color}45`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all .18s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-1px)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >
            <Ic.Check /> {isEdit ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Delete Confirmation ─────────────────────────────────────── */
const DeleteCategoryModal = ({ category, onClose, onConfirm }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.82)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(5px)",
    }}
  >
    <div
      style={{
        ...card(),
        width: 420,
        padding: "28px 26px",
        boxShadow: "0 28px 70px rgba(0,0,0,0.5)",
        animation: "deleteIn .25s cubic-bezier(.16,1,.3,1)",
        textAlign: "center",
      }}
    >
      <style>{`@keyframes deleteIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}`}</style>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: "rgba(239,68,68,0.12)",
          border: "2px solid rgba(239,68,68,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 18px",
        }}
      >
        <span style={{ fontSize: 34 }}>⚠️</span>
      </div>
      <h3
        style={{
          color: T.text,
          fontWeight: 900,
          fontSize: 18,
          margin: "0 0 8px",
        }}
      >
        Delete Category?
      </h3>
      <p
        style={{
          color: T.textSub,
          fontSize: 13,
          margin: "0 0 18px",
          lineHeight: 1.5,
        }}
      >
        You're about to delete{" "}
        <strong style={{ color: T.text }}>"{category.name}"</strong>.
        {category.productCount > 0 && (
          <>
            <br />
            <span style={{ color: T.red }}>
              ⚠ This category has {category.productCount} products assigned to
              it.
            </span>
          </>
        )}
      </p>
      <div
        style={{
          padding: "12px 14px",
          background: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.22)",
          borderRadius: 10,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: `${category.color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          {category.icon}
        </div>
        <div style={{ textAlign: "left" }}>
          <p
            style={{
              color: T.text,
              fontWeight: 700,
              fontSize: 12.5,
              margin: 0,
            }}
          >
            {category.name}
          </p>
          <p style={{ color: T.textSub, fontSize: 10.5, margin: "2px 0 0" }}>
            /{category.slug} • {category.productCount} products
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn
          variant="ghost"
          onClick={onClose}
          style={{ flex: 1, justifyContent: "center" }}
        >
          Cancel
        </Btn>
        <button
          onClick={() => {
            onConfirm(category.id);
            onClose();
          }}
          style={{
            flex: 1,
            padding: "10px",
            background: "linear-gradient(135deg,#dc2626,#991b1b)",
            border: "none",
            borderRadius: 9,
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
          }}
        >
          <Ic.Trash /> Delete
        </button>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   CATEGORIES PAGE
════════════════════════════════════════════════════════════════ */
export default function Categories() {
  const [categories, setCategories] = useState(INIT_CATEGORIES);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [modalMode, setModalMode] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const openCreate = () => {
    setActiveCategory(null);
    setModalMode("create");
  };
  const openEdit = (c) => {
    setActiveCategory(c);
    setModalMode("edit");
  };
  const openDelete = (c) => {
    setActiveCategory(c);
    setModalMode("delete");
  };
  const closeModal = () => {
    setModalMode(null);
    setActiveCategory(null);
  };

  const handleSave = (data) => {
    if (modalMode === "create") setCategories((prev) => [...prev, data]);
    else
      setCategories((prev) => prev.map((c) => (c.id === data.id ? data : c)));
  };
  const handleDelete = (id) =>
    setCategories((prev) => prev.filter((c) => c.id !== id));
  const handleToggle = (id) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    );

  const filtered = categories.filter((c) => {
    const ms =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const mst =
      statusF === "all" || (statusF === "active" ? c.isActive : !c.isActive);
    return ms && mst;
  });

  const totalProducts = categories.reduce((s, c) => s + c.productCount, 0);
  const activeCount = categories.filter((c) => c.isActive).length;
  const emptyCount = categories.filter((c) => c.productCount === 0).length;

  const thStyle = {
    padding: "11px 11px",
    color: T.textMut,
    fontSize: 9.5,
    fontWeight: 700,
    textAlign: "left",
    letterSpacing: "0.07em",
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#3a2010;border-radius:99px}
        @keyframes gridCardIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes rowIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
      `}</style>

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
            label: "Total Categories",
            value: categories.length,
            sub: `${activeCount} active`,
            color: T.gold,
            icon: "🗂️",
          },
          {
            label: "Total Products",
            value: totalProducts,
            sub: "Across all categories",
            color: T.blue,
            icon: "📦",
          },
          {
            label: "Empty Categories",
            value: emptyCount,
            sub: "No products yet",
            color: T.yellow,
            icon: "📭",
          },
          {
            label: "Inactive",
            value: categories.length - activeCount,
            sub: "Hidden from catalog",
            color: T.red,
            icon: "🚫",
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
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = k.color + "55";
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
                fontSize: 64,
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
                  color: T.text,
                  fontSize: 22,
                  fontWeight: 900,
                  margin: "2px 0 2px",
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

      {/* ── Filter & controls ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 200,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: T.bg3,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: "0 12px",
            height: 38,
            transition: "border-color .15s",
          }}
        >
          <span style={{ color: T.textMut, display: "flex" }}>
            <Ic.Search />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
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
        <div style={{ display: "flex", gap: 5 }}>
          {[
            ["all", "All"],
            ["active", "Active"],
            ["inactive", "Inactive"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setStatusF(v)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 11,
                background:
                  statusF === v
                    ? "linear-gradient(135deg,#c0712a,#8b3e10)"
                    : "rgba(139,90,43,0.1)",
                border: `1px solid ${statusF === v ? "transparent" : T.border}`,
                color: statusF === v ? "#fff" : T.textSub,
                transition: "all .15s",
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {["grid", "table"].map((v) => (
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
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {v === "grid" ? "⊞" : "☰"}
            </button>
          ))}
        </div>
        <Btn onClick={openCreate}>
          <Ic.Plus /> New Category
        </Btn>
      </div>

      {/* ── GRID VIEW ── */}
      {viewMode === "grid" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
            gap: 13,
          }}
        >
          {/* Add new card */}
          <div
            onClick={openCreate}
            style={{
              ...card(),
              padding: "24px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              border: `2px dashed ${T.border}`,
              background: "transparent",
              transition: "all .22s",
              minHeight: 180,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.gold;
              e.currentTarget.style.background = "rgba(205,133,63,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                background: "rgba(205,133,63,0.12)",
                border: `2px dashed ${T.gold}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.gold,
              }}
            >
              <Ic.Plus />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: T.gold,
                  fontWeight: 700,
                  fontSize: 13,
                  margin: 0,
                }}
              >
                New Category
              </p>
              <p style={{ color: T.textMut, fontSize: 11, margin: "3px 0 0" }}>
                Click to create
              </p>
            </div>
          </div>

          {filtered.map((c, idx) => {
            const productBarWidth =
              totalProducts > 0
                ? Math.round(
                    (c.productCount /
                      Math.max(...categories.map((x) => x.productCount), 1)) *
                      100,
                  )
                : 0;
            return (
              <div
                key={c.id}
                style={{
                  ...card(),
                  padding: "18px 16px",
                  borderLeft: `4px solid ${c.isActive ? c.color : T.textMut}`,
                  opacity: c.isActive ? 1 : 0.65,
                  transition: "all .22s",
                  animation: `gridCardIn .3s ease ${idx * 0.04}s both`,
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 14px 35px rgba(0,0,0,0.35), 0 0 0 1px ${c.color}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Background shimmer */}
                <div
                  style={{
                    position: "absolute",
                    right: -20,
                    bottom: -20,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: c.color + "12",
                    border: `1px solid ${c.color}20`,
                  }}
                />

                {/* Top row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${c.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      border: `2px solid ${c.color}35`,
                      flexShrink: 0,
                    }}
                  >
                    {c.icon}
                  </div>
                  <div
                    style={{ display: "flex", gap: 5, alignItems: "center" }}
                  >
                    <button
                      onClick={() => handleToggle(c.id)}
                      title="Toggle status"
                      style={{
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        padding: 0,
                      }}
                    >
                      <Badge color={c.isActive ? "green" : "red"} small>
                        {c.isActive ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </button>
                  </div>
                </div>

                {/* Name & slug */}
                <div style={{ marginBottom: 10 }}>
                  <h3
                    style={{
                      color: T.text,
                      fontWeight: 800,
                      fontSize: 15,
                      margin: "0 0 4px",
                    }}
                  >
                    {c.name}
                  </h3>
                  <p
                    style={{
                      color: c.color,
                      fontSize: 10.5,
                      fontFamily: "monospace",
                      margin: "0 0 6px",
                    }}
                  >
                    /{c.slug}
                  </p>
                  {c.description && (
                    <p
                      style={{
                        color: T.textSub,
                        fontSize: 11,
                        margin: 0,
                        lineHeight: 1.4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.description}
                    </p>
                  )}
                </div>

                {/* Product count bar */}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ color: T.textSub, fontSize: 10.5 }}>
                      Products
                    </span>
                    <span
                      style={{ color: c.color, fontWeight: 800, fontSize: 13 }}
                    >
                      {c.productCount}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: T.bg,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${productBarWidth}%`,
                        height: "100%",
                        background: c.color,
                        borderRadius: 3,
                        transition: "width .5s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => openEdit(c)}
                    style={{
                      flex: 1,
                      height: 32,
                      borderRadius: 8,
                      background: `${c.color}15`,
                      border: `1px solid ${c.color}30`,
                      color: c.color,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = `${c.color}25`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = `${c.color}15`)
                    }
                  >
                    <Ic.Edit /> Edit
                  </button>
                  <button
                    onClick={() => openDelete(c)}
                    disabled={c.productCount > 0}
                    title={
                      c.productCount > 0 ? "Remove products first" : "Delete"
                    }
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(248,113,113,0.1)",
                      border: "1px solid rgba(248,113,113,0.2)",
                      color: c.productCount > 0 ? T.textMut : T.red,
                      cursor: c.productCount > 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: c.productCount > 0 ? 0.4 : 1,
                      transition: "all .15s",
                    }}
                  >
                    <Ic.Trash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {viewMode === "table" && (
        <div style={{ ...card(), overflow: "hidden" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}
          >
            <thead style={{ background: T.bg2 }}>
              <tr>
                {[
                  "Category",
                  "Slug",
                  "Products",
                  "Description",
                  "Status",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, idx) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: `1px solid ${T.border}`,
                    transition: "background .12s",
                    animation: `rowIn .25s ease ${idx * 0.03}s both`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(139,90,43,0.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ padding: "12px 11px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 11 }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 11,
                          background: `${c.color}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          flexShrink: 0,
                          border: `2px solid ${c.color}35`,
                        }}
                      >
                        {c.icon}
                      </div>
                      <div>
                        <p
                          style={{
                            color: T.text,
                            fontWeight: 700,
                            fontSize: 13,
                            margin: 0,
                          }}
                        >
                          {c.name}
                        </p>
                        <div
                          style={{
                            width: 50,
                            height: 3,
                            background: c.color,
                            borderRadius: 2,
                            marginTop: 4,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 11px" }}>
                    <span
                      style={{
                        color: c.color,
                        fontWeight: 600,
                        fontSize: 11.5,
                        fontFamily: "monospace",
                        background: c.color + "12",
                        padding: "3px 8px",
                        borderRadius: 6,
                      }}
                    >
                      /{c.slug}
                    </span>
                  </td>
                  <td style={{ padding: "12px 11px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{ color: T.text, fontWeight: 700, fontSize: 14 }}
                      >
                        {c.productCount}
                      </span>
                      <div
                        style={{
                          width: 48,
                          height: 4,
                          background: T.bg,
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${totalProducts ? (c.productCount / Math.max(...categories.map((x) => x.productCount), 1)) * 100 : 0}%`,
                            height: "100%",
                            background: c.color,
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 11px" }}>
                    <span
                      style={{
                        color: T.textSub,
                        fontSize: 11.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                        maxWidth: 220,
                      }}
                    >
                      {c.description || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 11px" }}>
                    <button
                      onClick={() => handleToggle(c.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <Badge color={c.isActive ? "green" : "red"} small>
                        {c.isActive ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </button>
                  </td>
                  <td style={{ padding: "12px 11px" }}>
                    <span style={{ color: T.textSub, fontSize: 11 }}>
                      {c.createdAt}
                    </span>
                  </td>
                  <td style={{ padding: "12px 11px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button
                        onClick={() => openEdit(c)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background: `${c.color}15`,
                          border: `1px solid ${c.color}30`,
                          color: c.color,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all .15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = `${c.color}28`)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = `${c.color}15`)
                        }
                      >
                        <Ic.Edit />
                      </button>
                      <button
                        onClick={() => openDelete(c)}
                        disabled={c.productCount > 0}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background: "rgba(248,113,113,0.1)",
                          border: "1px solid rgba(248,113,113,0.22)",
                          color: c.productCount > 0 ? T.textMut : T.red,
                          cursor:
                            c.productCount > 0 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: c.productCount > 0 ? 0.35 : 1,
                        }}
                      >
                        <Ic.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ ...card(), padding: "56px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🗂️</div>
          <p
            style={{
              color: T.textSub,
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
            }}
          >
            No categories found
          </p>
          <Btn onClick={openCreate} style={{ marginTop: 16 }}>
            <Ic.Plus /> Create Category
          </Btn>
        </div>
      )}

      {/* ── Modals ── */}
      {(modalMode === "create" || modalMode === "edit") && (
        <CategoryModal
          category={activeCategory}
          mode={modalMode}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
      {modalMode === "delete" && activeCategory && (
        <DeleteCategoryModal
          category={activeCategory}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
