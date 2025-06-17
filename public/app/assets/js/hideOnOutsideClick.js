function hideOnOutsideClick(targetSelector, activatorSelector, closeBtnSelector, options = {}) {
    const {
        displayNone = true,
        activeClass = 'active',
        innerContentSelector = null, // новый параметр: селектор основного содержимого внутри модалки
    } = options;

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
            clickedInsideInnerContent = innerContent ? innerContent.contains(event.target) : false;
        }

        if (clickedCloseBtn) {
            if (displayNone) target.style.display = 'none';
            activators.forEach((el) => el.classList.remove(activeClass));
            return;
        }

        // Если клик вне активаторов и:
        // - клик вне всего target (модалки)
        // - или клик по фону (по target, но не по innerContent)
        if (!clickedActivator && (!clickedInsideTarget || (clickedInsideTarget && innerContentSelector && !clickedInsideInnerContent))) {
            if (displayNone) target.style.display = 'none';
            activators.forEach((el) => el.classList.remove(activeClass));
        }
    });
}
