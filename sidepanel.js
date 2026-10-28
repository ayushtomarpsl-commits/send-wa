"use strict";
/* Click Sender side panel — manual. Opens WhatsApp chats with the message ready; the user presses Send. */

/* ---------------- open a chat (manual) ----------------
   Uses WhatsApp's own click-to-chat link. It opens the chat and writes the
   message into the box. It does NOT send — the user presses Send in WhatsApp.
   If WhatsApp Web is already open, that same tab is reused (no extra tab). */
function chatUrl(digits, text) {
  return "https://web.whatsapp.com/send?phone=" + digits + (text ? "&text=" + encodeURIComponent(text) : "");
}
/* WhatsApp's own desktop deep link — the app jumps to the chat with no reload. */
function chatUrlApp(digits, text) {
  return "whatsapp://send?phone=" + digits + (text ? "&text=" + encodeURIComponent(text) : "");
}
function openViaProtocol(url) {
  const a = document.createElement("a");
  a.href = url;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 1000);
}
function setOpenMsg(key) {
  const el = document.getElementById("openmsg");
  if (el) el.textContent = key ? t(key) : "";
}
function openChat(digits, text) {
  if (openMode === "app") {
    openViaProtocol(chatUrlApp(digits, text));
    setOpenMsg("o_opened_app");
    return;
  }
  const url = chatUrl(digits, text);
  if (!chrome || !chrome.tabs || !chrome.tabs.query) { window.open(url, "_blank", "noopener"); return; }
  chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
    const err = chrome.runtime && chrome.runtime.lastError;
    if (err || !tabs || !tabs.length) {
      chrome.tabs.create({ url, active: true });
      setOpenMsg("o_opened_new");
      return;
    }
    const tab = tabs[0];
    chrome.tabs.update(tab.id, { url, active: true }, () => { void (chrome.runtime && chrome.runtime.lastError); });
    if (tab.windowId != null && chrome.windows && chrome.windows.update) {
      chrome.windows.update(tab.windowId, { focused: true }, () => { void (chrome.runtime && chrome.runtime.lastError); });
    }
    setOpenMsg("o_opened");
  });
}

/* ---------------- i18n ---------------- */
const T = {
  en: {
    step1: "Contacts", step2: "Message", step3: "Send", back: "Back", next: "Next",
    c_title: "Who should get the message?",
    c_upload: "Upload a CSV file",
    c_paste: "Or paste numbers (one per line, or CSV text with a header row)",
    c_use_paste: "Use pasted list", c_sample: "Download sample CSV",
    c_country: "Country code for numbers without +",
    c_loaded: "Loaded: {rows} rows.", c_read_error: "Could not read this file. Save it as CSV and try again.",
    c_phone_col: "Which column has the phone numbers?",
    c_ready: "Ready", c_invalid: "Need fixing", c_dupes: "Duplicates removed", c_optout: "Opted out",
    c_invalid_list: "Rows that need fixing", c_row: "Row {n}",
    reason_empty: "empty", reason_not_a_number: "not a phone number", reason_invalid: "not a valid number",
    m_title: "Write your message", m_label: "Message",
    m_hint: "Use {{column}} to personalise. Add a fallback like {{name|Customer}} for empty values.",
    m_insert: "Insert a variable:",
    m_unknown: "These variables are not columns in your file: {vars}",
    m_preview: "Preview for {phone}", m_empty: "Write a message first.",
    r_title: "Send, one by one",
    r_hint: "Click “Open WhatsApp”. Check the message, press Send in WhatsApp, then come back and mark it sent. Tip: wait a few seconds between people.",
    r_progress: "{done} of {total} done",
    r_open: "Open WhatsApp", r_sent: "Mark sent", r_skip: "Skip", r_undo: "Undo",
    r_next_open: "Open next unsent", r_report: "Download report (CSV)", r_restart: "Start over",
    r_sent_tag: "sent", r_skipped_tag: "skipped", r_pending_tag: "to do",
    r_done_all: "All contacts handled. You can download the report below.",
    o_title: "Opt-out list",
    o_hint: "Numbers here are skipped automatically. Add anyone who replies STOP, बंद, unsubscribe, etc.",
    o_add: "Add number", o_none: "Nobody has opted out yet.", o_remove: "Remove", o_export: "Export list (CSV)",
    bad_phone: "This is not a valid phone number.",
    help_title: "How to use this panel",
    o_opened: "Chat opened in WhatsApp with your message ready. Press Send there, then come back and tap “Mark sent”.",
    o_opened_new: "WhatsApp Web was not open, so it opened in a new tab. Log in if asked, then press Send.",
    o_opened_app: "Opened in the WhatsApp app with your message ready. Press Send there, then come back and tap “Mark sent”.",
    r_all_done: "All done — nothing left to open.",
    open_mode: "Open chats in",
    open_app: "WhatsApp app (no reload)",
    open_web: "Browser (reloads)",
    app_hint: "First time Chrome will ask permission — tick “Always allow” so it stops asking. Nothing happens? Install WhatsApp for Windows, or switch to Browser.",
  },
  hi: {
    step1: "कॉन्टैक्ट", step2: "मैसेज", step3: "भेजें", back: "पीछे", next: "आगे",
    c_title: "मैसेज किसे भेजना है?",
    c_upload: "CSV फ़ाइल अपलोड करें",
    c_paste: "या नंबर पेस्ट करें (हर लाइन में एक, या हेडर वाली CSV टेक्स्ट)",
    c_use_paste: "पेस्ट की गई सूची इस्तेमाल करें", c_sample: "नमूना CSV डाउनलोड करें",
    c_country: "बिना + वाले नंबरों का देश कोड",
    c_loaded: "लोड हुआ: {rows} पंक्तियाँ।", c_read_error: "यह फ़ाइल पढ़ी नहीं जा सकी। इसे CSV में सेव करके फिर कोशिश करें।",
    c_phone_col: "फ़ोन नंबर किस कॉलम में हैं?",
    c_ready: "तैयार", c_invalid: "सुधार चाहिए", c_dupes: "दोहराए हटाए", c_optout: "ऑप्ट-आउट",
    c_invalid_list: "जिन पंक्तियों में सुधार चाहिए", c_row: "पंक्ति {n}",
    reason_empty: "ख़ाली", reason_not_a_number: "फ़ोन नंबर नहीं", reason_invalid: "सही नंबर नहीं",
    m_title: "अपना मैसेज लिखें", m_label: "मैसेज",
    m_hint: "नाम आदि के लिए {{column}} लिखें। ख़ाली होने पर {{name|Customer}} जैसा बदला शब्द डालें।",
    m_insert: "वेरिएबल डालें:",
    m_unknown: "ये वेरिएबल आपकी फ़ाइल के कॉलम नहीं हैं: {vars}",
    m_preview: "{phone} के लिए पूर्वावलोकन", m_empty: "पहले मैसेज लिखें।",
    r_title: "एक-एक करके भेजें",
    r_hint: "“WhatsApp खोलें” दबाएँ। मैसेज जाँचें, WhatsApp में Send दबाएँ, फिर यहाँ आकर ‘भेजा’ पर टिक करें। सुझाव: लोगों के बीच कुछ सेकंड रुकें।",
    r_progress: "{total} में से {done} पूरे",
    r_open: "WhatsApp खोलें", r_sent: "भेजा", r_skip: "छोड़ें", r_undo: "वापस",
    r_next_open: "अगला बिना भेजा खोलें", r_report: "रिपोर्ट डाउनलोड करें (CSV)", r_restart: "फिर से शुरू करें",
    r_sent_tag: "भेजा", r_skipped_tag: "छोड़ा", r_pending_tag: "बाक़ी",
    r_done_all: "सभी कॉन्टैक्ट हो गए। नीचे से रिपोर्ट डाउनलोड कर सकते हैं।",
    o_title: "ऑप्ट-आउट सूची",
    o_hint: "यहाँ के नंबर अपने-आप छोड़ दिए जाते हैं। जो STOP, बंद, unsubscribe आदि लिखें उन्हें जोड़ें।",
    o_add: "नंबर जोड़ें", o_none: "अभी किसी ने ऑप्ट-आउट नहीं किया।", o_remove: "हटाएँ", o_export: "सूची निर्यात करें (CSV)",
    bad_phone: "यह सही फ़ोन नंबर नहीं है।",
    help_title: "इस पैनल को कैसे इस्तेमाल करें",
    o_opened: "WhatsApp में चैट खुल गई, मैसेज तैयार है। वहाँ Send दबाएँ, फिर यहाँ आकर “भेजा” पर टिक करें।",
    o_opened_new: "WhatsApp Web खुला नहीं था, इसलिए नए टैब में खुला। पूछे तो लॉग-इन करें, फिर Send दबाएँ।",
    o_opened_app: "WhatsApp ऐप में चैट खुल गई, मैसेज तैयार है। वहाँ Send दबाएँ, फिर यहाँ “भेजा” पर टिक करें।",
    r_all_done: "सब हो गया — खोलने को कुछ बाक़ी नहीं।",
    open_mode: "चैट यहाँ खोलें",
    open_app: "WhatsApp ऐप (रीलोड नहीं)",
    open_web: "ब्राउज़र (रीलोड होता है)",
    app_hint: "पहली बार Chrome अनुमति माँगेगा — “Always allow” पर टिक करें ताकि दोबारा न पूछे। कुछ न हो? WhatsApp for Windows इंस्टॉल करें, या ब्राउज़र चुनें।",
  },
};
let LANG = localStorage.getItem("wcs:lang") === "hi" ? "hi" : "en";
function t(k, p = {}) { let s = (T[LANG] && T[LANG][k]) || T.en[k] || k; return s.replace(/\{(\w+)\}/g, (m, x) => (p[x] !== undefined ? p[x] : m)); }

/* ---------------- phone ---------------- */
const DIAL = { IN: "91", AE: "971", BD: "880", BR: "55", GB: "44", ID: "62", NP: "977", PK: "92", SA: "966", US: "1" };
const COUNTRIES = [["IN", "India (+91)"], ["AE", "UAE (+971)"], ["BD", "Bangladesh (+880)"], ["BR", "Brazil (+55)"], ["GB", "United Kingdom (+44)"], ["ID", "Indonesia (+62)"], ["NP", "Nepal (+977)"], ["PK", "Pakistan (+92)"], ["SA", "Saudi Arabia (+966)"], ["US", "United States (+1)"]];
function cleanPhone(raw, country) {
  if (raw === null || raw === undefined) return { ok: false, reason: "empty" };
  let s = (typeof raw === "number" ? Math.round(raw).toString() : String(raw)).trim();
  if (!s) return { ok: false, reason: "empty" };
  s = s.replace(/[\s\-().‎‏‪-‮]/g, "");
  if (s.startsWith("00")) s = "+" + s.slice(2);
  const cc = DIAL[country] || "91";
  if (s.startsWith("+")) {
    const d = s.slice(1);
    if (!/^\d{8,15}$/.test(d)) return { ok: false, reason: "not_a_number" };
    return { ok: true, digits: d };
  }
  if (!/^\d+$/.test(s)) return { ok: false, reason: "not_a_number" };
  let d = s.replace(/^0+/, "");
  // India first: 9123456780 is a 10-digit mobile, not a 91-prefixed number.
  if (country === "IN") {
    if (/^[6-9]\d{9}$/.test(d)) return { ok: true, digits: cc + d };
    if (/^91[6-9]\d{9}$/.test(d)) return { ok: true, digits: d };
    return { ok: false, reason: "invalid" };
  }
  if (d.startsWith(cc) && d.length - cc.length >= 8 && d.length <= 15) return { ok: true, digits: d };
  const full = cc + d;
  if (full.length >= 8 && full.length <= 15) return { ok: true, digits: full };
  return { ok: false, reason: "invalid" };
}
function fmt(d) {
  d = String(d);
  if (d.startsWith("91") && d.length === 12) return "+91 " + d.slice(2, 7) + " " + d.slice(7);
  return "+" + d;
}

/* ---------------- template ---------------- */
function normKey(n) { return String(n == null ? "" : n).trim().toLowerCase().replace(/\s+/g, "_").replace(/[^\p{L}\p{N}_]/gu, ""); }
const VAR = /\{\{\s*([^}|]+?)\s*(?:\|\s*([^}]*?))?\s*\}\}/g;
function renderTpl(tpl, vars) { return String(tpl == null ? "" : tpl).replace(VAR, (m, k, fb) => { const v = vars[normKey(k)]; if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim(); return fb !== undefined ? fb : ""; }); }
function unknownVars(tpl, keys) { const known = new Set(keys), out = []; let m; VAR.lastIndex = 0; while ((m = VAR.exec(String(tpl || "")))) { const k = normKey(m[1]); if (!known.has(k) && m[2] === undefined) out.push(k); } return [...new Set(out)]; }

/* ---------------- CSV ---------------- */
function parseCSV(text) {
  text = String(text || "").replace(/^﻿/, "");
  const rows = []; let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += c; }
    else { if (c === '"') q = true; else if (c === ",") { row.push(field); field = ""; } else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; } else if (c === "\r") { } else field += c; }
  }
  row.push(field); rows.push(row);
  return rows;
}
function looksPhone(v) { const d = String(v == null ? "" : v).replace(/\D/g, ""); return d.length >= 7 && d.length <= 15; }
function hasLetters(v) { return /\p{L}/u.test(String(v == null ? "" : v)); }
function tableFromRows(rows) {
  const clean = rows.map(r => (Array.isArray(r) ? r : [r]).map(c => (c == null ? "" : c))).filter(r => r.some(c => String(c).trim() !== ""));
  if (!clean.length) return { columns: [], records: [] };
  const width = Math.max(...clean.map(r => r.length)), first = clean[0];
  const header = first.some(hasLetters) && !first.every(c => looksPhone(c) || String(c).trim() === "");
  const used = new Set(), columns = [];
  for (let i = 0; i < width; i++) { const label = header && String(first[i] || "").trim() ? String(first[i]).trim() : (width === 1 ? "phone" : "column " + (i + 1)); let key = normKey(label) || ("column_" + (i + 1)); while (used.has(key)) key += "_"; used.add(key); columns.push({ key, label }); }
  const body = header ? clean.slice(1) : clean;
  const records = body.map(r => { const o = {}; columns.forEach((c, i) => o[c.key] = String(r[i] == null ? "" : r[i]).trim()); return o; });
  return { columns, records };
}
const PHRE = /(phone|mobile|mob|number|num|whats ?app|wa|contact|cell|tel|फ़?ोन|मोबाइल|नंबर)/i;
function detectPhoneCol(cols, recs) { let best = null, bs = -1; for (const c of cols) { const s = recs.slice(0, 50); const ratio = s.length ? s.filter(r => looksPhone(r[c.key])).length / s.length : 0; const score = ratio + (PHRE.test(c.label) ? 1 : 0); if (score > bs) { bs = score; best = c.key; } } return bs > 0.3 ? best : (cols[0] && cols[0].key) || null; }
function buildContacts(recs, phoneKey, country, optouts) {
  const valid = [], invalid = [], optedOut = []; const seen = new Set(); let dup = 0;
  recs.forEach((rec, i) => {
    const res = cleanPhone(rec[phoneKey], country);
    if (!res.ok) { invalid.push({ row: i + 1, raw: String(rec[phoneKey] || ""), reason: res.reason }); return; }
    if (seen.has(res.digits)) { dup++; return; } seen.add(res.digits);
    if (optouts[res.digits]) { optedOut.push(res.digits); return; }
    valid.push({ phone: res.digits, vars: rec });
  });
  return { valid, invalid, duplicates: dup, optedOut };
}
function toCSV(cols, rows) { const esc = v => { const s = String(v == null ? "" : v); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }; return "﻿" + [cols.map(esc).join(",")].concat(rows.map(r => r.map(esc).join(","))).join("\r\n"); }
function download(name, text, type) { const b = new Blob([text], { type: type || "text/csv;charset=utf-8" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); }

/* ---------------- opt-out ---------------- */
const OPTOUT = ["stop", "stop all", "unsubscribe", "unsub", "opt out", "optout", "cancel", "band", "band karo", "mat bhejo", "रोकें", "रोको", "बंद", "बंद करो", "मत भेजो"];

/* ---------------- storage ---------------- */
function load(k, def) { try { const v = JSON.parse(localStorage.getItem("wcs:" + k)); return v == null ? def : v; } catch (e) { return def; } }
function save(k, v) { try { localStorage.setItem("wcs:" + k, JSON.stringify(v)); } catch (e) { } }

/* ---------------- state ---------------- */
let draft = load("draft", { country: "IN", message: "", table: null, phoneKey: null });
let campaign = load("campaign", null);
let optouts = load("optouts", {});
let openMode = load("openMode", "app"); // "app" = WhatsApp Desktop (no reload), "web" = browser
let tab = "send";
let step = campaign ? 3 : 1;
let msgFlash = "";

const panel = document.getElementById("panel");
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------------- render ---------------- */
function render() { if (tab === "send") renderSend(); else if (tab === "optouts") renderOptouts(); else renderHelp(); }

function stepBar() {
  return '<ol class="steps">' + [1, 2, 3].map(s => {
    const cls = s === step ? "on" : (s < step ? "done" : "");
    return '<li class="' + cls + '"><span class="num">' + s + '</span> ' + esc(t("step" + s)) + '</li>';
  }).join("") + '</ol>';
}

function renderSend() {
  if (campaign) { renderCampaign(); return; }
  let h = stepBar();
  const country = draft.country || "IN";
  if (step === 1) {
    const res = draft.table ? buildContacts(draft.table.records, draft.phoneKey, country, optouts) : null;
    h += '<section class="card"><h2>' + esc(t("c_title")) + '</h2>';
    h += '<div class="field"><label for="f">' + esc(t("c_upload")) + '</label><input id="f" type="file" accept=".csv,.txt,text/csv"></div>';
    h += '<div class="field"><label for="pa">' + esc(t("c_paste")) + '</label><textarea id="pa" rows="4" placeholder="9876543210\n+91 91234 56780"></textarea></div>';
    h += '<div class="row"><button class="btn" id="usePaste">' + esc(t("c_use_paste")) + '</button><button class="btn ghost small" id="sample">' + esc(t("c_sample")) + '</button></div>';
    h += '<div class="field" style="margin-top:10px"><label for="cc">' + esc(t("c_country")) + '</label><select id="cc">' + COUNTRIES.map(c => '<option value="' + c[0] + '"' + (c[0] === country ? " selected" : "") + '>' + esc(c[1]) + '</option>').join("") + '</select></div>';
    if (msgFlash) h += '<p class="banner bad" role="alert">' + esc(msgFlash) + '</p>';
    if (draft.table) {
      h += '<p class="muted small">' + esc(t("c_loaded", { rows: draft.table.records.length })) + '</p>';
      h += '<div class="field"><label for="pk">' + esc(t("c_phone_col")) + '</label><select id="pk">' + draft.table.columns.map(c => '<option value="' + esc(c.key) + '"' + (c.key === draft.phoneKey ? " selected" : "") + '>' + esc(c.label) + '</option>').join("") + '</select></div>';
      if (res) {
        h += '<dl class="stats"><div class="stat good"><dt>' + esc(t("c_ready")) + '</dt><dd>' + res.valid.length + '</dd></div><div class="stat bad"><dt>' + esc(t("c_invalid")) + '</dt><dd>' + res.invalid.length + '</dd></div><div class="stat"><dt>' + esc(t("c_dupes")) + '</dt><dd>' + res.duplicates + '</dd></div><div class="stat"><dt>' + esc(t("c_optout")) + '</dt><dd>' + res.optedOut.length + '</dd></div></dl>';
        if (res.invalid.length) h += '<details><summary>' + esc(t("c_invalid_list")) + ' (' + res.invalid.length + ')</summary><ul class="list compact">' + res.invalid.slice(0, 200).map(r => '<li>' + esc(t("c_row", { n: r.row })) + ': <code>' + esc(r.raw || "—") + '</code> — ' + esc(t("reason_" + r.reason)) + '</li>').join("") + '</ul></details>';
      }
    }
    h += '</section>';
    h += '<div class="nav-row"><span></span><button class="btn primary" id="next1"' + ((res && res.valid.length) ? "" : " disabled") + '>' + esc(t("next")) + '</button></div>';
  } else if (step === 2) {
    const cols = (draft.table && draft.table.columns) || [];
    const res = buildContacts(draft.table.records, draft.phoneKey, country, optouts);
    const c0 = res.valid[0];
    const unk = unknownVars(draft.message, cols.map(c => c.key));
    h += '<section class="card"><h2>' + esc(t("m_title")) + '</h2>';
    h += '<div class="field"><label for="msg">' + esc(t("m_label")) + '</label><textarea id="msg" rows="7">' + esc(draft.message) + '</textarea><p class="hint">' + esc(t("m_hint")) + '</p></div>';
    if (cols.length) h += '<div class="vars"><span class="muted small">' + esc(t("m_insert")) + '</span>' + cols.map(c => '<button class="chip" data-var="' + esc(c.key) + '">{{' + esc(c.key) + '}}</button>').join("") + '</div>';
    if (unk.length) h += '<p class="banner warn">' + esc(t("m_unknown", { vars: unk.join(", ") })) + '</p>';
    if (c0) h += '<div class="card" style="margin:10px 0 0"><strong>' + esc(t("m_preview", { phone: fmt(c0.phone) })) + '</strong><div class="bubble" style="margin-top:6px">' + (renderTpl(draft.message, c0.vars) ? esc(renderTpl(draft.message, c0.vars)) : '<em class="muted">' + esc(t("m_empty")) + '</em>') + '</div></div>';
    h += '</section>';
    h += '<div class="nav-row"><button class="btn" id="back2">' + esc(t("back")) + '</button><button class="btn primary" id="next2"' + (draft.message.trim() ? "" : " disabled") + '>' + esc(t("next")) + '</button></div>';
  }
  panel.innerHTML = h;
  wireSend();
}

function startCampaign() {
  const country = draft.country || "IN";
  const res = buildContacts(draft.table.records, draft.phoneKey, country, optouts);
  campaign = { id: "c" + Date.now(), name: "List of " + res.valid.length, message: draft.message, columns: draft.table.columns, items: res.valid.map(c => ({ phone: c.phone, vars: c.vars, status: "pending" })) };
  save("campaign", campaign);
  render();
}

function renderCampaign() {
  const items = campaign.items;
  const done = items.filter(i => i.status !== "pending").length;
  const sent = items.filter(i => i.status === "sent").length;
  const pct = items.length ? Math.round(done / items.length * 100) : 0;
  let h = '<section class="card"><h2>' + esc(t("r_title")) + '</h2><p class="muted small">' + esc(t("r_hint")) + '</p>';
  h += '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>';
  h += '<p class="small">' + esc(t("r_progress", { done: done, total: items.length })) + ' · ' + esc(t("r_sent_tag")) + ' ' + sent + '</p>';
  h += '<div class="row"><button class="btn primary" id="nextOpen"' + (done === items.length ? " disabled" : "") + '>' + esc(t("r_next_open")) + '</button><button class="btn ghost small" id="report">' + esc(t("r_report")) + '</button><button class="btn ghost small danger" id="restart">' + esc(t("r_restart")) + '</button></div>';
  h += '<div class="row" style="margin-top:9px"><span class="small muted">' + esc(t("open_mode")) + ':</span>' +
    '<button class="chip' + (openMode === "app" ? " on" : "") + '" data-mode="app" aria-pressed="' + (openMode === "app") + '">' + esc(t("open_app")) + '</button>' +
    '<button class="chip' + (openMode === "web" ? " on" : "") + '" data-mode="web" aria-pressed="' + (openMode === "web") + '">' + esc(t("open_web")) + '</button></div>';
  if (openMode === "app") h += '<p class="hint">' + esc(t("app_hint")) + '</p>';
  h += '<p id="openmsg" class="small muted" aria-live="polite" style="margin:8px 0 0"></p>';
  if (done === items.length) h += '<p class="banner good">' + esc(t("r_done_all")) + '</p>';
  h += '</section>';
  h += items.map((it, i) => {
    const text = renderTpl(campaign.message, it.vars);
    const cls = it.status === "sent" ? "is-sent" : (it.status === "skipped" ? "is-skipped" : "");
    const tag = it.status === "sent" ? '<span class="tag sent">' + esc(t("r_sent_tag")) + '</span>' : (it.status === "skipped" ? '<span class="tag skipped">' + esc(t("r_skipped_tag")) + '</span>' : '<span class="tag pending">' + esc(t("r_pending_tag")) + '</span>');
    let act;
    if (it.status === "pending") {
      act = '<button class="btn wa small" data-open="' + i + '">' + esc(t("r_open")) + '</button>' +
        '<button class="btn small" data-mark="' + i + '" data-st="sent">' + esc(t("r_sent")) + '</button>' +
        '<button class="btn small ghost" data-mark="' + i + '" data-st="skipped">' + esc(t("r_skip")) + '</button>';
    } else {
      act = '<button class="btn small ghost" data-open="' + i + '">' + esc(t("r_open")) + '</button>' +
        '<button class="btn small ghost" data-mark="' + i + '" data-st="pending">' + esc(t("r_undo")) + '</button>';
    }
    return '<div class="sendrow ' + cls + '" id="row' + i + '"><div class="who"><b>' + esc(fmt(it.phone)) + ' ' + tag + '</b><span class="pv">' + esc(text || "—") + '</span></div><div class="act">' + act + '</div></div>';
  }).join("");
  panel.innerHTML = h;
  wireCampaign();
}

function renderOptouts() {
  const entries = Object.entries(optouts).sort((a, b) => (b[1].at || 0) - (a[1].at || 0));
  let h = '<section class="card"><h2>' + esc(t("o_title")) + '</h2><p class="muted small">' + esc(t("o_hint")) + '</p>';
  h += '<div class="row"><input id="opn" type="tel" placeholder="98765 43210" style="flex:1;min-width:120px"><select id="occ" style="width:auto">' + COUNTRIES.map(c => '<option value="' + c[0] + '"' + (c[0] === (draft.country || "IN") ? " selected" : "") + '>' + esc(c[1]) + '</option>').join("") + '</select><button class="btn" id="oadd">' + esc(t("o_add")) + '</button></div>';
  if (msgFlash) h += '<p class="banner bad" role="alert">' + esc(msgFlash) + '</p>';
  if (!entries.length) h += '<p class="muted">' + esc(t("o_none")) + '</p>';
  else {
    h += '<ul class="list compact">' + entries.map(([k, v]) => '<li class="row between"><span>' + esc(fmt(k)) + ' <span class="muted small">· ' + (v.via === "manual" ? "added" : "STOP") + '</span></span><button class="btn small ghost" data-del="' + esc(k) + '">' + esc(t("o_remove")) + '</button></li>').join("") + '</ul>';
    h += '<button class="btn ghost small" id="oexport">' + esc(t("o_export")) + '</button>';
  }
  h += '</section>';
  panel.innerHTML = h;
  wireOptouts();
}

function renderHelp() {
  panel.innerHTML = '<section class="card"><h2>' + esc(t("help_title")) + '</h2>' +
    '<div class="Lb en"><ol>' +
    '<li>Open and log in to <b>WhatsApp Web</b> (web.whatsapp.com) once in this browser.</li>' +
    '<li><b>Contacts:</b> upload a CSV or paste numbers. From Excel use <i>File &rsaquo; Save As &rsaquo; CSV</i>. Pick the phone column and country code.</li>' +
    '<li><b>Message:</b> write it. Use <code>{{name}}</code> to personalise, and <code>{{name|Customer}}</code> for blanks.</li>' +
    '<li><b>Send:</b> for each person click <b>Open WhatsApp</b> — the chat opens with your message ready. Read it, press <b>Send</b> in WhatsApp, come back and tap <b>Mark sent</b>. Wait a few seconds between people.</li>' +
    '<li>People who reply STOP — add them under <b>Opt-outs</b>. They are skipped next time.</li>' +
    '<li>Download a <b>report</b> when done. Everything is stored only in this browser.</li>' +
    '</ol><p class="muted small">This panel never sends by itself — you press Send each time. Only message people who agreed to hear from you.</p></div>' +
    '<div class="Lb hi"><ol>' +
    '<li>इसी ब्राउज़र में एक बार <b>WhatsApp Web</b> (web.whatsapp.com) खोलकर लॉग-इन करें।</li>' +
    '<li><b>कॉन्टैक्ट:</b> CSV अपलोड करें या नंबर पेस्ट करें। Excel से <i>File &rsaquo; Save As &rsaquo; CSV</i>। फ़ोन कॉलम और देश कोड चुनें।</li>' +
    '<li><b>मैसेज:</b> लिखें। नाम के लिए <code>{{name}}</code>, ख़ाली होने पर <code>{{name|Customer}}</code>।</li>' +
    '<li><b>भेजें:</b> हर व्यक्ति के लिए <b>WhatsApp खोलें</b> दबाएँ — चैट खुलेगी, मैसेज तैयार रहेगा। पढ़कर WhatsApp में <b>Send</b> दबाएँ, फिर यहाँ <b>भेजा</b> पर टिक करें। लोगों के बीच कुछ सेकंड रुकें।</li>' +
    '<li>जो STOP लिखें उन्हें <b>ऑप्ट-आउट</b> में जोड़ें — अगली बार वे छूट जाएँगे।</li>' +
    '<li>पूरा होने पर <b>रिपोर्ट</b> डाउनलोड करें। सारा डेटा सिर्फ़ इसी ब्राउज़र में रहता है।</li>' +
    '</ol><p class="muted small">यह पैनल ख़ुद कभी नहीं भेजता — हर बार आप Send दबाते हैं। सिर्फ़ उन्हीं को भेजें जिन्होंने सहमति दी है।</p></div>' +
    '</section>';
}

/* ---------------- wiring ---------------- */
function loadTable(table) { draft.table = table; draft.phoneKey = detectPhoneCol(table.columns, table.records); msgFlash = ""; save("draft", draft); renderSend(); }
function wireSend() {
  const f = panel.querySelector("#f");
  if (f) f.onchange = async e => { const file = e.target.files[0]; if (!file) return; try { loadTable(tableFromRows(parseCSV(await file.text()))); } catch (err) { msgFlash = t("c_read_error"); renderSend(); } };
  const up = panel.querySelector("#usePaste");
  if (up) up.onclick = () => { const v = panel.querySelector("#pa").value; if (v.trim()) loadTable(tableFromRows(parseCSV(v))); };
  const sm = panel.querySelector("#sample");
  if (sm) sm.onclick = () => download("sample-contacts.csv", toCSV(["name", "phone", "city"], [["Asha", "98XXXXXXXX", "Pune"], ["Ravi", "+91 91XXXXXXXX", "Delhi"]]));
  const cc = panel.querySelector("#cc"); if (cc) cc.onchange = e => { draft.country = e.target.value; save("draft", draft); renderSend(); };
  const pk = panel.querySelector("#pk"); if (pk) pk.onchange = e => { draft.phoneKey = e.target.value; save("draft", draft); renderSend(); };
  const n1 = panel.querySelector("#next1"); if (n1) n1.onclick = () => { step = 2; render(); };
  const b2 = panel.querySelector("#back2"); if (b2) b2.onclick = () => { step = 1; render(); };
  const n2 = panel.querySelector("#next2"); if (n2) n2.onclick = () => startCampaign();
  const msg = panel.querySelector("#msg");
  if (msg) msg.oninput = e => {
    draft.message = e.target.value; save("draft", draft);
    const prev = panel.querySelector(".bubble");
    if (prev) { const res = buildContacts(draft.table.records, draft.phoneKey, draft.country || "IN", optouts); const c0 = res.valid[0]; prev.textContent = c0 ? renderTpl(draft.message, c0.vars) : ""; }
  };
  panel.querySelectorAll("[data-var]").forEach(b => b.onclick = () => {
    const el = panel.querySelector("#msg"); const tok = "{{" + b.dataset.var + "}}"; const s = el.selectionStart, e = el.selectionEnd;
    draft.message = el.value.slice(0, s) + tok + el.value.slice(e); save("draft", draft); renderSend();
    const el2 = panel.querySelector("#msg"); el2.focus(); el2.setSelectionRange(s + tok.length, s + tok.length);
  });
}
function markItem(i, st) {
  campaign.items[i].status = st;
  campaign.items[i].at = Date.now();
  save("campaign", campaign);
  renderCampaign();
  // Move to the next person so the user can just press Enter to open the chat.
  const n = campaign.items.findIndex(x => x.status === "pending");
  if (n >= 0) {
    const btn = panel.querySelector('[data-open="' + n + '"]');
    const row = panel.querySelector("#row" + n);
    if (row) row.scrollIntoView({ block: "center", behavior: "smooth" });
    if (btn) btn.focus({ preventScroll: true });
  }
}
function openFor(i) { const it = campaign.items[i]; openChat(it.phone, renderTpl(campaign.message, it.vars)); }
function wireCampaign() {
  panel.querySelectorAll("[data-mark]").forEach(b => b.onclick = () => markItem(+b.dataset.mark, b.dataset.st));
  panel.querySelectorAll("[data-open]").forEach(b => b.onclick = () => openFor(+b.dataset.open));
  panel.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => { openMode = b.dataset.mode; save("openMode", openMode); renderCampaign(); });
  const no = panel.querySelector("#nextOpen");
  if (no) no.onclick = () => {
    const i = campaign.items.findIndex(x => x.status === "pending");
    if (i < 0) { setOpenMsg("r_all_done"); return; }
    openFor(i);
    const row = panel.querySelector("#row" + i);
    if (row) row.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const rp = panel.querySelector("#report");
  if (rp) rp.onclick = () => { const vk = (campaign.columns || []).map(c => c.key); download("report.csv", toCSV(["phone", "status", "time"].concat(vk), campaign.items.map(i => ["+" + i.phone, i.status, i.at ? new Date(i.at).toLocaleString() : ""].concat(vk.map(k => i.vars[k] || ""))))); };
  const rs = panel.querySelector("#restart");
  if (rs) rs.onclick = () => { if (confirm(LANG === "hi" ? "फिर से शुरू करें? यह सूची हट जाएगी।" : "Start over? This list will be cleared.")) { campaign = null; localStorage.removeItem("wcs:campaign"); step = 1; render(); } };
}
function wireOptouts() {
  const add = panel.querySelector("#oadd");
  if (add) add.onclick = () => { const v = panel.querySelector("#opn").value; const c = panel.querySelector("#occ").value; const r = cleanPhone(v, c); if (!r.ok) { msgFlash = t("bad_phone"); renderOptouts(); return; } optouts[r.digits] = { at: Date.now(), via: "manual" }; save("optouts", optouts); msgFlash = ""; renderOptouts(); };
  panel.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { delete optouts[b.dataset.del]; save("optouts", optouts); renderOptouts(); });
  const ex = panel.querySelector("#oexport");
  if (ex) ex.onclick = () => download("opt-outs.csv", toCSV(["phone", "how", "date"], Object.entries(optouts).map(([k, v]) => ["+" + k, v.via, new Date(v.at).toLocaleString()])));
}

/* ---------------- tabs + language ---------------- */
function setLang(l) {
  LANG = l; localStorage.setItem("wcs:lang", l);
  document.documentElement.setAttribute("data-lang", l); document.documentElement.lang = l;
  document.querySelectorAll("[data-lang-btn]").forEach(b => { const on = b.dataset.langBtn === l; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
  render();
}
document.querySelectorAll("[data-lang-btn]").forEach(b => b.onclick = () => setLang(b.dataset.langBtn));
document.querySelectorAll("#tabs [data-tab]").forEach(b => b.onclick = () => {
  tab = b.dataset.tab; msgFlash = "";
  document.querySelectorAll("#tabs [role=tab]").forEach(x => x.setAttribute("aria-selected", String(x === b)));
  panel.setAttribute("aria-labelledby", "tab-" + tab);
  render();
});
setLang(LANG);
