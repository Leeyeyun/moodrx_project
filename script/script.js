const swiper1 = new Swiper('.pill-slide', {
    effect: '',
    // autoplay:{},
    slidesPerView:3,
    centeredSlides: true,
    loop:true,//기본값이 false임
    on: {
    slideChangeTransitionEnd: () => updateSlideStyles(),
    },
    navigation:{
        nextEl:'.pill_pagination .prev_next .swiper-button-next',
        prevEl:'.pill_pagination .prev_next .swiper-button-prev',
    },
    pagination:{
        el:'.whatis .swiper-pagination',//부모 필수
        type:'bullets',//필수작성
    },
});

/* gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
    trigger: ".main_ct",
    start: "top bottom",
    end: "+=1600",
    scrub: true,
    pin: true,
}); */

gsap.registerPlugin(ScrollTrigger);

// pin 메인 섹션
ScrollTrigger.create({
    trigger: ".main_ct",
    start: "top top",
    end: "+=800", // 총 스크롤 길이
    scrub: true,
    pin: true,
});

// 카드2: 스크롤 0 ~ 800px → 위로 올라옴 (카드1 위치에서 멈춤)
gsap.to(".card-img:nth-child(2)", {
    y: -800, // 위로 올라오게
    ease: "none",
    scrollTrigger: {
        trigger: ".main_ct",
        start: "top top",
        end: "+=800",
        scrub: true,
    },
});

window.addEventListener('pageshow', () => {
    ScrollTrigger.refresh(true);
});