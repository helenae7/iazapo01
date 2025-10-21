const SUPABASE_URL = "https://ffcyuihdurumltnquixa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmY3l1aWhkdXJ1bWx0bnF1aXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzU3NTEsImV4cCI6MjA3NjExMTc1MX0.XTSQKhdURhgMDhY-maUqj-HKBJKngZ9bveHvR29-Ju0";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.addEventListener("load", async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return (window.location.href = "index.html");

  const { data: transacoes } = await client
    .from("transacoes")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  let receitas = 0, despesas = 0;
  const tbody = document.querySelector("#transacoesTable tbody");
  tbody.innerHTML = "";

  transacoes.forEach(t => {
    const valor = parseFloat(t.valor || 0);
    if (t.tipo === "Receita") receitas += valor;
    else despesas += valor;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.descricao}</td>
      <td>${t.tipo}</td>
      <td>R$ ${valor.toFixed(2)}</td>
      <td>${new Date(t.data).toLocaleDateString()}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById("receitas").textContent = `R$ ${receitas.toFixed(2)}`;
  document.getElementById("despesas").textContent = `R$ ${despesas.toFixed(2)}`;
  document.getElementById("saldo").textContent = `R$ ${(receitas - despesas).toFixed(2)}`;

  renderChart(receitas, despesas);
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});
