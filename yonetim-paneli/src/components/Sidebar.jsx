import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        borderRadius: "0 40px 40px 0",
        minHeight: "100vh", // ekran kadar başlasın
        height: "auto",     // içeriğe göre uzasın
        fontSize: "1.1rem", // projeksiyon için biraz büyük
      }}
    >
      <h4 className="mb-4">Yönetim Paneli</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/firma-bilgileri">Firma Bilgileri</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/">Ana Sayfa</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/AktifSira">Aktif Sıra</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/sira-durumu">Sıra Durumu</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/uyeler">Üyeler</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/raporlar">Raporlar</Link>
        </li>
        
        
      </ul>
    </div>
  );
};

export default Sidebar;
