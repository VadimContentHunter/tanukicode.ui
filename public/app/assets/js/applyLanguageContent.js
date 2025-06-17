function applyLanguageContent(translations, lang) {
    const currentPath = window.location.pathname;

    // Найдём ключ, наиболее подходящий текущему пути
    const matchedKey = Object.keys(translations).find((key) => {
        const cleanedKey = key.replace(/^\/+|\/+$/g, '').toLowerCase();
        const cleanedPath = currentPath.replace(/^\/+|\/+$/g, '').toLowerCase();
        return cleanedPath.includes(cleanedKey);
    });

    if (!matchedKey) {
        console.warn('Не найден подходящий ключ для страницы:', currentPath);
        return;
    }

    const langMap = translations[matchedKey]?.[lang];
    if (!langMap) {
        console.warn(`Нет переводов для языка "${lang}" на странице "${matchedKey}"`);
        return;
    }

    Object.entries(langMap).forEach(([selector, text]) => {
        const el = document.querySelector(selector);
        if (el) {
            el.innerHTML = text;
        } else {
            console.warn('Элемент не найден для селектора:', selector);
        }
    });
}
