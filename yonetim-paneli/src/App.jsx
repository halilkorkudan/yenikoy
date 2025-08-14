import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AnaSayfa from './pages/AnaSayfa';
import SiraDurumu from './pages/SiraDurumu';
import Ayarlar from './pages/AktifSira';
import Uyeler from './pages/Uyeler';
import FirmaBilgileri from "./pages/firma-bilgileri";


function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header />
        <div style={{ padding: '20px', backgroundColor: '#f5f6fa', minHeight: 'calc(100vh - 60px)' }}>
          <Routes>
            <Route path="/" element={<AnaSayfa />} />
            <Route path="/sira-durumu" element={<SiraDurumu />} />
            <Route path="/AktifSira" element={<Ayarlar />} />
            <Route path="/uyeler" element={<Uyeler />} />
            <Route path="/firma-bilgileri" element={<FirmaBilgileri />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
