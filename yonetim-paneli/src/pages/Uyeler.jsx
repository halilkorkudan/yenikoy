import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Constants
const API_BASE_URL = "http://localhost:5000";
const EMPTY_FORM_DATA = {
  ad: "",
  soyad: "",
  tel_no: "",
  tc_no: "",
  hisse: "",
  araclar: [{ plaka: "", marka: "" }],
  dorseler: [{ plaka: "", marka: "" }],
  soforler: [{ ad: "", soyad: "", tel: "" }],
};

// Utility Functions
const safeString = (value) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const parseUserData = (user) => {
  return {
    ...user,
    araclar:
      user.aplaka && safeString(user.aplaka).trim()
        ? safeString(user.aplaka)
            .split(",")
            .map((plaka, i) => ({
              plaka: plaka?.trim() || "",
              marka: safeString(user.amarka).split(",")[i]?.trim() || "",
            }))
        : [{ plaka: "", marka: "" }],
    dorseler:
      user.dplaka && safeString(user.dplaka).trim()
        ? safeString(user.dplaka)
            .split(",")
            .map((plaka, i) => ({
              plaka: plaka?.trim() || "",
              marka: safeString(user.dmarka).split(",")[i]?.trim() || "",
            }))
        : [{ plaka: "", marka: "" }],
    soforler:
      user.sad && safeString(user.sad).trim()
        ? safeString(user.sad)
            .split(",")
            .map((ad, i) => ({
              ad: ad?.trim() || "",
              soyad: safeString(user.ssoyad).split(",")[i]?.trim() || "",
              tel: safeString(user.stel).split(",")[i]?.trim() || "",
            }))
        : [{ ad: "", soyad: "", tel: "" }],
  };
};

const formatUserDataForAPI = (formData) => {
  return {
    ad: formData.ad,
    soyad: formData.soyad,
    tel_no: formData.tel_no,
    tc_no: formData.tc_no,
    hisse: formData.hisse,
    aplaka: formData.araclar.map((a) => a.plaka).join(","),
    amarka: formData.araclar.map((a) => a.marka).join(","),
    dplaka: formData.dorseler.map((d) => d.plaka).join(","),
    dmarka: formData.dorseler.map((d) => d.marka).join(","),
    sad: formData.soforler.map((s) => s.ad).join(","),
    ssoyad: formData.soforler.map((s) => s.soyad).join(","),
    stel: formData.soforler.map((s) => s.tel).join(","),
  };
};

// API Service
class UyeService {
  static async fetchUsers() {
    const response = await fetch(`${API_BASE_URL}/uyeler`);
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }
    return response.json();
  }

  static async createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/uyeler`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Kayıt işlemi başarısız");
    }
    return response.json();
  }

  static async updateUser(id, userData) {
    const response = await fetch(`${API_BASE_URL}/uyeler/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Güncelleme işlemi başarısız");
    }
    return response.json();
  }

  static async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/uyeler/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Silme işlemi başarısız");
    }
    return response.json();
  }

  static async testConnection() {
    const response = await fetch(`${API_BASE_URL}/test`);
    return response.json();
  }
}

// Main Component
function Uyeler() {
  // State Management
  const [uyeler, setUyeler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [activeTab, setActiveTab] = useState("uye");

  // ✅ Eklenen state'ler
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [hisseVehicles, setHisseVehicles] = useState({});
  const [expandedHisse, setExpandedHisse] = useState(null);

  // ✅ Eklenen fonksiyonlar
  const handleHisseClick = async (hisseNo, index) => {
    if (!hisseNo || hisseNo.trim() === "") {
      alert("Önce hisse numarasını giriniz!");
      return;
    }
    const key = `${selectedMember?.id}-${index}`;
    if (expandedHisse === key) {
      setExpandedHisse(null);
    } else {
      setExpandedHisse(key);
      try {
        // backend'den araç listesi çekilmesi gerekiyorsa buraya API çağrısı eklenebilir
        setAvailableVehicles([]); // şimdilik boş setliyoruz
        setHisseVehicles((prev) => ({
          ...prev,
          [key]: null,
        }));
      } catch (error) {
        console.error("Araç bilgileri getirilemedi:", error);
        setAvailableVehicles([]);
      }
    }
  };

  const handleAssignVehicle = (hisseNo, vehicleId, index) => {
    const vehicle = availableVehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;
    const key = `${selectedMember?.id}-${index}`;
    setHisseVehicles((prev) => ({
      ...prev,
      [key]: vehicle,
    }));
    setAvailableVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  const handleRemoveVehicle = (hisseNo, index) => {
    const key = `${selectedMember?.id}-${index}`;
    const removedVehicle = hisseVehicles[key];
    if (!removedVehicle) return;
    setAvailableVehicles((prev) => [...prev, removedVehicle]);
    setHisseVehicles((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  // Table Configuration
  // ... (senin kodun buradan aynen devam ediyor)

  // Table Configuration
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "60px" },
    { name: "Ad", selector: (row) => row.ad, sortable: true },
    { name: "Soyad", selector: (row) => row.soyad, sortable: true },
    { name: "Telefon", selector: (row) => row.tel_no, sortable: true },
    { name: "TC Kimlik No", selector: (row) => row.tc_no, sortable: true },
    {
      name: "Hisse",
      selector: (row) => row.hisse,
      sortable: true,
      right: true,
    },
  ];

  // Data Loading
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log("🔄 Üyeler yükleniyor...");

      // Backend bağlantısını test et
      try {
        await UyeService.testConnection();
        console.log("✅ Backend bağlantısı başarılı");
      } catch (testError) {
        console.error("❌ Backend bağlantı testi başarısız:", testError);
        throw new Error("Backend sunucusuna erişilemiyor");
      }

      const data = await UyeService.fetchUsers();
      console.log("📊 Backend'den gelen veri:", data);

      if (!Array.isArray(data)) {
        console.error("❌ Geçersiz veri formatı:", data);
        setUyeler([]);
        return;
      }

      const parsedData = data.map(parseUserData);
      console.log("✅ Parse edilmiş veri:", parsedData);

      setUyeler(parsedData);
    } catch (error) {
      console.error("❌ Üyeler yüklenirken hata:", error);

      let errorMessage = "Veriler yüklenemedi.";
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("Network request failed")
      ) {
        errorMessage +=
          "\n\nBackend sunucusuna bağlanılamıyor. Kontrol edilecekler:\n• Backend server çalışıyor mu?\n• Port 5000 kullanılıyor mu?\n• MySQL servisi aktif mi?";
      } else {
        errorMessage += `\n\nDetay: ${error.message}`;
      }

      alert(errorMessage);
      setUyeler([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtering
  const filteredItems = uyeler.filter((uye) =>
    [uye.ad, uye.soyad, uye.tel_no, uye.tc_no].some((field) =>
      safeString(field).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // Hisse sayısı değiştiğinde hisse numaralarını güncelle
    if (name === "hisse") {
      const hisseSayisi = parseInt(value) || 0;
      const mevcutHisseNumaralari = editFormData.hisse_numaralari || [];

      // Hisse sayısına göre array'i ayarla
      let yeniHisseNumaralari = [...mevcutHisseNumaralari];
      if (hisseSayisi > yeniHisseNumaralari.length) {
        // Eksik olanları boş string olarak ekle
        while (yeniHisseNumaralari.length < hisseSayisi) {
          yeniHisseNumaralari.push("");
        }
      } else if (hisseSayisi < yeniHisseNumaralari.length) {
        // Fazla olanları kaldır
        yeniHisseNumaralari = yeniHisseNumaralari.slice(0, hisseSayisi);
      }

      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
        hisse_numaralari: yeniHisseNumaralari,
      }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Hisse numarası değiştirme
  const handleHisseNoChange = (index, value) => {
    const updatedHisseNumaralari = [...editFormData.hisse_numaralari];
    updatedHisseNumaralari[index] = value;
    setEditFormData((prev) => ({
      ...prev,
      hisse_numaralari: updatedHisseNumaralari,
    }));
  };

  // Hisse numarasına tıklama - araçları göster/gizle

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = formatUserDataForAPI(formData);
      console.log("📤 Yeni üye verisi gönderiliyor:", payload);

      const result = await UyeService.createUser(payload);

      // Local state'i güncelle
      const newUser = {
        ...formData,
        id: result.uyeId,
        ...payload,
      };

      setUyeler((prev) => [parseUserData(newUser), ...prev]);
      setFormData(EMPTY_FORM_DATA);
      setModalOpen(false);

      alert("✅ Üye başarıyla eklendi!");
    } catch (error) {
      console.error("❌ Üye ekleme hatası:", error);
      alert(`Hata: ${error.message}`);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = formatUserDataForAPI(editFormData);
      console.log("📤 Güncelleme verisi gönderiliyor:", payload);

      await UyeService.updateUser(selectedMember.id, payload);

      // Local state'i güncelle
      setUyeler((prev) =>
        prev.map((uye) =>
          uye.id === selectedMember.id ? { ...uye, ...editFormData } : uye
        )
      );

      alert("✅ Üye bilgileri güncellendi!");
    } catch (error) {
      console.error("❌ Güncelleme hatası:", error);
      alert(`Hata: ${error.message}`);
    }
  };

  const handleDeleteMember = async () => {
    if (
      !window.confirm(
        "⚠️ Bu üyeyi silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz."
      )
    ) {
      return;
    }

    try {
      await UyeService.deleteUser(selectedMember.id);

      setUyeler((prev) => prev.filter((u) => u.id !== selectedMember.id));
      setDetailModalOpen(false);

      alert("✅ Üye başarıyla silindi!");
    } catch (error) {
      console.error("❌ Silme hatası:", error);
      alert(`Hata: ${error.message}`);
    }
  };

  // Modal Handlers
  const handleCloseModal = () => {
    if (
      window.confirm(
        "Çıkmak istediğinize emin misiniz? Kaydedilmemiş değişiklikler kaybolacak."
      )
    ) {
      setModalOpen(false);
      setFormData(EMPTY_FORM_DATA);
    }
  };

  const handleCloseDetailModal = () => {
    if (
      window.confirm(
        "Çıkmak istediğinize emin misiniz? Kaydedilmemiş değişiklikler kaybolacak."
      )
    ) {
      setDetailModalOpen(false);
      setExpandedHisse(null);
      setHisseVehicles({});
    }
  };

  const openDetailModal = (row) => {
    setSelectedMember(row);
    setEditFormData({ ...row });
    setActiveTab("uye");
    setDetailModalOpen(true);
    setExpandedHisse(null);
    setHisseVehicles({});
  };

  // Export Functions
  const exportExcel = () => {
    try {
      const exportData = filteredItems.map((uye) => ({
        ID: uye.id,
        Ad: uye.ad,
        Soyad: uye.soyad,
        Telefon: uye.tel_no,
        "TC Kimlik": uye.tc_no,
        Hisse: uye.hisse,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Uyeler");

      const fileName = `uyeler_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Excel export hatası:", error);
      alert("Excel dosyası oluşturulamadı");
    }
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString("tr-TR");

      doc.text(`Üyeler Listesi - ${today}`, 14, 16);
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
        startY: 25,
      });

      const fileName = `uyeler_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("PDF export hatası:", error);
      alert("PDF dosyası oluşturulamadı");
    }
  };

  // Dynamic List Handlers
  const createListHandler = (listName) => ({
    add: () => {
      setEditFormData((prev) => ({
        ...prev,
        [listName]: [
          ...(prev[listName] || []),
          listName === "araclar" || listName === "dorseler"
            ? { plaka: "", marka: "" }
            : { ad: "", soyad: "", tel: "" },
        ],
      }));
    },

    change: (index, field, value) => {
      const updated = [...editFormData[listName]];
      updated[index][field] = value;
      setEditFormData((prev) => ({ ...prev, [listName]: updated }));
    },

    remove: (index) => {
      if (editFormData[listName].length === 1) return;
      setEditFormData((prev) => ({
        ...prev,
        [listName]: prev[listName].filter((_, i) => i !== index),
      }));
    },
  });

  const aracHandler = createListHandler("araclar");
  const dorseHandler = createListHandler("dorseler");
  const soforHandler = createListHandler("soforler");

  // Loading State
  if (loading) {
    return (
      <div
        className="container-fluid d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-3 text-muted">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Render Components
  const renderVehicleForm = (vehicles, handler, title) => (
    <div>
      <h6 className="fw-bold mt-3">{title}</h6>
      {vehicles?.map((vehicle, index) => (
        <div key={index} className="d-flex mb-2 align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Plaka"
            value={vehicle.plaka}
            onChange={(e) => handler.change(index, "plaka", e.target.value)}
          />
          <input
            type="text"
            className="form-control me-2"
            placeholder="Marka"
            value={vehicle.marka}
            onChange={(e) => handler.change(index, "marka", e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => handler.remove(index)}
            disabled={vehicles.length === 1}
            title={vehicles.length === 1 ? "Son kayıt silinemez" : "Kaydı sil"}
          >
            🗑️
          </button>
        </div>
      ))}
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={handler.add}
      >
        ➕ Yeni {title.split(" ")[0]} Ekle
      </button>
    </div>
  );

  const renderDriverForm = (drivers, handler) => (
    <div>
      <h6 className="fw-bold mt-3">Sürücüler</h6>
      {drivers?.map((driver, index) => (
        <div key={index} className="d-flex mb-2 align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Ad"
            value={driver.ad}
            onChange={(e) => handler.change(index, "ad", e.target.value)}
          />
          <input
            type="text"
            className="form-control me-2"
            placeholder="Soyad"
            value={driver.soyad}
            onChange={(e) => handler.change(index, "soyad", e.target.value)}
          />
          <input
            type="text"
            className="form-control me-2"
            placeholder="Telefon"
            value={driver.tel}
            onChange={(e) => handler.change(index, "tel", e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => handler.remove(index)}
            disabled={drivers.length === 1}
            title={drivers.length === 1 ? "Son kayıt silinemez" : "Kaydı sil"}
          >
            🗑️
          </button>
        </div>
      ))}
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={handler.add}
      >
        ➕ Yeni Sürücü Ekle
      </button>
    </div>
  );

  // Hisse numaraları formu
  const renderHisseForm = () => (
    <div>
      <h6 className="fw-bold mt-3">📊 Hisse Numaraları ve Araç Atamaları</h6>
      <div className="alert alert-info">
        <small>
          💡 Her hisse numarasına maksimum 1 araç atanabilir. Hisse numaralarını
          girdikten sonra üzerine tıklayarak araç atama işlemlerini
          yapabilirsiniz.
        </small>
      </div>
      {editFormData?.hisse_numaralari?.map((hisseNo, index) => {
        const key = `${selectedMember.id}-${index}`;
        const isExpanded = expandedHisse === key;
        const assignedVehicle = hisseVehicles[key];

        return (
          <div key={index} className="mb-4 border rounded p-3 bg-light">
            <div className="d-flex align-items-center mb-2">
              <label
                className="form-label me-2 mb-0 fw-bold"
                style={{ minWidth: "100px" }}
              >
                Hisse {index + 1}:
              </label>
              <input
                type="text"
                className="form-control me-2"
                placeholder="Hisse numarasını girin"
                value={hisseNo}
                onChange={(e) => handleHisseNoChange(index, e.target.value)}
              />
              {hisseNo && hisseNo.trim() !== "" && (
                <button
                  type="button"
                  className={`btn btn-sm me-2 ${
                    isExpanded ? "btn-warning" : "btn-outline-primary"
                  }`}
                  onClick={() => handleHisseClick(hisseNo, index)}
                  title="Araç atama işlemlerini görüntüle"
                >
                  {isExpanded ? "🔽" : "▶️"} Araç Yönetimi
                </button>
              )}

              {/* Atanmış araç göstergesi */}
              {assignedVehicle && (
                <span className="badge bg-success ms-2">
                  🚛 {assignedVehicle.plaka} - {assignedVehicle.marka}
                </span>
              )}
            </div>

            {isExpanded && (
              <div className="ms-2 p-3 bg-white border rounded">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">
                    🚛 Hisse #{hisseNo} - Araç Atama
                  </h6>
                </div>

                {assignedVehicle ? (
                  /* Araç atanmış durum */
                  <div>
                    <div className="alert alert-success d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">✅ Atanmış Araç</h6>
                        <p className="mb-0">
                          <strong>{assignedVehicle.plaka}</strong> -{" "}
                          {assignedVehicle.marka}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveVehicle(hisseNo, index)}
                        title="Araç atamasını kaldır"
                      >
                        ❌ Kaldır
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Araç atanmamış durum */
                  <div>
                    <div className="alert alert-warning mb-3">
                      <p className="mb-0">
                        ⚠️ Bu hisse numarasına henüz araç atanmamış.
                      </p>
                    </div>

                    <h6 className="fw-bold mb-2">📋 Mevcut Araçlardan Seç:</h6>
                    <div className="row g-2">
                      {availableVehicles.map((vehicle) => (
                        <div key={vehicle.id} className="col-md-6">
                          <div className="card h-100">
                            <div className="card-body p-2 d-flex justify-content-between align-items-center">
                              <div>
                                <span className="fw-bold text-primary">
                                  {vehicle.plaka}
                                </span>
                                <br />
                                <small className="text-muted">
                                  {vehicle.marka}
                                </small>
                              </div>
                              <button
                                type="button"
                                className="btn btn-outline-success btn-sm"
                                onClick={() =>
                                  handleAssignVehicle(
                                    hisseNo,
                                    vehicle.id,
                                    index
                                  )
                                }
                                title="Bu aracı hisseye ata"
                              >
                                ➕ Ata
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {availableVehicles.length === 0 && (
                      <div className="text-center text-muted py-3">
                        <p className="mb-0">📭 Atanabilir araç bulunamadı</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {(!editFormData?.hisse_numaralari ||
        editFormData.hisse_numaralari.length === 0) && (
        <div className="alert alert-warning">
          <p className="mb-0">
            ⚠️ Önce üye bilgileri sekmesinden hisse sayısını belirleyiniz,
            ardından hisse numaralarını girebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );

  // Main Render
  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-primary">👥 Üye Yönetimi</h2>
          <p className="text-muted">Toplam {uyeler.length} üye kayıtlı</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="row mb-3">
        <div className="col-md-6">
          <button
            className="btn btn-success me-2"
            onClick={() => setModalOpen(true)}
          >
            ➕ Yeni Üye Ekle
          </button>
          <button
            className="btn btn-outline-primary me-2"
            onClick={loadUsers}
            title="Verileri yenile"
          >
            🔄 Yenile
          </button>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-outline-success me-2"
              onClick={exportExcel}
            >
              📊 Excel İndir
            </button>
            <button className="btn btn-outline-danger me-3" onClick={exportPDF}>
              📄 PDF İndir
            </button>
            <input
              type="text"
              placeholder="🔍 Ara..."
              className="form-control"
              style={{ maxWidth: "250px" }}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="row">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                noDataComponent={
                  <div className="text-center p-4">
                    <p className="text-muted">📋 Kayıt bulunamadı</p>
                  </div>
                }
                highlightOnHover
                pointerOnHover
                striped
                dense
                onRowClicked={openDetailModal}
                customStyles={{
                  headRow: {
                    style: {
                      backgroundColor: "#f8f9fa",
                    },
                  },
                  rows: {
                    style: {
                      cursor: "pointer",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {modalOpen && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">➕ Yeni Üye Ekle</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Ad *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ad"
                          value={formData.ad}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Soyad *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="soyad"
                          value={formData.soyad}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Telefon Numarası *</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="tel_no"
                          value={formData.tel_no}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">TC Kimlik No *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="tc_no"
                          value={formData.tc_no}
                          onChange={handleInputChange}
                          maxLength="11"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Hisse Sayısı *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="hisse"
                      value={formData.hisse}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={handleCloseModal}
                    >
                      ❌ İptal
                    </button>
                    <button type="submit" className="btn btn-success">
                      💾 Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail & Edit Modal */}
      {detailModalOpen && selectedMember && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  👤 {selectedMember.ad} {selectedMember.soyad} - Detay
                  Bilgileri
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseDetailModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Tab Navigation */}
                <ul className="nav nav-pills mb-4" role="tablist">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "uye" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("uye")}
                    >
                      👤 Üye Bilgileri
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "hisse" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("hisse")}
                    >
                      📊 Hisse Numaraları
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "arac" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("arac")}
                    >
                      🚛 Araçlar
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "dorse" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("dorse")}
                    >
                      🚚 Dorseler
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "sofor" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("sofor")}
                    >
                      👨‍💼 Sürücüler
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content">
                  {/* Member Info Tab */}
                  {activeTab === "uye" && (
                    <div className="tab-pane active">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Ad *</label>
                            <input
                              type="text"
                              className="form-control"
                              name="ad"
                              value={editFormData?.ad || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Soyad *</label>
                            <input
                              type="text"
                              className="form-control"
                              name="soyad"
                              value={editFormData?.soyad || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Telefon Numarası *
                            </label>
                            <input
                              type="tel"
                              className="form-control"
                              name="tel_no"
                              value={editFormData?.tel_no || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">TC Kimlik No *</label>
                            <input
                              type="text"
                              className="form-control"
                              name="tc_no"
                              value={editFormData?.tc_no || ""}
                              onChange={handleEditChange}
                              maxLength="11"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Hisse Sayısı *</label>
                        <input
                          type="number"
                          className="form-control"
                          name="hisse"
                          value={editFormData?.hisse || ""}
                          onChange={handleEditChange}
                          min="1"
                        />
                        <small className="form-text text-muted">
                          💡 Hisse sayısını değiştirdiğinizde hisse numaraları
                          otomatik olarak ayarlanır.
                        </small>
                      </div>
                      <div className="alert alert-danger">
                        <h6>⚠️ Tehlikeli İşlemler</h6>
                        <button
                          className="btn btn-danger"
                          onClick={handleDeleteMember}
                        >
                          🗑️ Üyeyi Sil
                        </button>
                        <small className="d-block mt-2">
                          Bu işlem geri alınamaz. Üye ve tüm ilişkili verileri
                          silinecektir.
                        </small>
                      </div>
                    </div>
                  )}

                  {/* Hisse Numaraları Tab */}
                  {activeTab === "hisse" && renderHisseForm()}

                  {/* Vehicles Tab */}
                  {activeTab === "arac" &&
                    renderVehicleForm(
                      editFormData?.araclar,
                      aracHandler,
                      "Araç Bilgileri"
                    )}

                  {/* Trailers Tab */}
                  {activeTab === "dorse" &&
                    renderVehicleForm(
                      editFormData?.dorseler,
                      dorseHandler,
                      "Dorse Bilgileri"
                    )}

                  {/* Drivers Tab */}
                  {activeTab === "sofor" &&
                    renderDriverForm(editFormData?.soforler, soforHandler)}
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseDetailModal}
                  >
                    ❌ İptal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdate}
                  >
                    💾 Değişiklikleri Kaydet
                  </button>
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
