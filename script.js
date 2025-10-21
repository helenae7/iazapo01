// ✅ CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co"; // substitua pelo seu
const SUPABASE_KEY = "CHAVE_PUBLICA_ANON_AQUI"; // substitua pela chave anon (não a service key)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ FUNÇÃO DE LOGIN
const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  msg.textContent = "Verificando...";

  try {
    // 🔐 Login no Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      msg.textContent = "❌ Erro: " + error.message;
      return;
    }

    msg.textContent = "✅ Login realizado com sucesso!";
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Ocorreu um erro inesperado.";
  }
});
