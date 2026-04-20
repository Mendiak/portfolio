// i18n.js - Internationalization module
(function() {
    'use strict';

    const SUPPORTED_LANGS = ['en', 'es'];
    const DEFAULT_LANG = 'en';
    const LOCALES_PATH = './locales/';
    
    let currentLang = DEFAULT_LANG;
    let translations = {};

    // Detect user language from browser or URL
    function detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('lang');
        if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
            return savedLang;
        }

        // Check URL hash for language parameter
        const hashLang = window.location.hash.match(/lang=([a-z]{2})/);
        if (hashLang && SUPPORTED_LANGS.includes(hashLang[1])) {
            return hashLang[1];
        }

        // Fall back to browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.split('-')[0];
        
        return SUPPORTED_LANGS.includes(shortLang) ? shortLang : DEFAULT_LANG;
    }

    // Load translations from JSON file
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`${LOCALES_PATH}${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            return null;
        }
    }

    // Get nested value from object using dot notation
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    // Translate a single element
    function translateElement(element, lang) {
        const key = element.getAttribute('data-i18n');
        if (!key) return;

        const value = getNestedValue(translations[lang], key);
        if (value !== undefined && value !== null) {
            element.textContent = value;
        }
    }

    // Update element attributes (placeholder, alt, aria-label, etc.)
    function translateElementAttributes(element, lang) {
        const attrConfig = element.getAttribute('data-i18n-attr');
        if (!attrConfig) return;

        // Parse attribute configuration: "attr1|key1, attr2|key2"
        const attrs = attrConfig.split(',').map(a => a.trim());
        
        attrs.forEach(attr => {
            const [attrName, key] = attr.split('|').map(s => s.trim());
            if (!attrName || !key) return;

            const value = getNestedValue(translations[lang], key);
            if (value !== undefined && value !== null) {
                element.setAttribute(attrName, value);
            }
        });
    }

    // Handle aria-label attributes separately
    function translateAriaAttributes(element, lang) {
        const ariaConfig = element.getAttribute('data-i18n-attr-aria');
        if (!ariaConfig) return;

        const attrs = ariaConfig.split(',').map(a => a.trim());
        
        attrs.forEach(attr => {
            const [attrName, key] = attr.split('|').map(s => s.trim());
            if (!attrName || !key) return;

            const value = getNestedValue(translations[lang], key);
            if (value !== undefined && value !== null) {
                element.setAttribute(attrName, value);
            }
        });
    }

    // Update all translatable elements
    function updatePageLanguage(lang) {
        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update all elements with data-i18n (text content)
        document.querySelectorAll('[data-i18n]').forEach(element => {
            translateElement(element, lang);
            translateElementAttributes(element, lang);
            translateAriaAttributes(element, lang);
        });

        // Update all elements with only data-i18n-attr (attributes like placeholder, alt)
        document.querySelectorAll('[data-i18n-attr]:not([data-i18n])').forEach(element => {
            translateElementAttributes(element, lang);
        });

        // Update all elements with data-i18n-attr-aria
        document.querySelectorAll('[data-i18n-attr-aria]').forEach(element => {
            translateAriaAttributes(element, lang);
        });

        // Update meta tags
        updateMetaTags(lang);

        // Update language switcher buttons
        updateLanguageSwitcher(lang);

        // Save preference
        localStorage.setItem('lang', lang);
    }

    // Update SEO meta tags
    function updateMetaTags(lang) {
        const meta = translations[lang]?.meta;
        if (!meta) return;

        // Update title
        const titleEl = document.querySelector('title[data-i18n]');
        if (titleEl) {
            titleEl.textContent = meta.title;
        }

        // Update meta description
        const descEl = document.querySelector('meta[name="description"][data-i18n-attr]');
        if (descEl) {
            descEl.setAttribute('content', meta.description);
        }

        // Update OG tags
        const ogTitle = document.querySelector('meta[property="og:title"][data-i18n-attr]');
        if (ogTitle) {
            ogTitle.setAttribute('content', meta.og_title);
        }

        const ogDesc = document.querySelector('meta[property="og:description"][data-i18n-attr]');
        if (ogDesc) {
            ogDesc.setAttribute('content', meta.og_description);
        }

        const ogLocale = document.querySelector('meta[property="og:locale"][data-i18n-attr]');
        if (ogLocale) {
            ogLocale.setAttribute('content', lang === 'es' ? 'es_ES' : 'en_US');
        }

        // Update Twitter tags
        const twitterTitle = document.querySelector('meta[property="twitter:title"][data-i18n-attr]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', meta.twitter_title);
        }

        const twitterDesc = document.querySelector('meta[property="twitter:description"][data-i18n-attr]');
        if (twitterDesc) {
            twitterDesc.setAttribute('content', meta.twitter_description);
        }
    }

    // Update language switcher button text
    function updateLanguageSwitcher(lang) {
        const otherLang = lang === 'en' ? 'es' : 'en';
        const buttonText = lang === 'en' ? 'ES' : 'EN';
        const buttonLabel = lang === 'en' 
            ? translations[lang]?.lang_switcher?.label || 'Switch to Spanish'
            : translations[lang]?.lang_switcher?.label || 'Cambiar a inglés';

        // Update desktop button
        const langToggle = document.getElementById('lang-toggle');
        const langButtonText = document.getElementById('lang-button-text');
        if (langToggle) {
            langToggle.setAttribute('aria-label', buttonLabel);
        }
        if (langButtonText) {
            langButtonText.textContent = buttonText;
        }

        // Update mobile button
        const langToggleMobile = document.getElementById('lang-toggle-mobile');
        const langButtonTextMobile = document.getElementById('lang-button-text-mobile');
        if (langToggleMobile) {
            langToggleMobile.setAttribute('aria-label', buttonLabel);
        }
        if (langButtonTextMobile) {
            langButtonTextMobile.textContent = buttonText;
        }
    }

    // Switch to another language
    async function switchLanguage(newLang) {
        if (newLang === currentLang || !SUPPORTED_LANGS.includes(newLang)) return;

        if (!translations[newLang]) {
            const newTranslations = await loadTranslations(newLang);
            if (!newTranslations) {
                console.error(`Failed to load translations for ${newLang}`);
                return;
            }
            translations[newLang] = newTranslations;
        }

        currentLang = newLang;
        updatePageLanguage(currentLang);

        // Dispatch custom event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
    }

    // Initialize i18n
    async function init() {
        currentLang = detectLanguage();
        
        // Load translations for current and alternate language
        const loadPromises = SUPPORTED_LANGS.map(async (lang) => {
            const trans = await loadTranslations(lang);
            if (trans) {
                translations[lang] = trans;
            }
        });

        await Promise.all(loadPromises);

        if (translations[currentLang]) {
            updatePageLanguage(currentLang);
        }

        // Set up language switcher buttons
        const langToggle = document.getElementById('lang-toggle');
        const langToggleMobile = document.getElementById('lang-toggle-mobile');

        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const newLang = currentLang === 'en' ? 'es' : 'en';
                switchLanguage(newLang);
            });
        }

        if (langToggleMobile) {
            langToggleMobile.addEventListener('click', () => {
                const newLang = currentLang === 'en' ? 'es' : 'en';
                switchLanguage(newLang);
            });
        }

        console.log(
            "%c Hello world! %c I see you're checking under the hood. 🚀\n%cInterested in the source code? Check it out at: https://github.com/Mendiak/portfolio",
            "color: #ffb94f; font-weight: bold; font-size: 1.2rem;",
            "color: inherit; font-size: 1rem;",
            "color: #888; font-size: 0.9rem;"
        );
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for external use
    window.i18n = {
        switchLanguage,
        getCurrentLang: () => currentLang,
        getSupportedLangs: () => [...SUPPORTED_LANGS],
        getTranslations: () => translations[currentLang] || {}
    };

})();
