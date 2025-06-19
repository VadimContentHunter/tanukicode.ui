document.addEventListener('DOMContentLoaded', () => {
    new ToggleMenu({
        menuSelector: '.lang-curr-modal', // селектор меню
        triggers: [new TriggerOptions('.head-auth-info .icon-lang-white')],
    });

    setupLanguageSwitcher({
        actionSelector: '.modal-main-content .lang-data button',
        langAttr: 'target',
        url: '/api/set-language',
        activeClass: 'active',
        onResponse: (json, lang) => {
            applyLanguageContent(json, lang);
        },
    });

    new ThemeSwitcher(['.head-auth-info .icon-sun-white']);
});
