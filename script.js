const SUPABASE_URL = "https://ffcyuihdurumltnquixa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmY3l1aWhkdXJ1bWx0bnF1aXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzU3NTEsImV4cCI6MjA3NjExMTc1MX0.XTSQKhdURhgMDhY-maUqj-HKBJKngZ9bveHvR29-Ju0"; // copie exata do painel
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Conectando...";
  msg.style.color = "#fff";

  const input = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!input || !password) {
    msg.style.color = "#ff4a4a";
    msg.textContent = "Preencha todos os campos.";
    return;
  }

  // gera e-mail se for telefone
  const email = input.includes("@") ? input : `${input}@iazapuser.com`;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error && error.message.includes("Invalid login credentials")) {
      // tenta criar conta
      const { data: signUp, error: signUpError } = await supabase.auth.signUp({
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

    if (data.session) {
      msg.style.color = "#4aff6a";
      msg.textContent = "✅ Login realizado!";
      setTimeout(() => (window.location.href = "dashboard.html"), 1000);
    } else {
      msg.style.color = "#ff4a4a";
      msg.textContent = "Erro: falha ao logar.";
    }
  } catch (err) {
    console.error(err);
    msg.style.color = "#ff4a4a";
    msg.textContent = "❌ Falha de conexão com o Supabase (verifique URL e key).";
  }
});
