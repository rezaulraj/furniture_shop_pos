export const T = {
  bg: "#0d0804",
  bg2: "#150f06",
  bg3: "#1e1409",
  bg4: "#27190b",
  card: "#1c1208",
  cardHov: "#241808",
  border: "rgba(139,90,43,0.22)",
  borderHov: "rgba(205,133,63,0.4)",
  gold: "#cd853f",
  goldL: "#e8a855",
  goldD: "#8b4513",
  amber: "#f5a623",
  text: "#f5deb3",
  textSub: "#a07850",
  textMut: "#5a3d1e",
  green: "#4ade80",
  red: "#f87171",
  blue: "#60a5fa",
  yellow: "#fbbf24",
  purple: "#c084fc",
};

export const card = (extra = {}) => ({
  background: T.card,
  border: `1px solid ${T.border}`,
  borderRadius: 14,
  ...extra,
});
