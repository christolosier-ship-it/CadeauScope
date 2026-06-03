export const icons = { app:'🎁', radar:'🎯', idea:'💡', people:'🧑‍🤝‍🧑', occasions:'📅', settings:'⚙️', panic:'🚨', money:'💸', link:'🔗', photo:'📷', history:'🧾', archive:'📦' };
export function icon(name){ return icons[name] || '✨'; }
// V1 utilise des emojis. Cette couche permettra de remplacer les glyphes par des SVG inline plus tard.
