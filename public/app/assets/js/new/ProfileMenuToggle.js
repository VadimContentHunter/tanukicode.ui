/**
 * Класс для управления выпадающим меню: открытие, закрытие при клике вне и переключение по клику.
 * Поддерживает индивидуальные стили на разные триггеры.
 */
class ProfileMenuToggle {
    /**
     * @typedef {Object} TriggerStylePair
     * @property {string} selector - Селектор триггера.
     * @property {Object} [style] - CSS-свойства, применяемые к меню при активации этого триггера.
  
     * @param {Object} options
     * @param {string} options.menuSelector - Селектор меню (например '.modal-profile-menu').
     * @param {(string | TriggerStylePair)[]} options.triggers - Массив селекторов или объектов вида { selector, style }.
     */
    constructor({ menuSelector, triggers }) {
        /** @type {HTMLElement} */
        this.menu = document.querySelector(menuSelector);

        /** @type {Array<{ element: HTMLElement, style: Object }>} */
        this.triggers = [];

        for (const trigger of triggers) {
            if (typeof trigger === 'string') {
                const el = document.querySelector(trigger);
                if (el) this.triggers.push({ element: el, style: {} });
            } else if (typeof trigger === 'object') {
                const el = document.querySelector(trigger.selector);
                if (el) this.triggers.push({ element: el, style: trigger.style || {} });
            }
        }

        /** @type {boolean} */
        this.isOpen = false;

        this.boundOnClickOutside = this.onClickOutside.bind(this);

        this.init();
    }

    /**
     * Назначает обработчики на все триггеры.
     * @private
     */
    init() {
        this.triggers.forEach(({ element }) => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.isOpen && this.currentTrigger === element) {
                    this.close();
                } else {
                    this.open(element);
                }
            });
        });
    }

    /**
     * Открывает меню и применяет стили в зависимости от триггера.
     * @param {HTMLElement} trigger
     */
    open(trigger) {
        this.menu.style.display = 'block';
        this.isOpen = true;
        this.currentTrigger = trigger;

        const styleObj = this.triggers.find((t) => t.element === trigger)?.style || {};
        Object.assign(this.menu.style, styleObj);

        setTimeout(() => {
            document.addEventListener('click', this.boundOnClickOutside);
        });
    }

    /**
     * Закрывает меню и сбрасывает состояния и стили.
     */
    close() {
        this.menu.style.display = 'none';
        this.isOpen = false;
        this.currentTrigger = null;

        // Сброс всех кастомных стилей
        this.triggers.forEach(({ style }) => {
            for (const key in style) {
                this.menu.style[key] = '';
            }
        });

        document.removeEventListener('click', this.boundOnClickOutside);
    }

    /**
     * Закрывает меню при клике вне меню и вне триггеров.
     * @param {MouseEvent} event
     * @private
     */
    onClickOutside(event) {
        const clickedInsideMenu = this.menu.contains(event.target);
        const clickedOnTrigger = this.triggers.some(({ element }) => element.contains(event.target));

        if (!clickedInsideMenu && !clickedOnTrigger) {
            this.close();
        }
    }
}
