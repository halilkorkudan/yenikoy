import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import * as XLSX from "xlsx";

const IsEmirleriTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    musteri: "",
    nakliyeNo: "",
    nakliyeGuzergah: "",
    musteriAdi: "",
    aracTipi: "",
    tonaj: 0,
    aciklama: "",
    tur: "Dönüşlü",
    adet: 1,
    donusGuzergah: "",
    donusRefNo: "",
    donusDuraklari: "",
    donusYukTipi: ""
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
  const [transferLoading, setTransferLoading] = useState(false);

  // ✅ Sayfa yüklendiğinde veritabanından verileri çek
  useEffect(() => {
    fetchDataFromDB();
  }, []);

  // ✅ Veritabanından verileri çekme fonksiyonu
  const fetchDataFromDB = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/isler");

      if (response.ok) {
        const dbData = await response.json();

        // Backend'den gelen veriyi frontend formatına çevir
        const formattedData = dbData.map(item => ({
          id: item.id,
          musteri: item.musteri || '',
          nakliyeNo: item.nakliye_no || '',  // snake_case -> camelCase
          nakliyeGuzergah: item.guzergah || '',
          musteriAdi: item.musteri_adi || '',
          aracTipi: item.arac_tipi || '',
          tonaj: item.tonaj || 0,
          aciklama: item.aciklama || '',
          tur: item.tur || 'Dönüşlü',
          donusGuzergah: item.donus_guzergah || '',
          donusRefNo: item.donus_ref_no || '',
          donusDuraklari: item.donus_duraklari || '',
          donusYukTipi: item.donus_yuk_tipi || ''
        }));

        setData(formattedData);
        console.log('Veritabanından', formattedData.length, 'kayıt çekildi');
      } else {
        throw new Error('Veri çekme hatası');
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      showAlert("Veritabanından veri çekilemedi!", "danger");
      setData([]); // Hata durumunda boş array
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "success" }), 3000);
  };

  const handleShowModal = (index = null) => {
    if (index !== null) {
      const item = data[index];
      setFormData({
        ...item,
        adet: 1,
        nakliyeNo: item.nakliyeNo || '',
        nakliyeGuzergah: item.nakliyeGuzergah || '',
        musteriAdi: item.musteriAdi || '',
        aracTipi: item.aracTipi || ''
      });
      setEditIndex(index);
      setEditId(item.id);
    } else {
      setFormData({
        musteri: "", nakliyeNo: "", nakliyeGuzergah: "", musteriAdi: "",
        aracTipi: "", tonaj: 0, aciklama: "", tur: "Dönüşlü", adet: 1,
        donusGuzergah: "", donusRefNo: "", donusDuraklari: "", donusYukTipi: ""
      });
      setEditIndex(null);
      setEditId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Form submit - hem yeni ekle hem güncelle
  const handleSubmit = async () => {
    try {
      if (editIndex !== null) {
        // ✅ Güncelleme işlemi - veritabanında güncelle
        const updateData = {
          musteri: formData.musteri,
          nakliye_no: formData.nakliyeNo,
          guzergah: formData.nakliyeGuzergah,
          musteri_adi: formData.musteriAdi,
          arac_tipi: formData.aracTipi,
          tonaj: parseInt(formData.tonaj) || 0,
          aciklama: formData.aciklama,
          tur: formData.tur
        };

        const response = await fetch(`http://localhost:5000/isler/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          showAlert("İş başarıyla güncellendi!", "success");
          fetchDataFromDB(); // Verileri yeniden çek
        } else {
          throw new Error("Güncelleme hatası");
        }
      } else {
        // ✅ Yeni ekleme işlemi - veritabanına ekle
        const adet = parseInt(formData.adet) || 1;
        const newEntries = Array(adet).fill(null).map(() => ({
          musteri: formData.musteri,
          nakliye_no: formData.nakliyeNo,
          guzergah: formData.nakliyeGuzergah,
          musteri_adi: formData.musteriAdi,
          arac_tipi: formData.aracTipi,
          tonaj: parseInt(formData.tonaj) || 0,
          aciklama: formData.aciklama,
          tur: formData.tur
        }));

        const response = await fetch("http://localhost:5000/isler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: 'bulk_insert',
            data: newEntries
          }),
        });

        if (response.ok) {
          showAlert(`${adet} adet iş başarıyla eklendi!`, "success");
          fetchDataFromDB(); // Verileri yeniden çek
        } else {
          throw new Error("Ekleme hatası");
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error("İşlem hatası:", error);
      showAlert("İşlem sırasında hata oluştu!", "danger");
    }
  };

  const handleEdit = (index) => handleShowModal(index);

  // ✅ Silme işlemi - veritabanından da sil
  const handleDelete = async (index) => {
    try {
      const item = data[index];
      const response = await fetch(`http://localhost:5000/isler/${item.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        showAlert("İş başarıyla silindi!", "success");
        fetchDataFromDB(); // Verileri yeniden çek
      } else {
        throw new Error("Silme hatası");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      showAlert("Silme işlemi sırasında hata oluştu!", "danger");
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "IsEmirleri");
    XLSX.writeFile(wb, "is_emirleri.xlsx");
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const importedData = XLSX.utils.sheet_to_json(ws);
      const arrayData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      let processedData = [];

      if (importedData.length > 0 && typeof importedData[0] === 'object') {
        processedData = importedData.map((row) => ({
          musteri: row.musteri || row.Müşteri || "",
          nakliyeNo: row.nakliyeNo || row.nakliye_no || row["Nakliye No"] || "",
          nakliyeGuzergah: row.nakliyeGuzergah || row.guzergah || row.Güzergah || "",
          musteriAdi: row.musteriAdi || row.musteri_adi || row["Müşteri Adı"] || "",
          aracTipi: row.aracTipi || row.arac_tipi || row["Araç Tipi"] || "",
          tonaj: row.tonaj || row.Tonaj || 0,
          aciklama: row.aciklama || row.Açıklama || "",
          tur: row.tur || row.Tür || "Dönüşlü",
          donusGuzergah: row.donusGuzergah || "",
          donusRefNo: row.donusRefNo || "",
          donusDuraklari: row.donusDuraklari || "",
          donusYukTipi: row.donusYukTipi || ""
        }));
      } else if (arrayData.length > 1) {
        const rowsData = arrayData.slice(1).map((row) => ({
          musteri: row[0] || "",
          nakliyeNo: row[1] || "",
          nakliyeGuzergah: row[2] || "",
          musteriAdi: row[3] || "",
          aracTipi: row[4] || "",
          tonaj: row[5] || 0,
          aciklama: row[6] || "",
          tur: row[7] || "Dönüşlü",
          donusGuzergah: "",
          donusRefNo: "",
          donusDuraklari: "",
          donusYukTipi: ""
        }));
        processedData = rowsData;
      }

      if (processedData.length > 0) {
        // ✅ Excel verilerini hemen local state'e ekle (geçici görünüm için)
        setData(prev => [...prev, ...processedData.map((item, i) => ({
          ...item,
          id: Date.now() + i // Geçici ID
        }))]);
        showAlert(`${processedData.length} kayıt içe aktarıldı. Kalıcı olması için 'Veritabanına Kaydet' butonuna basın.`, "info");
      } else {
        showAlert("Excel dosyasından veri okunamadı!", "danger");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // ✅ Veritabanına kaydetme - sadece henüz kaydedilmemiş verileri kaydet
  const handleSaveToDB = async () => {
    try {
      // Geçici ID'li (henüz kaydedilmemiş) verileri filtrele
      const unsavedData = data.filter(item => typeof item.id === 'number' && item.id > 1000000);

      if (unsavedData.length === 0) {
        showAlert("Kaydedilecek yeni veri bulunamadı!", "info");
        return;
      }

      const rows = unsavedData.map(item => ({
        musteri: item.musteri || '',
        nakliye_no: item.nakliyeNo || '',
        guzergah: item.nakliyeGuzergah || '',
        musteri_adi: item.musteriAdi || '',
        arac_tipi: item.aracTipi || '',
        tonaj: parseInt(item.tonaj) || 0,
        aciklama: item.aciklama || '',
        tur: item.tur || 'Dönüşlü'
      }));

      const res = await fetch("http://localhost:5000/isler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: 'bulk_insert',
          data: rows
        }),
      });

      if (res.ok) {
        const result = await res.json();
        showAlert(result.message || "Veriler başarıyla veritabanına kaydedildi!", "success");
        // Verileri yeniden çek (gerçek ID'ler ile gelecek)
        fetchDataFromDB();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Sunucu hatası");
      }
    } catch (err) {
      console.error("Kayıt hatası:", err);
      showAlert("Veritabanına kayıt sırasında hata oluştu: " + err.message, "danger");
    }
  };

  // ✅ YENİ: Son gelenleri aktar fonksiyonu
  const handleTransferLatest = async () => {
    try {
      setTransferLoading(true);
      const response = await fetch("http://localhost:5000/transfer-latest-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        showAlert(
          `${result.transferredCount} iş İş Dağıtım sayfasına aktarıldı!`,
          "success"
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Aktarma hatası");
      }
    } catch (error) {
      console.error("Aktarma hatası:", error);
      showAlert("İş aktarma sırasında hata oluştu: " + error.message, "danger");
    } finally {
      setTransferLoading(false);
    }
  };

  // ✅ Loading durumu
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {alert.show && (
        <Alert variant={alert.variant} className="mb-3">
          {alert.message}
        </Alert>
      )}

      <div className="mb-3">
        <Button onClick={() => handleShowModal()}>Yeni İş Ekle</Button>{" "}
        <Button onClick={handleExportExcel} variant="success">Excel Aktar</Button>{" "}
        <Button onClick={handleSaveToDB} variant="info">Veritabanına Kaydet</Button>{" "}
        <Button onClick={fetchDataFromDB} variant="secondary">Verileri Yenile</Button>{" "}
        {/* ✅ YENİ: Son Gelenleri Aktar butonu */}
        <Button
          onClick={handleTransferLatest}
          variant="warning"
          disabled={transferLoading || data.length === 0}
        >
          {transferLoading ? 'Aktarılıyor...' : 'Son Gelenleri Aktar'}
        </Button>{" "}
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleImportExcel}
          style={{ display: "inline-block", marginLeft: "10px" }}
        />
      </div>

      <div className="mb-2">
        <small className="text-muted">
          Toplam {data.length} kayıt görüntüleniyor
        </small>
      </div>

      <Table striped bordered hover className="mt-2">
        <thead>
          <tr>
            <th>ID</th>
            <th>Müşteri</th>
            <th>Nakliye No</th>
            <th>Güzergah</th>
            <th>Müşteri Adı</th>
            <th>Araç Tipi</th>
            <th>Tonaj</th>
            <th>Açıklama</th>
            <th>Tür</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} className={typeof row.id === 'number' && row.id > 1000000 ? 'table-warning' : ''}>
              <td>
                {row.id}
                {typeof row.id === 'number' && row.id > 1000000 &&
                  <small className="text-muted d-block">(Kaydedilmemiş)</small>
                }
              </td>
              <td>{row.musteri}</td>
              <td>{row.nakliyeNo}</td>
              <td>{row.nakliyeGuzergah}</td>
              <td>{row.musteriAdi}</td>
              <td>{row.aracTipi}</td>
              <td>{row.tonaj}</td>
              <td>{row.aciklama}</td>
              <td>{row.tur}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(index)}>Düzenle</Button>{" "}
                <Button size="sm" variant="danger" onClick={() => handleDelete(index)}>Sil</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {data.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-muted">Henüz hiç veri bulunmuyor. Yeni iş ekleyin veya Excel'den içe aktarın.</p>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? "İşi Düzenle" : "Yeni İş Ekle"}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxWidth: "600px", minWidth: "500px", margin: "auto" }}>
          <Form>
            <Row className="mb-2">
              <Col>
                <Form.Label>Müşteri</Form.Label>
                <Form.Control name="musteri" value={formData.musteri} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Nakliye No</Form.Label>
                <Form.Control name="nakliyeNo" value={formData.nakliyeNo} onChange={handleChange} />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Form.Label>Güzergah</Form.Label>
                <Form.Control name="nakliyeGuzergah" value={formData.nakliyeGuzergah} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Müşteri Adı</Form.Label>
                <Form.Control name="musteriAdi" value={formData.musteriAdi} onChange={handleChange} />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Form.Label>Araç Tipi</Form.Label>
                <Form.Control name="aracTipi" value={formData.aracTipi} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Tonaj</Form.Label>
                <Form.Control type="number" name="tonaj" value={formData.tonaj} onChange={handleChange} />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Form.Label>Açıklama</Form.Label>
                <Form.Control name="aciklama" value={formData.aciklama} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Tür</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Dönüşlü"
                    name="tur"
                    value="Dönüşlü"
                    checked={formData.tur === "Dönüşlü"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Ring"
                    name="tur"
                    value="Ring"
                    checked={formData.tur === "Ring"}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>

            {formData.tur === "Dönüşlü" && (
              <>
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Dönüş Güzergahı</Form.Label>
                    <Form.Control name="donusGuzergah" value={formData.donusGuzergah} onChange={handleChange} />
                  </Col>
                  <Col>
                    <Form.Label>Dönüş Referans No</Form.Label>
                    <Form.Control name="donusRefNo" value={formData.donusRefNo} onChange={handleChange} />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Dönüş Durakları</Form.Label>
                    <Form.Control name="donusDuraklari" value={formData.donusDuraklari} onChange={handleChange} />
                  </Col>
                  <Col>
                    <Form.Label>Dönüş Yük Tipi</Form.Label>
                    <Form.Control name="donusYukTipi" value={formData.donusYukTipi} onChange={handleChange} />
                  </Col>
                </Row>
              </>
            )}

            {editIndex === null && (
              <Row className="mb-2">
                <Col>
                  <Form.Label>Adet</Form.Label>
                  <Form.Control type="number" min="1" name="adet" value={formData.adet} onChange={handleChange} />
                </Col>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>İptal</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editIndex !== null ? "Güncelle" : "Ekle"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default IsEmirleriTable;