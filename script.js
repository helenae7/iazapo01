// ===== CONFIGURAÇÃO DO SUPABASE =====
// 🔹 Substitua pelos valores exatos do seu painel (em Settings → API)
const SUPABASE_URL = "https://ffcyuihdurumltnquixa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmY3l1aWhkdXJ1bWx0bnF1aXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzU3NTEsImV4cCI6MjA3NjExMTc1MX0.XTSQKhdURhgMDhY-maUqj-HKBJKngZ9bveHvR29-Ju0"; // chave completa, sem espaços
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== ELEMENTOS DA PÁGINA =====
const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.style.color = "#fff";
  msg.textContent = "Verificando...";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    msg.style.color = "#ff4a4a";
    msg.textContent = "Preencha todos os campos.";
    return;
  }

  try {
    // === Tenta logar ===
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // === Se usuário não existir, cria conta ===
    if (error && error.message.includes("Invalid login credentials")) {
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        msg.style.color = "#ff4a4a";
        msg.textContent = "Erro ao criar conta: " + signUpError.message;
        return;
      }

      msg.style.color = "#4aff6a";
      msg.textContent = "✅ Conta criada! Verifique seu e-mail.";
      return;
    }

    // === Login bem-sucedido ===
    if (data.session) {
      msg.style.color = "#4aff6a";
      msg.textContent = "✅ Login realizado!";
      setTimeout(() => (window.location.href = "dashboard.html"), 1000);
    } else {
      msg.style.color = "#ff4a4a";
      msg.textContent = "Erro: " + (error?.message || "Falha ao logar.");
    }
  } catch (err) {
    msg.style.color = "#ff4a4a";
    msg.textContent = "❌ Erro ao conectar: verifique URL e chave Supabase.";
    console.error(err);
  }
});
