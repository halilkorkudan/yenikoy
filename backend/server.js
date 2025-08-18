const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 5000;

// CORS ayarlarını genişlet
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Test endpoint'i ekle
app.get('/test', (req, res) => {
  res.json({ message: 'Backend çalışıyor!', timestamp: new Date() });
});

// Geliştirilmiş MySQL bağlantısı
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "kop",
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10
});

// Bağlantı testi
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL bağlantı hatası:', err.message);
    process.exit(1);
  }
  console.log('✅ MySQL bağlantısı başarılı - ID:', connection.threadId);
  connection.release();
  
  // Server'ı başlat
  app.listen(port, () => {
    console.log(`🚀 Server ${port} portunda çalışıyor`);
  });
});

/* -------------------- ÜYELER ENDPOINTLERİ -------------------- */

// GET /uyeler - tüm üyeleri getir
app.get("/uyeler", (req, res) => {
  console.log('GET /uyeler endpoint\'ine istek geldi');
  
  db.query("SELECT * FROM uyeler", (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err);
      return res.status(500).json({ message: "Veritabanı hatası", error: err.message });
    }
    
    console.log('Veritabanından dönen sonuç:', results.length, 'kayıt');
    
    // Veri tiplerini kontrol et ve güvenli hale getir
    const safeResults = results.map(uye => {
      console.log('Raw veri tipleri:', {
        id: typeof uye.id,
        aplaka: typeof uye.aplaka,
        amarka: typeof uye.amarka,
        dplaka: typeof uye.dplaka,
        dmarka: typeof uye.dmarka,
        sad: typeof uye.sad,
        ssoyad: typeof uye.ssoyad,
        stel: typeof uye.stel,
        stel_value: uye.stel
      });
      
      return {
        ...uye,
        aplaka: uye.aplaka === null ? "" : String(uye.aplaka),
        amarka: uye.amarka === null ? "" : String(uye.amarka),
        dplaka: uye.dplaka === null ? "" : String(uye.dplaka),
        dmarka: uye.dmarka === null ? "" : String(uye.dmarka),
        sad: uye.sad === null ? "" : String(uye.sad),
        ssoyad: uye.ssoyad === null ? "" : String(uye.ssoyad),
        stel: uye.stel === null ? "" : String(uye.stel)
      };
    });
    
    res.json(safeResults);
  });
});

// POST /uyeler - yeni üye ekle
app.post("/uyeler", (req, res) => {
  console.log('POST /uyeler - Yeni üye ekleniyor:', req.body);
  
  const { ad, soyad, tc_no, tel_no, hisse, aplaka, amarka, dplaka, dmarka, sad, ssoyad, stel } = req.body;

  if (!ad || !soyad || !tc_no || !tel_no || !hisse) {
    return res.status(400).json({ message: "Tüm alanlar zorunludur" });
  }

  const sql = `INSERT INTO uyeler 
    (ad, soyad, tc_no, tel_no, hisse, aplaka, amarka, dplaka, dmarka, sad, ssoyad, stel) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [ad, soyad, tc_no, tel_no, hisse, aplaka, amarka, dplaka, dmarka, sad, ssoyad, stel];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Üye ekleme hatası:', err);
      return res.status(500).json({ message: "Veritabanı hatası", error: err.message });
    }
    console.log('Yeni üye eklendi, ID:', results.insertId);
    res.json({ uyeId: results.insertId });
  });
});

// PUT /uyeler/:id - üye güncelle
app.put("/uyeler/:id", (req, res) => {
  const { id } = req.params;
  console.log('PUT /uyeler/' + id + ' - Üye güncelleniyor:', req.body);
  
  const { ad, soyad, tc_no, tel_no, hisse, aplaka, amarka, dplaka, dmarka, sad, ssoyad, stel } = req.body;

  if (!ad || !soyad || !tc_no || !tel_no || !hisse) {
    return res.status(400).json({ message: "Tüm alanlar zorunludur" });
  }

  const sql = `UPDATE uyeler SET 
    ad=?, soyad=?, tc_no=?, tel_no=?, hisse=?, 
    aplaka=?, amarka=?, dplaka=?, dmarka=?, sad=?, ssoyad=?, stel=? 
    WHERE id=?`;
  const values = [ad, soyad, tc_no, tel_no, hisse, aplaka, amarka, dplaka, dmarka, sad, ssoyad, stel, id];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Üye güncelleme hatası:', err);
      return res.status(500).json({ message: "Veritabanı hatası", error: err.message });
    }
    console.log('Üye güncellendi, ID:', id);
    res.json({ message: "Üye güncellendi" });
  });
});

// DELETE /uyeler/:id - üye sil
app.delete("/uyeler/:id", (req, res) => {
  const { id } = req.params;
  console.log('DELETE /uyeler/' + id + ' - Üye siliniyor');
  
  db.query("DELETE FROM uyeler WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error('Üye silme hatası:', err);
      return res.status(500).json({ message: "Veritabanı hatası", error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Üye bulunamadı" });
    }
    console.log('Üye silindi, ID:', id);
    res.json({ message: "Üye silindi" });
  });
});

/* -------------------- İŞ AKTARİM ENDPOINTLERİ -------------------- */

// GET /is-emirleri - tüm iş emirlerini getir
app.get("/is-emirleri", (req, res) => {
  console.log('GET /is-emirleri endpoint\'ine istek geldi');
  
  db.query("SELECT * FROM isaktarim ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err);
      return res.status(500).json({ message: "Veritabanı hatası", error: err.message });
    }
    
    console.log('İş emirleri döndürüldü:', results.length, 'kayıt');
    res.json(results);
  });
});

// POST /is-emirleri - yeni iş emri ekle veya toplu ekle
app.post("/is-emirleri", (req, res) => {
  console.log('POST /is-emirleri - Yeni iş emri(leri) ekleniyor');
  
  const { action, data } = req.body;

  if (action === 'bulk_insert') {
    // Excel'den toplu ekleme
    console.log('Toplu ekleme:', data?.length, 'kayıt');
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Eklenecek veri bulunamadı" });
    }

    const sql = `INSERT INTO isaktarim 
      (musteri, nakliyeNo, nakliyeGuzergah, musteriAdi, aracTipi, tonaj, aciklama, tarih) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

    // Transaction başlat
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Bağlantı hatası:', err);
        return res.status(500).json({ message: "Veritabanı bağlantı hatası" });
      }

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          console.error('Transaction başlatma hatası:', err);
          return res.status(500).json({ message: "Transaction hatası" });
        }

        let completedInserts = 0;
        let hasError = false;

        data.forEach((item, index) => {
          const values = [
            item.musteri || '',
            item.nakliyeNo || '',
            item.nakliyeGuzergah || '',
            item.musteriAdi || '',
            item.aracTipi || '',
            item.tonaj || 0,
            item.aciklama || ''
          ];

          connection.query(sql, values, (err, results) => {
            if (err && !hasError) {
              hasError = true;
              console.error('Toplu ekleme hatası:', err);
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ 
                  message: "Toplu ekleme hatası", 
                  error: err.message,
                  failedAt: index + 1
                });
              });
            }

            completedInserts++;
            
            if (completedInserts === data.length && !hasError) {
              connection.commit((err) => {
                if (err) {
                  console.error('Commit hatası:', err);
                  return connection.rollback(() => {
                    connection.release();
                    res.status(500).json({ message: "Commit hatası" });
                  });
                }
                
                connection.release();
                console.log('Toplu ekleme başarılı:', data.length, 'kayıt');
                res.json({ 
                  message: "Toplu ekleme başarılı", 
                  insertedCount: data.length 
                });
              });
            }
          });
        });
      });
    });

  } else {
    // Tekli ekleme
    const { musteri, nakliyeNo, nakliyeGuzergah, musteriAdi, aracTipi, tonaj, aciklama } = data || req.body;

    const sql = `INSERT INTO isaktarim 
      (musteri, nakliyeNo, nakliyeGuzergah, musteriAdi, aracTipi, tonaj, aciklama, tarih) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
    const values = [musteri, nakliyeNo, nakliyeGuzergah, musteriAdi, aracTipi, tonaj || 0, aciklama];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('İş emri ekleme hatası:', err);
        return res.status(500).json({ message: "Veritabanı hatası", error: err.message });
      }
      console.log('Yeni iş emri eklendi, ID:', results.insertId);
      res.json({ isEmriId: results.insertId, message: "İş emri eklendi" });
    });
  }
});

// PUT /is-emirleri - iş emri güncelle
app.put("/is-emirleri", (req, res) => {
  console.log('PUT /is-emirleri - İş emri güncelleniyor');
  
  const { action, id, data } = req.body;

  if (action === 'update' && id && data) {
    const { musteri, nakliyeNo, nakliyeGuzergah, musteriAdi, aracTipi, tonaj, aciklama } = data;

    // ✅ DÜZELTME: Kolon isimlerini camelCase olarak değiştir
    const sql = `UPDATE isaktarim SET 
      musteri=?, nakliyeNo=?, nakliyeGuzergah=?, musteriAdi=?, 
      aracTipi=?, tonaj=?, aciklama=? 
      WHERE id=?`;
    const values = [musteri, nakliyeNo, nakliyeGuzergah, musteriAdi, aracTipi, tonaj || 0, aciklama, id];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('İş emri güncelleme hatası:', err);
        return res.status(500).json({ message: "Veritabanı hatası", error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "İş emri bulunamadı" });
      }
      console.log('İş emri güncellendi, ID:', id);
      res.json({ message: "İş emri güncellendi" });
    });
  } else {
    res.status(400).json({ message: "Geçersiz istek formatı" });
  }
});

// DELETE /is-emirleri - iş emri sil
app.delete("/is-emirleri", (req, res) => {
  console.log('DELETE /is-emirleri - İş emri siliniyor');
  
  const { action, id } = req.body;

  if (action === 'delete' && id) {
    db.query("DELETE FROM isaktarim WHERE id = ?", [id], (err, results) => {
      if (err) {
        console.error('İş emri silme hatası:', err);
        return res.status(500).json({ message: "Veritabanı hatası", error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "İş emri bulunamadı" });
      }
      console.log('İş emri silindi, ID:', id);
      res.json({ message: "İş emri silindi" });
    });
  } else {
    res.status(400).json({ message: "Geçersiz istek formatı" });
  }
});



/* -------------------- RAPORLAR ENDPOINTLERİ -------------------- */

// GET /raporlar - tüm raporları getir
app.get("/raporlar", (req, res) => {
  db.query("SELECT * FROM raporlar", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Veritabanı hatası" });
    }
    res.json(results);
  });
});

// GET /raporlar/tarih?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
app.get("/raporlar/tarih", (req, res) => {
  const { startDate, endDate } = req.query;
  const sql = "SELECT * FROM raporlar WHERE tarih BETWEEN ? AND ?";
  db.query(sql, [startDate, endDate], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Veritabanı hatası" });
    }
    res.json(results);
  });
});

// GET /raporlar/arama?q=aranacak_kelime
app.get("/raporlar/arama", (req, res) => {
  const { q } = req.query;
  const sql = `SELECT * FROM raporlar 
               WHERE plaka LIKE ? 
               OR referans_no LIKE ? 
               OR il LIKE ? 
               OR ilce LIKE ?`;
  const value = `%${q}%`;
  db.query(sql, [value, value, value, value], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Veritabanı hatası" });
    }
    res.json(results);
  });
});