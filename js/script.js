(() => {
    "use strict";

    const THEME_KEY = "burak-kaya-theme";
    const root = document.documentElement;
    const body = document.body;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    function readStoredTheme() {
        try {
            const storedTheme = localStorage.getItem(THEME_KEY);
            return storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
        } catch {
            return null;
        }
    }

    function writeStoredTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch {
            return;
        }
    }

    function addMediaListener(mediaQuery, callback) {
        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", callback);
        } else if (typeof mediaQuery.addListener === "function") {
            mediaQuery.addListener(callback);
        }
    }

    function updateThemeButtons(theme) {
        const isDark = theme === "dark";

        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            const icon = button.querySelector("[data-theme-icon]");
            const label = button.querySelector("[data-theme-label]");

            if (icon) {
                icon.textContent = isDark ? "☀" : "☾";
            }

            if (label) {
                label.textContent = isDark ? "Açık tema" : "Koyu tema";
            }

            button.setAttribute("aria-label", isDark ? "Açık temaya geç" : "Koyu temaya geç");
        });
    }

    function applyTheme(theme) {
        root.dataset.theme = theme;

        if (themeColorMeta) {
            themeColorMeta.setAttribute("content", theme === "dark" ? "#0e1612" : "#f4f7f2");
        }

        updateThemeButtons(theme);
    }

    function initTheme() {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const storedTheme = readStoredTheme();
        const preferredTheme = storedTheme || (mediaQuery.matches ? "dark" : "light");

        applyTheme(preferredTheme);

        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            button.addEventListener("click", () => {
                const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
                writeStoredTheme(nextTheme);
                applyTheme(nextTheme);
            });
        });

        addMediaListener(mediaQuery, (event) => {
            if (!readStoredTheme()) {
                applyTheme(event.matches ? "dark" : "light");
            }
        });
    }

    function initNavigation() {
        const navToggle = document.querySelector("[data-nav-toggle]");
        const navPanel = document.querySelector("[data-nav-panel]");
        const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));

        if (!navToggle || !navPanel) {
            return;
        }

        const desktopQuery = window.matchMedia("(min-width: 921px)");
        const focusableSelector = [
            "a[href]",
            "button:not([disabled])",
            "input:not([disabled])",
            "textarea:not([disabled])",
            "select:not([disabled])",
            "[tabindex]:not([tabindex='-1'])"
        ].join(",");

        const isMenuOpen = () => navToggle.getAttribute("aria-expanded") === "true";
        const getMenuFocusableElements = () =>
            [navToggle, ...Array.from(navPanel.querySelectorAll(focusableSelector))]
                .filter((element) => element && element.offsetParent !== null);

        const setMenuState = (isOpen) => {
            const shouldOpen = Boolean(isOpen) && !desktopQuery.matches;

            navToggle.setAttribute("aria-expanded", String(shouldOpen));
            navToggle.setAttribute("aria-label", shouldOpen ? "Menüyü kapat" : "Menüyü aç");
            body.classList.toggle("nav-open", shouldOpen);

            if (desktopQuery.matches) {
                navPanel.removeAttribute("aria-hidden");
            } else {
                navPanel.setAttribute("aria-hidden", String(!shouldOpen));
            }
        };

        const closeMenu = (returnFocus = false) => {
            const wasOpen = isMenuOpen();
            setMenuState(false);

            if (returnFocus && wasOpen) {
                navToggle.focus();
            }
        };

        navToggle.addEventListener("click", () => {
            setMenuState(!isMenuOpen());
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (!desktopQuery.matches) {
                    closeMenu(false);
                }
            });
        });

        document.addEventListener("keydown", (event) => {
            if (!isMenuOpen()) {
                return;
            }

            if (event.key === "Escape") {
                closeMenu(true);
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusableElements = getMenuFocusableElements();

            if (!focusableElements.length) {
                return;
            }

            const activeIndex = focusableElements.indexOf(document.activeElement);
            const nextIndex = event.shiftKey
                ? (activeIndex <= 0 ? focusableElements.length - 1 : activeIndex - 1)
                : (activeIndex === -1 || activeIndex === focusableElements.length - 1 ? 0 : activeIndex + 1);

            event.preventDefault();
            focusableElements[nextIndex]?.focus();
        });

        addMediaListener(desktopQuery, (event) => {
            if (event.matches) {
                closeMenu(false);
                navPanel.removeAttribute("aria-hidden");
            } else {
                setMenuState(false);
            }
        });

        setMenuState(false);
    }

    function initScrollState() {
        const syncScrollState = () => {
            body.classList.toggle("is-scrolled", window.scrollY > 12);
        };

        syncScrollState();
        window.addEventListener("scroll", syncScrollState, { passive: true });
    }

    function initScrollSpy() {
        const allNavLinks = Array.from(document.querySelectorAll("[data-nav-link]"));

        if (body.dataset.page !== "home") {
            const activeSectionByPage = {
                "about-detail": "#about",
                "hobbies-detail": "#hobbies",
                "contact-detail": "#contact"
            };
            const activeHash = activeSectionByPage[body.dataset.page];

            if (activeHash) {
                allNavLinks.forEach((link) => {
                    const hash = new URL(link.href, window.location.href).hash;
                    const isActive = hash === activeHash;
                    link.classList.toggle("is-active", isActive);

                    if (isActive) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            }

            return;
        }

        const linkMap = allNavLinks
            .map((link) => {
                const hash = new URL(link.href, window.location.href).hash;
                const section = hash ? document.querySelector(hash) : null;
                return section ? { link, hash, section } : null;
            })
            .filter(Boolean);

        if (!linkMap.length) {
            return;
        }

        const setActiveLink = (hash) => {
            linkMap.forEach((item) => {
                const isActive = item.hash === hash;
                item.link.classList.toggle("is-active", isActive);

                if (isActive) {
                    item.link.setAttribute("aria-current", "location");
                } else {
                    item.link.removeAttribute("aria-current");
                }
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

                if (visibleEntries[0]) {
                    setActiveLink(`#${visibleEntries[0].target.id}`);
                }
            },
            {
                rootMargin: "-35% 0px -45% 0px",
                threshold: [0.2, 0.35, 0.6]
            }
        );

        linkMap.forEach((item) => observer.observe(item.section));

        if (window.location.hash && document.querySelector(window.location.hash)) {
            setActiveLink(window.location.hash);
        } else {
            setActiveLink("#home");
        }

        window.addEventListener("hashchange", () => {
            if (window.location.hash && document.querySelector(window.location.hash)) {
                setActiveLink(window.location.hash);
            }
        });
    }

    function initAccordion() {
        const accordion = document.querySelector("[data-accordion]");

        if (!accordion) {
            return;
        }

        const items = Array.from(accordion.querySelectorAll(".accordion-item"));
        const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        if (!items.length) {
            return;
        }

        const getItemFromHash = () => {
            const hash = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
            return hash ? items.find((item) => item.id === hash) || null : null;
        };

        const closeItem = (item, animate = true) => {
            const trigger = item.querySelector("[data-accordion-trigger]");
            const panel = item.querySelector("[data-accordion-panel]");

            if (!trigger || !panel) {
                return;
            }

            item.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");

            if (panel.hidden) {
                panel.style.height = "";
                return;
            }

            if (reducedMotionQuery.matches || !animate) {
                panel.hidden = true;
                panel.style.height = "";
                return;
            }

            panel.dataset.transition = "closing";
            panel.style.height = `${panel.scrollHeight}px`;

            requestAnimationFrame(() => {
                panel.style.height = "0px";
            });

            const onTransitionEnd = (event) => {
                if (event.target !== panel || panel.dataset.transition !== "closing") {
                    return;
                }

                panel.hidden = true;
                panel.style.height = "";
                delete panel.dataset.transition;
                panel.removeEventListener("transitionend", onTransitionEnd);
            };

            panel.addEventListener("transitionend", onTransitionEnd);
        };

        const openItem = (item, animate = true) => {
            const trigger = item.querySelector("[data-accordion-trigger]");
            const panel = item.querySelector("[data-accordion-panel]");

            if (!trigger || !panel) {
                return;
            }

            item.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
            panel.hidden = false;

            if (reducedMotionQuery.matches || !animate) {
                panel.style.height = "";
                delete panel.dataset.transition;
                return;
            }

            panel.dataset.transition = "opening";
            panel.style.height = "0px";
            const targetHeight = panel.scrollHeight;

            requestAnimationFrame(() => {
                panel.style.height = `${targetHeight}px`;
            });

            const onTransitionEnd = (event) => {
                if (event.target !== panel || panel.dataset.transition !== "opening") {
                    return;
                }

                panel.style.height = "";
                delete panel.dataset.transition;
                panel.removeEventListener("transitionend", onTransitionEnd);
            };

            panel.addEventListener("transitionend", onTransitionEnd);
        };

        const setOpenItem = (targetItem, animate = true) => {
            items.forEach((item) => {
                if (item === targetItem) {
                    openItem(item, animate);
                } else {
                    closeItem(item, animate);
                }
            });
        };

        items.forEach((item) => {
            const trigger = item.querySelector("[data-accordion-trigger]");
            const panel = item.querySelector("[data-accordion-panel]");

            if (!trigger || !panel) {
                return;
            }

            if (item.classList.contains("is-open")) {
                panel.hidden = false;
                trigger.setAttribute("aria-expanded", "true");
            } else {
                panel.hidden = true;
                trigger.setAttribute("aria-expanded", "false");
            }

            trigger.addEventListener("click", () => {
                const isOpen = item.classList.contains("is-open");

                if (isOpen) {
                    closeItem(item);
                } else {
                    setOpenItem(item);
                }
            });
        });

        const initialHashItem = getItemFromHash();

        if (initialHashItem) {
            setOpenItem(initialHashItem, false);
            initialHashItem.scrollIntoView({
                block: "start",
                behavior: reducedMotionQuery.matches ? "auto" : "smooth"
            });
        }

        window.addEventListener("hashchange", () => {
            const targetItem = getItemFromHash();

            if (targetItem) {
                setOpenItem(targetItem, !reducedMotionQuery.matches);
            }
        });
    }

    function initContactForm() {
        const form = document.querySelector("[data-contact-form]");

        if (!form) {
            return;
        }

        const status = form.querySelector("[data-form-status]");
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const fields = {
            name: {
                input: form.querySelector("#name"),
                error: form.querySelector("#name-error"),
                validate(value) {
                    return value.trim().length >= 2
                        ? ""
                        : "Lütfen en az 2 karakter olacak şekilde adınızı yazın.";
                }
            },
            email: {
                input: form.querySelector("#email"),
                error: form.querySelector("#email-error"),
                validate(value) {
                    return emailPattern.test(value.trim())
                        ? ""
                        : "Geçerli bir e-posta adresi girin.";
                }
            },
            message: {
                input: form.querySelector("#message"),
                error: form.querySelector("#message-error"),
                validate(value) {
                    return value.trim().length >= 12
                        ? ""
                        : "Mesajınız en az 12 karakter olmalı.";
                }
            }
        };

        const clearStatus = () => {
            if (!status) {
                return;
            }

            status.hidden = true;
            status.textContent = "";
            status.removeAttribute("data-state");
        };

        const showStatus = (state, message) => {
            if (!status) {
                return;
            }

            status.hidden = false;
            status.dataset.state = state;
            status.textContent = message;
            status.focus();
        };

        const setFieldState = (field, message) => {
            if (!field.input || !field.error) {
                return;
            }

            if (message) {
                field.input.setAttribute("aria-invalid", "true");
            } else {
                field.input.removeAttribute("aria-invalid");
            }

            field.error.textContent = message;
        };

        const validateField = (fieldName) => {
            const field = fields[fieldName];

            if (!field || !field.input) {
                return true;
            }

            const message = field.validate(field.input.value);
            setFieldState(field, message);
            return !message;
        };

        Object.entries(fields).forEach(([fieldName, field]) => {
            if (!field.input) {
                return;
            }

            field.input.setAttribute("aria-describedby", `${fieldName}-error`);

            field.input.addEventListener("blur", () => {
                validateField(fieldName);
            });

            field.input.addEventListener("input", () => {
                if (field.input.getAttribute("aria-invalid") === "true") {
                    validateField(fieldName);
                }

                clearStatus();
            });
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            clearStatus();

            const invalidFieldName = Object.keys(fields).find((fieldName) => !validateField(fieldName));

            if (invalidFieldName) {
                showStatus("error", "Formu tamamlamak için işaretlenen alanları düzeltin.");
                fields[invalidFieldName].input.focus();
                return;
            }

            showStatus(
                "success",
                "Form demo amaçlı olduğu için mesaj gönderilmedi. Bilgiler doğrulandı; bana LinkedIn veya GitHub üzerinden ulaşabilirsiniz."
            );

            form.reset();
            Object.values(fields).forEach((field) => setFieldState(field, ""));
        });
    }

    initTheme();
    initNavigation();
    initScrollState();
    initScrollSpy();
    initAccordion();
    initContactForm();
})();
