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


// ============================================
// 여기에 이미지 경로들을 입력하세요!
// 배열에 여러 이미지를 넣으면 알약마다 랜덤하게 적용됩니다.
// ============================================
const PILL_IMAGES = [
    './images/pill_01.svg',
    './images/pill_02.svg',
    './images/pill_03.svg',
    // 필요한 만큼 추가하세요
];

// 이미지를 사용하지 않으려면 빈 배열로 두세요: const PILL_IMAGES = [];

// Chart.js 레이더 차트 설정
const chartCtx = document.getElementById("radarChart").getContext("2d");
const emotionLabels = ['기쁨', '설렘', '슬픔', '화남', '불안', '혼란', '무감각', '피로'];
const emotionValues = [80, 70, 50, 60, 45, 55, 35, 40]; // 고정된 값

let radarChart;

function createChart(animated = true) {
    if (radarChart) {
        radarChart.destroy();
    }
    
    radarChart = new Chart(chartCtx, {
        type: 'radar',
        data: {
            labels: emotionLabels,
            datasets: [{
                label: '감정 분포',
                data: emotionValues,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                pointRadius: 6,  // 5 → 6
                pointHoverRadius: 8,  // 7 → 8
                borderWidth: 3  // 2 → 3
            }]
        },
        options: {
            responsive: false,
            animation: {
                duration: animated ? 1500 : 0,
                easing: 'easeOutQuart'
            },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 25,
                        backdropColor: 'transparent',
                        font: {
                            size: 13  // 11 → 13
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 15,  // 13 → 15
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: '#ddd'
                    },
                    angleLines: {
                        color: '#ccc'
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // 차트 애니메이션이 끝난 후 벽 생성하고 알약 추가
    if (animated) {
        setTimeout(() => {
            updateWalls();
            initPills();
        }, 1600); // 애니메이션 1500ms + 여유 100ms
    } else {
        updateWalls();
        initPills();
    }
}

// Matter.js 물리 엔진 설정
const { Engine, Render, Runner, Bodies, Composite } = Matter;
const worldCanvas = document.getElementById("worldCanvas");

const engine = Engine.create();
const render = Render.create({
    canvas: worldCanvas,
    engine: engine,
    options: {
        width: 700,  // 600 → 700
        height: 700,  // 600 → 700
        background: "transparent",
        wireframes: false
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

const centerX = 350, centerY = 350;  // 300 → 350
const maxRadius = 240;  // 200 → 240
let containerWalls = [];
let pills = [];

function getRadarPoints(values) {
    return values.map((val, i) => {
        const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;
        const r = (val / 100) * maxRadius;
        return {
            x: centerX + r * Math.cos(angle),
            y: centerY + r * Math.sin(angle)
        };
    });
}

function updateWalls() {
    const points = getRadarPoints(emotionValues);

    // 기존 벽 제거
    containerWalls.forEach(w => Composite.remove(engine.world, w));
    containerWalls = [];

    // 새 벽 생성
    for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const b = points[(i + 1) % points.length];
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        const wall = Bodies.rectangle(
            (a.x + b.x) / 2,
            (a.y + b.y) / 2,
            len,
            20,
            { isStatic: true, angle, render: { visible: false } }
        );
        containerWalls.push(wall);
        Composite.add(engine.world, wall);
    }
}

function initPills() {
    // 기존 구슬 제거
    pills.forEach(pill => Composite.remove(engine.world, pill));
    pills = [];

    const useImages = PILL_IMAGES && PILL_IMAGES.length > 0;
    const positions = []; // 이미 생성된 위치 저장

    // 겹치지 않는 위치 찾기 함수
    function findNonOverlappingPosition(size) {
        let attempts = 0;
        let x, y, angle, radius;
        
        while (attempts < 50) { // 최대 50번 시도
            angle = Math.random() * Math.PI * 2;
            radius = Math.random() * maxRadius * 0.4;
            x = centerX + radius * Math.cos(angle);
            y = centerY + radius * Math.sin(angle);
            
            // 다른 알약들과 거리 체크
            let isOverlapping = false;
            for (let pos of positions) {
                const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                if (distance < size + pos.size + 10) { // 10px 여유 공간
                    isOverlapping = true;
                    break;
                }
            }
            
            if (!isOverlapping) {
                return { x, y };
            }
            
            attempts++;
        }
        
        // 50번 시도해도 안되면 그냥 랜덤 위치 반환
        return { x, y };
    }

    for (let i = 0; i < 9; i++) {
        // 랜덤 크기 생성 (30~50 사이로 더 크게)
        const randomSize = 10 + Math.random() * 20;
        
        // 겹치지 않는 위치 찾기
        const position = findNonOverlappingPosition(randomSize);
        const x = position.x;
        const y = position.y;
        
        // 위치 저장
        positions.push({ x, y, size: randomSize });
        
        // 각 알약마다 랜덤하게 이미지 선택
        let renderOptions;
        if (useImages) {
            const randomImage = PILL_IMAGES[Math.floor(Math.random() * PILL_IMAGES.length)];
            // 물리 바디 크기에 정확히 맞추기
            // SVG 원본 크기가 대략 100px라고 가정하고 계산
            // scale = (물리 바디 지름 * 2) / 원본 이미지 크기
            const scale = (randomSize * 2) / 100;  // 물리 바디에 맞춤
            renderOptions = {
                sprite: {
                    texture: randomImage,
                    xScale: scale,
                    yScale: scale
                }
            };
        } else {
            renderOptions = {
                fillStyle: "rgba(255, 99, 132, 0.85)",
                strokeStyle: "rgba(255, 99, 132, 1)",
                lineWidth: 2
            };
        }

        const pill = Bodies.circle(x, y, randomSize, {
            restitution: 0.8,
            friction: 0.005,
            render: renderOptions
        });
        pills.push(pill);
        Composite.add(engine.world, pill);
    }
}

// 페이지 로드 시 차트 초기화
window.addEventListener('DOMContentLoaded', () => {
    createChart(true);
});