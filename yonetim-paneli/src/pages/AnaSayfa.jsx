import React, { useEffect } from "react";
import Chart from "chart.js/auto";

function AnaSayfa() {
  useEffect(() => {
    // Line Chart
    const ctx = document.getElementById("lineChart");
    if (ctx) {
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
          datasets: [
            {
              label: "Tır",
              data: [65, 59, 80, 81, 56, 55],
              borderColor: "orange",
              backgroundColor: "rgba(255,165,0,0.2)",
              fill: true,
            },
          ],
        },
      });
    }

    // Doughnut Chart
    const ctx2 = document.getElementById("doughnutChart");
    if (ctx2) {
      new Chart(ctx2, {
        type: "doughnut",
        data: {
          labels: [
            "Dağıtılmış Planlı İşler",
            "Dağıtılmamış İşler",
            "Dağıtılmış Üye İşleri",
          ],
          datasets: [
            {
              data: [120, 50, 118],
              backgroundColor: ["#e74c3c", "#3498db", "#2ecc71"],
            },
          ],
        },
      });
    }
  }, []);

  return (
    <div className="container-fluid">
      {/* Kartlar */}
      <div className="row">
        {[
          { title: "Üye Sayısı", value: 282 },
          { title: "Araç Sayısı", value: 739 },
          { title: "Tır Sayısı", value: 378 },
          { title: "Dorse Sayısı", value: 350 },
          { title: "Kamyon Sayısı", value: 11 },
          { title: "Muayene Tarihi Geçmiş", value: 3 },
        ].map((item, i) => (
          <div key={i} className="col-md-2">
            <div className="card p-3 text-center mb-3">
              <h4>{item.value}</h4>
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grafikler */}
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 mb-3">
            <h5>Haftalık İş Dağılımı</h5>
            <canvas id="lineChart"></canvas>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>İşler</h5>
            <canvas id="doughnutChart"></canvas>
          </div>
        </div>
      </div>

      {/* Listeler */}
      <div className="row">
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h5>En Çok İş Alan Üyeler</h5>
            <ul>
              <li>Soğukçular Taş. Nak. İnş...</li>
              <li>Gümüşoğlu Taşımacılık</li>
              <li>Uzunoğlu Yapı Nak. İnş...</li>
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h5>En Çok Gelen İşler</h5>
            <ul>
              <li>Manisa / Yunusemre</li>
              <li>Sakarya / Pamukova</li>
              <li>İzmir / Karşıyaka</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnaSayfa;
