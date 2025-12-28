// Sayfanın tamamen yüklenmesini bekle (Hataları olmasın diye)
document.addEventListener('DOMContentLoaded', () => {

    // HAMBURGER MENU
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const header = document.querySelector('header'); 

    if (burger) {
        burger.addEventListener('click', () => {
            // CSS'te tanımladığım .nav-active sınıfını aç/kapat
            nav.classList.toggle('nav-active');

            // Hamburger ikonunu çarpı animasyonu
            burger.classList.toggle('toggle');

            // Menü açılınca Header'ın stilini değiştirmek için sınıf ekledim
            header.classList.toggle('menu-active');

        });
    }

    // TEMA DEĞİŞTİRİCİ 
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Kullanıcının tercihini hatırla (Local Storage, sunumdakilerin kullandığı zımbırtı)
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

    // ACCORDION (İÇERİK GİZLEME/GÖSTERME) 
    // Bu özellik 'Hobiler' sayfasında kullanılacak
    const accordions = document.getElementsByClassName('accordion');

    for (let i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener('click', function () {
            // Tıklanan başlığa active sınıfı ekle (stil için)
            this.classList.toggle('active');

            // Başlığın hemen altındaki içerik paneli
            const panel = this.nextElementSibling;

            // Display yerine maxHeight kontrolü yapıyor, animasyon için
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null; // Kapat
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px"; // paneli açar, içerik kadar yükseklik verir
            }
        });
    }

    // FORM DOĞRULAMA 
    // İletişim sayfası için
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
                // Form geçerliyse kullanıcıya bilgi ver 
                alert('Mesajınız başarıyla gönderildi!');
            }
        });
    }
});