document.addEventListener('DOMContentLoaded', () => {
    new ProfileMenuToggle({
        menuSelector: '.modal-profile-menu',
        triggers: [
            '#my_profile_photo', // обычный десктопный триггер
            {
                selector: '#mobile-my_profile_photo',
                style: {
                    left: '0',
                    right: 'auto',
                },
            },
        ],
    });

    new ClassToggleMenu({
        menuSelector: '#nav-main-menu',
        toggleClass: 'no-active',
        openButtonSelector: '#btn-main-menu',
        closeButtonSelector: '.header-mobile-vers button[btn-id="close"]',
        innerContentSelector: '.main-nav-menus',
    });
});
