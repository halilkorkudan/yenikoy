const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MySQL bağlantısı
const db = mysql.createPool({
  host: "localhost",
  user: "root",      // kendi kullanıcı adın
  password: "",      // kendi şifren
  database: "kop",   // senin veritabanın
});

// GET /uyeler - tüm üyeleri getir
app.get("/uyeler", (req, res) => {
  db.query("SELECT * FROM uyeler", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Veritabanı hatası" });
    }
    res.json(results);
  });
});

// POST /uyeler - yeni üye ekle
app.post("/uyeler", (req, res) => {
  const { ad, soyad, tc_no, tel_no, hisse } = req.body;

  if (!ad || !soyad || !tc_no || !tel_no || !hisse) {
    return res.status(400).json({ message: "Tüm alanlar zorunludur" });
  }

  const sql = "INSERT INTO uyeler (ad, soyad, tc_no, tel_no, hisse) VALUES (?, ?, ?, ?, ?)";
  const values = [ad, soyad, tc_no, tel_no, hisse];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Veritabanı hatası" });
    }
    // Yeni kaydın id'sini dön
    res.json({ uyeId: results.insertId });
  });
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});
