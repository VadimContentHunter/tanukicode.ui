function toggleDisplay(targetSelector, activatorSelector) {
    const target = document.querySelector(targetSelector);
    const activator = document.querySelector(activatorSelector);

    if (!target || !activator) {
        console.warn('Target или activator не найдены');
        return;
    }

    activator.addEventListener('click', () => {
        const currentDisplay = getComputedStyle(target).display;

        if (currentDisplay === 'none') {
            target.style.display = 'flex';
        } else {
            target.style.display = 'none';
        }
    });
}
