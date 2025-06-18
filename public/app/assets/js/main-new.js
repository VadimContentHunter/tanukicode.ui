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
        onOpen(trigger) {
            console.log('Меню открыто через триггер:', trigger);

            const menu = this.getMenuElement();
            if (!menu) return;

            if (trigger instanceof TriggerOptions) {
                menu.style = trigger.style;
            }
        },
        onClose(trigger) {
            console.log('Меню закрыто', trigger ? `через триггер ${trigger.selector}` : 'клик вне меню');
            console.log(trigger);
            const menu = this.getMenuElement();
            if (!menu) return;

            menu.style = 'display: none';
        },
    });
});
