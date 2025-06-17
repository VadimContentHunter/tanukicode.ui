function setupLanguageSwitcher({
    actionSelector = 'button',
    langAttr = 'target',
    url = '/api/set-language',
    activeClass = 'active', // новый параметр для класса активности
    onResponse = () => {},
}) {
    const buttons = document.querySelectorAll(actionSelector);

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute(langAttr)?.trim();
            if (!lang) return;

            const page = window.location.pathname;
            const fullUrl = `${url}?lang=${encodeURIComponent(lang)}&page=${encodeURIComponent(page)}`;

            fetch(fullUrl)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Ошибка ${res.status}`);
                    }
                    return res.json();
                })
                .then((json) => {
                    // Убираем класс активности у всех кнопок
                    buttons.forEach((b) => b.classList.remove(activeClass));
                    // Добавляем класс активности у нажатой кнопки
                    btn.classList.add(activeClass);

                    onResponse(json, lang);
                })
                .catch((err) => {
                    console.error('Ошибка при смене языка:', err);
                });
        });
    });
}
