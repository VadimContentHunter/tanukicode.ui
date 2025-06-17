function setupProfileNavigation({
    mainSelector,
    buttonSelector = '.button-menu-item',
    targetAttr = 'target', // Атрибут у кнопок, где хранится таргет
    navAttr = 'profile-settings-nav-id',
    tabAttr = 'profile-settings-tab-id',
    display = 'flex',
}) {
    const setDisplay = (el, value) => {
        if (el) el.style.display = value;
    };

    document.querySelectorAll(buttonSelector).forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute(targetAttr)?.trim();

            if (!target) return; // игнорируем пустые таргеты

            // Показываем основное окно
            const main = document.querySelector(mainSelector);
            if (main) {
                setDisplay(main, display);
            } else {
                console.warn('mainSelector не найден:', mainSelector);
            }

            // Обрабатываем навигационные элементы
            const navItems = document.querySelectorAll(`[${navAttr}]`);
            navItems.forEach((el) => {
                const attr = el.getAttribute(navAttr)?.trim();
                el.classList.remove('button-active', 'button-inactive');
                if (attr === target) {
                    el.classList.add('button-active');
                } else {
                    el.classList.add('button-inactive');
                }
            });

            // Обрабатываем табы
            const tabItems = document.querySelectorAll(`[${tabAttr}]`);
            let foundTargetTab = false;

            tabItems.forEach((el) => {
                const attr = el.getAttribute(tabAttr)?.trim();
                if (attr === target) {
                    setDisplay(el, display);
                    foundTargetTab = true;
                } else {
                    setDisplay(el, 'none');
                }
            });

            if (!foundTargetTab) {
                console.warn(`Не найден таб с ${tabAttr}="${target}"`);
            }
        });
    });
}
