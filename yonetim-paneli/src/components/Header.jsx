// Header.js
import React from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  // URL yoluna göre başlık belirleme
  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Anasayfa';
      case '/isDagitimi':
        return 'İş Dağıtımı';
      case '/AktifSira':
        return 'Aktif Sıra';
      case '/uyeler':
        return 'Üyeler';
      case '/firma-bilgileri':
        return 'Firma Bilgileri';
      default:
        return 'Yönetim Paneli';
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '10px', color: '#333', borderBottom: '1px solid #ddd' }}>
      <h2>{getTitle()}</h2>
    </div>
  );
}

export default Header;
