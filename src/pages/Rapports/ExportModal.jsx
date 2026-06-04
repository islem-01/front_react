import React, { useState } from "react";

export default function ExportModal({ onExport, onClose }) {
  const [format, setFormat] = useState("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleExport = () => {
    onExport(format);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container small">
        <div className="modal-header">
          <h2>📎 Exporter le rapport</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Format d'export</label>
            <div className="radio-group">
              <label className="radio-option">
                <input type="radio" value="pdf" checked={format === "pdf"} onChange={() => setFormat("pdf")} />
                PDF Document
              </label>
              <label className="radio-option">
                <input type="radio" value="excel" checked={format === "excel"} onChange={() => setFormat("excel")} />
                Excel (.xlsx)
              </label>
              <label className="radio-option">
                <input type="radio" value="csv" checked={format === "csv"} onChange={() => setFormat("csv")} />
                CSV
              </label>
              <label className="radio-option">
                <input type="radio" value="json" checked={format === "json"} onChange={() => setFormat("json")} />
                JSON
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Période</label>
            <div className="form-row">
              <input type="date" className="form-input" placeholder="Date début" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
              <input type="date" className="form-input" placeholder="Date fin" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label>Contenu à inclure</label>
            <div className="checkbox-group">
              <input type="checkbox" id="includeCharts" checked={includeCharts} onChange={(e) => setIncludeCharts(e.target.checked)} />
              <label htmlFor="includeCharts">Inclure les graphiques</label>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="includeTables" checked={includeTables} onChange={(e) => setIncludeTables(e.target.checked)} />
              <label htmlFor="includeTables">Inclure les tableaux de données</label>
            </div>
          </div>

          <div className="info-card">
            <div className="info-title">ℹ️ Informations</div>
            <div className="info-text">L'export inclura toutes les données filtrées et les statistiques actuelles.</div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-save" onClick={handleExport}>Exporter</button>
        </div>
      </div>
    </div>
  );
}