import React, { useState, useEffect } from "react";

const AktifSira = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Test verisi - sonradan veritabanından gelecek
  const [uyeler, setUyeler] = useState([
    { id: 1, sira: 1, kod: 406, plaka: "14KB723", aracTipi: "Tır", nerede: "ANKARA KAHRAMANKAZAN", joker: false, durum: "kapali" },
    { id: 2, sira: 2, kod: 335, plaka: "41NP154", aracTipi: "Tır", nerede: "GAZİANTEP ŞAHİNBEY", joker: false, durum: "acik" },
    { id: 3, sira: 3, kod: 408, plaka: "41AY603", aracTipi: "Tır", nerede: "KOCAELİ GEBZE", joker: false, durum: "acik" },
    { id: 4, sira: 4, kod: 190, plaka: "41ATK692", aracTipi: "Tır", nerede: "BURSA KESTEL", joker: false, durum: "kapali" },
    { id: 5, sira: 5, kod: 2, plaka: "41LZ745", aracTipi: "Tır", nerede: "AFYONKARAHİSAR SİNANPAŞA", joker: false, durum: "kapali" },
    { id: 6, sira: 6, kod: 278, plaka: "41BY188", aracTipi: "Tır", nerede: "BURSA NİLÜFER", joker: false, durum: "acik" },
    { id: 7, sira: 7, kod: 459, plaka: "41RS028", aracTipi: "Tır", nerede: "ANTALYA DÖŞEMEALTI", joker: false, durum: "kapali" },
    { id: 8, sira: 8, kod: 508, plaka: "41K9218", aracTipi: "Tır", nerede: "BURSA NİLÜFER", joker: false, durum: "kapali" },
  ]);

  const [secilenUye, setSecilenUye] = useState(null);
  const [panelAcik, setPanelAcik] = useState(false);

  // Responsive değerler
  const isDesktop = screenSize.width > 1200;
  const isTablet = screenSize.width > 768 && screenSize.width <= 1200;
  const isMobile = screenSize.width <= 768;

  // Panel menü fonksiyonları - backend'de yapılacak
  const cezaVer = (uyeId) => {
    console.log(`Ceza ver - Üye ID: ${uyeId}`);
    setPanelAcik(false);
    // Backend kodu buraya gelecek
  };

  const siraAc = (uyeId) => {
    console.log(`Sıra aç - Üye ID: ${uyeId}`);
    const yeniUyeler = uyeler.map(uye =>
      uye.id === uyeId ? { ...uye, durum: "acik" } : uye
    );
    setUyeler(yeniUyeler);
    setPanelAcik(false);
    // Backend kodu buraya gelecek
  };

  const siraKapat = (uyeId) => {
    console.log(`Sıra kapat - Üye ID: ${uyeId}`);
    const yeniUyeler = uyeler.map(uye =>
      uye.id === uyeId ? { ...uye, durum: "kapali" } : uye
    );
    setUyeler(yeniUyeler);
    setPanelAcik(false);
    // Backend kodu buraya gelecek
  };

  const siraSonuCezasi = (uyeId) => {
    console.log(`Sıra sonu cezası - Üye ID: ${uyeId}`);
    setPanelAcik(false);
    // Backend kodu buraya gelecek
  };

  const uyeTikla = (uye) => {
    setSecilenUye(uye);
    setPanelAcik(true);
  };

  const excelAktar = () => {
    // Excel dosyası oluşturma simülasyonu
    const csvContent = "SIRA,KOD,PLAKA,ARAÇ TİPİ,JOKER,DURUM\n" +
      uyeler.map(uye => `${uye.sira},${uye.kod},${uye.plaka},${uye.aracTipi},${uye.joker ? 'Evet' : 'Hayır'},${uye.durum === 'acik' ? 'Açık' : 'Kapalı'}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `aktif_sira_${new Date().toLocaleDateString('tr-TR')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Excel dosyası indirildi");
  };

  const pdfAktar = () => {
    // PDF içeriği oluşturma
    const printContent = `
      <html>
        <head>
          <title>Aktif Sıra Durum Raporu</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2c3e50; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #343a40; color: white; }
            .kapali { background-color: #ff6b6b; color: white; }
            .acik { background-color: white; }
          </style>
        </head>
        <body>
          <h1>AKTİF SIRA DURUM RAPORU</h1>
          <p>Tarih: ${new Date().toLocaleDateString('tr-TR')}</p>
          <table>
            <thead>
              <tr>
                <th>SIRA</th>
                <th>KOD</th>
                <th>PLAKA</th>
                <th>ARAÇ TİPİ</th>
                <th>JOKER</th>
                <th>DURUM</th>
              </tr>
            </thead>
            <tbody>
              ${uyeler.map(uye => `
                <tr class="${uye.durum}">
                  <td>${uye.sira}</td>
                  <td>${uye.kod}</td>
                  <td>${uye.plaka}</td>
                  <td>${uye.aracTipi}</td>
                  <td>${uye.joker ? '⭐' : '0'}</td>
                  <td>${uye.durum === 'acik' ? 'Açık' : 'Kapalı'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();

    console.log("PDF raporu yazdırıldı");
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: isMobile ? '10px' : '15px'
    }}>

      

      {/* Ana İçerik - Tam Ortalanmış */}
      <div style={{
        marginLeft: isMobile ? '15px' : isDesktop ? '280px' : '270px',
        marginRight: '15px',
        maxWidth: isMobile ? 'calc(100% - 30px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: isMobile ? 'auto' : 'calc(100% - ' + (isMobile ? '30px' : isDesktop ? '295px' : '285px') + ')'
      }}>

        {/* Başlık ve Dışa Aktarma Butonları */}
        <div style={{
          backgroundColor: 'white',
          padding: isMobile ? '20px' : isDesktop ? '30px' : '25px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid #ddd',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '100%'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            marginBottom: '20px',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '15px' : '20px'
          }}>
            <h1 style={{
              fontSize: isDesktop ? '32px' : isTablet ? '28px' : '24px',
              fontWeight: 'bold',
              margin: 0,
              color: '#2c3e50'
            }}>AKTİF SIRA DURUM</h1>

            <div style={{
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={excelAktar}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: isDesktop ? '12px 24px' : '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: isDesktop ? '16px' : '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 6px rgba(40,167,69,0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#218838';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#28a745';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                📊 Excel
              </button>

              <button
                onClick={pdfAktar}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: isDesktop ? '12px 24px' : '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: isDesktop ? '16px' : '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 6px rgba(220,53,69,0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#c82333';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                📄 PDF
              </button>
            </div>
          </div>

          <p style={{
            margin: '0 0 20px 0',
            color: '#6c757d',
            fontSize: isDesktop ? '16px' : '14px'
          }}>
            Yanında 🔍 simgesi bulunan bilgileri arama yerinden arayabilirsiniz.
          </p>

          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Ara..."
              style={{
                padding: isDesktop ? '15px 20px' : '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                width: isMobile ? '100%' : isDesktop ? '500px' : '400px',
                maxWidth: '100%',
                fontSize: isDesktop ? '16px' : '14px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>
        </div>

        {/* Ana Tablo - Tam Genişlik ve Ortalanmış */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #ddd',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          overflowX: 'auto',
          width: '100%',
          maxWidth: '100%'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: isMobile ? '700px' : '100%',
            tableLayout: 'auto'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #343a40 0%, #495057 100%)',
                color: 'white'
              }}>
                <th style={{
                  border: '1px solid #495057',
                  padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px',
                  width: '12%'
                }}>
                  SIRA 🔍
                </th>
                <th style={{
                  border: '1px solid #495057',
                  padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px',
                  width: '15%'
                }}>
                  KOD 🔍
                </th>
                <th style={{
                  border: '1px solid #495057',
                  padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px',
                  width: '20%'
                }}>
                  PLAKA 🔍
                </th>
                <th style={{
                  border: '1px solid #495057',
                  padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px',
                  width: '20%'
                }}>
                  ARAÇ TİPİ
                </th>
                <th style={{
                  border: '1px solid #495057',
                  padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px',
                  width: '20%'
                }}>
                  ⭐JOKER⭐
                </th>
                <th style={{
                  border: '1px solid #495057',
                  padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px',
                  width: '13%'
                }}>
                  #
                </th>
              </tr>
            </thead>
            <tbody>
              {uyeler.map((uye, index) => (
                <tr
                  key={uye.id}
                  onClick={() => uyeTikla(uye)}
                  style={{
                    backgroundColor: uye.durum === "acik" ? 'white' : '#ff6b6b',
                    color: uye.durum === "acik" ? 'black' : 'white',
                    cursor: 'pointer',
                    height: isDesktop ? '70px' : isTablet ? '60px' : '55px',
                    borderBottom: '1px solid #e9ecef'
                  }}
                  onMouseEnter={(e) => {
                    const tr = e.currentTarget;
                    if (uye.durum === "acik") {
                      tr.style.backgroundColor = '#f8f9fa';
                    } else {
                      tr.style.backgroundColor = '#e74c3c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const tr = e.currentTarget;
                    tr.style.backgroundColor = uye.durum === "acik" ? 'white' : '#ff6b6b';
                  }}
                >
                  <td style={{
                    border: '1px solid #dee2e6',
                    padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                    fontWeight: 'bold',
                    fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px'
                  }}>
                    {uye.sira}
                  </td>
                  <td style={{
                    border: '1px solid #dee2e6',
                    padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                    fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px',
                    fontWeight: '500'
                  }}>
                    {uye.kod}
                  </td>
                  <td style={{
                    border: '1px solid #dee2e6',
                    padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                    fontWeight: 'bold',
                    fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px'
                  }}>
                    {uye.plaka}
                  </td>
                  <td style={{
                    border: '1px solid #dee2e6',
                    padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                    fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px'
                  }}>
                    {uye.aracTipi}
                  </td>
                  <td style={{
                    border: '1px solid #dee2e6',
                    padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                    textAlign: 'center',
                    fontSize: isDesktop ? '20px' : '18px'
                  }}>
                    {uye.joker ? '⭐' : '0'}
                  </td>
                  <td style={{
                    border: '1px solid #dee2e6',
                    padding: isDesktop ? '20px' : isTablet ? '16px' : '14px',
                    textAlign: 'center',
                    fontSize: isDesktop ? '18px' : isTablet ? '16px' : '14px'
                  }}>
                    {uye.durum === "acik" ? '0' : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Üye Panel Menü */}
      {panelAcik && secilenUye && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setPanelAcik(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: isMobile ? '25px' : isDesktop ? '35px' : '30px',
              minWidth: isMobile ? '280px' : isDesktop ? '400px' : '350px',
              maxWidth: '90vw',
              boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              transform: 'scale(1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              marginTop: 0,
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: isDesktop ? '22px' : isTablet ? '20px' : '18px',
              color: '#2c3e50',
              fontWeight: 'bold'
            }}>
              {secilenUye.plaka} - {secilenUye.kod}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button
                onClick={() => cezaVer(secilenUye.id)}
                style={{
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  padding: isDesktop ? '16px 28px' : '14px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: isDesktop ? '18px' : '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 8px rgba(255,193,7,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e0a800';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 12px rgba(255,193,7,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffc107';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 8px rgba(255,193,7,0.3)';
                }}
              >
                Ceza Ver
              </button>

              <button
                onClick={() => siraAc(secilenUye.id)}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: isDesktop ? '16px 28px' : '14px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: isDesktop ? '18px' : '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 8px rgba(40,167,69,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#218838';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 12px rgba(40,167,69,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#28a745';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 8px rgba(40,167,69,0.3)';
                }}
              >
                Sıra Aç
              </button>

              <button
                onClick={() => siraKapat(secilenUye.id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: isDesktop ? '16px 28px' : '14px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: isDesktop ? '18px' : '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 8px rgba(220,53,69,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#c82333';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 12px rgba(220,53,69,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 8px rgba(220,53,69,0.3)';
                }}
              >
                Sıra Kapat
              </button>

              <button
                onClick={() => siraSonuCezasi(secilenUye.id)}
                style={{
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  padding: isDesktop ? '16px 28px' : '14px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: isDesktop ? '18px' : '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 8px rgba(111,66,193,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#5a32a3';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 12px rgba(111,66,193,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6f42c1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 8px rgba(111,66,193,0.3)';
                }}
              >
                Sıra Sonu Cezası
              </button>

              <button
                onClick={() => setPanelAcik(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: isDesktop ? '16px 28px' : '14px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: isDesktop ? '18px' : '16px',
                  marginTop: '10px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#545b62';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AktifSira;