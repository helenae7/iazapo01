function renderChart(receitas, despesas) {
  const ctx = document.getElementById("transacoesChart");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Receitas", "Despesas"],
      datasets: [
        {
          data: [receitas, despesas],
          backgroundColor: ["#2ecc71", "#e74c3c"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { labels: { color: "#fff" } } },
    },
  });
}
