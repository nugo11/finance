import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({
  Entert,
  Bill,
  DiningOuttotalAmount,
  pqtotalAmount,
  sum
}) => {
  const totalLimit = Entert + Bill + DiningOuttotalAmount + pqtotalAmount;
  const spent = sum;

  const data = {
    labels: ["Entertainment", "Bills", "Dining Out", "Personal Care"],
    datasets: [
      {
        data: [Entert, Bill, DiningOuttotalAmount, pqtotalAmount],
        backgroundColor: ["#277C78", "#82C9D7", "#F2CDAC", "#626070"],
        cutout: "75%",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    layout: {
      padding: 20,
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <div style={{ position: "relative", width: "250px", height: "250px" }}>
        <Doughnut data={data} options={options} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
            ${spent}
          </h2>
          <p style={{ margin: 0, color: "#666" }}>of ${totalLimit} limit</p>
        </div>
      </div>

      <div className="chartLabels">
        {data.labels.map((label, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: data.datasets[0].backgroundColor[index],
                marginRight: "10px",
              }}
            ></div>
            <div>
              <p style={{ margin: 0, fontSize: "11px" }}>{label}</p>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                ${data.datasets[0].data[index].toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;
