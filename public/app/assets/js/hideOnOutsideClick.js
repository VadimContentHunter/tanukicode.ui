function hideOnOutsideClick(targetSelector, activatorSelector, closeBtnSelector, options = {}) {
    const { displayNone = true, activeClass = '', inactiveClass = '', innerContentSelector = null } = options;

    const target = document.querySelector(targetSelector);
    const activators = Array.from(document.querySelectorAll(activatorSelector));
    const closeButtons = closeBtnSelector ? Array.from(document.querySelectorAll(closeBtnSelector)) : [];

    if (!target || activators.length === 0) {
        console.warn('Target или activators не найдены');
        return;
    }

    document.addEventListener('click', (event) => {
        const isVisible = getComputedStyle(target).display !== 'none';
        if (!isVisible) return;

        const clickedInsideTarget = target.contains(event.target);
        const clickedActivator = activators.some((el) => el.contains(event.target));
        const clickedCloseBtn = closeButtons.some((el) => el.contains(event.target));

        let clickedInsideInnerContent = false;
        if (innerContentSelector) {
            const innerContent = target.querySelector(innerContentSelector);
            clickedInsideInnerContent = innerContent?.contains(event.target) ?? false;
        }

        const shouldClose =
            clickedCloseBtn ||
            (!clickedActivator && (!clickedInsideTarget || (clickedInsideTarget && innerContentSelector && !clickedInsideInnerContent)));

        if (shouldClose) {
            if (inactiveClass) target.classList.add(inactiveClass);

            if (displayNone) target.style.display = 'none';

            if (activeClass) {
                activators.forEach((el) => el.classList.remove(activeClass));
            }
        }
    });
}
