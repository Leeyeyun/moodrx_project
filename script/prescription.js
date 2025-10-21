window.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const top = document.querySelector('.top');
    const btm = document.querySelector('.btm');

    const headerHeight = header.offsetHeight;
    const topHeight = top.offsetHeight;

    const availableHeight = window.innerHeight - headerHeight - topHeight;

    btm.style.height = `${availableHeight}px`;
});

const listItems = document.querySelectorAll('.list');
const raderChart = document.querySelector('.rader_chart');
const rightDetail = document.querySelector('.rightDetail');
const contentsWrap = document.querySelector('.contents_wrap');
const d2 = document.querySelector('.d_2');
const rightDetailChildren = rightDetail.children;

let currentSection = 0; // 0: 진단, 1: 처방, 2: 복용


listItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (index === currentSection) return; // 동일한 섹션 클릭 시 무시
        listItems.forEach(li => li.classList.remove('active'));
        item.classList.add('active');

        // 모든 섹션 공통 초기화
        raderChart.style.transition = 'opacity 0.6s ease';
        rightDetail.style.transition = 'opacity 0.6s ease, width 0.6s ease';
        contentsWrap.style.transition = 'opacity 0.6s ease';
        d2.style.transition = 'opacity 0.6s ease, width 0.6s ease';

        // 진단 > 처방
        if (currentSection === 0 && index === 1) {
        raderChart.style.opacity = 0;
        setTimeout(() => {
            for (let child of rightDetailChildren) {
            child.style.opacity = 0;
            child.style.visibility = 'hidden';
            }
        }, 200);
        setTimeout(() => {
            rightDetail.style.opacity = '0';
            rightDetail.style.width = '0';
        }, 700);
        setTimeout(() => {
            raderChart.style.display = 'none';
            rightDetail.classList.add('hidden');
        }, 900);
        setTimeout(() => {
            contentsWrap.style.display = 'flex';
            d2.style.display = 'flex';
            d2.style.width = '45%';
            requestAnimationFrame(() => {
            contentsWrap.style.opacity = 1;
            d2.style.opacity = 1;
            });
        }, 1500);
        }

        // 처방 > 복용
        else if (currentSection === 1 && index === 2) {
        d2.style.width = '0';
        d2.style.opacity = '0';
        }

        // 복용 > 처방
        else if (currentSection === 2 && index === 1) {
        d2.style.display = 'flex';
        setTimeout(() => {
            d2.style.width = '45%';
            d2.style.opacity = '1';
        }, 10);
        }

        // 처방 > 진단
        else if (currentSection === 1 && index === 0) {
        contentsWrap.style.opacity = 0;
        d2.style.opacity = 0;
        setTimeout(() => {
            contentsWrap.style.display = 'none';
            d2.style.display = 'none';
            raderChart.style.display = 'flex';
            rightDetail.classList.remove('hidden');
            rightDetail.style.width = '45%';
            setTimeout(() => {
            raderChart.style.opacity = 1;
            rightDetail.style.opacity = 1;
            for (let child of rightDetailChildren) {
                child.style.opacity = 1;
                child.style.visibility = 'visible';
            }
            }, 10);
        }, 500);
        }

        // 진단 > 복용
        else if (currentSection === 0 && index === 2) {
        raderChart.style.opacity = 0;
        setTimeout(() => {
            for (let child of rightDetailChildren) {
            child.style.opacity = 0;
            child.style.visibility = 'hidden';
            }
        }, 200);
        setTimeout(() => {
            rightDetail.style.opacity = '0';
            rightDetail.style.width = '0';
        }, 700);
        setTimeout(() => {
            raderChart.style.display = 'none';
            rightDetail.classList.add('hidden');
        }, 900);
        }

        // 복용 > 진단
        else if (currentSection === 2 && index === 0) {
        raderChart.style.display = 'flex';
        rightDetail.classList.remove('hidden');
        rightDetail.style.width = '45%';
        setTimeout(() => {
            raderChart.style.opacity = 1;
            rightDetail.style.opacity = 1;
            for (let child of rightDetailChildren) {
            child.style.opacity = 1;
            child.style.visibility = 'visible';
            }
        }, 10);
        }

        currentSection = index;
    });
});

// 콘텐츠 이미지 클릭 시 → 복용(03)으로 전환
const imageSlides = document.querySelectorAll('.swiper-slide .image');

imageSlides.forEach(image => {
    image.addEventListener('click', () => {
        if (currentSection !== 2) {
        listItems[2].click(); // 복용으로 전환
        }
    });
});



// 02 처방 - 작품 슬라이드
const workSwiper = new Swiper('.work-slide', {
    loop: true,
    slidesPerView: 1,
    spaceBetween:20,

    speed: 1000,

    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },
    
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    }
});