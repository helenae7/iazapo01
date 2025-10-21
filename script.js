// ===== CONFIGURAÇÃO DO SUPABASE =====
const SUPABASE_URL = "https://ffcyuihdurumltnquixa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmY3l1aWhkdXJ1bWx0bnF1aXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzU3NTEsImV4cCI6MjA3NjExMTc1MX0.XTSQKhdURhgMDhY-maUqj-HKBJKngZ9bveHvR29-Ju0";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== ELEMENTOS DA PÁGINA =====
const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

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

  // Se for número, cria e-mail interno
  const email = emailOrPhone.includes("@")
    ? emailOrPhone
    : `${emailOrPhone}@iazapuser.com`;

  const telefone = emailOrPhone.replace(/\D/g, ""); // só números

  try {
    // === LOGIN ===
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // === CONTA NÃO EXISTE → CRIA ===
    if (error && error.message.includes("Invalid login credentials")) {
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        msg.style.color = "#ff4a4a";
        msg.textContent = "Erro ao criar conta: " + signUpError.message;
        console.error(signUpError);
        return;
      }

      // ===== INSERE NA TABELA USUÁRIOS =====
      const { error: insertError } = await supabase
        .from("usuarios")
        .insert([
          {
            nome: "Novo usuário",
            email: email,
            telefone: telefone || null,
            senha: password,
            mensagens: 0,
            tem_plano: false,
          },
        ]);

      if (insertError) {
        console.error("Erro ao inserir no banco:", insertError);
        msg.style.color = "#ff4a4a";
        msg.textContent =
          "Conta criada, mas falhou ao salvar no banco de dados.";
        return;
      }

      msg.style.color = "#4aff6a";
      msg.textContent = "✅ Conta criada com sucesso!";
      return;
    }

    // === LOGIN OK ===
    if (data.session) {
      msg.style.color = "#4aff6a";
      msg.textContent = "✅ Login realizado!";
      setTimeout(() => (window.location.href = "dashboard.html"), 1000);
    } else {
      msg.style.color = "#ff4a4a";
      msg.textContent = "Erro: falha ao logar.";
    }
  } catch (err) {
    msg.style.color = "#ff4a4a";
    msg.textContent = "❌ Erro ao conectar com Supabase.";
    console.error(err);
  }
});
