// ===== CONFIGURAÇÃO DO SUPABASE =====
const SUPABASE_URL = "https://ffcyuihdurumltnquixa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmY3l1aWhkdXJ1bWx0bnF1aXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzU3NTEsImV4cCI6MjA3NjExMTc1MX0.XTSQKhdURhgMDhY-maUqj-HKBJKngZ9bveHvR29-Ju0";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== ELEMENTOS =====
const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

// ===== FUNÇÃO DE LOGIN/CRIAÇÃO =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  msg.style.color = "#fff";
  msg.textContent = "Verificando...";

  const emailOrPhone = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!emailOrPhone || !password) {
    msg.style.color = "#ff4a4a";
    msg.textContent = "Preencha todos os campos.";
    return;
  }

  // Se o usuário digitou um número, gerar um e-mail fake
  let email = emailOrPhone;
  if (!email.includes("@")) {
    email = `${emailOrPhone}@iazapuser.com`; // gera e-mail interno
  }

  try {
    // === Tenta login ===
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // === Se não existir, cria conta ===
    if (error && error.message.includes("Invalid login credentials")) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        msg.style.color = "#ff4a4a";
        msg.textContent = "Erro ao criar conta: " + signUpError.message;
        console.error(signUpError);
        return;
      }

      msg.style.color = "#4aff6a";
      msg.textContent = "✅ Conta criada com sucesso!";
      return;
    }

    // === Login OK ===
    if (data.session) {
      msg.style.color = "#4aff6a";
      msg.textContent = "✅ Login realizado!";
      setTimeout(() => (window.location.href = "dashboard.html"), 800);
    } else {
      msg.style.color = "#ff4a4a";
      msg.textContent = "Erro: " + (error?.message || "Falha ao logar.");
    }
  } catch (err) {
    msg.style.color = "#ff4a4a";
    msg.textContent = "❌ Erro ao conectar com Supabase.";
    console.error(err);
  }
});
