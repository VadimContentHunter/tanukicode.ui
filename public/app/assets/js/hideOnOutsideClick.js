function hideOnOutsideClick(targetSelector, activatorSelector) {
    const target = document.querySelector(targetSelector);
    const activator = document.querySelector(activatorSelector);

    if (!target || !activator) {
        console.warn('Target или activator не найдены');
        return;
    }

    document.addEventListener('click', (event) => {
        const isVisible = getComputedStyle(target).display !== 'none';
        const clickedInsideTarget = target.contains(event.target);
        const clickedActivator = activator.contains(event.target);

        if (isVisible && !clickedInsideTarget && !clickedActivator) {
            target.style.display = 'none';
        }
    });
}
