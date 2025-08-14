import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const dummyData = [
  { id: 1, kod: 'TR123', plaka: '34ABC123', aracTipi: 'Tır', siraAcik: true },
  { id: 2, kod: 'TR456', plaka: '35XYZ456', aracTipi: 'Kamyon', siraAcik: false },
  { id: 3, kod: 'TR789', plaka: '06DEF789', aracTipi: 'Dorse', siraAcik: true },
];

const AktifSira = () => {
  const [uyeler, setUyeler] = useState(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [selectedUye, setSelectedUye] = useState(null);

  const handleRowClick = (uye) => {
    setSelectedUye(uye);
    setShowModal(true);
  };

  const toggleSiraDurumu = () => {
    const updated = uyeler.map((uye) =>
      uye.id === selectedUye.id ? { ...uye, siraAcik: !uye.siraAcik } : uye
    );
    setUyeler(updated);
    setShowModal(false);
  };

  return (
    <div>

      <Table bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Sıra</th>
            <th>Kod</th>
            <th>Plaka</th>
            <th>Araç Tipi</th>
            <th>Sıra Durumu</th>
          </tr>
        </thead>
        <tbody>
          {uyeler.map((uye, index) => (
            <tr
              key={uye.id}
              onClick={() => handleRowClick(uye)}
              style={{ backgroundColor: uye.siraAcik ? 'white' : '#f8d7da', cursor: 'pointer' }}
            >
              <td>{index + 1}</td>
              <td>{uye.kod}</td>
              <td>{uye.plaka}</td>
              <td>{uye.aracTipi}</td>
              <td>{uye.siraAcik ? 'Açık' : 'Kapalı'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>İşlem Seçenekleri</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Plaka:</strong> {selectedUye?.plaka}</p>
          <p><strong>Sıra Durumu:</strong> {selectedUye?.siraAcik ? 'Açık' : 'Kapalı'}</p>
          <div className="d-grid gap-2">
            <Button variant="warning">Ceza Ver</Button>
            <Button variant="secondary" onClick={toggleSiraDurumu}>
              {selectedUye?.siraAcik ? 'Sıra Kapat' : 'Sıra Aç'}
            </Button>
            <Button variant="danger">Sıra Sonu Cezası</Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Kapat</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AktifSira;
