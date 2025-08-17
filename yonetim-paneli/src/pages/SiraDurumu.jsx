import React from "react";

const FirmaBilgileri = () => {
    const firmaData = [
        { label: "Şirket Adı", value: "S.S. 44 Nolu Yeniköy Koop" },
        { label: "Hisse Sayısı", value: "750" },
        { label: "Tel 1", value: "02623414142" },
        { label: "Tel 2", value: "05515507058" },
        { label: "Email", value: "info@yenikoykoop.com" },
        { label: "Adres", value: "Sepetlipınar, Sanayi Cd. No:26, 41275 Başiskele/Kocaeli" },
        { label: "Vergi Dairesi", value: "Tepecik" },
        { label: "Şehir", value: "Başiskele" },
        { label: "Ülke", value: "Türkiye" },
        { label: "Vergi No", value: "5580004431" },
        { label: "Kep Adres", value: "1231231" },
        { label: "Web Site", value: "www.yenikoykoop.com" }
    ];

    const half = Math.ceil(firmaData.length / 2);
    const leftColumn = firmaData.slice(0, half);
    const rightColumn = firmaData.slice(half);

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Firma Bilgileri</h1>
            <div style={styles.grid}>
                <div style={styles.column}>
                    {leftColumn.map((item, index) => (
                        <div key={index} style={styles.row}>
                            <span style={styles.label}>{item.label}:</span>
                            <span style={styles.value}>{item.value}</span>
                        </div>
                    ))}
                </div>
                <div style={styles.column}>
                    {rightColumn.map((item, index) => (
                        <div key={index} style={styles.row}>
                            <span style={styles.label}>{item.label}:</span>
                            <span style={styles.value}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1000px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    },
    header: {
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "28px",
        color: "#333",
        borderBottom: "2px solid #eee",
        paddingBottom: "10px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
    },
    column: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
        paddingBottom: "5px"
    },
    label: {
        fontWeight: "bold",
        color: "#555"
    },
    value: {
        color: "#333"
    }
};

export default FirmaBilgileri;