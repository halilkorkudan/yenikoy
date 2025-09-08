import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import * as XLSX from "xlsx";

const Raporlar = () => {
  const [raporlar, setRaporlar] = useState([]);
  const [arama, setArama] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Verileri çek
  useEffect(() => {
    fetch("http://localhost:5000/raporlar")
      .then((res) => res.json())
      .then((data) => setRaporlar(data));
  }, []);

  const handleArama = () => {
    fetch(`http://localhost:5000/raporlar/arama?q=${arama}`)
      .then((res) => res.json())
      .then((data) => setRaporlar(data));
  };

  const handleTarihFiltre = () => {
    fetch(
      `http://localhost:5000/raporlar/tarih?startDate=${startDate}&endDate=${endDate}`
    )
      .then((res) => res.json())
      .then((data) => setRaporlar(data));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(raporlar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Raporlar");
    XLSX.writeFile(workbook, "raporlar.xlsx");
  };

  // Pagination
  const indexOfLastRecord = currentPage * (recordsPerPage === "Tümü" ? raporlar.length : recordsPerPage);
  const indexOfFirstRecord = indexOfLastRecord - (recordsPerPage === "Tümü" ? raporlar.length : recordsPerPage);
  const currentRecords = raporlar.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(raporlar.length / (recordsPerPage === "Tümü" ? raporlar.length : recordsPerPage));

  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2c3e50" }}>Raporlar</h2>

      {/* Filtre ve Arama */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Plaka veya İlçe ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", minWidth: "180px" }}
        />
        <button onClick={handleArama} style={{ padding: "8px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Ara
        </button>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <button onClick={handleTarihFiltre} style={{ padding: "8px 16px", backgroundColor: "#2ecc71", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Filtrele
        </button>
        <select value={recordsPerPage} onChange={(e) => { setRecordsPerPage(e.target.value); setCurrentPage(1); }} style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
          <option>Tümü</option>
        </select>
        <button onClick={exportToExcel} style={{ padding: "8px 16px", backgroundColor: "#e67e22", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Excel'e Aktar
        </button>
      </div>

      {/* Tablo */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
          <thead style={{ backgroundColor: "#34495e", color: "white" }}>
            <tr>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Sıra</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Plaka</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Referans No</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Tarih</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>İl</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>İlçe</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{r.id}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{r.plaka}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{r.referans_no}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{r.tarih ? format(new Date(r.tarih), "dd.MM.yyyy", { locale: tr }) : ""}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{r.il}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{r.ilce}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "15px", gap: "5px", flexWrap: "wrap" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => changePage(num)}
            style={{
              padding: "6px 12px",
              border: "1px solid #ccc",
              backgroundColor: num === currentPage ? "#3498db" : "white",
              color: num === currentPage ? "white" : "black",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Raporlar;
