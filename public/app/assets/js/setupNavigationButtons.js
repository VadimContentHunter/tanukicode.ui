function setupNavigationButtons(targetList, buttonSelector = '.button-menu-item', visibleDisplay = 'flex', beforeShow = null) {
    const setVisible = (el) => {
        if (el) el.style.display = visibleDisplay;
    };

    document.querySelectorAll(buttonSelector).forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetAttr = btn.getAttribute('target')?.trim();
            if (!targetAttr) return;

            const config = targetList.find(([name]) => name === targetAttr);
            if (!config) return;

            const [targetName, mainSel, storageSel, wrapperSel] = config;

            // A. Находим mainComponent, если указан
            let mainComponent = mainSel ? document.querySelector(mainSel) : null;
            if (mainComponent) setVisible(mainComponent);

            // B. Ищем storage внутри mainComponent (если есть), иначе работаем с mainComponent или document
            let searchRoot = mainComponent || document;
            let storage = null;

            if (mainComponent && storageSel) {
                storage = mainComponent.querySelector(storageSel);
                if (storage) searchRoot = storage;
            }

            // C. Собираем ВСЕ дочерние элементы в allTargets
            const allTargets = Array.from((storage || mainComponent || document).children || []);

            // D. Ищем selected по targetName
            const targetSelectors = [`[id="${targetName}"]`, `.${targetName}`, `[data-target="${targetName}"]`].join(',');

            let rawTarget = searchRoot.querySelector(targetSelectors);
            if (!rawTarget) return;

            let selected = rawTarget;
            if (wrapperSel === 'parent') {
                selected = rawTarget.parentElement || rawTarget;
            } else if (wrapperSel) {
                const wrapper = rawTarget.closest(wrapperSel);
                if (wrapper) selected = wrapper;
            }

            // E. Кастомная обработка
            if (typeof beforeShow === 'function') {
                beforeShow(allTargets, selected, config);
            }

            // F. Показываем выбранный
            setVisible(selected);
        });
    });
}
