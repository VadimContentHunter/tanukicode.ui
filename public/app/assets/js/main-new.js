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
});
