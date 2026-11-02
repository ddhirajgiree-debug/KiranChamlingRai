
document.addEventListener("DOMContentLoaded", function () {
    // =====================================
    // ELEMENTS
    // =====================================
    const langEnglish = document.getElementById("langEnglish");
    const langNepali = document.getElementById("langNepali");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    const sections = document.querySelectorAll(
        "main#home > .content-section"
    );

    const hero = document.querySelector("main#home > .hero-section");
    const featured = document.querySelector("main#home > .featured-section");

    let currentLanguage = "en";

    // =====================================
    // LANGUAGE SWITCHER
    // =====================================
    function setLanguage(language) {
        currentLanguage = language;

        document.documentElement.lang =
            language === "ne" ? "ne" : "en";

        document.querySelectorAll("[data-en][data-ne]").forEach(function (element) {
            element.textContent = element.getAttribute(
                language === "ne" ? "data-ne" : "data-en"
            );
        });

        document.querySelectorAll(
            "[data-placeholder-en][data-placeholder-ne]"
        ).forEach(function (element) {
            element.placeholder = element.getAttribute(
                language === "ne"
                    ? "data-placeholder-ne"
                    : "data-placeholder-en"
            );
        });

        if (langEnglish) {
            langEnglish.classList.toggle("active", language === "en");
            langEnglish.setAttribute(
                "aria-pressed",
                String(language === "en")
            );
        }

        if (langNepali) {
            langNepali.classList.toggle("active", language === "ne");
            langNepali.setAttribute(
                "aria-pressed",
                String(language === "ne")
            );
        }

        updateDate();

        try {
            localStorage.setItem("kiranPortfolioLanguage", language);
        } catch (error) {
            // Language switching works without localStorage.
        }
    }

    function updateDate() {
        const dateElement = document.getElementById("currentDate");

        if (!dateElement) return;

        const now = new Date();

        if (currentLanguage === "en") {
            dateElement.textContent = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }).format(now);

            return;
        }

        try {
            if (typeof NepaliDate !== "undefined") {
                const bsDate = new NepaliDate(now);

                const months = [
                    "बैशाख", "जेठ", "असार", "साउन",
                    "भदौ", "असोज", "कात्तिक", "मंसिर",
                    "पुस", "माघ", "फागुन", "चैत"
                ];

                const digits = "०१२३४५६७८९";

                function nepaliDigits(value) {
                    return String(value).replace(/\d/g, function (digit) {
                        return digits[Number(digit)];
                    });
                }

                const year = bsDate.getYear();
                const month = bsDate.getMonth();
                const day = bsDate.getDate();

                if (
                    month >= 0 &&
                    month < 12 &&
                    year > 0 &&
                    day > 0
                ) {
                    dateElement.textContent =
                        nepaliDigits(day) + " " +
                        months[month] + " " +
                        nepaliDigits(year);

                    return;
                }
            }
        } catch (error) {
            console.error("Nepali date conversion failed:", error);
        }

        dateElement.textContent = "मिति उपलब्ध छैन";
    }

    if (langEnglish) {
        langEnglish.addEventListener("click", function () {
            setLanguage("en");
        });
    }

    if (langNepali) {
        langNepali.addEventListener("click", function () {
            setLanguage("ne");
        });
    }

    // =====================================
    // MEDIA TABS
    // =====================================
    function showMediaTab(tab) {
        const selectedTab = ["videos", "news"].includes(tab)
            ? tab
            : "videos";

        document.querySelectorAll("[data-media-panel]").forEach(function (panel) {
            panel.hidden = panel.dataset.mediaPanel !== selectedTab;
        });

        document.querySelectorAll("[data-media-select]").forEach(function (button) {
            const isActive =
                button.dataset.mediaSelect === selectedTab;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-selected", String(isActive));
        });
    }

    document.querySelectorAll("[data-media-select]").forEach(function (button) {
        button.addEventListener("click", function () {
            showMediaTab(button.dataset.mediaSelect);
        });
    });

    // =====================================
    // PAGE NAVIGATION
    // =====================================
    function closeMobileMenu() {
        if (mainNav) {
            mainNav.classList.remove("nav-open", "open");
        }

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        }
    }

    function showPage(page, mediaTab = "videos", updateUrl = true) {
        const isHome = page === "home";

        // Show only the requested content section.
        sections.forEach(function (section) {
            section.style.display =
                isHome || section.id === page ? "block" : "none";
        });

        // Home hero uses grid layout, not block.
        if (hero) {
            hero.style.display = isHome ? "grid" : "none";
        }

        if (featured) {
            featured.style.display = isHome ? "block" : "none";
        }

        // Open the requested Media tab.
        if (page === "media") {
            showMediaTab(mediaTab);
        }

        // Highlight the current navigation link.
        document.querySelectorAll("#mainNav a[href^='#']").forEach(function (link) {
            const href = link.getAttribute("href");
            const linkPage = link.dataset.page || href.substring(1);

            const isMediaSubLink = link.hasAttribute("data-media-tab");

            link.classList.toggle(
                "nav-active",
                linkPage === page && !isMediaSubLink
            );
        });

        closeMobileMenu();

        // Update the URL without reloading the page.
        if (updateUrl) {
            const hash = page === "home" ? "#home" : "#" + page;

            if (window.location.hash !== hash) {
                window.history.pushState(
                    { page: page, mediaTab: mediaTab },
                    "",
                    hash
                );
            }
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Handle navbar and dropdown links.
    document.querySelectorAll("#mainNav a[href^='#']").forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");
            const page = link.dataset.page || href.substring(1);
            const mediaTab = link.dataset.mediaTab || "videos";

            const target = document.getElementById(page);

            if (
                page === "home" ||
                (target && target.classList.contains("content-section"))
            ) {
                event.preventDefault();
                showPage(page, mediaTab);
            }
        });
    });

    // Hero buttons and links to sections.
    document.querySelectorAll(
        "main#home .hero-buttons a[href^='#'], main#home .text-link[href^='#']"
    ).forEach(function (link) {
        link.addEventListener("click", function (event) {
            const page = link.getAttribute("href").substring(1);
            const target = document.getElementById(page);

            if (target && target.classList.contains("content-section")) {
                event.preventDefault();
                showPage(page);
            }
        });
    });

    // Browser Back / Forward.
    window.addEventListener("popstate", function (event) {
        const page =
            (event.state && event.state.page) ||
            window.location.hash.substring(1) ||
            "home";

        const mediaTab =
            (event.state && event.state.mediaTab) || "videos";

        const target = document.getElementById(page);

        if (
            page === "home" ||
            (target && target.classList.contains("content-section"))
        ) {
            showPage(page, mediaTab, false);
        } else {
            showPage("home", "videos", false);
        }
    });

    // =====================================
    // MOBILE MENU
    // =====================================
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("nav-open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });
    }

    // =====================================
    // FOOTER YEAR
    // =====================================
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // =====================================
    // INITIAL PAGE AND LANGUAGE
    // =====================================
    let savedLanguage = "en";

    try {
        const storedLanguage =
            localStorage.getItem("kiranPortfolioLanguage");

        if (storedLanguage === "en" || storedLanguage === "ne") {
            savedLanguage = storedLanguage;
        }
    } catch (error) {
        // Default to English.
    }

    setLanguage(savedLanguage);

    const initialPage = window.location.hash.substring(1) || "home";
    const initialTarget = document.getElementById(initialPage);

    if (
        initialPage === "home" ||
        (initialTarget && initialTarget.classList.contains("content-section"))
    ) {
        showPage(initialPage, "videos", false);
    } else {
        showPage("home", "videos", false);
    }
});
