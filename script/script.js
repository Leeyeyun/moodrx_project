const pillName = document.querySelector('.pill_txt .pillName');
const pillNameKor = document.querySelector('.pill_txt .pillNameKor');
const pillDesc = document.querySelector('.pill_txt .pill_desc');

const swiper1 = new Swiper('.pill-slide', {
    effect: '',
    autoplay:{},
    slidesPerView:3,
    centeredSlides: true,
    loop:true,//기본값이 false임
    navigation:{
        nextEl:'.pill_pagination .prev_next .swiper-button-next',
        prevEl:'.pill_pagination .prev_next .swiper-button-prev',
    },
    pagination:{
        el:'.whatis .swiper-pagination',//부모 필수
        type:'bullets',//필수작성
    },
});

swiper1.on('slideChange', function () {
    switch (swiper1.realIndex) {
        case 0:
        pillName.textContent = "JOY";
        pillNameKor.textContent = "기쁨";
        pillDesc.textContent = "마음이 가볍고 모든 것이 괜찮게 느껴지는 순간.";
        break;
        case 1:
        pillName.textContent = "TINGLE";
        pillNameKor.textContent = "설렘";
        pillDesc.textContent = "새로운 기대감에 심장이 두근거리고, 앞으로의 순간이 기다려지는 느낌.";
        break;
        case 2:
        pillName.textContent = "SADNESS";
        pillNameKor.textContent = "슬픔";
        pillDesc.textContent = "마음이 무겁고 텅 빈 것처럼 느껴지는, 말로 표현하기 어려운 감정.";
        break;
        case 3:
        pillName.textContent = "ANGER";
        pillNameKor.textContent = "분노";
        pillDesc.textContent = "억울함과 부당함이 휘몰아치며 마음이 뜨겁게 달아오르는 순간.";
        break;
        case 4:
        pillName.textContent = "ANXIETY";
        pillNameKor.textContent = "불안";
        pillDesc.textContent = "무언가 잘못될 것 같은 예상하지 못한 두려움이 엄습하는 기분.";
        break;
        case 5:
        pillName.textContent = "CONFUSION";
        pillNameKor.textContent = "혼란";
        pillDesc.textContent = "모든 것이 뒤섞이고 불확실하게 느껴져 머릿속이 복잡한 상태.";
        break;
        case 6:
        pillName.textContent = "FATIGUE";
        pillNameKor.textContent = "피로";
        pillDesc.textContent = "몸과 마음이 무겁고, 어떤 것도 더 이상 하기 싫은 지친 느낌.";
        break;
        case 7:
        pillName.textContent = "BLANK";
        pillNameKor.textContent = "무감각";
        pillDesc.textContent = "모든 감정이 멈춘 듯 아무것도 느끼고 싶지 않은 공허함.";
        break;
    }
});


/* gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
    trigger: ".main_ct",
    start: "top bottom",
    end: "+=1600",
    scrub: true,
    pin: true,
}); */

/* gsap.registerPlugin(ScrollTrigger); */

// pin 메인 섹션
/* ScrollTrigger.create({
    trigger: ".main_ct",
    start: "top top",
    end: "+=800",
    scrub: true,
    pin: true,
});
 */
// 카드2: 스크롤 0 ~ 800px → 위로 올라옴 (카드1 위치에서 멈춤)
/* gsap.to(".card-img:nth-child(2)", {
    x: -300,
    y: -800,
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
}); */
