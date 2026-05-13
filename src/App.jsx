import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

// ── Fertilizer section templates ─────────────────────────────────────────────
// analysisField/rateField/rateIsLiquid/lbsPerGalField drive the NPK calculator
const FS = {
  aqua: {
    label: "▸ Aqua Ammonia", headerColor: "#4a8a7a",
    borderColor: "#2a6a5a", bg: "rgba(60,120,100,0.07)", labelColor: "#5a9e8a",
    cardLabel: "💧 Aqua Ammonia", cardColor: "#4a7a6a", valueColor: "#5ab8a0",
    analysisField: "aquaAnalysis", rateField: "aquaRate",
    rateIsLiquid: true, defaultLbsPerGal: 5.15,
    fields: [
      { label: "Analysis (N-P-K)", field: "aquaAnalysis", type: "text" },
      { label: "Rate (gal/ac)", field: "aquaRate", type: "number" },
      { label: "Date", field: "aquaDate", type: "date" },
    ],
  },
  starter: {
    label: "▸ Starter Fertilizer", headerColor: "#8a7a3a",
    borderColor: "#6a5a1a", bg: "rgba(120,100,40,0.07)", labelColor: "#9a8e4a",
    cardLabel: "🌱 Starter", cardColor: "#7a6a2a", valueColor: "#c8aa4e",
    analysisField: "starterAnalysis", rateField: "starterRate", rateIsLiquid: false,
    fields: [
      { label: "Product", field: "starterProduct", type: "text" },
      { label: "Analysis (N-P-K)", field: "starterAnalysis", type: "text" },
      { label: "Rate (lbs/ac)", field: "starterRate", type: "number" },
      { label: "Date", field: "starterDate", type: "date" },
    ],
  },
  topdress: {
    label: "▸ Topdress", headerColor: "#7a6a9a",
    borderColor: "#5a4a7a", bg: "rgba(100,80,140,0.07)", labelColor: "#9a8ebc",
    cardLabel: "⬆️ Topdress", cardColor: "#6a5a8a", valueColor: "#a890d8",
    analysisField: "topdressAnalysis", rateField: "topdressRate", rateIsLiquid: false,
    fields: [
      { label: "Product", field: "topdressProduct", type: "text" },
      { label: "Analysis (N-P-K)", field: "topdressAnalysis", type: "text" },
      { label: "Rate (lbs/ac)", field: "topdressRate", type: "number" },
      { label: "Date", field: "topdressDate", type: "date" },
    ],
  },
  preplant: {
    label: "▸ Preplant (Broadcast)", headerColor: "#8a7a3a",
    borderColor: "#6a5a1a", bg: "rgba(120,100,40,0.07)", labelColor: "#9a8e4a",
    cardLabel: "🌱 Preplant", cardColor: "#7a6a2a", valueColor: "#c8aa4e",
    analysisField: "preplantAnalysis", rateField: "preplantRate", rateIsLiquid: false,
    fields: [
      { label: "Product", field: "preplantProduct", type: "text" },
      { label: "Analysis (N-P-K)", field: "preplantAnalysis", type: "text" },
      { label: "Rate (lbs/ac)", field: "preplantRate", type: "number" },
      { label: "Date", field: "preplantDate", type: "date" },
    ],
  },
  fert1: {
    label: "▸ Fertigation #1", headerColor: "#4a8a7a",
    borderColor: "#2a6a5a", bg: "rgba(60,120,100,0.07)", labelColor: "#5a9e8a",
    cardLabel: "💧 Fertigation #1", cardColor: "#4a7a6a", valueColor: "#5ab8a0",
    analysisField: "fert1Analysis", rateField: "fert1Rate",
    rateIsLiquid: true, lbsPerGalField: "fert1LbsPerGal",
    fields: [
      { label: "Product", field: "fert1Product", type: "text" },
      { label: "Analysis (N-P-K)", field: "fert1Analysis", type: "text" },
      { label: "Rate (gal/ac)", field: "fert1Rate", type: "number" },
      { label: "Solution Wt (lbs/gal)", field: "fert1LbsPerGal", type: "number" },
      { label: "Date", field: "fert1Date", type: "date" },
    ],
  },
  fert2: {
    label: "▸ Fertigation #2", headerColor: "#4a7a8a",
    borderColor: "#2a5a6a", bg: "rgba(60,100,120,0.07)", labelColor: "#5a8e9e",
    cardLabel: "💧 Fertigation #2", cardColor: "#3a6a7a", valueColor: "#6ab8d0",
    analysisField: "fert2Analysis", rateField: "fert2Rate",
    rateIsLiquid: true, lbsPerGalField: "fert2LbsPerGal",
    fields: [
      { label: "Product", field: "fert2Product", type: "text" },
      { label: "Analysis (N-P-K)", field: "fert2Analysis", type: "text" },
      { label: "Rate (gal/ac)", field: "fert2Rate", type: "number" },
      { label: "Solution Wt (lbs/gal)", field: "fert2LbsPerGal", type: "number" },
      { label: "Date", field: "fert2Date", type: "date" },
    ],
  },
  fert3: {
    label: "▸ Fertigation #3", headerColor: "#5a6a8a",
    borderColor: "#3a4a6a", bg: "rgba(80,100,140,0.07)", labelColor: "#7a8eae",
    cardLabel: "💧 Fertigation #3", cardColor: "#4a5a7a", valueColor: "#8aaad0",
    analysisField: "fert3Analysis", rateField: "fert3Rate",
    rateIsLiquid: true, lbsPerGalField: "fert3LbsPerGal",
    fields: [
      { label: "Product", field: "fert3Product", type: "text" },
      { label: "Analysis (N-P-K)", field: "fert3Analysis", type: "text" },
      { label: "Rate (gal/ac)", field: "fert3Rate", type: "number" },
      { label: "Solution Wt (lbs/gal)", field: "fert3LbsPerGal", type: "number" },
      { label: "Date", field: "fert3Date", type: "date" },
    ],
  },
  sidedress: {
    label: "▸ Sidedress (V4–V6)", headerColor: "#7a6a9a",
    borderColor: "#5a4a7a", bg: "rgba(100,80,140,0.07)", labelColor: "#9a8ebc",
    cardLabel: "↕️ Sidedress", cardColor: "#6a5a8a", valueColor: "#a890d8",
    analysisField: "sidedressAnalysis", rateField: "sidedressRate", rateIsLiquid: false,
    fields: [
      { label: "Product", field: "sidedressProduct", type: "text" },
      { label: "Analysis (N-P-K)", field: "sidedressAnalysis", type: "text" },
      { label: "Rate (lbs/ac)", field: "sidedressRate", type: "number" },
      { label: "Date", field: "sidedressDate", type: "date" },
    ],
  },
  dormant: {
    label: "▸ Dormant Application (Jan–Feb)", headerColor: "#6a7a9a",
    borderColor: "#4a5a7a", bg: "rgba(80,100,140,0.07)", labelColor: "#8a9ebc",
    cardLabel: "❄️ Dormant", cardColor: "#5a6a8a", valueColor: "#9aaad0",
    analysisField: "dormantAnalysis", rateField: "dormantRate", rateIsLiquid: false,
    fields: [
      { label: "Product", field: "dormantProduct", type: "text" },
      { label: "Analysis (N-P-K)", field: "dormantAnalysis", type: "text" },
      { label: "Rate (lbs/ac)", field: "dormantRate", type: "number" },
      { label: "Date", field: "dormantDate", type: "date" },
    ],
  },
  spring: {
    label: "▸ Spring Application (Post-Bloom)", headerColor: "#5a8a4a",
    borderColor: "#3a6a2a", bg: "rgba(80,140,60,0.07)", labelColor: "#7aae6a",
    cardLabel: "🌸 Spring App.", cardColor: "#4a7a3a", valueColor: "#90d870",
    analysisField: "springAnalysis", rateField: "springRate", rateIsLiquid: false,
    fields: [
      { label: "Product", field: "springProduct", type: "text" },
      { label: "Analysis (N-P-K)", field: "springAnalysis", type: "text" },
      { label: "Rate (lbs/ac)", field: "springRate", type: "number" },
      { label: "Date", field: "springDate", type: "date" },
    ],
  },
  fertigation: {
    label: "▸ Fertigation (Season)", headerColor: "#4a8a7a",
    borderColor: "#2a6a5a", bg: "rgba(60,120,100,0.07)", labelColor: "#5a9e8a",
    cardLabel: "💧 Fertigation", cardColor: "#4a7a6a", valueColor: "#5ab8a0",
    analysisField: "fertigationAnalysis", rateField: "fertigationRate",
    rateIsLiquid: true, lbsPerGalField: "fertigationLbsPerGal",
    fields: [
      { label: "Product", field: "fertigationProduct", type: "text" },
      { label: "Analysis (N-P-K)", field: "fertigationAnalysis", type: "text" },
      { label: "Rate (gal/ac/app)", field: "fertigationRate", type: "number" },
      { label: "Solution Wt (lbs/gal)", field: "fertigationLbsPerGal", type: "number" },
      { label: "# Applications", field: "fertigationApps", type: "number" },
      { label: "Start Date", field: "fertigationDate", type: "date" },
    ],
  },
  foliar: {
    label: "▸ Foliar Spray (Zinc / Boron)", headerColor: "#8a6a4a",
    borderColor: "#6a4a2a", bg: "rgba(140,100,60,0.07)", labelColor: "#ae8a6a",
    cardLabel: "🌿 Foliar", cardColor: "#7a5a3a", valueColor: "#d0a870",
    fields: [
      { label: "Product", field: "foliarProduct", type: "text" },
      { label: "Rate (lbs/ac)", field: "foliarRate", type: "number" },
      { label: "Date", field: "foliarDate", type: "date" },
    ],
  },
};

const CROP_CONFIGS = {
  rice: {
    label: "Rice", icon: "🌾",
    varietyGroups: [
      { label: "CA Medium Grain", items: ["M-105","M-202","M-204","M-205","M-206","M-207","M-208","M-209","M-210","M-211"] },
      { label: "CA Short Grain", items: ["S-102","S-201"] },
      { label: "CA Long Grain", items: ["L-204","L-205","L-206"] },
      { label: "Other", items: ["Jasmine","Basmati","Arborio","Glutinous","Brown Rice","Wild Rice","Other"] },
    ],
    yieldLabel: "Total Harvest (cwt)", yieldUnit: "cwt",
    extraFields: [],
    fertSections: [FS.aqua, FS.starter, FS.topdress],
    showNPK: true,
  },
  tomatoes: {
    label: "Processing Tomatoes", icon: "🍅",
    varieties: [
      "Heinz 2401","Heinz 3402","HMX 7883","HMX 7884","AB-2","AB-2 Improved",
      "Halley 3155","Halley 3254","Escalon","Escalade","Peto 696",
      "BHN 444","BHN 602","BHN 836","BHN 968",
      "Zenith","Brigade","Rugged","Revenge","Tempest","Momentum",
      "CalRed","Hypeel 45","Imperial","Blazer","Other"
    ],
    yieldLabel: "Total Harvest (tons)", yieldUnit: "tons",
    extraFields: [
      { label: "Brix", field: "brix", type: "number" },
      { label: "Processor / Contract", field: "processor", type: "text" },
    ],
    fertSections: [FS.preplant, FS.sidedress],
    hasFertigationLog: true,
    showNPK: false,
  },
  wheat: {
    label: "Wheat", icon: "🌿",
    varieties: ["WB4458","WB4303","Yecora Rojo","Patwin","UC Drought Tolerant","Other"],
    yieldLabel: "Total Harvest (cwt)", yieldUnit: "cwt",
    extraFields: [
      { label: "Seeding Rate (lbs/ac)", field: "seedingRate", type: "number" },
      { label: "Protein %", field: "protein", type: "number" },
      { label: "Test Weight (lbs/bu)", field: "testWeight", type: "number" },
    ],
    fertSections: [FS.starter, FS.topdress],
    showNPK: false,
  },
  corn: {
    label: "Corn", icon: "🌽",
    varieties: ["DeKalb DKC","Pioneer P","NK Brand","Syngenta","Other"],
    yieldLabel: "Total Harvest (bu)", yieldUnit: "bu",
    extraFields: [
      { label: "Population (seeds/ac)", field: "population", type: "number" },
    ],
    fertSections: [FS.starter, FS.sidedress, FS.topdress],
    showNPK: false,
  },
  almonds: {
    label: "Almonds", icon: "🌰",
    varieties: ["Nonpareil","Carmel","Butte","Padre","Wood Colony","Independence","Shasta","Other"],
    yieldLabel: "Total Harvest (lbs)",
    isPerennial: true,
    extraFields: [],
    fertSections: [FS.dormant, FS.spring, FS.foliar],
    hasFertigationLog: true,
    showNPK: false,
  },
  sunflowers: {
    label: "Sunflowers", icon: "🌻",
    varieties: ["Croplan","Dekalb","Pioneer","Triumph","Other"],
    yieldLabel: "Total Harvest (lbs)",
    extraFields: [],
    fertSections: [FS.starter, FS.topdress],
    showNPK: false,
  },
  walnuts: {
    label: "Walnuts", icon: "🌳",
    varieties: ["Chandler","Hartley","Howard","Tulare","Vina","Franquette","Serr","Chico","Other"],
    yieldLabel: "Total Harvest (lbs)",
    isPerennial: true,
    extraFields: [
      { label: "Hull Split Date", field: "hullSplitDate", type: "date" },
    ],
    fertSections: [FS.dormant, FS.spring, FS.foliar],
    hasFertigationLog: true,
    showNPK: false,
  },
  pistachios: {
    label: "Pistachios", icon: "🫘",
    varieties: ["Kerman","Golden Hills","Lost Hills","Platinum","Randy","Peters","Gumdrop","Other"],
    yieldLabel: "Total Harvest (lbs)",
    isPerennial: true,
    extraFields: [
      { label: "Hull Split Date", field: "hullSplitDate", type: "date" },
    ],
    fertSections: [FS.dormant, FS.spring, FS.foliar],
    hasFertigationLog: true,
    showNPK: false,
  },
  pecans: {
    label: "Pecans", icon: "🥜",
    varieties: ["Wichita","Western","Desirable","Cheyenne","Sioux","Kiowa","Stuart","Pawnee","Other"],
    yieldLabel: "Total Harvest (lbs)",
    isPerennial: true,
    extraFields: [],
    fertSections: [FS.dormant, FS.spring, FS.foliar],
    hasFertigationLog: true,
    showNPK: false,
  },
};

const VARIETIES = [
  "M-105", "M-202", "M-204", "M-205", "M-206", "M-207", "M-208", "M-209", "M-210", "M-211",
  "S-102", "S-201", "L-204", "L-205", "L-206",
  "Jasmine", "Basmati", "Arborio", "Glutinous", "Brown Rice", "Wild Rice", "Other"
];

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const daysUntilHarvest = (plant, yield_) => {
  if (!plant || !yield_) return null;
  return Math.round((new Date(yield_) - new Date(plant)) / 86400000);
};

const statusColor = (days) => {
  if (days === null) return "#6b6b4a";
  if (days < 0) return "#c0392b";
  if (days < 30) return "#e67e22";
  return "#2ecc71";
};

const emptyForm = {
  cropType: "rice",
  fieldNumber: "", variety: "", plantDate: "", plantYear: "", yieldDate: "", acres: "", yield_lbs: "", notes: "",
  // rice
  aquaAnalysis: "20-0-0", aquaRate: "", aquaDate: "",
  starterProduct: "", starterAnalysis: "", starterRate: "", starterDate: "",
  topdressProduct: "", topdressAnalysis: "", topdressRate: "", topdressDate: "",
  // tomatoes / grain
  preplantProduct: "", preplantAnalysis: "", preplantRate: "", preplantDate: "",
  sidedressProduct: "", sidedressAnalysis: "", sidedressRate: "", sidedressDate: "",
  // perennials
  dormantProduct: "", dormantAnalysis: "", dormantRate: "", dormantDate: "",
  springProduct: "", springAnalysis: "", springRate: "", springDate: "",
  foliarProduct: "", foliarRate: "", foliarDate: "",
  // fertigation log (replaces fert1/2/3 and fertigation flat fields)
  fertigationLog: [],
  // crop-specific extras
  brix: "", processor: "", seedingRate: "", protein: "", testWeight: "",
  population: "", hullSplitDate: "",
  // spray log
  sprayLog: [],
};

// ── NPK calculation helper ───────────────────────────────────────────────────
function parseNPK(analysis) {
  if (!analysis) return [0, 0, 0];
  const parts = analysis.toString().split("-").map(x => parseFloat(x) || 0);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}
// rate in gal/ac for aqua (liquid), lbs/ac for dry
function calcNPK(rate, analysis, isLiquid) {
  if (!rate || !analysis) return [0, 0, 0];
  const r = parseFloat(rate) || 0;
  // Aqua ammonia: ~5.15 lbs/gal weight, so gal * lbs/gal = lbs applied
  const lbsApplied = isLiquid ? r * 5.15 : r;
  const [n, p, k] = parseNPK(analysis);
  return [lbsApplied * n / 100, lbsApplied * p / 100, lbsApplied * k / 100];
}
function sumNPK(...apps) {
  return apps.reduce((acc, [n, p, k]) => [acc[0]+n, acc[1]+p, acc[2]+k], [0, 0, 0]);
}
function calcNPKTotal(r) {
  const [aN,aP,aK] = calcNPK(r.aquaRate, r.aquaAnalysis || "20-0-0", true);
  const [sN,sP,sK] = calcNPK(r.starterRate, r.starterAnalysis, false);
  const [tN,tP,tK] = calcNPK(r.topdressRate, r.topdressAnalysis, false);
  return sumNPK([aN,aP,aK],[sN,sP,sK],[tN,tP,tK]);
}
function calcSectionNPK(record, sec) {
  if (!sec.analysisField || !sec.rateField) return null;
  const analysis = record[sec.analysisField];
  const rate = parseFloat(record[sec.rateField]);
  if (!analysis || !rate) return null;
  let lbsApplied;
  if (sec.rateIsLiquid) {
    const lbsPerGal = sec.lbsPerGalField
      ? (parseFloat(record[sec.lbsPerGalField]) || sec.defaultLbsPerGal)
      : sec.defaultLbsPerGal;
    if (!lbsPerGal) return null;
    lbsApplied = rate * lbsPerGal;
  } else {
    lbsApplied = rate;
  }
  const [n, p, k] = parseNPK(analysis);
  if (n === 0 && p === 0 && k === 0) return null;
  return [lbsApplied * n / 100, lbsApplied * p / 100, lbsApplied * k / 100];
}
function calcFertigationLogNPK(record) {
  return (record.fertigationLog || []).reduce((acc, entry) => {
    const rate = parseFloat(entry.rate);
    const lbsPerGal = parseFloat(entry.lbsPerGal);
    const apps = parseFloat(entry.apps) || 1;
    if (!rate || !lbsPerGal || !entry.analysis) return acc;
    const lbsApplied = rate * lbsPerGal * apps;
    const [n, p, k] = parseNPK(entry.analysis);
    return [acc[0] + lbsApplied * n / 100, acc[1] + lbsApplied * p / 100, acc[2] + lbsApplied * k / 100];
  }, [0, 0, 0]);
}

// ── Print Modal ─────────────────────────────────────────────────────────────
function PrintModal({ r, onClose }) {
  const days = r.plantDate && r.yieldDate
    ? Math.round((new Date(r.yieldDate) - new Date(r.plantDate)) / 86400000)
    : null;

  const Row = ({ label, value }) => value ? (
    <tr>
      <td style={{ padding: "7px 10px", fontSize: 12, color: "#646474", textTransform: "uppercase", letterSpacing: "0.1em", width: "45%", borderBottom: "1px solid #eef4d8" }}>{label}</td>
      <td style={{ padding: "7px 10px", fontSize: 13, fontWeight: 600, color: "#1a1a0a", borderBottom: "1px solid #eef4d8" }}>{value}</td>
    </tr>
  ) : null;

  const Section = ({ title, children }) => {
    const kids = Array.isArray(children) ? children.filter(Boolean) : [children].filter(Boolean);
    if (!kids.length) return null;
    return (
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#787888", borderBottom: "1px solid #d8e0c0", paddingBottom: 4, marginBottom: 8 }}>{title}</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}><tbody>{kids}</tbody></table>
      </div>
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", color: "#1a1a0a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", width: "100%", maxWidth: 680, borderRadius: 12, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.55)" }}>

        {/* Modal toolbar */}
        <div style={{ background: "#242432", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#9ec89e", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>🖨 Field Summary — Print Preview</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => window.print()}
              style={{ background: "#4d7a52", border: "none", color: "#fff", padding: "7px 18px", fontSize: 12, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2 }}>
              Print / Save PDF
            </button>
            <button onClick={onClose}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "7px 14px", fontSize: 12, fontFamily: "inherit", cursor: "pointer", borderRadius: 2 }}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* Printable content */}
        <div id="print-area" style={{ padding: "36px 40px" }}>
          <style>{`@media print { body * { visibility: hidden; } #print-area, #print-area * { visibility: visible; } #print-area { position: fixed; top: 0; left: 0; width: 100%; padding: 28px 40px; } }`}</style>

          {/* Header */}
          <div style={{ borderBottom: "3px solid #384040", paddingBottom: 14, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#242432", letterSpacing: "0.04em" }}>🌾 GOLDEN STATE GROWER</div>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#787888", marginTop: 3 }}>Field Summary Report</div>
            </div>
            <div style={{ fontSize: 11, color: "#9a9a7a", textAlign: "right" }}>
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}<br/>
              Field Record Manager
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {r.fieldNumber && <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", background: "#e8f0f8", color: "#2a5a8a", padding: "3px 10px", borderRadius: 3, fontWeight: 600 }}>Field #{r.fieldNumber}</span>}
            <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", background: "#eef4d8", color: "#383848", padding: "3px 10px", borderRadius: 3, fontWeight: 600 }}>{r.variety}</span>
          </div>

          {/* Notes */}
          {r.notes && <div style={{ background: "#f5f8ec", borderLeft: "3px solid #8aaa3a", padding: "10px 14px", fontSize: 13, color: "#2e2e38", marginBottom: 18, fontStyle: "italic" }}>{r.notes}</div>}

          <Section title="Crop Info">
            {r.plantYear ? <Row label="Plant Year" value={r.plantYear} /> : <Row label="Plant Date" value={formatDate(r.plantDate)} />}
            <Row label="Harvest / Yield Date" value={formatDate(r.yieldDate)} />
            <Row label="Growth Days" value={days !== null ? `${days} days` : null} />
{r.yield_lbs > 0 && (() => {
              const rcfg = CROP_CONFIGS[r.cropType] || CROP_CONFIGS.rice;
              const unit = rcfg.yieldUnit || "lbs";
              const val = Number(r.yield_lbs);
              const displayVal = `${Number.isInteger(val) ? val.toLocaleString() : val.toFixed(1)} ${unit}`;
              const acres = parseFloat(r.acres);
              const perAc = acres > 0 ? `${(val / acres).toFixed(1)} ${unit}/ac` : null;
              return (<>
                <Row label="Acres" value={r.acres > 0 ? `${r.acres} ac` : null} />
                <Row label="Total Harvest" value={displayVal} />
                {perAc && <Row label="Yield per Acre" value={perAc} />}
              </>);
            })()}
          </Section>

          {(() => {
            const rcfg = CROP_CONFIGS[r.cropType] || CROP_CONFIGS.rice;
            return rcfg.fertSections.map((sec, si) => {
              const filled = sec.fields.filter(f => r[f.field]);
              if (!filled.length) return null;
              const secTitle = sec.label.replace(/^▸\s*/, "");
              return (
                <Section key={si} title={`Fertilizer — ${secTitle}`}>
                  {filled.map(f => (
                    <Row key={f.field} label={f.label}
                      value={f.type === "date" ? (r[f.field] ? formatDate(r[f.field]) : null) : (r[f.field] || null)} />
                  ))}
                </Section>
              );
            });
          })()}

          {(() => {
            const rcfg = CROP_CONFIGS[r.cropType] || CROP_CONFIGS.rice;
            const secNPKs = rcfg.fertSections.map(sec => calcSectionNPK(r, sec)).filter(Boolean);
            const fNPK = calcFertigationLogNPK(r);
            const base = secNPKs.reduce((acc, [n,p,k]) => [acc[0]+n,acc[1]+p,acc[2]+k], [0,0,0]);
            const [totN, totP, totK] = [base[0]+fNPK[0], base[1]+fNPK[1], base[2]+fNPK[2]];
            const fmt = v => v > 0 ? `${v.toFixed(1)} lbs/ac` : "—";
            return (totN > 0 || totP > 0 || totK > 0) ? (
              <Section title="N-P-K Totals (lbs/ac applied)">
                <Row label="Total Nitrogen (N)" value={fmt(totN)} />
                <Row label="Total Phosphorus (P₂O₅)" value={fmt(totP)} />
                <Row label="Total Potassium (K₂O)" value={fmt(totK)} />
              </Section>
            ) : null;
          })()}

          {(r.fertigationLog || []).length > 0 && (
            <Section title="Fertigation Log">
              {(r.fertigationLog || []).map((entry, idx) => (
                <React.Fragment key={idx}>
                  <Row label={`#${idx+1} Product`} value={entry.product} />
                  <Row label={`#${idx+1} Analysis`} value={entry.analysis} />
                  <Row label={`#${idx+1} Rate`} value={entry.rate ? `${entry.rate} gal/ac/app` : null} />
                  <Row label={`#${idx+1} Solution Wt`} value={entry.lbsPerGal ? `${entry.lbsPerGal} lbs/gal` : null} />
                  <Row label={`#${idx+1} Applications`} value={entry.apps} />
                  <Row label={`#${idx+1} Date`} value={entry.date ? formatDate(entry.date) : null} />
                </React.Fragment>
              ))}
            </Section>
          )}

          {(r.sprayLog || []).length > 0 && (
            <Section title="Spray Log">
              {(r.sprayLog || []).map((entry, idx) => (
                <React.Fragment key={idx}>
                  <Row label={`#${idx+1} Type`} value={entry.type} />
                  <Row label={`#${idx+1} Product`} value={entry.product} />
                  <Row label={`#${idx+1} Rate`} value={entry.rate ? `${entry.rate} ${entry.unit||"gal"}/ac` : null} />
                  <Row label={`#${idx+1} Date`} value={entry.date ? formatDate(entry.date) : null} />
                </React.Fragment>
              ))}
            </Section>
          )}

          {/* Footer */}
          <div style={{ marginTop: 28, borderTop: "1px solid #d0d8b0", paddingTop: 10, fontSize: 10, color: "#aaa", letterSpacing: "0.1em", display: "flex", justifyContent: "space-between" }}>
            <span>GOLDEN STATE GROWER — Field Record Manager</span>
            <span>Field: {r.fieldNumber || "—"} · Variety: {r.variety}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────
const SectionHeader = ({ color, label }) => (
  <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color }}>{label}</p>
);

const FertBox = ({ borderColor, bg, labelColor, fields, form, setForm }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24, padding: "16px", background: bg, borderLeft: `3px solid ${borderColor}`, borderRadius: 2 }}>
    {fields.map(({ label, field, type }) => (
      <div key={field}>
        <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: labelColor, marginBottom: 6 }}>{label}</label>
        <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
          style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.07)", border: `1px solid ${borderColor}`, color: "#e4e4e8", padding: "9px 12px", fontSize: 14, fontFamily: "Georgia, serif", borderRadius: 2, outline: "none" }} />
      </div>
    ))}
  </div>
);

// ── Load Ticket Modal ─────────────────────────────────────────────────────────
function TicketModal({ tickets, setTickets, records, setRecords, onClose }) {
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState("");
  const [filterField, setFilterField] = React.useState("all");

  function parseTickets(raw) {
    const results = [];
    const errors = [];
    // Split on "A lot closed" or "RTW closed lot" boundaries
    const chunks = raw.split(/(?=(?:A lot closed|RTW closed lot))/gi).filter(s => s.trim());
    for (const chunk of chunks) {
      try {
        const lot = (chunk.match(/lot[:\s#]+([^\s]+)/i) || [])[1] || "";
        const fieldM = chunk.match(/Field\s+([A-Z0-9-]+)/i);
        const field = fieldM ? fieldM[1].trim() : "";
        const commod = (chunk.match(/Commod[^\r\n]*/i) || [])[0]?.replace(/Commod[:\s]+/i,"")?.trim() || "";
        const loads = parseFloat((chunk.match(/Loads[:\s]+([\d.]+)/i) || [])[1] || 0);
        const moisture = parseFloat((chunk.match(/(?:Wt avg moist|moisture)[:\s]+([\d.]+)/i) || [])[1] || 0);
        const delivWt = parseFloat((chunk.match(/Deliv wt[:\s]+([\d,.]+)/i) || [])[1]?.replace(/,/g,"") || 0);
        const dryWt = parseFloat((chunk.match(/Dry wt[:\s]+([\d,.]+)/i) || [])[1]?.replace(/,/g,"") || 0);
        if (!field && !lot) { errors.push("Skipped unrecognized line"); continue; }
        results.push({
          id: Date.now() + Math.random(),
          lot, field, commod, loads, moisture, delivWt, dryWt,
          date: new Date().toISOString().split("T")[0],
        });
      } catch(e) {
        errors.push("Parse error: " + e.message);
      }
    }
    return { results, errors };
  }

  function handleAdd() {
    if (!input.trim()) return;
    const { results, errors } = parseTickets(input);
    if (results.length === 0) { setError("Could not parse any tickets. Check the format."); return; }
    const newTickets = [...tickets, ...results];
    setTickets(newTickets);
    // Update yield_lbs on matching field records with summed dry weight
    const byField = {};
    newTickets.forEach(t => {
      if (!t.field) return;
      byField[t.field] = (byField[t.field] || 0) + (t.dryWt || 0);
    });
    setRecords(prev => prev.map(r => {
      const total = byField[r.fieldNumber];
      if (total !== undefined) {
        const unit = (CROP_CONFIGS[r.cropType] || CROP_CONFIGS.rice).yieldUnit || "lbs";
        const divisors = { cwt: 100, tons: 2000, bu: 56, lbs: 1 };
        const converted = Math.round(total / (divisors[unit] || 1) * 10) / 10;
        return { ...r, yield_lbs: converted };
      }
      return r;
    }));
    setInput("");
    setError(errors.length ? errors.join("; ") : "");
  }

  function handleDelete(id) {
    const newTickets = tickets.filter(t => t.id !== id);
    setTickets(newTickets);
    // Recalculate yields
    const byField = {};
    newTickets.forEach(t => { if (t.field) byField[t.field] = (byField[t.field] || 0) + (t.dryWt || 0); });
    setRecords(prev => prev.map(r => {
      const total = byField[r.fieldNumber];
      if (total !== undefined) {
        const unit = (CROP_CONFIGS[r.cropType] || CROP_CONFIGS.rice).yieldUnit || "lbs";
        const divisors = { cwt: 100, tons: 2000, bu: 56, lbs: 1 };
        return { ...r, yield_lbs: Math.round(total / (divisors[unit] || 1) * 10) / 10 };
      }
      return { ...r };
    }));
  }

  const allFields = [...new Set(tickets.map(t => t.field).filter(Boolean))].sort();
  const displayed = filterField === "all" ? tickets : tickets.filter(t => t.field === filterField);

  // Totals by field
  const fieldTotals = {};
  tickets.forEach(t => {
    if (!t.field) return;
    if (!fieldTotals[t.field]) fieldTotals[t.field] = { loads: 0, delivWt: 0, dryWt: 0, tickets: 0 };
    fieldTotals[t.field].loads += t.loads || 0;
    fieldTotals[t.field].delivWt += t.delivWt || 0;
    fieldTotals[t.field].dryWt += t.dryWt || 0;
    fieldTotals[t.field].tickets += 1;
  });

  const thS = { padding: "7px 12px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888896", borderBottom: "2px solid #2e2e38", textAlign: "left" };
  const tdS = { padding: "7px 12px", fontSize: 12, borderBottom: "1px solid #1e1e26", color: "#e4e4e8" };
  const tdN = { padding: "7px 12px", fontSize: 12, borderBottom: "1px solid #1e1e26", color: "#9ec89e", textAlign: "right", fontVariantNumeric: "tabular-nums" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 16px", overflowY: "auto" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#141418", border: "1px solid #2e2e38", width: "100%", maxWidth: 1000, borderRadius: 12, boxShadow: "0 24px 64px rgba(0,0,0,0.65)" }}>

        {/* Header */}
        <div style={{ background: "#1c1c20", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#9ec89e", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>🚛 Load Ticket Logger</span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "7px 14px", fontSize: 12, fontFamily: "inherit", cursor: "pointer", borderRadius: 2 }}>✕ Close</button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Paste input */}
          <p style={{ margin: "0 0 8px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#787888" }}>▸ Paste load texts</p>
          <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder="Paste one or more load texts here, e.g.: RTW closed lot: 25122 Field BR-1 Commod: Medium Loads:9 Wt avg moist: 21.2 Deliv wt:4769.20 Dry wt: 4066.55"

            style={{ width: "100%", boxSizing: "border-box", height: 110, background: "rgba(255,255,255,0.06)", border: "1px solid #2e2e38", color: "#e4e4e8", padding: "10px 12px", fontSize: 13, fontFamily: "Georgia, serif", borderRadius: 2, outline: "none", resize: "vertical" }} />
          {error && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#e08870" }}>{error}</p>}
          <button onClick={handleAdd} style={{ marginTop: 10, background: "#3d6442", border: "none", color: "#fff", padding: "9px 24px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2 }}>
            + Add Tickets
          </button>
        </div>

        {/* Field totals summary */}
        {Object.keys(fieldTotals).length > 0 && (
          <div style={{ margin: "0 24px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid #1e1e26", borderRadius: 3 }}>
            <div style={{ padding: "10px 14px", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#787888", borderBottom: "1px solid #1e1e26" }}>📊 Field Totals</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                {["Field", "Tickets", "Total Loads", "Total Deliv Wt", "Total Dry Wt", "cwt", "cwt/ac"].map(h => <th key={h} style={thS}>{h}</th>)}
              </tr></thead>
              <tbody>
                {Object.entries(fieldTotals).sort(([a],[b]) => a.localeCompare(b)).map(([field, t]) => {
                  const rec = records.find(r => r.fieldNumber === field);
                  const cwt = (t.dryWt / 100).toFixed(1);
                  const cwtAc = rec && rec.acres > 0 ? (t.dryWt / 100 / parseFloat(rec.acres)).toFixed(1) : "—";
                  return (
                    <tr key={field}>
                      <td style={{ padding:"7px 12px",fontSize:12,borderBottom:"1px solid #1e1e26",color:"#aac8e8",fontWeight:600 }}>{field}</td>
                      <td style={tdN}>{t.tickets}</td>
                      <td style={tdN}>{t.loads.toFixed(0)}</td>
                      <td style={tdN}>{t.delivWt.toLocaleString(undefined, {maximumFractionDigits:0})} lbs</td>
                      <td style={tdN}>{t.dryWt.toLocaleString(undefined, {maximumFractionDigits:0})} lbs</td>
                      <td style={{ padding:"7px 12px",fontSize:12,borderBottom:"1px solid #1e1e26",color:"#d8e890",textAlign:"right" }}>{Number(cwt).toLocaleString()} cwt</td>
                      <td style={{ padding:"7px 12px",fontSize:12,borderBottom:"1px solid #1e1e26",color:"#90d8c8",textAlign:"right" }}>{cwtAc} cwt/ac</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Individual tickets */}
        {tickets.length > 0 && (
          <div style={{ margin: "0 24px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#787888" }}>▸ Individual Tickets ({tickets.length})</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#787888" }}>Filter:</span>
                <select value={filterField} onChange={e => setFilterField(e.target.value)}
                  style={{ background: "#1e1e26", border: "1px solid #2e2e38", color: "#9ec89e", padding: "4px 10px", fontSize: 11, fontFamily: "Georgia, serif", borderRadius: 2, outline: "none" }}>
                  <option value="all">All Fields</option>
                  {allFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead><tr>
                  {["Field", "Lot #", "Loads", "Moisture", "Deliv Wt", "Dry Wt", "cwt", ""].map(h => <th key={h} style={thS}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {displayed.map(t => (
                    <tr key={t.id}>
                      <td style={{ padding:"7px 12px",fontSize:12,borderBottom:"1px solid #1e1e26",color:"#aac8e8",fontWeight:600 }}>{t.field}</td>
                      <td style={tdS}>{t.lot}</td>
                      <td style={tdN}>{t.loads}</td>
                      <td style={tdN}>{t.moisture}%</td>
                      <td style={tdN}>{t.delivWt.toLocaleString(undefined, {maximumFractionDigits:2})} lbs</td>
                      <td style={tdN}>{t.dryWt.toLocaleString(undefined, {maximumFractionDigits:2})} lbs</td>
                      <td style={{ padding:"7px 12px",fontSize:12,borderBottom:"1px solid #1e1e26",color:"#d8e890",textAlign:"right" }}>{(t.dryWt/100).toFixed(1)} cwt</td>
                      <td style={{ padding:"7px 12px",fontSize:12,borderBottom:"1px solid #1e1e26",color:"#e4e4e8",textAlign:"center" }}>
                        <button onClick={() => handleDelete(t.id)} style={{ background: "#5a2a1a", border: "none", color: "#e8c0b0", padding: "3px 8px", fontSize: 11, cursor: "pointer", borderRadius: 2, fontFamily: "inherit" }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tickets.length === 0 && (
          <div style={{ padding: "32px 24px", textAlign: "center", color: "#4a5a2a" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🚛</div>
            <p style={{ fontSize: 13 }}>No tickets yet. Paste your load texts above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Report Builder Modal ──────────────────────────────────────────────────────
function ReportBuilderModal({ records, allYears, onClose }) {
  const allFieldNums = [...new Set(records.map(r=>r.fieldNumber).filter(Boolean))].sort();
  const allCrops = [...new Set(records.map(r=>r.cropType||"rice").filter(Boolean))].sort();

  const COLUMNS = [
    { key:"cropType",        label:"Crop Type",             group:"General" },
    { key:"fieldNumber",     label:"Field #",               group:"General" },
    { key:"variety",         label:"Variety",               group:"General" },
    { key:"acres",           label:"Acres",                 group:"General" },
    { key:"plantDate",       label:"Plant Date",            group:"General" },
    { key:"plantYear",       label:"Plant Year",            group:"General" },
    { key:"yieldDate",       label:"Harvest Date",          group:"General" },
    { key:"growthDays",      label:"Growth Days",           group:"General" },
    { key:"yield_raw",        label:"Yield (with units)",    group:"General" },
    { key:"yield_lbs",       label:"Yield (raw number)",    group:"General" },
    { key:"yield_cwt",       label:"Yield (with unit)",     group:"General" },
    { key:"yield_cwtac",     label:"Yield per Acre",        group:"General" },
    { key:"notes",           label:"Notes",                 group:"General" },
    { key:"aquaRate",        label:"Aqua Rate (gal/ac)",    group:"Fertilizer" },
    { key:"aquaDate",        label:"Aqua Date",             group:"Fertilizer" },
    { key:"starterProduct",  label:"Starter Product",       group:"Fertilizer" },
    { key:"starterRate",     label:"Starter Rate (lbs/ac)", group:"Fertilizer" },
    { key:"starterDate",     label:"Starter Date",          group:"Fertilizer" },
    { key:"topdressProduct", label:"Topdress Product",      group:"Fertilizer" },
    { key:"topdressRate",    label:"Topdress Rate (lbs/ac)",group:"Fertilizer" },
    { key:"topdressDate",    label:"Topdress Date",         group:"Fertilizer" },
    { key:"preplantProduct", label:"Preplant Product",      group:"Fertilizer" },
    { key:"preplantRate",    label:"Preplant Rate (lbs/ac)",group:"Fertilizer" },
    { key:"sidedressProduct",label:"Sidedress Product",     group:"Fertilizer" },
    { key:"sidedressRate",   label:"Sidedress Rate (lbs/ac)",group:"Fertilizer" },
    { key:"dormantProduct",  label:"Dormant Product",       group:"Fertilizer" },
    { key:"dormantRate",     label:"Dormant Rate (lbs/ac)", group:"Fertilizer" },
    { key:"springProduct",   label:"Spring App. Product",   group:"Fertilizer" },
    { key:"springRate",      label:"Spring App. Rate",      group:"Fertilizer" },
    { key:"fertigCount",     label:"Fertigation Events",    group:"Fertilizer" },
    { key:"npk_n",           label:"Total N (lbs/ac)",      group:"NPK" },
    { key:"npk_p",           label:"Total P (lbs/ac)",      group:"NPK" },
    { key:"npk_k",           label:"Total K (lbs/ac)",      group:"NPK" },
    { key:"sprayCount",      label:"Spray Events",          group:"Spray Log" },
    { key:"spray1Type",      label:"1st Spray Type",        group:"Spray Log" },
    { key:"spray1Product",   label:"1st Spray Product",     group:"Spray Log" },
    { key:"spray1Rate",      label:"1st Spray Rate",        group:"Spray Log" },
    { key:"spray1Date",      label:"1st Spray Date",        group:"Spray Log" },
    { key:"brix",            label:"Brix",                  group:"Crop Details" },
    { key:"processor",       label:"Processor",             group:"Crop Details" },
    { key:"seedingRate",     label:"Seeding Rate",          group:"Crop Details" },
    { key:"protein",         label:"Protein %",             group:"Crop Details" },
    { key:"testWeight",      label:"Test Weight",           group:"Crop Details" },
    { key:"population",      label:"Population",            group:"Crop Details" },
    { key:"hullSplitDate",   label:"Hull Split Date",       group:"Crop Details" },
  ];

  const GROUPS = [...new Set(COLUMNS.map(c=>c.group))];

  const [selectedCols, setSelectedCols] = React.useState(["cropType","fieldNumber","variety","acres","plantDate","plantYear","yieldDate","yield_raw","notes"]);
  const [filterYear,    setFilterYear]    = React.useState("all");
  const [filterCrop,    setFilterCrop]    = React.useState("all");
  const [filterVariety, setFilterVariety] = React.useState("all");
  const [filterField,   setFilterField]   = React.useState("all");
  const [reportTitle,   setReportTitle]   = React.useState("Custom Field Report");
  const [sortCol,       setSortCol]       = React.useState("fieldNumber");
  const [sortDir,       setSortDir]       = React.useState("asc");

  const allVarieties = React.useMemo(() =>
    [...new Set(records.filter(r => filterCrop === "all" || (r.cropType||"rice") === filterCrop).map(r=>r.variety).filter(Boolean))].sort(),
    [records, filterCrop]
  );
  React.useEffect(() => { setFilterVariety("all"); }, [filterCrop]);

  const toggleCol = col => setSelectedCols(prev => prev.includes(col) ? prev.filter(c=>c!==col) : [...prev, col]);
  const toggleSort = col => { if (sortCol === col) setSortDir(d => d==="asc"?"desc":"asc"); else { setSortCol(col); setSortDir("asc"); } };

  const getVal = (r, key) => {
    const rcfg = CROP_CONFIGS[r.cropType] || CROP_CONFIGS.rice;
    if (key === "cropType") return (CROP_CONFIGS[r.cropType||"rice"]||{label:r.cropType||"Rice"}).label;
    if (key === "growthDays") { if(!r.plantDate||!r.yieldDate) return "—"; return Math.round((new Date(r.yieldDate)-new Date(r.plantDate))/86400000)+"d"; }
    if (key === "yield_raw") { if(!r.yield_lbs||r.yield_lbs<=0) return "—"; const cfg=CROP_CONFIGS[r.cropType||"rice"]||CROP_CONFIGS.rice; const u=cfg.yieldUnit||"lbs"; const v=Number(r.yield_lbs); return `${Number.isInteger(v)?v.toLocaleString():v.toFixed(1)} ${u}`; }
    if (key === "yield_cwt") { const u=(CROP_CONFIGS[r.cropType||"rice"]||CROP_CONFIGS.rice).yieldUnit||"lbs"; return r.yield_lbs>0?`${Number(r.yield_lbs).toLocaleString()} ${u}`:"—"; }
    if (key === "yield_cwtac") { const cfg=CROP_CONFIGS[r.cropType||"rice"]||CROP_CONFIGS.rice; const u=cfg.yieldUnit||"lbs"; const ac=parseFloat(r.acres)||0; return r.yield_lbs>0&&ac>0?`${(Number(r.yield_lbs)/ac).toFixed(1)} ${u}/ac`:"—"; }
    if (["plantDate","yieldDate","aquaDate","starterDate","topdressDate","preplantDate","sidedressDate","dormantDate","springDate","hullSplitDate"].includes(key)) return r[key]?formatDate(r[key]):"—";
    if (key === "fertigCount") return (r.fertigationLog||[]).length || "—";
    if (key === "sprayCount") return (r.sprayLog||[]).length || "—";
    if (key === "spray1Type") return (r.sprayLog||[])[0]?.type || "—";
    if (key === "spray1Product") return (r.sprayLog||[])[0]?.product || "—";
    if (key === "spray1Rate") { const e=(r.sprayLog||[])[0]; return e?.rate?`${e.rate} ${e.unit||"gal"}/ac`:"—"; }
    if (key === "spray1Date") { const e=(r.sprayLog||[])[0]; return e?.date?formatDate(e.date):"—"; }
    if (key === "npk_n" || key === "npk_p" || key === "npk_k") {
      const secNPKs = rcfg.fertSections.map(sec => calcSectionNPK(r, sec)).filter(Boolean);
      const fNPK = calcFertigationLogNPK(r);
      const base = secNPKs.reduce((acc,[n,p,k])=>[acc[0]+n,acc[1]+p,acc[2]+k],[0,0,0]);
      const tot = [base[0]+fNPK[0], base[1]+fNPK[1], base[2]+fNPK[2]];
      const idx = key==="npk_n"?0:key==="npk_p"?1:2;
      return tot[idx]>0?tot[idx].toFixed(1):"—";
    }
    return r[key]||"—";
  };

  const getSortVal = (r, col) => {
    const v = getVal(r, col);
    const n = parseFloat(v);
    return isNaN(n) ? (v === "—" ? "" : v.toLowerCase()) : n;
  };

  const filtered = records
    .filter(r => {
      if (filterYear!=="all" && (!r.plantDate||new Date(r.plantDate).getFullYear()!==parseInt(filterYear))) return false;
      if (filterCrop!=="all" && (r.cropType||"rice")!==filterCrop) return false;
      if (filterVariety!=="all" && r.variety!==filterVariety) return false;
      if (filterField!=="all" && r.fieldNumber!==filterField) return false;
      return true;
    })
    .sort((a, b) => {
      const av = getSortVal(a, sortCol), bv = getSortVal(b, sortCol);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

  const colLabel = key => COLUMNS.find(c=>c.key===key)?.label||key;

  const printReport = () => {
    const thead = selectedCols.map(k=>`<th>${colLabel(k)}</th>`).join("");
    const tbody = filtered.map(r=>`<tr>${selectedCols.map(k=>`<td>${getVal(r,k)}</td>`).join("")}</tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${reportTitle}</title>
    <style>body{font-family:Georgia,serif;color:#1a1a0a;padding:32px 40px}h1{font-size:22px;color:#242432;margin-bottom:4px}p{font-size:11px;color:#888;letter-spacing:.1em;text-transform:uppercase;margin-bottom:24px}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#eef4d8;padding:7px 8px;text-align:left;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#383848;border-bottom:2px solid #c8d880}td{padding:6px 8px;border-bottom:1px solid #eee}tr:nth-child(even) td{background:#fafdf0}.footer{margin-top:24px;font-size:10px;color:#aaa;border-top:1px solid #ddd;padding-top:10px;display:flex;justify-content:space-between}@media print{@page{margin:.5in}}</style>
    </head><body><h1>🌾 ${reportTitle}</h1>
    <p>Golden State Grower · ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} · ${filtered.length} records · sorted by ${colLabel(sortCol)} ${sortDir}</p>
    <table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
    <div class="footer"><span>Golden State Grower — ${reportTitle}</span><span>${filtered.length} records</span></div>
    </body></html>`;
    const win = window.open("","_blank");
    if(win){win.document.write(html);win.document.close();}
  };

  const btnStyle = { background:"rgba(255,255,255,0.07)",border:"1px solid #2e2e38",color:"#e4e4e8",padding:"9px 12px",fontSize:13,fontFamily:"Georgia,serif",borderRadius:2,outline:"none" };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 16px",overflowY:"auto" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:"#141418",border:"1px solid #2e2e38",width:"100%",maxWidth:1100,borderRadius:12,boxShadow:"0 24px 64px rgba(0,0,0,0.65)" }}>

        {/* Header */}
        <div style={{ background:"#1c1c20",padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ color:"#9ec89e",fontSize:13,letterSpacing:"0.1em",textTransform:"uppercase" }}>📋 Report Builder</span>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={printReport} style={{ background:"#4d7a52",border:"none",color:"#fff",padding:"7px 18px",fontSize:12,fontFamily:"inherit",cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:2 }}>Print / PDF</button>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",padding:"7px 14px",fontSize:12,fontFamily:"inherit",cursor:"pointer",borderRadius:2 }}>✕ Close</button>
          </div>
        </div>

        <div style={{ padding:"20px 24px" }}>
          {/* Report title */}
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#787888",marginBottom:6 }}>Report Title</label>
            <input value={reportTitle} onChange={e=>setReportTitle(e.target.value)} style={{ ...btnStyle,width:"100%",maxWidth:400,boxSizing:"border-box" }} />
          </div>

          {/* Filters */}
          <p style={{ margin:"0 0 10px",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#787888" }}>▸ Filters</p>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap",marginBottom:20,padding:"16px",background:"rgba(255,255,255,0.03)",borderRadius:3,border:"1px solid #1e1e26" }}>
            {[
              ["Year",    filterYear,    setFilterYear,    [["all","All Years"],   ...allYears.map(y=>[String(y),String(y)])]],
              ["Crop",    filterCrop,    setFilterCrop,    [["all","All Crops"],   ...allCrops.map(c=>[c,(CROP_CONFIGS[c]||{label:c}).label])]],
              ["Variety", filterVariety, setFilterVariety, [["all","All Varieties"],...allVarieties.map(v=>[v,v])]],
              ["Field",   filterField,   setFilterField,   [["all","All Fields"],  ...allFieldNums.map(f=>[f,f])]],
            ].map(([label, val, set, opts]) => (
              <div key={label}>
                <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#787888",marginBottom:6 }}>{label}</label>
                <select value={val} onChange={e=>set(e.target.value)} style={btnStyle}>
                  {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            <div style={{ display:"flex",alignItems:"flex-end" }}>
              <span style={{ fontSize:12,color:"#485058",paddingBottom:10 }}>{filtered.length} record{filtered.length!==1?"s":""} match</span>
            </div>
          </div>

          {/* Column picker — template + dropdown */}
          <div style={{ display:"flex",gap:12,flexWrap:"wrap",marginBottom:16,alignItems:"flex-end" }}>
            <div>
              <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#787888",marginBottom:6 }}>Quick Template</label>
              <select onChange={e => {
                const presets = {
                  basic: ["cropType","fieldNumber","variety","acres","plantDate","plantYear","yieldDate","yield_raw","notes"],
                  fert:  ["cropType","fieldNumber","variety","acres","aquaRate","starterProduct","starterRate","preplantProduct","preplantRate","dormantProduct","dormantRate","springProduct","springRate","fertigCount","npk_n","npk_p","npk_k"],
                  npk:   ["cropType","fieldNumber","variety","acres","plantDate","plantYear","yield_raw","npk_n","npk_p","npk_k"],
                  spray: ["cropType","fieldNumber","variety","sprayCount","spray1Type","spray1Product","spray1Rate","spray1Date"],
                  full:  COLUMNS.map(c=>c.key),
                };
                if (presets[e.target.value]) setSelectedCols(presets[e.target.value]);
                e.target.value = "";
              }} style={{ ...btnStyle, minWidth:180 }}>
                <option value="">Load template…</option>
                <option value="basic">Basic Overview</option>
                <option value="fert">Fertilizer Detail</option>
                <option value="npk">NPK Summary</option>
                <option value="spray">Spray Log</option>
                <option value="full">Full Report (all columns)</option>
              </select>
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#787888",marginBottom:6 }}>Add Column</label>
              <select onChange={e => { if(e.target.value){ toggleCol(e.target.value); e.target.value=""; } }} style={{ ...btnStyle, width:"100%" }}>
                <option value="">Select a column to add…</option>
                {GROUPS.map(group => (
                  <optgroup key={group} label={group}>
                    {COLUMNS.filter(c=>c.group===group && !selectedCols.includes(c.key)).map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
          <p style={{ margin:"0 0 8px",fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:"#646474" }}>Active columns — click × to remove</p>
          <div style={{ marginBottom:20,padding:"12px 14px",background:"rgba(255,255,255,0.03)",borderRadius:6,border:"1px solid #1e1e26",minHeight:42,display:"flex",flexWrap:"wrap",gap:6,alignItems:"center" }}>
            {selectedCols.length === 0 && <span style={{ fontSize:12,color:"#4a5a2a",fontStyle:"italic" }}>No columns selected — load a template or add columns above</span>}
            {selectedCols.map(key => {
              const col = COLUMNS.find(c=>c.key===key);
              if (!col) return null;
              return (
                <div key={key} style={{ display:"flex",alignItems:"center",gap:3,background:"rgba(255,255,255,0.06)",border:"1px solid #2e2e38",color:"#9ec89e",padding:"3px 4px 3px 9px",borderRadius:6,fontSize:11 }}>
                  <span>{col.label}</span>
                  <button onClick={() => toggleCol(key)} style={{ background:"none",border:"none",color:"#888896",cursor:"pointer",padding:"0 3px",fontSize:15,lineHeight:1 }}>×</button>
                </div>
              );
            })}
          </div>

          {/* Preview with sortable headers */}
          <p style={{ margin:"0 0 10px",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#787888" }}>▸ Preview — click column header to sort</p>
          <div style={{ overflowX:"auto",border:"1px solid #1e1e26",borderRadius:3 }}>
            <table style={{ width:"100%",borderCollapse:"collapse",minWidth:400 }}>
              <thead>
                <tr style={{ background:"rgba(255,255,255,0.04)" }}>
                  {selectedCols.map(k => {
                    const active = sortCol === k;
                    return (
                      <th key={k} onClick={()=>toggleSort(k)} style={{ padding:"8px 12px",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:active?"#9ec89e":"#888896",borderBottom:"2px solid #2e2e38",textAlign:"left",whiteSpace:"nowrap",cursor:"pointer",userSelect:"none",background:active?"rgba(255,255,255,0.06)":"transparent" }}>
                        {colLabel(k)} {active?(sortDir==="asc"?"▲":"▼"):""}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0,10).map((r,i)=>(
                  <tr key={r.id} style={{ background:i%2===0?"transparent":"rgba(255,255,255,0.02)" }}>
                    {selectedCols.map(k=><td key={k} style={{ padding:"6px 12px",fontSize:12,borderBottom:"1px solid #1e1e26",color:"#9ec89e",whiteSpace:"nowrap" }}>{getVal(r,k)}</td>)}
                  </tr>
                ))}
                {filtered.length>10 && <tr><td colSpan={selectedCols.length} style={{ padding:"8px 12px",fontSize:11,color:"#485058",fontStyle:"italic",borderBottom:"1px solid #1e1e26" }}>...and {filtered.length-10} more rows in the printed report</td></tr>}
                {filtered.length===0 && <tr><td colSpan={selectedCols.length} style={{ padding:"20px 12px",fontSize:12,color:"#4a5a2a",textAlign:"center",fontStyle:"italic" }}>No records match the current filters</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardSection({ label, color, children }) {
  return (
    <div style={{ marginTop: 10, borderTop: "1px solid #2a3a1a", paddingTop: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color, marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

function StatBlock({ label, value, icon, valueColor }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 2, padding: "8px 10px" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6a7e3a", marginBottom: 3 }}>{icon} {label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: valueColor || "#9ec89e" }}>{value}</div>
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)", border: "1px solid #2e2e38",
  color: "#e4e4e8", padding: "9px 12px", fontSize: 14,
  fontFamily: "Georgia, serif", borderRadius: 2, outline: "none",
};

const iconBtn = (bg) => ({
  background: bg, border: "none", color: "#e4e4e8",
  width: 28, height: 28, cursor: "pointer", fontSize: 13,
  borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
  transition: "opacity 0.15s", fontFamily: "inherit",
});

const herbInputStyle = (borderColor) => ({
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)", border: `1px solid ${borderColor}`,
  color: "#e4e4e8", padding: "9px 12px", fontSize: 14,
  fontFamily: "Georgia, serif", borderRadius: 2, outline: "none",
});

const unitToggleStyle = {
  background: "#3a2a1a", border: "1px solid #8a5a3a", color: "#e8c090",
  padding: "0 10px", fontSize: 12, fontFamily: "Georgia, serif",
  cursor: "pointer", borderRadius: 2, whiteSpace: "nowrap",
  letterSpacing: "0.05em", fontWeight: 600,
};

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App({ user }) {
  const [records, setRecords] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [fields, setFields] = useState([]);
  const [showFieldMgr, setShowFieldMgr] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [tickets, setTickets] = useState([]);
  const [showTickets, setShowTickets] = useState(false);

  // Load data from Supabase on startup
  useEffect(() => {
    async function load() {
      const [{ data: recs }, { data: ud }] = await Promise.all([
        supabase.from("records").select("data").eq("user_id", user.id),
        supabase.from("user_data").select("fields, tickets").eq("user_id", user.id).maybeSingle(),
      ]);
      if (recs) setRecords(recs.map(r => r.data));
      if (ud) {
        if (ud.fields) setFields(ud.fields);
        if (ud.tickets) setTickets(ud.tickets);
      }
      setLoaded(true);
    }
    load();
  }, [user.id]);

  // Sync fields + tickets to Supabase whenever they change
  useEffect(() => {
    if (!loaded) return;
    supabase.from("user_data").upsert({ user_id: user.id, fields, tickets, updated_at: new Date().toISOString() });
  }, [fields, tickets, loaded, user.id]);

  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("fieldNumber");
  const [yearFilter, setYearFilter] = useState("all");
  const [cropFilter, setCropFilter] = useState("all");
  const [printRecord, setPrintRecord] = useState(null);
  const [showReportBuilder, setShowReportBuilder] = useState(false);

  const handleAddField = () => {
    const name = newFieldName.trim();
    if (name && !fields.includes(name)) {
      setFields([...fields, name].sort());
    }
    setNewFieldName("");
  };

  const handleDeleteField = (f) => setFields(fields.filter(x => x !== f));

  const handleSubmit = async () => {
    if (!form.variety || (!form.plantDate && !form.plantYear)) return;
    const clean = { ...form, yield_lbs: Number(form.yield_lbs) || 0 };
    if (editId !== null) {
      const updated = { ...clean, id: editId };
      setRecords(records.map(r => r.id === editId ? updated : r));
      supabase.from("records").upsert({ id: editId, user_id: user.id, data: updated });
      setEditId(null);
    } else {
      const id = crypto.randomUUID();
      const newRec = { ...clean, id };
      setRecords([...records, newRec]);
      supabase.from("records").insert({ id, user_id: user.id, data: newRec });
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleEdit = (r) => { setForm({ ...emptyForm, ...r }); setEditId(r.id); setShowForm(true); };
  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id));
    supabase.from("records").delete().eq("id", id).eq("user_id", user.id);
  };

  const allYears = [...new Set(records
    .map(r => r.plantDate ? new Date(r.plantDate).getFullYear() : null)
    .filter(Boolean)
  )].sort((a, b) => b - a);

  const filtered = records
    .filter(r => [r.variety, r.notes, r.fieldNumber].join(" ").toLowerCase().includes(search.toLowerCase()))
    .filter(r => yearFilter === "all" || (r.plantDate && new Date(r.plantDate).getFullYear() === parseInt(yearFilter)))
    .filter(r => cropFilter === "all" || (r.cropType || "rice") === cropFilter)
    .sort((a, b) => {
      if (sort === "year") {
        const ya = a.plantDate ? new Date(a.plantDate).getFullYear() : 0;
        const yb = b.plantDate ? new Date(b.plantDate).getFullYear() : 0;
        return yb - ya;
      }
      return (a[sort] || "").localeCompare(b[sort] || "");
    });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #111113 0%, #18181c 50%, #111113 100%)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", color: "#e4e4e8" }}>
      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); }
        input[type="number"] { -moz-appearance: textfield; }
        input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
        select option, select optgroup { background: #1e2a0a; color: #e4e4e8; }
        select { color: #e4e4e8; }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        input, select, textarea { font-size: 15px !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important; border-radius: 7px !important; }
        button { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important; border-radius: 7px !important; }
        label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important; }
        .brand-name { font-family: 'Georgia', 'Times New Roman', serif !important; }
        .rpad { padding-left: clamp(16px,4vw,48px); padding-right: clamp(16px,4vw,48px); }
        .hdr-btns { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .sort-row { display: flex; gap: 8px; align-items: center; overflow-x: auto; padding-bottom: 2px; flex-shrink: 0; }
        .sort-row::-webkit-scrollbar { display: none; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(340px,100%), 1fr)); gap: 20px; }
        .crop-card { transition: background 0.2s, transform 0.15s, box-shadow 0.15s; }
        .crop-card:hover { background: rgba(255,255,255,0.07) !important; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.4); }
        .modal-panel { border-radius: 12px !important; }
        @media (max-width: 640px) {
          .btn-lbl { display: none; }
          .hdr-btn { padding: 10px 11px !important; }
          .save-full { width: 100%; padding: 14px 0 !important; font-size: 15px !important; }
          .controls-row { flex-direction: column; align-items: stretch !important; }
          .controls-row .sort-row { width: 100%; }
          .search-input { max-width: 100% !important; }
          .sign-out-btn { padding: 10px 10px !important; font-size: 10px !important; }
        }
      `}</style>

      {/* Header */}
      <div className="rpad" style={{ borderBottom: "2px solid #363642", paddingTop: "clamp(20px,3vw,32px)", paddingBottom: 24, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 36, lineHeight: 1 }}>🌾</span>
            <h1 className="brand-name" style={{ margin: 0, fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 700, letterSpacing: "0.04em", color: "#9ec89e", textShadow: "0 2px 12px rgba(140,180,140,0.2)" }}>GOLDEN STATE GROWER</h1>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#888896", letterSpacing: "0.18em", textTransform: "uppercase" }}>Field Record Manager</p>
        </div>
        <div className="hdr-btns">
          <button onClick={() => setShowFieldMgr(!showFieldMgr)} className="hdr-btn"
            style={{ background: showFieldMgr ? "#2a3a1a" : "transparent", border: "1px solid #363642", color: "#888896", padding: "10px 20px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2 }}>
            🗂 <span className="btn-lbl">Fields</span>
          </button>
          <button onClick={() => setShowTickets(true)} className="hdr-btn"
            style={{ background: "transparent", border: "1px solid #363642", color: "#888896", padding: "10px 20px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2 }}>
            🚛 <span className="btn-lbl">Tickets</span>
          </button>
          <button onClick={() => setShowReportBuilder(true)} className="hdr-btn"
            style={{ background: "transparent", border: "1px solid #363642", color: "#888896", padding: "10px 20px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2 }}>
            📋 <span className="btn-lbl">Reports</span>
          </button>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
            style={{ background: showForm ? "#252528" : "#4d7a52", border: "none", color: "#e4e4e8", padding: "10px 24px", fontSize: 14, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s", borderRadius: 2, boxShadow: "0 4px 16px rgba(120,160,40,0.3)" }}>
            {showForm ? "✕" : "+ New"}
          </button>
          <button onClick={() => supabase.auth.signOut()} className="sign-out-btn"
            style={{ background: "transparent", border: "1px solid #252528", color: "#5a6a3a", padding: "10px 16px", fontSize: 12, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2 }}
            title={user.email}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Field Manager */}
      {showFieldMgr && (
        <div className="rpad" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid #2e2e38", paddingTop: 20, paddingBottom: 20, animation: "slideDown 0.2s ease" }}>
          <p style={{ margin: "0 0 12px", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#787888" }}>▸ Manage Fields</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {fields.map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.07)", border: "1px solid #2e2e38", borderRadius: 2, padding: "4px 10px" }}>
                <span style={{ fontSize: 13, color: "#aac8e8" }}>{f}</span>
                <button onClick={() => handleDeleteField(f)} style={{ background: "none", border: "none", color: "#8a4a3a", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: "0 2px" }}>✕</button>
              </div>
            ))}
            {fields.length === 0 && <span style={{ fontSize: 12, color: "#363642", fontStyle: "italic" }}>No fields added yet</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newFieldName} onChange={e => setNewFieldName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddField()}
              placeholder="Field name (e.g. F-01, North 40)…"
              style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #2e2e38",color:"#e4e4e8",padding:"9px 12px",fontSize:14,fontFamily:"Georgia, serif",borderRadius:2,outline:"none",maxWidth:280 }} />
            <button onClick={handleAddField}
              style={{ background: "#384040", border: "none", color: "#fff", padding: "9px 20px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2 }}>
              + Add
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rpad" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid #2e2e38", paddingTop: 28, paddingBottom: 28, animation: "slideDown 0.2s ease" }}>
          <h3 style={{ margin: "0 0 24px", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888896" }}>
            {editId !== null ? "✎ Edit Record" : "+ New Record"}
          </h3>

          {/* Crop Type */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#787888", marginBottom: 6 }}>Crop Type</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(CROP_CONFIGS).map(([key, cfg]) => (
                <button key={key} type="button"
                  onClick={() => setForm({ ...emptyForm, cropType: key, fieldNumber: form.fieldNumber, acres: form.acres, plantDate: form.plantDate, notes: form.notes })}
                  style={{ background: form.cropType === key ? "#2a4030" : "rgba(255,255,255,0.05)", border: `1px solid ${form.cropType === key ? "#3e6842" : "#2e2e38"}`, color: form.cropType === key ? "#9ec89e" : "#787888", padding: "8px 16px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", borderRadius: 2, transition: "all 0.15s" }}>
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <SectionHeader color="#485058" label="▸ Crop Info" />
          {(() => {
            const cfg = CROP_CONFIGS[form.cropType] || CROP_CONFIGS.rice;
            return (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
                {/* Field Number */}
                <div>
                  <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#787888", marginBottom: 6 }}>Field Number</label>
                  {fields.length > 0 ? (
                    <select value={form.fieldNumber} onChange={e => setForm({ ...form, fieldNumber: e.target.value })}
                      style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #2e2e38",color:"#e4e4e8",padding:"9px 12px",fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }}>
                      <option value="">Select field…</option>
                      {fields.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={form.fieldNumber} onChange={e => setForm({ ...form, fieldNumber: e.target.value })}
                      style={inputStyle} placeholder="e.g. F-01" />
                  )}
                </div>
                {/* Variety */}
                <div>
                  <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#787888", marginBottom: 6 }}>Variety *</label>
                  <select value={form.variety} onChange={e => setForm({ ...form, variety: e.target.value })} style={inputStyle}>
                    <option value="">Select variety…</option>
                    {cfg.varietyGroups
                      ? cfg.varietyGroups.map(g => (
                          <optgroup key={g.label} label={g.label}>
                            {g.items.map(v => <option key={v} value={v}>{v}</option>)}
                          </optgroup>
                        ))
                      : cfg.varieties.map(v => <option key={v} value={v}>{v}</option>)
                    }
                  </select>
                </div>
                {/* Common date/number fields */}
                {[
                  cfg.isPerennial
                    ? { label: "Plant Year", field: "plantYear", type: "number" }
                    : { label: "Plant Date *", field: "plantDate", type: "date" },
                  { label: "Yield / Harvest Date", field: "yieldDate", type: "date" },
                  { label: "Acres", field: "acres", type: "number" },
                  { label: cfg.yieldLabel, field: "yield_lbs", type: "number" },
                  { label: "Notes", field: "notes", type: "text" },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#787888", marginBottom: 6 }}>{label}</label>
                    <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                      style={inputStyle} placeholder={field === "notes" ? "Optional notes…" : ""} />
                  </div>
                ))}
                {/* Crop-specific extra fields */}
                {cfg.extraFields.map(({ label, field, type }) => (
                  <div key={field}>
                    <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#787888", marginBottom: 6 }}>{label}</label>
                    <input type={type} value={form[field] || ""} onChange={e => setForm({ ...form, [field]: e.target.value })}
                      style={inputStyle} />
                  </div>
                ))}
              </div>
            );
          })()}

          {(() => {
            const cfg = CROP_CONFIGS[form.cropType] || CROP_CONFIGS.rice;
            const sectionNPKs = cfg.fertSections.map(sec => calcSectionNPK(form, sec));
            const fertigNPK = calcFertigationLogNPK(form);
            const fertigHasNPK = fertigNPK[0] > 0 || fertigNPK[1] > 0 || fertigNPK[2] > 0;
            const hasAnyNPK = sectionNPKs.some(Boolean) || fertigHasNPK;
            const sectTotals = sectionNPKs.reduce((acc, npk) => npk ? [acc[0]+npk[0], acc[1]+npk[1], acc[2]+npk[2]] : acc, [0,0,0]);
            const totals = [sectTotals[0]+fertigNPK[0], sectTotals[1]+fertigNPK[1], sectTotals[2]+fertigNPK[2]];
            return (
              <>
                {cfg.fertSections.map((sec, i) => {
                  const npk = sectionNPKs[i];
                  return (
                    <React.Fragment key={i}>
                      <SectionHeader color={sec.headerColor} label={sec.label} />
                      <FertBox borderColor={sec.borderColor} bg={sec.bg} labelColor={sec.labelColor}
                        fields={sec.fields} form={form} setForm={setForm} />
                      {npk && (
                        <div style={{ marginTop: -16, marginBottom: 24, padding: "7px 14px", background: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${sec.borderColor}`, borderRadius: 2, fontSize: 12, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ color: "#6a7e4a", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 10 }}>NPK:</span>
                          <span>N: <strong style={{ color: "#a8e870" }}>{npk[0].toFixed(1)}</strong> lbs/ac</span>
                          <span>P: <strong style={{ color: "#e8c870" }}>{npk[1].toFixed(1)}</strong> lbs/ac</span>
                          <span>K: <strong style={{ color: "#70b8e8" }}>{npk[2].toFixed(1)}</strong> lbs/ac</span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
                {hasAnyNPK && (
                  <div style={{ marginBottom: 24, padding: "12px 16px", background: "rgba(80,120,80,0.08)", border: "1px solid #2e4032", borderRadius: 2 }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7a9e4a", marginBottom: 8 }}>▸ Total N-P-K Applied (lbs/ac)</div>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#e4e4e8" }}>N: <span style={{ color: "#a8e870" }}>{totals[0].toFixed(1)}</span></span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#e4e4e8" }}>P: <span style={{ color: "#e8c870" }}>{totals[1].toFixed(1)}</span></span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#e4e4e8" }}>K: <span style={{ color: "#70b8e8" }}>{totals[2].toFixed(1)}</span></span>
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {(CROP_CONFIGS[form.cropType] || CROP_CONFIGS.rice).hasFertigationLog && (<>
            <SectionHeader color="#4a8a7a" label="▸ Fertigation Log" />
            <div style={{ marginBottom: 24 }}>
              {(form.fertigationLog || []).map((entry, idx) => {
                const update = (field, val) => setForm({ ...form, fertigationLog: form.fertigationLog.map((e, i) => i === idx ? { ...e, [field]: val } : e) });
                return (
                  <div key={idx} style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))",gap:10,marginBottom:10,padding:"14px",background:"rgba(60,120,100,0.08)",borderLeft:"3px solid #2a6a5a",borderRadius:2 }}>
                    <div>
                      <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#5a9e8a",marginBottom:6 }}>Product</label>
                      <input type="text" value={entry.product} onChange={e => update("product", e.target.value)}
                        style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #2a6a5a",color:"#e4e4e8",padding:"9px 12px",fontSize:14,fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }} />
                    </div>
                    <div>
                      <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#5a9e8a",marginBottom:6 }}>Analysis (N-P-K)</label>
                      <input type="text" value={entry.analysis} onChange={e => update("analysis", e.target.value)}
                        style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #2a6a5a",color:"#e4e4e8",padding:"9px 12px",fontSize:14,fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }} />
                    </div>
                    <div>
                      <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#5a9e8a",marginBottom:6 }}>Rate (gal/ac/app)</label>
                      <input type="number" value={entry.rate} onChange={e => update("rate", e.target.value)}
                        style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #2a6a5a",color:"#e4e4e8",padding:"9px 12px",fontSize:14,fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }} />
                    </div>
                    <div>
                      <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#5a9e8a",marginBottom:6 }}>Solution Wt (lbs/gal)</label>
                      <input type="number" value={entry.lbsPerGal} onChange={e => update("lbsPerGal", e.target.value)}
                        style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #2a6a5a",color:"#e4e4e8",padding:"9px 12px",fontSize:14,fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }} />
                    </div>
                    <div>
                      <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#5a9e8a",marginBottom:6 }}># Applications</label>
                      <input type="number" value={entry.apps} onChange={e => update("apps", e.target.value)}
                        style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #2a6a5a",color:"#e4e4e8",padding:"9px 12px",fontSize:14,fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }} />
                    </div>
                    <div>
                      <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#5a9e8a",marginBottom:6 }}>Date</label>
                      <input type="date" value={entry.date} onChange={e => update("date", e.target.value)}
                        style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #2a6a5a",color:"#e4e4e8",padding:"9px 12px",fontSize:14,fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }} />
                    </div>
                    <button type="button" onClick={() => setForm({ ...form, fertigationLog: form.fertigationLog.filter((_,i) => i !== idx) })}
                      style={{ alignSelf:"flex-end",background:"#1a4a3a",border:"none",color:"#80c8b0",padding:"9px 14px",fontSize:13,fontFamily:"inherit",cursor:"pointer",borderRadius:2 }}>✕ Remove</button>
                  </div>
                );
              })}
              <button type="button"
                onClick={() => setForm({ ...form, fertigationLog: [...(form.fertigationLog||[]), { product:"", analysis:"", rate:"", lbsPerGal:"", apps:"1", date:"" }] })}
                style={{ background:"rgba(60,120,100,0.1)",border:"1px dashed #2a6a5a",color:"#5a9e8a",padding:"9px 20px",fontSize:12,fontFamily:"inherit",cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:2 }}>
                + Add Fertigation Event
              </button>
            </div>
          </>)}

          <SectionHeader color="#7a5a2a" label="▸ Spray Log" />
          <div style={{ marginBottom: 24 }}>
            {(form.sprayLog || []).map((entry, idx) => {
              const UNITS = ["gal","qt","pt","fl oz","lbs","oz"];
              const nextUnit = u => UNITS[(UNITS.indexOf(u) + 1) % UNITS.length];
              const update = (field, val) => setForm({ ...form, sprayLog: form.sprayLog.map((e, i) => i === idx ? { ...e, [field]: val } : e) });
              return (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 10, padding: "14px", background: "rgba(120,90,40,0.08)", borderLeft: "3px solid #6a4a1a", borderRadius: 2, position: "relative" }}>
                  <div>
                    <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#a8844a",marginBottom:6 }}>Type</label>
                    <select value={entry.type} onChange={e => update("type", e.target.value)}
                      style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #6a4a1a",color:"#e4e4e8",padding:"9px 12px",fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }}>
                      {["Herbicide","Fungicide","Insecticide","Adjuvant","PGR","Other"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#a8844a",marginBottom:6 }}>Product</label>
                    <input type="text" value={entry.product} onChange={e => update("product", e.target.value)}
                      style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #6a4a1a",color:"#e4e4e8",padding:"9px 12px",fontSize:14,fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }} />
                  </div>
                  <div>
                    <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#a8844a",marginBottom:6 }}>Rate</label>
                    <div style={{ display:"flex",gap:6 }}>
                      <input type="number" value={entry.rate} onChange={e => update("rate", e.target.value)}
                        style={{ flex:1,boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #6a4a1a",color:"#e4e4e8",padding:"9px 12px",fontSize:14,fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }} />
                      <button type="button" onClick={() => update("unit", nextUnit(entry.unit))}
                        style={{ ...unitToggleStyle, borderColor:"#6a4a1a",background:"#3a2a0a" }}>{entry.unit}/ac</button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display:"block",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#a8844a",marginBottom:6 }}>Date</label>
                    <input type="date" value={entry.date} onChange={e => update("date", e.target.value)}
                      style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.07)",border:"1px solid #6a4a1a",color:"#e4e4e8",padding:"9px 12px",fontSize:14,fontFamily:"Georgia, serif",borderRadius:2,outline:"none" }} />
                  </div>
                  <button type="button" onClick={() => setForm({ ...form, sprayLog: form.sprayLog.filter((_,i) => i !== idx) })}
                    style={{ alignSelf:"flex-end",background:"#5a2a0a",border:"none",color:"#e8b090",padding:"9px 14px",fontSize:13,fontFamily:"inherit",cursor:"pointer",borderRadius:2 }}>✕ Remove</button>
                </div>
              );
            })}
            <button type="button"
              onClick={() => setForm({ ...form, sprayLog: [...(form.sprayLog||[]), { type:"Herbicide", product:"", rate:"", unit:"gal", date:"" }] })}
              style={{ background:"rgba(120,90,40,0.15)",border:"1px dashed #6a4a1a",color:"#a8844a",padding:"9px 20px",fontSize:12,fontFamily:"inherit",cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:2 }}>
              + Add Application
            </button>
          </div>

          <button onClick={handleSubmit} className="save-full" style={{ background: "#4d7a52", border: "none", color: "#fff", padding: "10px 32px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2, boxShadow: "0 2px 12px rgba(60,110,60,0.35)" }}>
            {editId !== null ? "Update Record" : "Save Record"}
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="rpad controls-row" style={{ paddingTop: 20, paddingBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search field #, variety or notes…" className="search-input"
          style={{ width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.05)",border:"1px solid #2e2e38",color:"#e4e4e8",padding:"9px 12px",fontFamily:"Georgia, serif",borderRadius:2,outline:"none",maxWidth:280 }} />
        <div className="sort-row">
          <span style={{ fontSize: 11, color: "#787888", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>Sort:</span>
          {[["fieldNumber", "Field #"], ["plantDate", "Planted"], ["yieldDate", "Harvest"], ["variety", "Variety"], ["year", "Year"]].map(([s, label]) => (
            <button key={s} onClick={() => setSort(s)} style={{ background: sort === s ? "#384040" : "transparent", border: "1px solid #2e2e38", color: sort === s ? "#9ec89e" : "#888896", padding: "6px 12px", fontSize: 11, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.1em", borderRadius: 2, transition: "all 0.15s", flexShrink: 0 }}>{label}</button>
          ))}
          <select value={cropFilter} onChange={e => setCropFilter(e.target.value)}
            style={{ background: "#1e1e26", border: "1px solid #2e2e38", color: "#9ec89e", padding: "6px 10px", fontFamily: "Georgia, serif", borderRadius: 2, outline: "none", cursor: "pointer", flexShrink: 0 }}>
            <option value="all">All Crops</option>
            {Object.entries(CROP_CONFIGS).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
            ))}
          </select>
          {allYears.length > 0 && (
            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
              style={{ background: "#1e1e26", border: "1px solid #2e2e38", color: "#9ec89e", padding: "6px 10px", fontFamily: "Georgia, serif", borderRadius: 2, outline: "none", cursor: "pointer", flexShrink: 0 }}>
              <option value="all">All Years</option>
              {allYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          )}
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#6a7e3a", flexShrink: 0 }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Cards */}
      <div className="rpad cards-grid" style={{ paddingBottom: 48 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#363642" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
            <p style={{ fontSize: 14, letterSpacing: "0.1em" }}>No records yet — tap + New to add your first field record.</p>
          </div>
        )}
        {filtered.map(r => {
          const days = daysUntilHarvest(r.plantDate, r.yieldDate);
          const sc = statusColor(days);
          const rcfg = CROP_CONFIGS[r.cropType] || CROP_CONFIGS.rice;
          const hasFert = rcfg.fertSections.some(sec => sec.fields.some(f => r[f.field]));
          return (
            <div key={r.id} className="crop-card" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2d3f10", borderLeft: `4px solid ${sc}`, borderRadius: 10, padding: "20px 22px" }}>

              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                    {r.fieldNumber && (
                      <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(255,255,255,0.1)", color: "#aac8e8", padding: "2px 8px", borderRadius: 2 }}>#{r.fieldNumber}</span>
                    )}
                    {r.cropType && r.cropType !== "rice" && (
                      <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,255,0.07)", color: "#b0b880", padding: "2px 8px", borderRadius: 2 }}>
                        {(CROP_CONFIGS[r.cropType] || {}).icon} {(CROP_CONFIGS[r.cropType] || {}).label}
                      </span>
                    )}
                    <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(120,160,40,0.15)", color: "#9ec89e", padding: "2px 8px", borderRadius: 2 }}>{r.variety}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#e4e4e8" }}>
                    {r.notes || <span style={{ color: "#363642", fontSize: 14, fontStyle: "italic" }}>No notes</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => setPrintRecord(r)} title="Print summary"
                    style={{ background:"#1a3a4a",border:"none",color:"#e4e4e8",width:28,height:28,cursor:"pointer",fontSize:15,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",transition:"opacity 0.15s",fontFamily:"inherit" }}>🖨</button>
                  <button onClick={() => handleEdit(r)} style={iconBtn("#2e3a30")}>✎</button>
                  <button onClick={() => handleDelete(r.id)} style={iconBtn("#5a2a1a")}>✕</button>
                </div>
              </div>

              {/* Crop Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {r.plantYear
                  ? <StatBlock label="Plant Year" value={r.plantYear} icon="🌳" />
                  : <StatBlock label="Planted" value={formatDate(r.plantDate)} icon="🌱" />}
                <StatBlock label="Harvest" value={formatDate(r.yieldDate)} icon="🌾" />
{r.yield_lbs > 0 && (() => {
                  const unit = (CROP_CONFIGS[r.cropType] || CROP_CONFIGS.rice).yieldUnit || "lbs";
                  const val = Number(r.yield_lbs);
                  const acres = parseFloat(r.acres);
                  const perAc = acres > 0 ? (val / acres).toFixed(1) : null;
                  return (<>
                    <StatBlock label={`Yield (${unit})`} value={`${Number.isInteger(val) ? val.toLocaleString() : val.toFixed(1)} ${unit}`} icon="⚖️" valueColor="#d8e890" />
                    {perAc && <StatBlock label={`Yield (${unit}/ac)`} value={`${perAc} ${unit}/ac`} icon="📐" valueColor="#90d8c8" />}
                  </>);
                })()}
                {days !== null && <StatBlock label="Growth Days" value={`${days}d`} icon="📅" valueColor={sc} />}
              </div>

              {/* Crop-specific extra stats */}
              {(() => {
                const cfg = CROP_CONFIGS[r.cropType];
                if (!cfg || !cfg.extraFields.length) return null;
                const extras = cfg.extraFields.filter(f => r[f.field]);
                if (!extras.length) return null;
                return (
                  <CardSection label={`${cfg.icon} ${cfg.label} Details`} color="#646474">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {extras.map(f => (
                        <StatBlock key={f.field} label={f.label} value={f.type === "date" ? formatDate(r[f.field]) : r[f.field]} icon={cfg.icon} valueColor="#9ec89e" />
                      ))}
                    </div>
                  </CardSection>
                );
              })()}

              {/* Fertilizer — dynamic per crop */}
              {rcfg.fertSections.map((sec, si) => {
                const filled = sec.fields.filter(f => r[f.field]);
                if (!filled.length) return null;
                return (
                  <CardSection key={si} label={sec.cardLabel} color={sec.cardColor}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {filled.map(f => (
                        <StatBlock key={f.field} label={f.label}
                          value={f.type === "date" ? formatDate(r[f.field]) : r[f.field]}
                          icon="💧" valueColor={sec.valueColor} />
                      ))}
                    </div>
                  </CardSection>
                );
              })}

              {/* Fertigation Log */}
              {(r.fertigationLog || []).length > 0 && (
                <CardSection label="💧 Fertigation Log" color="#4a8a7a">
                  {(r.fertigationLog || []).map((entry, idx) => (
                    <div key={idx} style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:idx < r.fertigationLog.length-1 ? 10 : 0 }}>
                      {entry.product && <StatBlock label="Product" value={entry.product} icon="💧" valueColor="#5ab8a0" />}
                      {entry.analysis && <StatBlock label="Analysis" value={entry.analysis} icon="🧪" valueColor="#5ab8a0" />}
                      {entry.rate && <StatBlock label="Rate" value={`${entry.rate} gal/ac/app`} icon="💉" valueColor="#5ab8a0" />}
                      {entry.apps && <StatBlock label="Applications" value={entry.apps} icon="🔁" valueColor="#5ab8a0" />}
                      {entry.date && <StatBlock label="Date" value={formatDate(entry.date)} icon="📆" valueColor="#5ab8a0" />}
                    </div>
                  ))}
                </CardSection>
              )}

              {/* Fertilizer Totals — all crops */}
              {(() => {
                const secNPKs = rcfg.fertSections.map(sec => calcSectionNPK(r, sec)).filter(Boolean);
                const fertigNPK = calcFertigationLogNPK(r);
                const fertigHas = fertigNPK[0] > 0 || fertigNPK[1] > 0 || fertigNPK[2] > 0;
                if (!secNPKs.length && !fertigHas) return null;
                const base = secNPKs.reduce((acc, [n,p,k]) => [acc[0]+n, acc[1]+p, acc[2]+k], [0,0,0]);
                const [totN, totP, totK] = [base[0]+fertigNPK[0], base[1]+fertigNPK[1], base[2]+fertigNPK[2]];
                const fmt = v => v > 0 ? `${v.toFixed(1)} lbs/ac` : null;
                return (totN > 0 || totP > 0 || totK > 0) ? (
                  <CardSection label="📊 N-P-K Totals" color="#6a8a3a">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      <StatBlock label="Total N" value={fmt(totN) || "—"} icon="🟢" valueColor="#a8e870" />
                      <StatBlock label="Total P" value={fmt(totP) || "—"} icon="🟠" valueColor="#e8c870" />
                      <StatBlock label="Total K" value={fmt(totK) || "—"} icon="🔵" valueColor="#70b8e8" />
                    </div>
                  </CardSection>
                ) : null;
              })()}

              {/* Spray Log */}
              {(r.sprayLog || []).length > 0 && (
                <CardSection label="🧪 Spray Log" color="#8a6a3a">
                  {(r.sprayLog || []).map((entry, idx) => (
                    <div key={idx} style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:idx < r.sprayLog.length-1 ? 10 : 0 }}>
                      {entry.type && <StatBlock label="Type" value={entry.type} icon="🧪" valueColor="#d8b870" />}
                      {entry.product && <StatBlock label="Product" value={entry.product} icon="💊" valueColor="#e8c870" />}
                      {entry.rate && <StatBlock label="Rate" value={`${entry.rate} ${entry.unit||"gal"}/ac`} icon="💉" valueColor="#d8b870" />}
                      {entry.date && <StatBlock label="Date" value={formatDate(entry.date)} icon="📆" valueColor="#d8b870" />}
                    </div>
                  ))}
                </CardSection>
              )}
            </div>
          );
        })}
      </div>
      {printRecord && <PrintModal r={printRecord} onClose={() => setPrintRecord(null)} />}
      {showReportBuilder && <ReportBuilderModal records={records} allYears={allYears} onClose={() => setShowReportBuilder(false)} />}
      {showTickets && <TicketModal tickets={tickets} setTickets={setTickets} records={records} setRecords={setRecords} onClose={() => setShowTickets(false)} />}
    </div>
  );
}
