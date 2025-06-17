/**
 * Настраивает поведение навигации и отображения табов в интерфейсе профиля.
 *
 * При клике на кнопку из `buttonSelector`:
 * - показывает основной контейнер (`mainSelector`);
 * - активирует соответствующую кнопку навигации (`[profile-settings-nav-id]`);
 * - отображает соответствующий таб (`[profile-settings-tab-id]`);
 * - скрывает все остальные табы;
 * - игнорирует кнопки с пустым или начинающимся на "_" значением в атрибуте `targetAttr`.
 *
 * @param {Object} config - Конфигурационный объект.
 * @param {string} config.mainSelector - CSS-селектор главного контейнера, который будет показан при активации таба.
 * @param {string} [config.buttonSelector='.button-menu-item'] - Селектор кнопок навигации, по умолчанию `.button-menu-item`.
 * @param {string} [config.targetAttr='target'] - Название атрибута у кнопок, в котором хранится имя таргета.
 * @param {string} [config.navAttr='profile-settings-nav-id'] - Атрибут у элементов навигации (например, кнопки меню).
 * @param {string} [config.tabAttr='profile-settings-tab-id'] - Атрибут у табов (разделов), которые нужно показать/скрыть.
 * @param {string} [config.display='flex'] - Значение CSS `display` для показа активного таба и контейнера.
 */
function setupProfileNavigation({
    mainSelector,
    buttonSelector = '.button-menu-item',
    targetAttr = 'target',
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

            if (!target || target.startsWith('_')) return; // игнорируем пустые таргеты

            const main = document.querySelector(mainSelector);
            if (main) {
                setDisplay(main, display);
            } else {
                console.warn('mainSelector не найден:', mainSelector);
            }

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
