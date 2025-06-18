/**
 * Класс управления меню через добавление/удаление CSS-класса
 * с поддержкой кнопки закрытия и исключения кликов по "внутренней" зоне.
 */
class ClassToggleMenu {
    /**
     * @param {Object} options
     * @param {string} options.menuSelector - Селектор меню (например, '#nav-main-menu').
     * @param {string} options.toggleClass - Класс, который нужно добавить/удалить для скрытия (например, 'no-active').
     * @param {string} options.openButtonSelector - Кнопка, открывающая меню.
     * @param {string} options.closeButtonSelector - Кнопка, закрывающая меню.
     * @param {string} options.innerContentSelector - Селектор области внутри меню, клики по которой не закрывают меню.
     */
    constructor({ menuSelector, toggleClass, openButtonSelector, closeButtonSelector, innerContentSelector }) {
        this.menu = document.querySelector(menuSelector);
        this.openButton = document.querySelector(openButtonSelector);
        this.closeButton = document.querySelector(closeButtonSelector);
        this.innerContent = document.querySelector(innerContentSelector);

        this.toggleClass = toggleClass;

        this.boundOutsideClick = this.handleOutsideClick.bind(this);

        this.init();
    }

    /**
     * Назначение обработчиков
     */
    init() {
        if (this.openButton) {
            this.openButton.addEventListener('click', () => this.open());
        }

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }
    }

    /**
     * Открывает меню
     */
    open() {
        this.menu.classList.remove(this.toggleClass);

        // задержка — чтобы избежать немедленного закрытия
        setTimeout(() => {
            document.addEventListener('click', this.boundOutsideClick);
        });
    }

    /**
     * Закрывает меню
     */
    close() {
        this.menu.classList.add(this.toggleClass);
        document.removeEventListener('click', this.boundOutsideClick);
    }

    /**
     * Обрабатывает клик вне контента
     * @param {MouseEvent} event
     */
    handleOutsideClick(event) {
        if (!this.menu.contains(event.target) || (this.innerContent && !this.innerContent.contains(event.target))) {
            this.close();
        }
    }
}
