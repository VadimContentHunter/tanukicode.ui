function setupResponsiveToggleClick({
    triggerSelector,
    targetSelector,
    mobileClass = 'no-active',
    desktopClass = 'collapse',
    breakpoint = 1144,
}) {
    const trigger = document.querySelector(triggerSelector);
    const target = document.querySelector(targetSelector);
    if (!trigger || !target) return;

    function toggleClasses() {
        const isMobile = window.innerWidth < breakpoint;

        // Удаляем desktopClass если в мобильной версии
        if (isMobile && target.classList.contains(desktopClass)) {
            target.classList.remove(desktopClass);
        }

        if (isMobile) {
            target.classList.toggle(mobileClass);
        } else {
            target.classList.toggle(desktopClass);
        }
    }

    trigger.addEventListener('click', toggleClasses);

    // Также удаляем desktopClass при ресайзе окна в моб. режим
    window.addEventListener('resize', () => {
        if (window.innerWidth < breakpoint && target.classList.contains(desktopClass)) {
            target.classList.remove(desktopClass);
        }
    });
}

function setupResponsiveCollapseToggle({
    triggerSelector,
    targetSelector,
    collapseClass = 'collapse',
    alwaysClass = 'no-active',
    breakpoint = 1144,
}) {
    const trigger = document.querySelector(triggerSelector);
    const target = document.querySelector(targetSelector);
    if (!trigger || !target) return;

    // Всегда добавляем "постоянный" класс
    target.classList.add(alwaysClass);

    // Обработчик клика
    function handleToggle() {
        if (window.innerWidth < breakpoint) {
            target.classList.remove(collapseClass);
        } else {
            target.classList.toggle(collapseClass);
        }
    }

    trigger.addEventListener('click', handleToggle);

    // Обработчик ресайза
    window.addEventListener('resize', () => {
        if (window.innerWidth < breakpoint) {
            target.classList.remove(collapseClass);
        }
    });
}

