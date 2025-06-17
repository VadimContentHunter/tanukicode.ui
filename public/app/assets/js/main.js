document.addEventListener('DOMContentLoaded', () => {
    toggleDisplay('.modal-profile-menu', '#my_profile_photo');
    toggleDisplay('.modal-header-lang', '.additional-nav .icon-lang');
    hideOnOutsideClick('.modal-profile-menu', '#my_profile_photo', '.profile-navigation .button-menu-item');
    hideOnOutsideClick('.modal-header-lang', '.additional-nav .icon-lang');
    hideOnOutsideClick(
        '.modal-profile-settings',
        '.modal-profile-menu', // селектор, который открывает модалку
        '.modal-profile-settings button[btn-id="close"]', // кнопка закрытия
        { innerContentSelector: '.profile-settings'}
    );

    // hideOnOutsideClick('.modal-header-lang', '.additional-nav .icon-lang');

    setupProfileNavigation({
        buttonSelector: '.modal-profile-menu .button-menu-item',
        targetAttr: 'target',
        mainSelector: '.modal-profile-settings',
        navAttr: 'profile-settings-nav-id',
        tabAttr: 'profile-settings-tab-id',
        display: 'flex',
    });

    setupProfileNavigation({
        buttonSelector: '.modal-profile-settings .head--profile-settings--navigate button',
        targetAttr: 'profile-settings-nav-id',
        mainSelector: '.modal-profile-settings',
        navAttr: 'profile-settings-nav-id',
        tabAttr: 'profile-settings-tab-id',
        display: 'flex',
    });
});

//header .profile-section
//.modal-profile-menu
