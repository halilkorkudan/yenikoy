import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AnaSayfa from './pages/AnaSayfa';
import IsDagitimi from './pages/isDagitimi';
import UyeisDag from './pages/uyeisDagitimi';
import Ayarlar from './pages/AktifSira';
import Uyeler from './pages/Uyeler';
import FirmaBilgileri from "./pages/firma-bilgileri";
import Raporlar from './pages/Raporlar';
import IsEmirleri from './pages/isEmirleri';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header />
        <div style={{ padding: '20px', backgroundColor: '#f5f6fa', minHeight: 'calc(100vh - 60px)' }}>
          <Routes>
            <Route path="/" element={<AnaSayfa />} />
            <Route path="/isDagitimi" element={<IsDagitimi />} />
            <Route path="/AktifSira" element={<Ayarlar />} />
            <Route path="/uyeler" element={<Uyeler />} />
            <Route path="/firma-bilgileri" element={<FirmaBilgileri />} />
            <Route path="/raporlar" element={<Raporlar />} />
            <Route path="/isEmirleri" element={<IsEmirleri />} />
            <Route path="/isDagitimi/uye" element={<UyeisDag />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
