const SUPABASE_URL = "https://ffcyuihdurumltnquixa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmY3l1aWhkdXJ1bWx0bnF1aXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzU3NTEsImV4cCI6MjA3NjExMTc1MX0.XTSQKhdURhgMDhY-maUqj-HKBJKngZ9bveHvR29-Ju0";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("loginBtn").addEventListener("click", async () => {
  const login = document.getElementById("loginField").value.trim();
  const senha = document.getElementById("passwordField").value.trim();
  const msg = document.getElementById("loginMessage");

  if (!login) return (msg.textContent = "Informe o telefone ou e-mail");

  const { data: user } = await client
    .from("usuarios")
    .select("*")
    .or(`telefone.eq.${login},email.eq.${login}`)
    .single();

  if (!user) return (msg.textContent = "Usuário não encontrado.");

  if (!user.senha) {
    document.getElementById("createPasswordSection").classList.remove("hidden");
    document.getElementById("setPasswordBtn").onclick = async () => {
      const newPass = document.getElementById("newPassword").value;
      const confirm = document.getElementById("confirmPassword").value;
      if (newPass !== confirm) return (msg.textContent = "Senhas não coincidem.");
      await client.from("usuarios").update({ senha: newPass }).eq("id", user.id);
      localStorage.setItem("userId", user.id);
      window.location.href = "dashboard.html";
    };
  } else {
    if (user.senha !== senha) return (msg.textContent = "Senha incorreta.");
    localStorage.setItem("userId", user.id);
    window.location.href = "dashboard.html";
  }
});
