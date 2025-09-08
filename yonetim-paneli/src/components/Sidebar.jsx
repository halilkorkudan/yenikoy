import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaUsers, 
  FaListUl, 
  FaTruck, 
  FaBuilding, 
  FaBars,
  FaListAlt,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isIsDagitimiOpen, setIsIsDagitimiOpen] = useState(false); // alt menü state

  return (
    <div
      style={{
        width: collapsed ? "80px" : "250px",
        backgroundColor: "#1e1e2f",
        color: "#fff",
        minHeight: "100vh",
        transition: "width 0.3s ease",
        boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
      }}
    >
      {/* Üst kısım */}
      <div className="d-flex align-items-center justify-content-between p-3">
        {!collapsed && <h4 className="mb-0">Yönetim Paneli</h4>}
        <FaBars
          style={{ cursor: "pointer" }}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Menü */}
      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <Link
            className="nav-link text-white d-flex align-items-center gap-2 p-3"
            to="/firma-bilgileri"
            style={{ transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343454")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <FaBuilding />
            {!collapsed && "Firma Bilgileri"}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link text-white d-flex align-items-center gap-2 p-3"
            to="/"
            style={{ transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343454")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <FaHome />
            {!collapsed && "Ana Sayfa"}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link text-white d-flex align-items-center gap-2 p-3"
            to="/AktifSira"
            style={{ transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343454")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <FaTruck />
            {!collapsed && "Aktif Sıra"}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link text-white d-flex align-items-center gap-2 p-3"
            to="/isEmirleri"
            style={{ transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343454")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <FaTruck />
            {!collapsed && "İş Emirleri"}
          </Link>
          
          
        </li>
        {/* İş Dağıtımı Menü */}
        <li className="nav-item">
          <div
            className="nav-link text-white d-flex align-items-center justify-content-between gap-2 p-3"
            style={{ cursor: "pointer", transition: "all 0.2s" }}
            onClick={() => setIsIsDagitimiOpen(!isIsDagitimiOpen)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#343454")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div className="d-flex align-items-center gap-2">
              <FaListUl />
              {!collapsed && "İş Dağıtımı"}
            </div>
            {!collapsed && (isIsDagitimiOpen ? <FaChevronUp /> : <FaChevronDown />)}
          </div>
          {/* Alt Menü */}
          {isIsDagitimiOpen && !collapsed && (
            <ul className="nav flex-column ms-4">
              <li className="nav-item">
                <Link
                  className="nav-link text-white p-2"
                  to="/isDagitimi/uye"
                  style={{ transition: "all 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#343454")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  Üye İş Dağıtımı
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white p-2"
                  to="/isDagitimi/sira"
                  style={{ transition: "all 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#343454")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  Sıra Durumu
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="nav-item">
          <Link
            className="nav-link text-white d-flex align-items-center gap-2 p-3"
            to="/uyeler"
            style={{ transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343454")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <FaUsers />
            {!collapsed && "Üyeler"}
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            className="nav-link text-white d-flex align-items-center gap-2 p-3"
            to="/raporlar"
            style={{ transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343454")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <FaListAlt />
            {!collapsed && "Raporlar"}
          </Link>
        </li>
        
        
        
      </ul>
    </div>
  );
};

export default Sidebar;
