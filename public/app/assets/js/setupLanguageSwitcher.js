/**
 * Выполняет смену языка на странице, запрашивая переводы с сервера,
 * обновляет активную кнопку и параметр `lang` в URL.
 *
 * @param {string} lang - Код языка, например: `'en'`, `'ru'`.
 * @param {Object} options - Настройки функции.
 * @param {NodeListOf<Element>} options.buttons - Список всех кнопок переключения языка.
 * @param {string} options.langAttr - Атрибут, содержащий код языка на кнопках (например, `'target'`).
 * @param {string} options.activeClass - Класс, который будет добавлен активной кнопке.
 * @param {string} options.url - URL API для получения переводов, например: `'/api/set-language'`.
 * @param {Function} options.onResponse - Колбэк, вызываемый после успешной загрузки переводов.
 *        Получает параметры (translations: object, lang: string).
 *
 * @returns {Promise<void>} Промис завершения загрузки переводов.
 */
async function changeLanguage(lang, { buttons, langAttr, activeClass, url, onResponse }) {
    const page = window.location.pathname;
    const fullUrl = `${url}?lang=${encodeURIComponent(lang)}&page=${encodeURIComponent(page)}`;

    try {
        const res = await fetch(fullUrl);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        buttons.forEach((b) => b.classList.remove(activeClass));
        buttons.forEach((b_1) => {
            if (b_1.getAttribute(langAttr)?.trim() === lang) {
                b_1.classList.add(activeClass);
            }
        });

        const urlObj = new URL(window.location);
        urlObj.searchParams.set('lang', lang);
        window.history.replaceState(null, '', urlObj.toString());

        onResponse(json, lang);
    } catch (err) {
        console.error('Ошибка при смене языка:', err);
    }
}

/**
 * Устанавливает обработчики на кнопки переключения языка и
 * автоматически применяет язык из URL-параметра `?lang=...` при загрузке страницы.
 *
 * @param {Object} config - Конфигурация переключателя языка.
 * @param {string} [config.actionSelector='button'] - Селектор кнопок переключения языка.
 * @param {string} [config.langAttr='target'] - Атрибут, содержащий код языка.
 * @param {string} [config.url='/api/set-language'] - URL API для загрузки переводов.
 * @param {string} [config.activeClass='active'] - Класс активности, применяемый к выбранной кнопке.
 * @param {Function} [config.onResponse=() => {}] - Колбэк при успешной загрузке переводов.
 *        Получает параметры (translations: object, lang: string).
 */
function setupLanguageSwitcher({
    actionSelector = 'button',
    langAttr = 'target',
    url = '/api/set-language',
    activeClass = 'active',
    onResponse = () => {},
}) {
    const buttons = document.querySelectorAll(actionSelector);

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute(langAttr)?.trim();
            if (!lang) return;
            changeLanguage(lang, { buttons, langAttr, activeClass, url, onResponse });
        });
    });

    const langFromUrl = new URLSearchParams(window.location.search).get('lang');
    if (langFromUrl) {
        changeLanguage(langFromUrl, { buttons, langAttr, activeClass, url, onResponse });
    }
}
