const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});
document.querySelectorAll("#navMenu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});

// --- Formulario de contacto: envía la solicitud al backend (Supabase) ---
//
// Antes esto era un <form action="mailto:..."> que dependía de que el
// visitante tuviera un cliente de correo configurado, y aunque lo tuviera
// solo abría un borrador que él mismo tenía que enviar. Ahora se manda
// directo a una función de Supabase que guarda la solicitud como una cita
// pendiente de confirmar y avisa por notificación push a la secretaria y
// al administrador en el CRM.
//
// La llave de abajo es la llave pública (anon) de Supabase — está
// diseñada para ser pública en sitios web, no es un secreto. La
// seguridad real la da Supabase (RLS) del lado del servidor.
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const submitBtn = document.getElementById("contactSubmitBtn");
  const msgEl = document.getElementById("contactFormMsg");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = contactForm.nombre.value.trim();
    const telefono = contactForm.telefono.value.trim();
    const tipo = contactForm.servicio.value;
    const mensaje = contactForm.mensaje.value.trim();

    if (!nombre || !telefono) {
      msgEl.textContent = "Por favor completa tu nombre y teléfono.";
      msgEl.style.color = "#c0392b";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";
    msgEl.textContent = "";

    const SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwamRtenVkaXBoc3d0bHVzbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzI5NTAsImV4cCI6MjA5NDEwODk1MH0.dzDh0aUOE0IGvYYHg8Ocz_8n1HR7J4q0_ILjKtV2iaM";

    try {
      const res = await fetch(
        "https://ppjdmzudiphswtluslaj.supabase.co/functions/v1/notificar-solicitud",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "apikey": SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ nombre, telefono, tipo, mensaje }),
        }
      );

      if (!res.ok) throw new Error("Error del servidor");

      contactForm.reset();
      msgEl.textContent = "¡Gracias! Recibimos tu solicitud y te contactaremos pronto.";
      msgEl.style.color = "#1e8449";
    } catch (err) {
      msgEl.textContent =
        "No pudimos enviar tu solicitud. Por favor llámanos al 787-360-6894.";
      msgEl.style.color = "#c0392b";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Solicitar servicio →";
    }
  });
}
