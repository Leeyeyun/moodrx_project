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


// 카드 애니메이션
const mainCardSection = document.querySelector('.main_card');
const cardImages = document.querySelectorAll('.card_img');

window.addEventListener('scroll', () => {
    const triggerY = mainCardSection.offsetTop;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // main_card 섹션이 화면에 절반 들어왔을 때
    if (scrollY + windowHeight * 0.5 >= triggerY) {
        // 카드를 순서대로 활성화
        cardImages.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('active');
            }, index * 300); // 0ms, 300ms, 600ms
        });
    } else {
        // 스크롤 올라가면 역순으로 active 제거
        cardImages.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('active');
            }, (cardImages.length - 1 - index) * 300); // 600ms, 300ms, 0ms
        });
    }
});


// 레이더 차트 hover 인터랙션
const situationCards = document.querySelectorAll('.situation_card');
const radarImages = document.querySelectorAll('.rader_wrap > img');

situationCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        // 모든 레이더 차트 숨기기
        radarImages.forEach(img => {
            img.style.opacity = '0';
            radarImages[index].style.opacity = '1';
        });
    });
});

// 마우스가 모든 카드를 벗어났을 때 첫 번째 차트로 복귀
const situationList = document.querySelector('.situation_list');
situationList.addEventListener('mouseleave', () => {
    radarImages.forEach(img => {
        img.style.opacity = '0';
        radarImages[0].style.opacity = '1';
    });
});