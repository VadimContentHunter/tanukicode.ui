class Carousel {
    constructor(selector) {
        this.slider = document.querySelector(selector);
        if (!this.slider) return;

        this.list = this.slider.querySelector('.block-carousel-list');
        this.slides = Array.from(this.list.children);
        this.prevBtn = this.slider.querySelector('[data-controls="prev"]');
        this.nextBtn = this.slider.querySelector('[data-controls="next"]');
        this.navButtons = Array.from(this.slider.querySelectorAll('[data-nav]'));

        this.currentIndex = 0;
        this.startX = 0;
        this.currentTranslate = 0;
        this.isDragging = false;

        window.addEventListener('resize', () => this.onResize());

        this.updateVisibleSlides();
        this.init();
    }

    onResize() {
        this.updateVisibleSlides();
        // При ресайзе позицию корректируем без анимации
        this.updateSlider(this.currentIndex, false);
        this.updateNavButtons();
    }

    updateVisibleSlides() {
        const containerWidth = this.slider.clientWidth;
        const slideWidth = this.slides[0].getBoundingClientRect().width;
        this.visibleSlides = Math.floor(containerWidth / slideWidth) || 1;

        // Корректируем currentIndex, чтобы не выйти за пределы
        const maxIndex = Math.max(this.slides.length - this.visibleSlides, 0);
        if (this.currentIndex > maxIndex) {
            this.currentIndex = maxIndex;
        }
    }

    init() {
        this.updateSlider(this.currentIndex);
        this.bindButtons();
        this.bindSwipe();
        this.updateNavButtons();
    }

    updateSlider(index, animate = true) {
        const maxIndex = Math.max(this.slides.length - this.visibleSlides, 0);
        if (index < 0) index = maxIndex;
        if (index > maxIndex) index = 0;
        this.currentIndex = index;

        const slideWidth = this.slides[0].getBoundingClientRect().width;
        this.list.style.transition = animate ? 'transform 0.3s ease' : 'none';
        this.list.style.transform = `translateX(-${slideWidth * this.currentIndex}px)`;

        this.updateNavButtons();
    }

    updateNavButtons() {
        if (this.navButtons.length === 3) {
            const maxIndex = Math.max(this.slides.length - this.visibleSlides, 0);
            const midIndex = Math.floor(maxIndex / 2);

            let activeBtnIndex;
            if (this.currentIndex < midIndex) {
                activeBtnIndex = 0; // первая кнопка — меньше середины
            } else if (this.currentIndex >= midIndex && this.currentIndex < maxIndex) {
                activeBtnIndex = 1; // вторая кнопка — от середины (включительно) до предпоследнего
            } else if (this.currentIndex >= maxIndex) {
                activeBtnIndex = 2; // третья кнопка — последний и далее
            }

            this.navButtons.forEach((btn, i) => {
                btn.classList.toggle('block-carousel-button-active', i === activeBtnIndex);
                btn.setAttribute('aria-current', i === activeBtnIndex ? 'true' : 'false');
            });
        } else {
            this.navButtons.forEach((btn, i) => {
                btn.classList.toggle('block-carousel-button-active', i === this.currentIndex);
                btn.setAttribute('aria-current', i === this.currentIndex ? 'true' : 'false');
            });
        }
    }

    bindButtons() {
        this.prevBtn?.addEventListener('click', () => this.updateSlider(this.currentIndex - 1));
        this.nextBtn?.addEventListener('click', () => this.updateSlider(this.currentIndex + 1));

        if (this.navButtons.length === 3) {
            const maxIndex = Math.max(this.slides.length - this.visibleSlides, 0);
            const midIndex = Math.floor(maxIndex / 2);
            const targets = [0, midIndex, maxIndex];

            this.navButtons.forEach((btn, i) => {
                btn.setAttribute('aria-label', ['Start', 'Middle', 'End'][i]);
                btn.addEventListener('click', () => {
                    this.updateSlider(targets[i]);
                });
            });
        } else {
            this.navButtons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.nav, 10);
                    this.updateSlider(index);
                });
            });
        }
    }

    bindSwipe() {
        this.list.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.list.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.list.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;

        const style = window.getComputedStyle(this.list);
        const matrix = new DOMMatrixReadOnly(style.transform);
        this.currentTranslate = matrix.m41 || 0;

        this.list.style.transition = 'none';
    }

    onTouchMove(e) {
        if (!this.isDragging) return;
        const moveX = e.touches[0].clientX;
        const diff = moveX - this.startX;

        this.list.style.transform = `translateX(${this.currentTranslate + diff}px)`;
    }

    onTouchEnd(e) {
        if (!this.isDragging) return;
        this.isDragging = false;

        this.list.style.transition = 'transform 0.3s ease';

        const endX = e.changedTouches[0].clientX;
        const diff = this.startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0)
                this.updateSlider(this.currentIndex + 1); // влево
            else this.updateSlider(this.currentIndex - 1); // вправо
        } else {
            this.updateSlider(this.currentIndex);
        }
    }
}
