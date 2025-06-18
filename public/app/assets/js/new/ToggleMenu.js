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
        this.style = { ...TriggerOptions.defaultStyle };
        this.toggleClass = null;
        this.type = 'toggle'; // по умолчанию
    }

    _initFromObject(options) {
        this.selector = options.selector;
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

    /**
     * Применяет стили к DOM-элементу
     * @param {HTMLElement} element
     */
    applyStyleToElement(element) {
        if (!(element instanceof HTMLElement)) return;

        Object.entries(this.style).forEach(([prop, value]) => {
            element.style[prop] = value;
        });
    }

    hasToggleClass() {
        return typeof this.toggleClass === 'string' && this.toggleClass.trim() !== '';
    }
}

class MenuStore {
    #isOpen = false;
    #customProps = {};

    constructor({ isOpen = false, ...rest } = {}) {
        this.#isOpen = isOpen;
        this.#customProps = rest; // Сохраняем всё остальное
    }

    setOpenState(value) {
        if (typeof value !== 'boolean') {
            console.error('MenuStore: значение должно быть boolean');
            return;
        }
        this.#isOpen = value;
    }

    getOpenState() {
        return this.#isOpen;
    }

    getCustomProp(key) {
        return this.#customProps[key];
    }

    setCustomProp(key, value) {
        this.#customProps[key] = value;
    }
}

class ToggleMenu {
    #menuSelector;
    #innerContentSelector;
    #triggers;
    #menuStore;

    constructor({ menuSelector, triggers, innerContentSelector = null, onOpen = null, onClose = null, menuStore = new MenuStore() }) {
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

        this.#menuStore = menuStore;

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
                const store = this.#menuStore;
                const isOpen = store.getOpenState();

                if (trigger.type === 'open') {
                    if (isOpen) return; // уже открыто — ничего не делать
                    store.setOpenState(true);
                    this._onOpen(trigger, store);
                } else if (trigger.type === 'close') {
                    if (!isOpen) return; // уже закрыто — ничего не делать
                    store.setOpenState(false);
                    this._onClose(trigger, null, store);
                } else if (trigger.type === 'toggle') {
                    const newState = !isOpen;
                    store.setOpenState(newState);

                    if (newState) {
                        this._onOpen(trigger, store);
                    } else {
                        this._onClose(trigger, null, store);
                    }
                }
            });
        });
    }

    _bindOutsideClick() {
        document.addEventListener('click', (event) => {
            const menu = this.getMenuElement();
            if (!menu || !this.#menuStore.getOpenState()) return;

            const clickedOnTrigger = this.#triggers.some((trigger) => {
                const el = document.querySelector(trigger.selector);
                return el && el.contains(event.target);
            });
            if (clickedOnTrigger) return;

            let clickedInsideInner = null;

            if (this.#innerContentSelector) {
                const inner = this.getInnerContentElement();
                clickedInsideInner = inner?.contains(event.target) ?? false;
            }

            this.#menuStore.setOpenState(false);
            this._onClose(null, clickedInsideInner, this.#menuStore);
        });
    }

    _defaultOpen(trigger) {
        const menu = this.getMenuElement();
        if (!menu) return;

        if (trigger?.toggleClass) {
            menu.classList.add(trigger.toggleClass);
        }

        if (trigger?.style) {
            Object.entries(trigger.style).forEach(([prop, value]) => {
                menu.style[prop] = value;
            });
        } else if (!trigger?.toggleClass) {
            menu.style.display = 'block';
        }
    }

    _defaultClose(trigger) {
        const menu = this.getMenuElement();
        if (!menu) return;

        menu.style.cssText = '';

        if (trigger && trigger.toggleClass) {
            menu.classList.remove(trigger.toggleClass);
        } else {
            this.#triggers.forEach((t) => {
                if (t.toggleClass) {
                    menu.classList.remove(t.toggleClass);
                }
            });
        }

        menu.style.display = '';
    }
}
