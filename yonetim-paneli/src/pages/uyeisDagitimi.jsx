import React, { useState } from "react";

const IsDagitimi = () => {
  const [tamEkran, setTamEkran] = useState(false);
  const [görünümModu, setGörünümModu] = useState('her-ikisi'); // 'sadece-sol', 'sadece-sag', 'her-ikisi'
  
  const [araclar, setAraclar] = useState([
    { sıra: 1, hisse: 406, plaka: "14KB723", güzergah: "ANKARA KAHRAMANKAZAN", çarpı: "T", veri: 0, star: 1, secildi: false, selected: false },
    { sıra: 2, hisse: 335, plaka: "41NP154", güzergah: "-", çarpı: "T", veri: 0, star: 1, secildi: false, selected: false },
    { sıra: 3, hisse: 408, plaka: "41AY603", güzergah: "-", çarpı: "T", veri: 0, star: 0, secildi: false, selected: false },
    { sıra: 4, hisse: 190, plaka: "41ATK692", güzergah: "-", çarpı: "T", veri: 0, star: 1, secildi: false, selected: false },
    { sıra: 5, hisse: 2, plaka: "41LZ745", güzergah: "-", çarpı: "T", veri: 0, star: 0, secildi: false, selected: false },
    { sıra: 6, hisse: 278, plaka: "41BY188", güzergah: "-", çarpı: "T", veri: 0, star: 1, secildi: false, selected: false },
    { sıra: 7, hisse: 459, plaka: "41RS028", güzergah: "ANTALYA DÖŞEMEALTI", çarpı: "T", veri: 0, star: 1, secildi: false, selected: false },
    { sıra: 8, hisse: 508, plaka: "41K9218", güzergah: "BURSA NİLÜFER", çarpı: "T", veri: 0, star: 1, secildi: false, selected: false },
    { sıra: 9, hisse: 42, plaka: "41PA213", güzergah: "-", çarpı: "T", veri: 0, star: 0, secildi: false, selected: false },
    { sıra: 10, hisse: "", plaka: "41ASY295", güzergah: "TRABZON YOMRA", çarpı: "T", veri: 0, star: 0, secildi: false, selected: false }
  ]);

  const [isler, setIsler] = useState([
    {
      id: 1,
      müşteri: "HAYAT KİMYA SANAYİ A.Ş",
      araçTipi: "Tır",
      yükTipi: "Hijyen",
      referansNo: "1060018173",
      yön: "Gidiş",
      açıklama: "MURAT LOJ. ADANA",
      tonaj: 0,
      depo: "Merkez Depo",
      varisİli: "ADANA",
      varisİlçesi: "YÜREĞİR",
      duraklar: "",
      selected: false
    },
    {
      id: 2,
      müşteri: "HAYAT KİMYA SANAYİ A.Ş",
      araçTipi: "Tır",
      yükTipi: "Hijyen",
      referansNo: "1060018174",
      yön: "Gidiş",
      açıklama: "MURAT LOJ. ADANA",
      tonaj: 0,
      depo: "Merkez Depo",
      varisİli: "ADANA",
      varisİlçesi: "YÜREĞİR",
      duraklar: "",
      selected: false
    },
    {
      id: 3,
      müşteri: "HAYAT KİMYA SANAYİ A.Ş",
      araçTipi: "Tır",
      yükTipi: "Hijyen",
      referansNo: "1060018175",
      yön: "Gidiş",
      açıklama: "MURAT LOJ. ADANA",
      tonaj: 0,
      depo: "Merkez Depo",
      varisİli: "ADANA",
      varisİlçesi: "YÜREĞİR",
      duraklar: "",
      selected: false
    },
    {
      id: 4,
      müşteri: "HAYAT KİMYA SANAYİ A.Ş",
      araçTipi: "Tır",
      yükTipi: "Hijyen",
      referansNo: "1000247578",
      yön: "Gidiş",
      açıklama: "IŞIK MEDİKAL/HALİL BİLGİÇ",
      tonaj: 10104,
      depo: "Merkez Depo",
      varisİli: "ADANA",
      varisİlçesi: "SEYHAN",
      duraklar: "",
      selected: false
    },
    {
      id: 5,
      müşteri: "HAYAT KİMYA SANAYİ A.Ş",
      araçTipi: "Tır",
      yükTipi: "Hijyen",
      referansNo: "1000246865",
      yön: "Gidiş",
      açıklama: "MESÇİ GIDA ADANA DEPO/IŞIK MEDİKAL/HALİL BİLGİÇ",
      tonaj: 13901,
      depo: "Merkez Depo",
      varisİli: "ADANA",
      varisİlçesi: "SEYHAN",
      duraklar: "",
      selected: false
    },
    {
      id: 6,
      müşteri: "HAYAT KİMYA SANAYİ A.Ş",
      araçTipi: "Tır",
      yükTipi: "Hijyen",
      referansNo: "1062039063",
      yön: "Gidiş",
      açıklama: "A101 YENİ MAĞAZACILI/BİM BİRLEŞİK MAĞAZAL/BİM BİRLEŞİK MAĞAZAL",
      tonaj: 11141,
      depo: "Merkez Depo",
      varisİli: "AFYONKARAHİSAR",
      varisİlçesi: "SİNANPAŞA",
      duraklar: "",
      selected: false
    }
  ]);

  // Seçili araç ve işleri kontrol et
  const seçiliAraç = araclar.find(araç => araç.selected);
  const seçiliİş = isler.find(iş => iş.selected);
  const isiVerButonuGöster = seçiliAraç && seçiliİş;

  const toggleAraçSecim = (index) => {
    const kopya = [...araclar];
    // Eğer zaten seçili ise iptal et, değilse önce hepsini false yap sonra bunu true yap
    if (kopya[index].selected) {
      kopya[index].selected = false;
    } else {
      kopya.forEach(araç => araç.selected = false);
      kopya[index].selected = true;
    }
    setAraclar(kopya);
  };

  const toggleİşSecim = (index) => {
    const kopya = [...isler];
    // Eğer zaten seçili ise iptal et, değilse önce hepsini false yap sonra bunu true yap
    if (kopya[index].selected) {
      kopya[index].selected = false;
    } else {
      kopya.forEach(iş => iş.selected = false);
      kopya[index].selected = true;
    }
    setIsler(kopya);
  };

  const işiVer = () => {
    if (seçiliAraç && seçiliİş) {
      alert(`${seçiliAraç.plaka} plakalı araç için ${seçiliİş.referansNo} referans nolu iş atandı!`);
      
      // Seçimleri temizle
      const aracKopya = [...araclar];
      const isKopya = [...isler];
      
      aracKopya.forEach(araç => araç.selected = false);
      isKopya.forEach(iş => iş.selected = false);
      
      setAraclar(aracKopya);
      setIsler(isKopya);
    }
  };

  const tamEkranToggle = () => {
    setTamEkran(!tamEkran);
  };

  const solTabloGöster = () => {
    setGörünümModu('sadece-sag');
  };

  const sağTabloGöster = () => {
    setGörünümModu('sadece-sol');
  };

  const ikiTabloGöster = () => {
    setGörünümModu('her-ikisi');
  };

  return (
    <div style={{ 
      width: tamEkran ? '100vw' : '100%', 
      minWidth: tamEkran ? 'auto' : '1200px', 
      height: tamEkran ? '100vh' : 'auto',
      backgroundColor: 'white',
      position: tamEkran ? 'fixed' : 'static',
      top: tamEkran ? 0 : 'auto',
      left: tamEkran ? 0 : 'auto',
      zIndex: tamEkran ? 9999 : 'auto'
    }}>
      {/* Ana başlık */}
      <div style={{ 
        backgroundColor: '#0f766e', 
        color: 'white', 
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={solTabloGöster}
            style={{ backgroundColor: 'white', color: '#374151', padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
          >
            ←
          </button>
          <button 
            onClick={sağTabloGöster}
            style={{ backgroundColor: 'white', color: '#374151', padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
          >
            →
          </button>
          <button 
            onClick={ikiTabloGöster}
            style={{ backgroundColor: 'white', color: '#374151', padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
          >
            ⟳
          </button>
        </div>
        
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>İŞ DAĞITIM EKRANI</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="radio" name="mod" defaultChecked />
              <span>Normal</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="radio" name="mod" />
              <span>Jokerli</span>
            </label>
          </div>
          <select style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid #d1d5db', color: '#374151' }}>
            <option>Sıradan</option>
            <option>1. Çarpan / Sıra Harici</option>
            <option>Çarpısız / Sıra Harici</option>
            <option>Çarpı Sil / Sıra Harici</option>
          </select>
          <button 
            onClick={tamEkranToggle}
            style={{ 
              backgroundColor: '#67e8f9', 
              color: '#134e4a', 
              padding: '4px 16px', 
              borderRadius: '4px', 
              fontWeight: 'bold', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {tamEkran ? 'BİTİR' : 'BAŞLA'}
          </button>
        </div>
      </div>

      {/* İkinci satır */}
      <div style={{ backgroundColor: '#f3f4f6', padding: '8px 24px', borderBottom: '1px solid #d1d5db', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{ backgroundColor: 'white', border: '1px solid #d1d5db', padding: '4px 12px', borderRadius: '4px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Gizle / Göster <span>▼</span>
        </button>
        
        {/* İŞİ VER BUTONU - Sadece iki taraftan da seçim yapıldığında görünür */}
        {isiVerButonuGöster && (
          <button 
            onClick={işiVer}
            style={{ 
              backgroundColor: '#dc2626', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              fontSize: '14px', 
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            İŞİ VER
          </button>
        )}
      </div>

      {/* Ana içerik - YAN YANA */}
      <div style={{ display: 'flex', height: tamEkran ? 'calc(100vh - 120px)' : '600px' }}>
        {/* Sol panel */}
        {(görünümModu === 'sadece-sol' || görünümModu === 'her-ikisi') && (
          <div style={{ 
            width: görünümModu === 'sadece-sol' ? '100%' : '50%', 
            borderRight: görünümModu === 'her-ikisi' ? '1px solid #d1d5db' : 'none', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            {/* Sol tablo başlık */}
            <div style={{ backgroundColor: '#f3f4f6', padding: '8px 16px', borderBottom: '1px solid #d1d5db' }}>
            </div>
            
            {/* Sol panel tablo container - Kaydırılabilir */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#e5e7eb', zIndex: 1 }}>
                  <tr>
                    <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', width: '40px' }}>Sıra</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', width: '80px' }}>Hisse</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', width: '80px' }}>Plaka</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', width: '60px' }}>
                      <div>🚛</div>
                      <div style={{ fontSize: '10px', display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <span>T</span><span>K</span>
                      </div>
                    </th>
                    <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', width: '40px' }}>
                      <div>✕</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {araclar.map((araç, index) => (
                    <tr 
                      key={index}
                      style={{
                        border: '1px solid #d1d5db',
                        cursor: 'pointer',
                        backgroundColor: araç.selected ? '#dbeafe' : 'white',
                        color: 'black'
                      }}
                    >
                      <td style={{ border: '1px solid #d1d5db', padding: '4px 8px', textAlign: 'center' }}>{araç.sıra}</td>
                      <td style={{ border: '1px solid #d1d5db', padding: '4px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input 
                            type="checkbox" 
                            checked={araç.selected}
                            onChange={() => toggleAraçSecim(index)}
                            style={{ cursor: 'pointer' }}
                          />
                          {araç.hisse}
                        </div>
                      </td>
                      <td style={{ border: '1px solid #d1d5db', padding: '4px 8px', fontWeight: 'bold' }}>{araç.plaka}</td>
                      <td style={{ border: '1px solid #d1d5db', padding: '4px 8px', fontSize: '12px', textAlign: 'center' }}>
                        <span>T</span>
                      </td>
                      <td style={{ border: '1px solid #d1d5db', padding: '4px 8px', fontSize: '12px', textAlign: 'center' }}>
                        <span>{araç.star}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sağ panel */}
        {(görünümModu === 'sadece-sag' || görünümModu === 'her-ikisi') && (
          <div style={{ 
            width: görünümModu === 'sadece-sag' ? '100%' : '50%', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            {/* Sağ panel tablo container - Kaydırılabilir */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#e5e7eb', zIndex: 1 }}>
                  <tr>
                    <th style={{ border: '1px solid #d1d5db', padding: '4px', textAlign: 'left', minWidth: '120px' }}>Müşteri</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '4px', textAlign: 'left', minWidth: '80px' }}>Araç Tipi</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '4px', textAlign: 'left', minWidth: '100px' }}>Nakliye No</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '4px', textAlign: 'left', minWidth: '120px' }}>Nakliye Güzergahı</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '4px', textAlign: 'left', minWidth: '80px' }}>Bayi</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '4px', textAlign: 'left', minWidth: '60px' }}>Tonaj</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '4px', textAlign: 'left', minWidth: '150px' }}>Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  {isler.map((iş, index) => (
                    <tr 
                      key={index} 
                      style={{ 
                        border: '1px solid #d1d5db', 
                        backgroundColor: iş.selected ? '#dbeafe' : (index % 2 === 0 ? 'white' : '#f9fafb'),
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ border: '1px solid #d1d5db', padding: '4px' }}>
                        <div style={{ color: '#2563eb', fontWeight: '600', fontSize: '11px' }}>{iş.müşteri}</div>
                      </td>
                      <td style={{ border: '1px solid #d1d5db', padding: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input 
                            type="checkbox" 
                            checked={iş.selected}
                            onChange={() => toggleİşSecim(index)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ backgroundColor: '#e9d5ff', color: '#7c3aed', padding: '2px 4px', borderRadius: '4px', fontSize: '10px' }}>
                            {iş.araçTipi}
                          </span>
                        </div>
                      </td>
                      <td style={{ border: '1px solid #d1d5db', padding: '4px' }}>{iş.referansNo}</td>
                      <td style={{ border: '1px solid #d1d5db', padding: '4px', fontWeight: '600' }}>
                        {iş.varisİli}/{iş.varisİlçesi}
                      </td>
                      <td style={{ border: '1px solid #d1d5db', padding: '4px' }}>
                        {iş.açıklama.includes('A101') ? 'A101' : 
                         iş.açıklama.includes('BİM') ? 'BİM' : 
                         iş.açıklama.includes('MURAT') ? 'MURAT LOJ.' :
                         iş.açıklama.includes('IŞIK') ? 'IŞIK MEDİKAL' : '-'}
                      </td>
                      <td style={{ border: '1px solid #d1d5db', padding: '4px', textAlign: 'right' }}>{iş.tonaj}</td>
                      <td style={{ border: '1px solid #d1d5db', padding: '4px', fontWeight: '600' }}>{iş.açıklama}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IsDagitimi;