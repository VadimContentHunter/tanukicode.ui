class TriggerOptions {
    static defaultStyle = { display: 'block' };
    static allowedTypes = ['open', 'close', 'toggle'];

    constructor(options) {
        if (typeof options === 'string') {
            this._initFromString(options);
        } else if (typeof options === 'object' && options !== null) {
            this._initFromObject(options);
        } else {
            throw new TypeError('Trigger must be a string or object');
        }
    }

    _initFromString(selector) {
        this.selector = selector;
        this.innerContentSelector = null;
        this.style = { ...TriggerOptions.defaultStyle };
        this.toggleClass = null;
        this.type = 'toggle'; // по умолчанию
    }

    _initFromObject(options) {
        this.selector = options.selector;
        this.innerContentSelector = options.innerContentSelector ?? null;
        this.style = options.style ? { ...TriggerOptions.defaultStyle, ...options.style } : { ...TriggerOptions.defaultStyle };
        this.toggleClass = options.toggleClass ?? null;
        this.type = this._validateType(options.type);
    }

    _validateType(type) {
        if (TriggerOptions.allowedTypes.includes(type)) {
            return type;
        }
        return 'toggle'; // по умолчанию
    }
}

class ToggleMenu {
    #menuSelector;
    #innerContentSelector;
    #triggers; // массив объектов TriggerOptions
    #isOpen = false;

    constructor({ menuSelector, triggers, innerContentSelector = null, onOpen = null, onClose = null }) {
        if (typeof menuSelector !== 'string') {
            throw new TypeError('menuSelector должен быть строкой');
        }
        this.#menuSelector = menuSelector;

        if (innerContentSelector !== null && typeof innerContentSelector !== 'string') {
            throw new TypeError('innerContentSelector должен быть строкой или null');
        }
        this.#innerContentSelector = innerContentSelector;

        if (!Array.isArray(triggers)) {
            throw new TypeError('triggers должен быть массивом');
        }
        this.#triggers = triggers.map((t) => new TriggerOptions(t));

        // Присваиваем коллбеки или дефолтные методы
        this._onOpen = typeof onOpen === 'function' ? onOpen.bind(this) : this._defaultOpen.bind(this);
        this._onClose = typeof onClose === 'function' ? onClose.bind(this) : this._defaultClose.bind(this);

        this._bindTriggers();
        this._bindOutsideClick();
    }

    getMenuElement() {
        return document.querySelector(this.#menuSelector);
    }

    getInnerContentElement() {
        if (!this.#innerContentSelector) return null;
        return document.querySelector(this.#innerContentSelector);
    }

    _bindTriggers() {
        this.#triggers.forEach((trigger) => {
            const el = document.querySelector(trigger.selector);
            if (!el) return;

            el.addEventListener('click', () => {
                if (trigger.type === 'open') {
                    this._onOpen(trigger);
                    this.#isOpen = true;
                } else if (trigger.type === 'close') {
                    this._onClose(trigger);
                    this.#isOpen = false;
                } else if (trigger.type === 'toggle') {
                    if (this.#isOpen) {
                        this._onClose(trigger);
                        this.#isOpen = false;
                    } else {
                        this._onOpen(trigger);
                        this.#isOpen = true;
                    }
                }
            });
        });
    }

    _bindOutsideClick() {
        document.addEventListener('click', (event) => {
            const menu = this.getMenuElement();
            if (!menu || !this.#isOpen) return;

            if (!menu.contains(event.target)) {
                const clickedOnTrigger = this.#triggers.some((trigger) => {
                    const el = document.querySelector(trigger.selector);
                    return el && el.contains(event.target);
                });

                if (!clickedOnTrigger) {
                    this._onClose(null);
                    this.#isOpen = false;
                }
            }
        });
    }

    // Дефолтная реализация открытия меню
    _defaultOpen(trigger) {
        const menu = this.getMenuElement();
        if (!menu) return;

        if (trigger.toggleClass) {
            menu.classList.add(trigger.toggleClass);
        }

        if (trigger.style) {
            Object.entries(trigger.style).forEach(([prop, value]) => {
                menu.style[prop] = value;
            });
        } else if (!trigger.toggleClass) {
            menu.style.display = 'block';
        }
    }

    // Дефолтная реализация закрытия меню
    _defaultClose(trigger) {
        const menu = this.getMenuElement();
        if (!menu) return;

        menu.style.cssText = '';

        if (trigger && trigger.toggleClass) {
            menu.classList.remove(trigger.toggleClass);
        } else {
            // Если trigger === null, убираем toggleClass у всех триггеров
            this.#triggers.forEach((t) => {
                if (t.toggleClass) {
                    menu.classList.remove(t.toggleClass);
                }
            });
        }

        menu.style.display = '';
    }
}
