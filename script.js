// Sayfanın tamamen yüklenmesini bekle (Hataları önlemek için)
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBİL MENÜ (HAMBURGER MENU) --- [cite: 25]
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');

    if (burger) {
        burger.addEventListener('click', () => {
            // CSS'te tanımladığımız .nav-active sınıfını aç/kapat
            nav.classList.toggle('nav-active');
            
            // Hamburger ikonuna animasyon eklemek için (Opsiyonel)
            burger.classList.toggle('toggle');
        });
    }

    // --- 2. TEMA DEĞİŞTİRİCİ (DARK/LIGHT MODE) --- [cite: 17, 18]
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Kullanıcının tercihini hatırla (Local Storage)
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeBtn.textContent = '☀️ Tema';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            // Buton metnini ve hafızayı güncelle
            if (body.classList.contains('dark-mode')) {
                themeBtn.textContent = '☀️ Tema';
                localStorage.setItem('theme', 'dark');
            } else {
                themeBtn.textContent = '🌙 Tema';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- 3. ACCORDION (İÇERİK GİZLEME/GÖSTERME) --- [cite: 19, 20]
    // Bu özellik 'Hobiler' sayfasında kullanılacak
    const accordions = document.getElementsByClassName('accordion');

    for (let i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener('click', function() {
            // Tıklanan başlığa 'active' sınıfı ekle (stil için)
            this.classList.toggle('active');

            // Başlığın hemen altındaki içerik paneli
            const panel = this.nextElementSibling;

            // Display yerine maxHeight kontrolü yapıyoruz
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null; // Kapat
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px"; // Aç (İçerik kadar yükseklik ver)
        }
    });
    }

    // --- 4. FORM DOĞRULAMA (VALIDATION) --- [cite: 15, 16]
    // Bu özellik 'İletişim' sayfasında kullanılacak
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            // İsim alanı kontrolü
            const nameInput = document.getElementById('name');
            const nameError = document.getElementById('name-error');
            
            if (nameInput.value.trim() === '') {
                nameError.textContent = 'İsim alanı boş bırakılamaz!';
                nameError.style.color = 'red'; // DOM manipülasyonu ile stil
                isValid = false;
            } else {
                nameError.textContent = '';
            }

            // Email alanı kontrolü
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basit regex

            if (!emailPattern.test(emailInput.value)) {
                emailError.textContent = 'Geçerli bir e-posta adresi giriniz!';
                emailError.style.color = 'red';
                isValid = false;
            } else {
                emailError.textContent = '';
            }

            // Eğer form geçersizse göndermeyi engelle
            if (!isValid) {
                e.preventDefault();
            } else {
                // Form geçerliyse kullanıcıya bilgi ver (Demo amaçlı)
                alert('Mesajınız başarıyla gönderildi (Simülasyon)!');
            }
        });
    }
});