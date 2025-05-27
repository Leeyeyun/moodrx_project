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

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
    trigger: ".main_ct",
    start: "top bottom", // 화면에 완전히 들어왔을 때 시작
    end: "+=1600",       // 총 스크롤 길이
    scrub: true,
    pin: true,
});

