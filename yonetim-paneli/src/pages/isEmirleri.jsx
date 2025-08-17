import React, { useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";

const initialData = [
  { id: 1, musteri: "Musteri1", nakliyeNo: "N001", nakliyeGuzergah: "İstanbul-Ankara", musteriAdi: "Ahmet Yılmaz", aracTipi: "Tır", tonaj: 20, aciklama: "Özel yük", tur: "Dönüş" }
];

const IsEmirleriTable = () => {
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    musteri: "",
    nakliyeNo: "",
    nakliyeGuzergah: "",
    musteriAdi: "",
    aracTipi: "",
    tonaj: 0,
    aciklama: "",
    tur: "Dönüş",
    adet: 1
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleShowModal = (index = null) => {
    if (index !== null) {
      setFormData({ ...data[index], adet: 1 });
      setEditIndex(index);
    } else {
      setFormData({ musteri: "", nakliyeNo: "", nakliyeGuzergah: "", musteriAdi: "", aracTipi: "", tonaj: 0, aciklama: "", tur: "Dönüş", adet: 1 });
      setEditIndex(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const adet = parseInt(formData.adet) || 1;
    const newEntries = Array(adet).fill({
      musteri: formData.musteri,
      nakliyeNo: formData.nakliyeNo,
      nakliyeGuzergah: formData.nakliyeGuzergah,
      musteriAdi: formData.musteriAdi,
      aracTipi: formData.aracTipi,
      tonaj: formData.tonaj,
      aciklama: formData.aciklama,
      tur: formData.tur
    });

    if (editIndex !== null) {
      const updatedData = [...data];
      updatedData[editIndex] = { ...formData };
      setData(updatedData);
    } else {
      setData(prev => [...prev, ...newEntries.map((entry, i) => ({ ...entry, id: prev.length + i + 1 }))]);
    }

    handleCloseModal();
  };

  const handleEdit = (index) => handleShowModal(index);

  const handleDelete = (index) => {
    setData(prev => prev.filter((_, i) => i !== index));
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

      // Her satıra id ekle
      const dataWithIds = importedData.map((row, i) => ({
        id: data.length + i + 1,
        musteri: row.musteri || "",
        nakliyeNo: row.nakliyeNo || "",
        nakliyeGuzergah: row.nakliyeGuzergah || "",
        musteriAdi: row.musteriAdi || "",
        aracTipi: row.aracTipi || "",
        tonaj: row.tonaj || 0,
        aciklama: row.aciklama || "",
        tur: row.tur || "Dönüş"
      }));

      setData(prev => [...prev, ...dataWithIds]);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      <Button onClick={() => handleShowModal()}>Yeni İş Ekle</Button>{" "}
      <Button onClick={handleExportExcel} variant="success">Excel Aktar</Button>{" "}
      <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} style={{ display: "inline-block", marginLeft: "10px" }} />

      <Table striped bordered hover className="mt-2">
        <thead>
          <tr>
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
            <tr key={row.id}>
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
                    label="Dönüş" 
                    name="tur" 
                    value="Dönüş" 
                    checked={formData.tur === "Dönüş"} 
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

            {!editIndex && (
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
          <Button variant="primary" onClick={handleSubmit}>{editIndex !== null ? "Güncelle" : "Ekle"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default IsEmirleriTable;
