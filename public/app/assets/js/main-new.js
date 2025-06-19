document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.main-list li').forEach((li) => {
        const players = li.querySelectorAll('lottie-player');

        li.addEventListener('mouseenter', () => {
            players.forEach((p) => p.play());
        });

        li.addEventListener('mouseleave', () => {
            players.forEach((p) => p.stop());
        });
    });

    new ToggleMenu({
        menuSelector: '.modal-profile-menu', // селектор меню
        triggers: [
            new TriggerOptions('#my_profile_photo'),
            new TriggerOptions({
                selector: '#mobile-my_profile_photo',
                style: { left: '0', right: 'auto', display: 'block' },
            }),
            new TriggerOptions({
                selector: '.header-mobile-vers button[btn-id="close"]',
                type: 'close',
            }),
        ],
    });

    const navMainMenu = new ToggleMenu({
        menuSelector: '#nav-main-menu', // селектор меню
        innerContentSelector: '.main-nav-menus',
        menuStore: new MenuStore({
            toggleClass: 'no-active',
        }),
        triggers: [
            new TriggerOptions({
                selector: '#btn-main-menu',
                type: 'toggle',
            }),
            new TriggerOptions({
                selector: '.header-mobile-vers button[btn-id="close"]',
                type: 'close',
            }),
        ],
        onOpen(trigger, menuStore) {
            const toggleClass = menuStore.getCustomProp('toggleClass');
            const menu = this.getMenuElement();
            if (!(menu instanceof HTMLElement)) return;
            if (typeof toggleClass !== 'string') {
                return;
            }

            if (trigger instanceof TriggerOptions) {
                if (menu.classList.contains(toggleClass)) {
                    menu.classList.remove(toggleClass);
                }
            }
        },
        onClose(trigger, clickedInsideInner, menuStore) {
            const toggleClass = menuStore.getCustomProp('toggleClass');
            const menu = this.getMenuElement();
            if (!menu) return;
            if (typeof toggleClass !== 'string') {
                return;
            }

            if (clickedInsideInner === true) {
                menuStore.setOpenState(true);
            } else {
                if (!menu.classList.contains(toggleClass)) {
                    menu.classList.add(toggleClass);
                }
            }
        },
    });

    new ToggleMenu({
        menuSelector: '#modal-voucher', // селектор меню
        innerContentSelector: '.profile-settings',
        triggers: [
            new TriggerOptions({
                selector: '#modal-voucher button[btn-id="close"]',
                type: 'close',
            }),
            new TriggerOptions({
                selector: '.profile-navigation button[target="_voucher"]',
                style: { display: 'flex' },
            }),
        ],
        onClose(trigger, clickedInsideInner, menuStore) {
            const menu = this.getMenuElement();
            if (!menu) return;

            if (clickedInsideInner === true) {
                menuStore.setOpenState(true);
            } else {
                menu.style = 'display: none';
            }
        },
    });

    new ToggleMenu({
        menuSelector: '#modal-account-setting', // селектор меню
        innerContentSelector: '.profile-settings',
        triggers: [
            new TriggerOptions({
                selector: '#modal-account-setting button[btn-id="close"]',
                type: 'close',
            }),
            new TriggerOptions({
                selector: '.modal-profile-menu',
                // style: { display: 'flex' },
            }),
        ],
        onOpen(trigger, menuStore) {},
        onClose(trigger, clickedInsideInner, menuStore) {
            const menu = this.getMenuElement();
            if (!menu) return;

            if (clickedInsideInner === true) {
                menuStore.setOpenState(true);
            } else {
                menu.style = 'display: none';
            }
        },
    });

    setupProfileNavigation({
        buttonSelector: '.modal-profile-menu .button-menu-item',
        targetAttr: 'target',
        mainSelector: '#modal-account-setting',
        navAttr: 'profile-settings-nav-id',
        tabAttr: 'profile-settings-tab-id',
        display: 'flex',
    });

    setupProfileNavigation({
        buttonSelector: '#modal-account-setting .head--profile-settings button',
        targetAttr: 'profile-settings-nav-id',
        mainSelector: '#modal-account-setting',
        navAttr: 'profile-settings-nav-id',
        tabAttr: 'profile-settings-tab-id',
        display: 'flex',
    });

    new ToggleMenu({
        menuSelector: '.modal-header-lang', // селектор меню
        triggers: [
            new TriggerOptions('.additional-nav .icon-lang'),
            new TriggerOptions({
                selector: '.header-mobile-vers .icon-lang',
                style: { left: '0', right: 'auto', display: 'block' },
            }),
        ],
    });

    setupLanguageSwitcher({
        actionSelector: '.modal-header-lang .lang-data button',
        langAttr: 'target',
        url: '/api/set-language',
        activeClass: 'active',
        onResponse: (json, lang) => {
            applyLanguageContent(json, lang);
        },
    });

    setupResponsiveCollapseToggle({
        triggerSelector: '#btn-main-menu',
        targetSelector: '#nav-main-menu',
    });

    document.querySelectorAll('.form-item-select').forEach((container) => {
        // Генерируем уникальный id для контейнера, если нужно
        // или используем сам элемент как контейнерSelector (в нашем случае — это элемент, а не селектор строкой)

        setupCustomSelect({
            containerSelector: container, // передаем сам DOM элемент
            headerSelector: '.head-select',
            itemsSelector: '.body-select .content-select .item',
            inputSelector: 'input[type="hidden"]', // или по name, если нужно
            openClass: 'select-list-view',
        });
    });

    new Carousel('.block-carousel');
    new ThemeSwitcher(['#nav-main-menu .header-mobile-vers .icon-sun', '.main-header .icon-sun']);
});
