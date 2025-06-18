document.addEventListener('DOMContentLoaded', () => {
    // new ProfileMenuToggle({
    //     menuSelector: '.modal-profile-menu',
    //     triggers: [
    //         '#my_profile_photo', // обычный десктопный триггер
    //         {
    //             selector: '#mobile-my_profile_photo',
    //             style: {
    //                 left: '0',
    //                 right: 'auto',
    //             },
    //         },
    //         {
    //             selector: '.header-mobile-vers button[btn-id="close"]',
    //             type: 'close'
    //         },
    //     ],
    // });

    // const a = {
    //     selector: '#my_profile_photo',
    //     innerContentSelector: null,
    //     style: { display: block },
    //     toggleClass: null,
    //     type: 'open',
    // };

    // new ClassToggleMenu({
    //     menuSelector: '#nav-main-menu',
    //     toggleClass: 'no-active',
    //     openButtonSelector: '#btn-main-menu',
    //     closeButtonSelector: '.header-mobile-vers button[btn-id="close"]',
    //     innerContentSelector: '.main-nav-menus',
    // });

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
        onOpen(trigger, menuStore) {
            const menu = this.getMenuElement();
            if (!menu) return;

            if (trigger instanceof TriggerOptions) {
                trigger.applyStyleToElement(menu);
            }
        },
        onClose(trigger, clickedInsideInner, menuStore) {
            const menu = this.getMenuElement();
            if (!menu) return;

            menu.style = 'display: none';
        },
    });

    new ToggleMenu({
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
            console.log('Меню открыто через триггер:', trigger);
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
            console.log('Меню закрыто', trigger ? `через триггер ${trigger.selector}` : 'клик вне меню');
            console.log(menuStore);
            const toggleClass = menuStore.getCustomProp('toggleClass');
            const menu = this.getMenuElement();
            if (!menu) return;
            if (typeof toggleClass !== "string") {
                return;
            }

            if (clickedInsideInner === true) {
                console.log('Клик был внутри внутреннего контента');
                menuStore.setOpenState(true);
            } else {
                console.log('Клик был вне внутреннего контента или innerContentSelector не задан');
                if (!menu.classList.contains(toggleClass)) {
                    menu.classList.add(toggleClass);
                }
            }

            // if (menuStore instanceof MenuStore) {
            //     menuStore.setOpenState(true);
            // }

            // state.value = false;

            // menu.style.display = 'none';
        },
    });
});
