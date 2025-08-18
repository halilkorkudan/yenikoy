import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Tam ekran projeksiyon sıra takip bileşeni
// İstekler:
// 1) Sıralar sütun bazlı ve her sütunda yukarıdan aşağıya artacak şekilde (ör: 1,6,11 ... gibi)
// 2) Geçişte yalnızca en sağdan yeni bir sütun girsin; en soldaki sütun soldan çıksın
// 3) 8x25 grid, responsive saat ve sayaçlar

const ProjeksiyonSira = () => {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    });

    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentColumn, setCurrentColumn] = useState(0); // görünür pencerenin SOL başındaki sütun indexi

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Test verisi - 350 sıra
    const [siralar, setSiralar] = useState(() => {
        const testData = [];
        for (let i = 1; i <= 350; i++) {
            const cities = ["34", "06", "35", "41", "16", "07", "42", "58", "01", "68"];
            const letters = ["AB", "CD", "EF", "GH", "JK", "LM", "NP", "RS", "TU", "VY"];
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            const randomNumber = Math.floor(Math.random() * 9000) + 1000;
            testData.push({
                id: i,
                sira: i,
                plaka: `${randomCity} ${randomLetter} ${randomNumber}`,
                durum: Math.random() > 0.85 ? "acik" : "kapali",
            });
        }
        return testData;
    });

    // Responsive flags
    const isDesktop = screenSize.width > 1200;
    const isTablet = screenSize.width > 768 && screenSize.width <= 1200;
    const isMobile = screenSize.width <= 768;

    // Grid sabitleri - responsive satır sayısı hesaplaması
    const columnCount = 8; // 8 sütun görünür
    const gap = isMobile ? 4 : 6;

    // Dinamik satır sayısı hesapla
    const headerHeight = isMobile ? 90 : 100;
    const bottomBarHeight = 60;
    const padding = 20;
    const availableHeight = screenSize.height - headerHeight - bottomBarHeight - padding;

    // Minimum kutu yüksekliği ve maksimum satır sayısı
    const minBoxHeight = 45;
    const maxPossibleRows = Math.floor((availableHeight + gap) / (minBoxHeight + gap));

    // Satır sayısını ekran boyutuna göre dinamik olarak ayarla
    const rowCount = Math.max(15, Math.min(30, maxPossibleRows)); // Minimum 5, maksimum 25 satır

    // Görünür kutu boyu hesapla (sadece font ölçeklemek için kullanıyoruz)
    const boxHeight = Math.max(Math.floor((availableHeight - gap * (rowCount - 1)) / rowCount), minBoxHeight);

    // Saat güncelleme
    useEffect(() => {
        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timeInterval);
    }, []);

    // Sütun pencere kaydırma (yalnızca yeni sütun sağdan gelsin)
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentColumn((prev) => (prev + 1) % Math.max(1, Math.ceil(siralar.length / rowCount)));
        }, 6000); // 6 sn
        return () => clearInterval(slideInterval);
    }, [siralar.length, rowCount]);

    // 30 sn'de bir veri yenileme placeholder
    useEffect(() => {
        const dataInterval = setInterval(() => {
            // Örnek: API çağrısı ile yeni verileri çekip setSiralar(...) yapabilirsiniz
            // console.log("Veriler yenilendi:", new Date().toLocaleTimeString());
        }, 30000);
        return () => clearInterval(dataInterval);
    }, []);

    const formatTime = (date) =>
        date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // --- Veri düzeni ---
    // İstenen düzen: 1. sütun 1,2,3,...; 2. sütun 26,27,28,... (genel form: 1,26,51 ... değil!)
    // Kullanıcı örneği: 1 6 11 ... gibi; bu örnek satır sayısı 5 iken her sütundaki alt alta artış ve
    // sütunlar soldan sağa giderken +rowCount adım farkını ifade eder. Genel formül aşağıdaki gibidir.

    const organizedDataByColumns = useMemo(() => {
        // Satır/sütun mantığı: Her sütun rowCount kayıt içerir (1-rowCount, rowCount+1-2*rowCount, ...)
        // ve bu kayıtlar grid üzerinde ALTTAN YUKARI doğru artacak şekilde dizilir.
        // Yani 1 en altta, rowCount en üstte olacak; son sütun dolu değilse sayılar yine en alttan başlayıp yukarı doğru dolar.
        const sorted = [...siralar].sort((a, b) => a.sira - b.sira);
        const totalCols = Math.ceil(sorted.length / rowCount);
        const cols = [];
        for (let col = 0; col < totalCols; col++) {
            const start = col * rowCount; // 0-based
            const end = Math.min(start + rowCount, sorted.length); // exclusive
            const itemsAsc = sorted.slice(start, end); // [start..end) — 1..rowCount, rowCount+1..2*rowCount, ...
            const emptyCountTop = rowCount - itemsAsc.length; // son sütun eksikse üstte boşluk bırak
            const paddedTop = Array.from({ length: emptyCountTop }, () => null);
            // Top-to-bottom dizilim: üstte boşluklar, altta veriler => ekranda artış alttan yukarı
            cols.push([...paddedTop, ...itemsAsc]);
        }
        return cols;
    }, [siralar, rowCount]);

    const totalColumns = useMemo(() => organizedDataByColumns.length, [organizedDataByColumns]);

    const wrapIndex = (i) => {
        if (totalColumns === 0) return 0;
        return ((i % totalColumns) + totalColumns) % totalColumns;
    };

    // Görünür 8 sütunu hazırla (soldan sağa)
    const visibleColumns = useMemo(() => {
        const arr = [];
        for (let i = 0; i < columnCount; i++) {
            const colIndex = wrapIndex(currentColumn + i);
            const items = organizedDataByColumns[colIndex] || [];
            arr.push({ colIndex, items });
        }
        return arr;
    }, [organizedDataByColumns, currentColumn, columnCount]);

    // Durum sayıları (tüm veri için)
    const acikSayisi = useMemo(() => siralar.filter((s) => s.durum === "acik").length, [siralar]);
    const kapaliSayisi = useMemo(() => siralar.filter((s) => s.durum === "kapali").length, [siralar]);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "#1a1a1a",
                color: "white",
                overflow: "hidden",
                zIndex: 9999,
                fontFamily: "Roboto, sans-serif",
            }}
        >
            {/* Header */}
            <div
                style={{
                    backgroundColor: "#2c3e50",
                    padding: isMobile ? "15px 20px" : "20px 30px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    flexWrap: "wrap",
                    gap: "15px",
                    position: "relative",
                    zIndex: 10001,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "30px", flexWrap: "wrap" }}>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: isMobile ? "20px" : isDesktop ? "28px" : "24px",
                            fontWeight: 600,
                            color: "#ecf0f1",
                            fontFamily: "Roboto, sans-serif",
                        }}
                    >
                        AKTİF SIRA TAKİP SİSTEMİ
                    </h1>

                    <div style={{ display: "flex", gap: isMobile ? "15px" : "25px", fontSize: isMobile ? "14px" : "16px", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: 12, height: 12, backgroundColor: "#ffffff", borderRadius: "50%", boxShadow: "0 0 8px rgba(255,255,255,0.5)" }} />
                            <span style={{ fontWeight: 600 }}>Açık: {acikSayisi}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: 12, height: 12, backgroundColor: "#B71C1C", borderRadius: "50%", boxShadow: "0 0 8px rgba(183,28,28,0.5)" }} />
                            <span style={{ fontWeight: 600 }}>Kapalı: {kapaliSayisi}</span>
                        </div>

                        <div style={{ fontWeight: 600 }}>Toplam: {siralar.length}</div>

                        <div
                            style={{
                                backgroundColor: "#34495e",
                                padding: "4px 12px",
                                borderRadius: 15,
                                fontSize: 14,
                                border: "1px solid #4a5568",
                            }}
                        >
                            {wrapIndex(currentColumn) + 1} / {Math.max(1, totalColumns)}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        fontSize: isMobile ? "18px" : isDesktop ? "24px" : "20px",
                        fontFamily: "Roboto, monospace",
                        fontWeight: 600,
                        color: "#3498db",
                    }}
                >
                    {formatTime(currentTime)}
                </div>
            </div>

            {/* Ana Grid */}
            <div
                style={{
                    padding: isMobile ? 8 : 10,
                    height: `calc(100vh - ${isMobile ? "90px" : "100px"})`,
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 10000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                        gridTemplateRows: `repeat(${rowCount}, 1fr)`,
                        gap: `${gap}px`,
                        width: "100%",
                        height: "100%",
                        maxWidth: "100%",
                        margin: 0,
                        position: "relative",
                    }}
                >
                    {/* Sütunlar: her biri ayrı motion.div, böylece yalnızca sağdan yeni sütun girer, soldaki çıkar */}
                    <AnimatePresence initial={false}>
                        {visibleColumns.map((col, i) => (
                            <motion.div key={col.colIndex} layout
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                style={{
                                    gridColumn: i + 1,
                                    gridRow: `1 / span ${rowCount}`,
                                    display: "grid",
                                    gridTemplateRows: `repeat(${rowCount}, 1fr)`,
                                    gap: `${gap}px`,
                                }}
                            >
                                {Array.from({ length: rowCount }).map((_, rowIdx) => {
                                    const sira = col.items[rowIdx];
                                    const isEmpty = !sira;
                                    const bg = isEmpty ? "transparent" : sira.durum === "acik" ? "#ffffff" : "#B71C1C";
                                    const borderColor = isEmpty ? "transparent" : sira.durum === "acik" ? "#ffffff" : "#B71C1C";
                                    const textColor = isEmpty ? "transparent" : sira.durum === "acik" ? "#000000" : "#ffffff";

                                    return (
                                        <div
                                            key={isEmpty ? `empty-${col.colIndex}-${rowIdx}` : `${sira.id}-${col.colIndex}-${rowIdx}`}
                                            style={{
                                                backgroundColor: bg,
                                                border: `3px solid ${borderColor}`,
                                                borderRadius: isEmpty ? 0 : 12,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: isEmpty ? 0 : "0 8px",
                                                height: "100%",
                                                boxShadow: isEmpty
                                                    ? "none"
                                                    : sira.durum === "acik"
                                                        ? "0 0 15px rgba(255,255,255,0.4)"
                                                        : "0 0 15px rgba(183,28,28,0.4)",
                                                position: "relative",
                                                opacity: isEmpty ? 0 : 1,
                                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                                cursor: isEmpty ? "default" : "pointer",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isEmpty) {
                                                    e.currentTarget.style.transform = "scale(1.02)";
                                                    e.currentTarget.style.boxShadow =
                                                        sira.durum === "acik"
                                                            ? "0 0 25px rgba(255,255,255,0.8)"
                                                            : "0 0 25px rgba(183,28,28,0.8)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isEmpty) {
                                                    e.currentTarget.style.transform = "scale(1)";
                                                    e.currentTarget.style.boxShadow =
                                                        sira.durum === "acik"
                                                            ? "0 0 15px rgba(255,255,255,0.4)"
                                                            : "0 0 15px rgba(183,28,28,0.4)";
                                                }
                                            }}
                                        >
                                            {!isEmpty && (
                                                <>
                                                    {/* Sol: Sıra Numarası */}
                                                    <div
                                                        style={{
                                                            fontSize: Math.max(boxHeight * 0.3, 20),
                                                            fontWeight: 600,
                                                            color: textColor,
                                                            textShadow: sira.durum === "acik" ? "none" : "0 2px 4px rgba(0,0,0,0.5)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            minWidth: Math.max(boxHeight * 0.30, 20),
                                                            fontFamily: "Roboto, sans-serif",
                                                        }}
                                                    >
                                                        {sira.sira}
                                                    </div>

                                                    {/* Sağ: Plaka */}
                                                    <div
                                                        style={{
                                                            fontSize: Math.max(boxHeight * 0.30, 20),
                                                            fontWeight: 600,
                                                            color: textColor,
                                                            textAlign: "center",
                                                            textShadow: sira.durum === "acik" ? "none" : "0 2px 4px rgba(0,0,0,0.5)",
                                                            letterSpacing: 0.5,
                                                            flex: 1,
                                                            marginLeft: 4,
                                                            fontFamily: "Roboto, sans-serif",
                                                        }}
                                                    >
                                                        {sira.plaka}
                                                    </div>

                                                    {/* Durum ikonu */}
                                                    <div style={{ position: "absolute", top: 3, right: 5, fontSize: 8, opacity: 0.9 }}>
                                                        {sira.durum === "acik" ? "🟢" : "🔴"}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Alt İlerleme Çubuğu */}
            <div
                style={{
                    position: "fixed",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#34495e",
                    padding: "8px 20px",
                    borderRadius: 25,
                    fontSize: 14,
                    color: "#ecf0f1",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    zIndex: 10001,
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 600,
                }}
            >
                📊 Sütun: {wrapIndex(currentColumn) + 1}-{wrapIndex(currentColumn + columnCount)} / {Math.max(1, totalColumns)} | Satır: {rowCount}
            </div>
        </div>
    );
};

export default ProjeksiyonSira;