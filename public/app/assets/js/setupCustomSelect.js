function setupCustomSelect({
    containerSelector, // 1) селектор всего блока с селектом
    headerSelector, // 2) селектор для заголовка, куда пишем выбранный текст
    itemsSelector, // 3) селектор для списка элементов (внутри containerSelector)
    inputSelector, // 4) селектор для скрытого input (внутри containerSelector)
    openClass = 'select-list-view', // класс для открытия списка
}) {
    const container = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
    if (!container) return;

    const header = container.querySelector(headerSelector);
    const input = container.querySelector(inputSelector);
    const items = container.querySelectorAll(itemsSelector);

    if (!header || !input || items.length === 0) return;

    // Открытие/закрытие списка по клику на header
    header.addEventListener('click', () => {
        container.classList.toggle(openClass);
    });

    // Выбор элемента
    items.forEach((item) => {
        item.addEventListener('click', () => {
            const value = item.getAttribute('data-option');
            const text = item.textContent.trim();

            input.value = value;
            header.textContent = text;

            // Закрываем список
            container.classList.remove(openClass);
        });
    });

    // Закрытие при клике вне контейнера
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            container.classList.remove(openClass);
        }
    });
}
