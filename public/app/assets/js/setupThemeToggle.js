class ThemeSwitcher {
    constructor(buttonSelectors, themeAttribute = 'data-theme', darkValue = 'dark') {
        // buttonSelectors — строка селектора или массив селекторов
        if (typeof buttonSelectors === 'string') {
            this.buttons = Array.from(document.querySelectorAll(buttonSelectors));
        } else if (Array.isArray(buttonSelectors)) {
            this.buttons = buttonSelectors.flatMap((sel) => Array.from(document.querySelectorAll(sel)));
        } else {
            this.buttons = [];
        }

        this.themeAttribute = themeAttribute;
        this.darkValue = darkValue;

        this.init();
    }

    isDarkTheme() {
        return document.documentElement.getAttribute(this.themeAttribute) === this.darkValue;
    }

    toggleTheme() {
        if (this.isDarkTheme()) {
            document.documentElement.removeAttribute(this.themeAttribute);
        } else {
            document.documentElement.setAttribute(this.themeAttribute, this.darkValue);
        }
    }

    updateIcons() {
        const dark = this.isDarkTheme();
        this.buttons.forEach((btn) => {
            const icon = btn.querySelector('i');
            if (!icon) return;

            if (dark) {
                icon.classList.remove('icon-sun');
                icon.classList.add('icon-moon');
            } else {
                icon.classList.remove('icon-moon');
                icon.classList.add('icon-sun');
            }
        });
    }

    onClick = () => {
        this.toggleTheme();
        this.updateIcons();
    };

    init() {
        this.buttons.forEach((btn) => btn.addEventListener('click', this.onClick));
        this.updateIcons();
    }
}
