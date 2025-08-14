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
    aplaka: "",
    amarka: "",
    dplaka: "",
    dmarka: "",
    sad: "",
    ssoyad: "",
    stel: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [activeTab, setActiveTab] = useState("uye");

  useEffect(() => {
    fetch("http://localhost:5000/uyeler")
      .then((res) => res.json())
      .then((data) => setUyeler(data))
      .catch((err) => console.error("Üyeler alınamadı:", err));
  }, []);

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "60px" },
    { name: "Ad", selector: (row) => row.ad, sortable: true },
    { name: "Soyad", selector: (row) => row.soyad, sortable: true },
    { name: "Telefon", selector: (row) => row.tel_no, sortable: true },
    { name: "TC Kimlik No", selector: (row) => row.tc_no, sortable: true },
    { name: "Hisse", selector: (row) => row.hisse, sortable: true, right: true },
  ];

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
      setUyeler((prev) => [...prev, { ...formData, id: data.uyeId }]);
      setFormData({
        ad: "",
        soyad: "",
        tel_no: "",
        tc_no: "",
        hisse: "",
        aplaka: "",
        amarka: "",
        dplaka: "",
        dmarka: "",
        sad: "",
        ssoyad: "",
        stel: "",
      });
      setModalOpen(false);
      alert("Üye başarıyla eklendi!");
    } catch (err) {
      console.error("Sunucu hatası:", err);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Uyeler");
    XLSX.writeFile(workbook, "uyeler.xlsx");
  };

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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/uyeler/${selectedMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        alert("Güncelleme başarısız.");
        return;
      }

      setUyeler((prev) =>
        prev.map((uye) =>
          uye.id === selectedMember.id ? { ...uye, ...editFormData } : uye
        )
      );
      setDetailModalOpen(false);
      alert("Üye bilgileri güncellendi!");
    } catch (err) {
      console.error("Sunucu hatası:", err);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  const handleDeleteMember = async () => {
    if (!window.confirm("Bu üyeyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`http://localhost:5000/uyeler/${selectedMember.id}`, {
        method: "DELETE",
      });
      if (!res.ok) { alert("Silme başarısız."); return; }
      setUyeler((prev) => prev.filter((u) => u.id !== selectedMember.id));
      setDetailModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Sunucu hatası.");
    }
  };

  // Araç
  const addArac = () => {
    setEditFormData((prev) => ({
      ...prev,
      aplaka: "",
      amarka: "",
    }));
  };
  const handleAracChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Dorse
  const addDorse = () => {
    setEditFormData((prev) => ({
      ...prev,
      dplaka: "",
      dmarka: "",
    }));
  };
  const handleDorseChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Sürücü
  const addSofor = () => {
    setEditFormData((prev) => ({
      ...prev,
      sad: "",
      ssoyad: "",
      stel: "",
    }));
  };
  const handleSoforChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Ekle</button>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <button className="btn btn-success me-2" onClick={exportExcel}>Excel</button>
          <button className="btn btn-danger" onClick={exportPDF}>PDF</button>
        </div>
        <input type="text" placeholder="Ara..." className="form-control w-25"
          value={filterText} onChange={(e) => setFilterText(e.target.value)} />
      </div>

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
        onRowClicked={(row) => {
          setSelectedMember(row);
          setEditFormData({ ...row });
          setActiveTab("uye");
          setDetailModalOpen(true);
        }}
      />

      {/* Üye Ekleme Modal */}
      {modalOpen && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Üye Ekle</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3"><label className="form-label">Ad</label>
                    <input type="text" className="form-control" name="ad" value={formData.ad} onChange={handleInputChange} required /></div>
                  <div className="mb-3"><label className="form-label">Soyad</label>
                    <input type="text" className="form-control" name="soyad" value={formData.soyad} onChange={handleInputChange} required /></div>
                  <div className="mb-3"><label className="form-label">Telefon Numarası</label>
                    <input type="text" className="form-control" name="tel_no" value={formData.tel_no} onChange={handleInputChange} required /></div>
                  <div className="mb-3"><label className="form-label">TC Kimlik No</label>
                    <input type="text" className="form-control" name="tc_no" value={formData.tc_no} onChange={handleInputChange} required /></div>
                  <div className="mb-3"><label className="form-label">Hisse Sayısı</label>
                    <input type="number" className="form-control" name="hisse" value={formData.hisse} onChange={handleInputChange} required min={1} /></div>
                  <button type="submit" className="btn btn-success">Kaydet</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detay & Düzenleme Modal */}
      {detailModalOpen && selectedMember && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setDetailModalOpen(false)}>
          <div className="modal-dialog modal-lg" style={{ maxWidth: "750px" }} onClick={(e) => e.stopPropagation()} role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Üye Detay</h5>
                <button type="button" className="btn-close" onClick={() => setDetailModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                {/* Sekme Butonları */}
                <div className="mb-3">
                  <button className={`btn me-2 ${activeTab === "uye" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("uye")}>Üye Düzenle</button>
                  <button className={`btn me-2 ${activeTab === "arac" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("arac")}>Araç Bilgileri</button>
                  <button className={`btn me-2 ${activeTab === "dorse" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("dorse")}>Dorse Bilgileri</button>
                  <button className={`btn ${activeTab === "sofor" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("sofor")}>Sürücüler</button>
                </div>

                {/* Üye Bilgileri */}
                {activeTab === "uye" && (
                  <div>
                    <h6 className="fw-bold">Üye Bilgileri</h6>
                    <div className="mb-3"><label className="form-label">Ad</label>
                      <input type="text" className="form-control" name="ad" value={editFormData.ad} onChange={handleEditChange} /></div>
                    <div className="mb-3"><label className="form-label">Soyad</label>
                      <input type="text" className="form-control" name="soyad" value={editFormData.soyad} onChange={handleEditChange} /></div>
                    <div className="mb-3"><label className="form-label">Telefon Numarası</label>
                      <input type="text" className="form-control" name="tel_no" value={editFormData.tel_no} onChange={handleEditChange} /></div>
                    <div className="mb-3"><label className="form-label">TC Kimlik No</label>
                      <input type="text" className="form-control" name="tc_no" value={editFormData.tc_no} onChange={handleEditChange} /></div>
                    <div className="mb-3"><label className="form-label">Hisse Sayısı</label>
                      <input type="number" className="form-control" name="hisse" value={editFormData.hisse} onChange={handleEditChange} min={1} /></div>
                  <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-danger" onClick={handleDeleteMember}>Üyeyi Sil</button>
                  </div>
                  </div>
                )}

                {/* Araç Bilgileri */}
                {activeTab === "arac" && (
                  <div>
                    <h6 className="fw-bold mt-3">Araç Bilgileri</h6>
                    <div className="d-flex mb-2">
                      <input type="text" className="form-control me-2" placeholder="Plaka" value={editFormData.aplaka} onChange={(e) => handleAracChange("aplaka", e.target.value)} />
                      <input type="text" className="form-control me-2" placeholder="Marka" value={editFormData.amarka} onChange={(e) => handleAracChange("amarka", e.target.value)} />
                      <button className="btn btn-secondary" onClick={addArac}>Yeni Araç Ekle</button>
                    </div>
                  </div>
                )}

                {/* Dorse Bilgileri */}
                {activeTab === "dorse" && (
                  <div>
                    <h6 className="fw-bold mt-3">Dorse Bilgileri</h6>
                    <div className="d-flex mb-2">
                      <input type="text" className="form-control me-2" placeholder="Plaka" value={editFormData.dplaka} onChange={(e) => handleDorseChange("dplaka", e.target.value)} />
                      <input type="text" className="form-control me-2" placeholder="Marka" value={editFormData.dmarka} onChange={(e) => handleDorseChange("dmarka", e.target.value)} />
                      <button className="btn btn-secondary" onClick={addDorse}>Yeni Dorse Ekle</button>
                    </div>
                  </div>
                )}

                {/* Sürücüler */}
                {activeTab === "sofor" && (
                  <div>
                    <h6 className="fw-bold mt-3">Sürücüler</h6>
                    <div className="d-flex mb-2">
                      <input type="text" className="form-control me-2" placeholder="Ad" value={editFormData.sad} onChange={(e) => handleSoforChange("sad", e.target.value)} />
                      <input type="text" className="form-control me-2" placeholder="Soyad" value={editFormData.ssoyad} onChange={(e) => handleSoforChange("ssoyad", e.target.value)} />
                      <input type="text" className="form-control me-2" placeholder="Tel" value={editFormData.stel} onChange={(e) => handleSoforChange("stel", e.target.value)} />
                      <button className="btn btn-secondary" onClick={addSofor}>Yeni Sürücü Ekle</button>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between mt-3">
                  <button className="btn btn-primary" onClick={handleUpdate}>Güncelle</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Uyeler;
