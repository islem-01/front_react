import React from "react";
import "./DashboardPage.css";

/* ── KPI data ─────────────────────────────────────── */
const kpis = [
  {
    label: "Total Étudiants",
    value: "1 248",
    trend: "+4.2%",
    trendDir: "up",
    iconClass: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    label: "Salles actives",
    value: "34",
    trend: "+2",
    trendDir: "up",
    iconClass: "green",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: "Examens aujourd'hui",
    value: "12",
    trend: "–",
    trendDir: "neutral",
    iconClass: "orange",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    label: "Alertes actives",
    value: "7",
    trend: "-3",
    trendDir: "down",
    iconClass: "red",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
];

/* ── Bar chart data ────────────────────────────────── */
const barData = [
  { label: "Lun", present: 90, absent: 10 },
  { label: "Mar", present: 75, absent: 25 },
  { label: "Mer", present: 85, absent: 15 },
  { label: "Jeu", present: 92, absent: 8 },
  { label: "Ven", present: 68, absent: 32 },
  { label: "Sam", present: 55, absent: 20 },
];

/* ── Donut chart data ──────────────────────────────── */
const donutData = [
  { label: "Présents", pct: 82, color: "#1a3a8f" },
  { label: "Absents", pct: 11, color: "#93c5fd" },
  { label: "Anomalies", pct: 7, color: "#ef4444" },
];

/* Build SVG donut */
function buildDonut(data, radius = 52, stroke = 14) {
  const cx = 65, cy = 65;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return data.map((d) => {
    const dash = (d.pct / 100) * circ;
    const gap = circ - dash;
    const segment = { ...d, dash, gap, offset, cx, cy, radius, stroke };
    offset += dash;
    return segment;
  });
}

function DonutChart({ data }) {
  const segments = buildDonut(data);
  return (
    <div className="donut-wrapper">
      <div className="donut-svg-wrap">
        <svg width="130" height="130" viewBox="0 0 130 130">
          {/* Track */}
          <circle cx="65" cy="65" r="52" fill="none" stroke="#f3f4f6" strokeWidth="14"/>
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.radius}
              fill="none"
              stroke={s.color}
              strokeWidth={s.stroke}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="butt"
              transform="rotate(-90 65 65)"
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          ))}
        </svg>
        <div className="donut-center">
          <span className="donut-center-value">82%</span>
          <span className="donut-center-label">Présence</span>
        </div>
      </div>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={i} className="donut-legend-item">
            <div className="donut-legend-left">
              <div className="donut-legend-bar" style={{ background: d.color }} />
              <span>{d.label}</span>
            </div>
            <span className="donut-legend-pct">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Exams data ────────────────────────────────────── */
const exams = [
  { name: "Mathématiques", salle: "A-101", heure: "08:00", etudiants: 45, status: "en-cours" },
  { name: "Informatique", salle: "B-205", heure: "10:30", etudiants: 38, status: "programme" },
  { name: "Physique", salle: "C-302", heure: "13:00", etudiants: 52, status: "programme" },
  { name: "Anglais", salle: "A-104", heure: "07:30", etudiants: 41, status: "termine" },
  { name: "Économie", salle: "D-110", heure: "15:00", etudiants: 29, status: "alerte" },
];

const statusLabels = {
  "en-cours": "En cours",
  "programme": "Programmé",
  "termine": "Terminé",
  "alerte": "Alerte",
};

/* ── Alerts data ───────────────────────────────────── */
const alerts = [
  { title: "Comportement suspect détecté", salle: "A-101", time: "Il y a 5 min", severity: "high" },
  { title: "Étudiant absent non signalé", salle: "B-205", time: "Il y a 12 min", severity: "medium" },
  { title: "Caméra hors ligne", salle: "C-302", time: "Il y a 20 min", severity: "high" },
  { title: "Retard surveillant", salle: "D-110", time: "Il y a 35 min", severity: "medium" },
  { title: "Salle surpeuplée", salle: "A-104", time: "Il y a 1h", severity: "low" },
];

/* ═══════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════ */
export default function DashboardPage() {
  const maxBar = Math.max(...barData.map((d) => d.present + d.absent));

  return (
    <div className="dashboard-page">
      {/* ── KPI Row ─────────────────────────── */}
      <div>
        <p className="section-title">Vue d'ensemble</p>
        <div className="kpi-grid">
          {kpis.map((kpi, i) => (
            <div key={i} className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">{kpi.label}</span>
                <div className={`kpi-icon ${kpi.iconClass}`}>{kpi.icon}</div>
              </div>
              <div className="kpi-value">{kpi.value}</div>
              <div className={`kpi-trend ${kpi.trendDir}`}>
                {kpi.trendDir === "up" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                )}
                {kpi.trendDir === "down" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                )}
                <span>{kpi.trend} ce mois</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Charts Row ──────────────────────── */}
      <div className="charts-row">
        {/* Bar chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Présences par jour</div>
              <div className="chart-subtitle">Semaine en cours</div>
            </div>
            <span className="chart-badge">Cette semaine</span>
          </div>
          <div className="bar-chart">
            {barData.map((d, i) => {
              const presH = (d.present / maxBar) * 100;
              const absH = (d.absent / maxBar) * 100;
              return (
                <div key={i} className="bar-group">
                  <div className="bar-wrap">
                    <div className="bar secondary" style={{ height: `${absH}%` }} />
                    <div className="bar primary" style={{ height: `${presH}%` }} />
                  </div>
                  <span className="bar-label">{d.label}</span>
                </div>
              );
            })}
          </div>
          <div className="bar-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#1a3a8f" }} />
              Présents
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#93c5fd" }} />
              Absents
            </div>
          </div>
        </div>

        {/* Donut chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Taux de présence</div>
              <div className="chart-subtitle">Aujourd'hui</div>
            </div>
          </div>
          <DonutChart data={donutData} />
        </div>
      </div>

      {/* ── Tables Row ──────────────────────── */}
      <div className="tables-row">
        {/* Exams table */}
        <div className="table-card">
          <div className="table-card-header">
            <span className="table-card-title">Examens du jour</span>
            <button className="table-link">Voir tout →</button>
          </div>
          <table className="exams-table">
            <thead>
              <tr>
                <th>Matière</th>
                <th>Salle</th>
                <th>Heure</th>
                <th>Étudiants</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((e, i) => (
                <tr key={i}>
                  <td className="exam-name">{e.name}</td>
                  <td>{e.salle}</td>
                  <td>{e.heure}</td>
                  <td>{e.etudiants}</td>
                  <td>
                    <span className={`status-badge ${e.status}`}>
                      <span className="status-dot" />
                      {statusLabels[e.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts list */}
        <div className="table-card">
          <div className="table-card-header">
            <span className="table-card-title">Alertes récentes</span>
            <button className="table-link">Voir tout →</button>
          </div>
          <div className="alerts-list">
            {alerts.map((a, i) => (
              <div key={i} className="alert-item">
                <div className="alert-dot-col">
                  <div className={`alert-severity-dot ${a.severity}`} />
                </div>
                <div className="alert-content">
                  <div className="alert-title">{a.title}</div>
                  <div className="alert-meta">
                    <span>Salle {a.salle}</span>
                    <span className="alert-time">{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
