window.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const top = document.querySelector('.top');
    const btm = document.querySelector('.btm');

    const headerHeight = header.offsetHeight;
    const topHeight = top.offsetHeight;

    const availableHeight = window.innerHeight - headerHeight - topHeight;

    btm.style.height = `${availableHeight}px`;
});

// 알약 제품 슬라이드
const productSwiper = new Swiper('.product-slide', {
    loop: true,
    slidesPerView: 1,
    spaceBetween:20,

    speed: 1000,

/*     autoplay: {
        delay: 3000,
        disableOnInteraction: false
    }, */
    
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    }
});