import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Uyeler() {
  const [uyeler, setUyeler] = useState([]);
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    tel_no: "",
    tc_no: "",
    hisse: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  // Backend'den üyeleri çek
  useEffect(() => {
    fetch("http://localhost:5000/uyeler")
      .then((res) => res.json())
      .then((data) => setUyeler(data))
      .catch((err) => console.error("Üyeler alınamadı:", err));
  }, []);

  // Tablo kolonları
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "60px" },
    { name: "Ad", selector: (row) => row.ad, sortable: true },
    { name: "Soyad", selector: (row) => row.soyad, sortable: true },
    { name: "Telefon", selector: (row) => row.tel_no, sortable: true },
    { name: "TC Kimlik No", selector: (row) => row.tc_no, sortable: true },
    { name: "Hisse", selector: (row) => row.hisse, sortable: true, right: true },
  ];

  // Arama filtreleme
  const filteredItems = uyeler.filter(
    (uye) =>
      uye.ad.toLowerCase().includes(filterText.toLowerCase()) ||
      uye.soyad.toLowerCase().includes(filterText.toLowerCase()) ||
      uye.tel_no.toLowerCase().includes(filterText.toLowerCase()) ||
      uye.tc_no.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Üye ekleme fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/uyeler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Hata: " + errorData.message);
        return;
      }

      const data = await res.json();

      // Yeni üye ekle
      setUyeler((prev) => [...prev, { ...formData, id: data.uyeId }]);
      setFormData({ ad: "", soyad: "", tel_no: "", tc_no: "", hisse: "" });
      setModalOpen(false);
      alert("Üye başarıyla eklendi!");
    } catch (err) {
      console.error("Sunucu hatası:", err);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  // Excel export
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Uyeler");
    XLSX.writeFile(workbook, "uyeler.xlsx");
  };

  // PDF export
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Üyeler Listesi", 14, 16);
    doc.autoTable({
      head: [["ID", "Ad", "Soyad", "Telefon", "TC Kimlik No", "Hisse"]],
      body: filteredItems.map((uye) => [
        uye.id,
        uye.ad,
        uye.soyad,
        uye.tel_no,
        uye.tc_no,
        uye.hisse,
      ]),
      startY: 20,
    });
    doc.save("uyeler.pdf");
  };


  return (
    <div className="container-fluid" style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}>


      {/* Ekle Butonu */}
      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          Ekle
        </button>
      </div>

      {/* Excel/PDF Butonları ve Arama */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <button className="btn btn-success me-2" onClick={exportExcel}>
            Excel
          </button>
          <button className="btn btn-danger" onClick={exportPDF}>
            PDF
          </button>
        </div>
        <input
          type="text"
          placeholder="Ara..."
          className="form-control w-25"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        noDataComponent="Kayıt bulunamadı"
        highlightOnHover
        pointerOnHover
        striped
        dense
      />

      {/* Modal */}
      {modalOpen && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Üye Ekle</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Ad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ad"
                      value={formData.ad}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Soyad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="soyad"
                      value={formData.soyad}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Telefon Numarası</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tel_no"
                      value={formData.tel_no}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">TC Kimlik No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tc_no"
                      value={formData.tc_no}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Hisse Sayısı</label>
                    <input
                      type="number"
                      className="form-control"
                      name="hisse"
                      value={formData.hisse}
                      onChange={handleInputChange}
                      required
                      min={1}
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Kaydet
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Uyeler;
