// ==================== 사용자 데이터 로드 ====================
let userData = null;

// localStorage에서 사용자 데이터 불러오기
function loadUserData() {
    const storedData = localStorage.getItem('moodrx_user_data');
    if (storedData) {
        userData = JSON.parse(storedData);
        console.log('Loaded user data:', userData);
        updateUserInfo();
    } else {
        console.warn('No user data found in localStorage');
        // 데이터가 없으면 기본값 설정
        userData = {
            name: '홍길동',
            finalEmotion: '슬픔-증폭',
            step1EmotionName: '슬픔',
            direction: '증폭'
        };
        updateUserInfo();
    }
}

// 사용자 정보를 화면에 표시
function updateUserInfo() {
    // 이름 업데이트
    const userNameElements = document.querySelectorAll('.user_name');
    userNameElements.forEach(el => {
        el.textContent = userData.name;
    });
    
    // Care (케어 방향) 업데이트
    const careElements = document.querySelectorAll('.top_wrap li:nth-child(2) .txt_wrap h4');
    if (careElements.length >= 2) {
        const directionKR = userData.direction; // 증폭, 완화, 전환
        let directionEN = 'Amplify';
        
        if (directionKR === '증폭') directionEN = 'Amplify';
        else if (directionKR === '완화') directionEN = 'Soothe';
        else if (directionKR === '전환') directionEN = 'Transform';
        
        careElements[0].textContent = directionKR;
        careElements[1].textContent = directionEN;
    }
    
    // Target (타겟 감정) 업데이트
    const targetElements = document.querySelectorAll('.top_wrap li:nth-child(3) .txt_wrap h4');
    if (targetElements.length >= 2) {
        const emotionKR = userData.step1EmotionName; // 슬픔, 분노, 무감각, 설렘, 불안
        let emotionEN = 'Sadness';
        
        if (emotionKR === '슬픔') emotionEN = 'Sadness';
        else if (emotionKR === '분노') emotionEN = 'Anger';
        else if (emotionKR === '무감각') emotionEN = 'Numbness';
        else if (emotionKR === '설렘') emotionEN = 'Excitement';
        else if (emotionKR === '불안') emotionEN = 'Anxiety';
        
        targetElements[0].textContent = emotionKR;
        targetElements[1].textContent = emotionEN;
    }
    
    // Prescription 설명 업데이트
    updatePrescriptionText();
}

// 감정에 따른 처방 설명 업데이트
function updatePrescriptionText() {
    const descElement = document.querySelector('.user_result .desc p');
    if (!descElement) return;
    
    const prescriptionTexts = {
        '슬픔-증폭': '슬픔이라는 감정을 더욱 깊이 있게 경험하며, 그 감정 속에서 자신을 이해하고 수용할 수 있도록 시각적 몰입을 유도합니다.',
        '슬픔-완화': '슬픔의 무게를 덜어내고 마음의 평안을 찾을 수 있도록, 부드럽고 따뜻한 시각적 경험을 제공합니다.',
        '분노-증폭': '분노라는 감정을 억누르지 않고 충분히 표현하며, 그 에너지를 건강하게 전환할 수 있도록 강렬한 시각적 자극을 제공합니다.',
        '분노-완화': '분노의 열기를 식히고 차분함을 되찾을 수 있도록, 안정적이고 고요한 시각적 경험을 제공합니다.',
        '무감각-증폭': '무감각 상태를 있는 그대로 받아들이며, 그 속에서 자신을 관찰할 수 있도록 정적이고 명상적인 시각적 경험을 제공합니다.',
        '무감각-완화': '무뎌진 감각을 깨우고 다시 감정을 느낄 수 있도록, 자극적이고 생동감 있는 시각적 경험을 제공합니다.',
        '설렘-증폭': '설렘이라는 감정을 극대화하여 삶의 활력과 기대감을 높일 수 있도록, 역동적이고 화려한 시각적 경험을 제공합니다.',
        '설렘-완화': '과도한 설렘을 안정적인 기쁨으로 전환하며, 차분하면서도 따뜻한 시각적 경험을 제공합니다.',
        '불안-증폭': '불안을 회피하지 않고 직면하며, 그 속에서 경계심과 주의력을 높일 수 있도록 긴장감 있는 시각적 경험을 제공합니다.',
        '불안-완화': '불안한 마음을 진정시키고 안정을 찾을 수 있도록, 평온하고 규칙적인 시각적 경험을 제공합니다.',
        '혼란': '혼란스러운 마음을 정리하고 명료함을 찾을 수 있도록, 구조적이고 균형 잡힌 시각적 경험을 제공합니다.',
        '무감각': '무감각 상태에서 벗어나 다시 감정을 느낄 수 있도록, 자극적이고 생동감 있는 시각적 경험을 제공합니다.',
        '슬픔': '슬픔을 있는 그대로 느끼고 표현하며, 그 과정에서 치유를 경험할 수 있도록 깊이 있는 시각적 경험을 제공합니다.',
        '피로': '지친 마음과 몸을 회복할 수 있도록, 편안하고 부드러운 시각적 휴식을 제공합니다.',
        '기쁨': '기쁨이라는 감정을 온전히 누리고 확장할 수 있도록, 밝고 따뜻한 시각적 경험을 제공합니다.',
        '불안': '불안을 인정하고 다스릴 수 있도록, 안정감 있고 규칙적인 시각적 경험을 제공합니다.',
        '설렘': '설렘을 즐기고 그 에너지를 긍정적으로 활용할 수 있도록, 생동감 넘치는 시각적 경험을 제공합니다.'
    };
    
    const emotionKey = userData.finalEmotion;
    const prescriptionText = prescriptionTexts[emotionKey] || '당신의 감정을 케어하기 위한 맞춤형 시각적 경험을 제공합니다.';
    
    descElement.textContent = prescriptionText;
}

// ==================== 기존 코드 ====================
window.addEventListener('DOMContentLoaded', () => {
    loadUserData(); // 사용자 데이터 먼저 로드
    
    const header = document.querySelector('header');
    const top = document.querySelector('.top');
    const btm = document.querySelector('.btm');

    const headerHeight = header.offsetHeight;
    const topHeight = top.offsetHeight;

    const availableHeight = window.innerHeight - headerHeight - topHeight;

    btm.style.height = `${availableHeight}px`;
});

const listItems = document.querySelectorAll('.list');
const listWrap = document.querySelector('.list_wrap');
const raderChart = document.querySelector('.rader_chart');
const rightDetail = document.querySelector('.rightDetail');
const contentsWrap = document.querySelector('.contents_wrap');
const d2 = document.querySelector('.d_2');
const takingContent = document.querySelector('.taking_content');
const rightDetailChildren = rightDetail ? rightDetail.children : [];

let currentSection = 0; // 0: 진단, 1: 처방, 2: 복용

listItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (index === currentSection) return; // 동일한 섹션 클릭 시 무시
        listItems.forEach(li => li.classList.remove('active'));
        item.classList.add('active');

        // 모든 섹션 공통 초기화
        if (raderChart) raderChart.style.transition = 'opacity 0.6s ease';
        if (rightDetail) rightDetail.style.transition = 'opacity 0.6s ease, width 0.6s ease';
        if (contentsWrap) contentsWrap.style.transition = 'opacity 0.6s ease';
        if (d2) d2.style.transition = 'opacity 0.6s ease, width 0.6s ease';
        if (takingContent) takingContent.style.transition = 'opacity 0.6s ease';
        if (listWrap) listWrap.style.transition = 'all 0.6s ease';

        // 진단 > 처방
        if (currentSection === 0 && index === 1) {
            raderChart.style.opacity = 0;
            
            // d_1 내용만 페이드아웃
            setTimeout(() => {
                for (let child of rightDetailChildren) {
                    if (child.classList.contains('d_1')) {
                        child.style.opacity = 0;
                    }
                }
            }, 200);
            
            setTimeout(() => {
                raderChart.style.display = 'none';
                
                // d_1 숨기기
                const d1 = document.querySelector('.d_1');
                if (d1) d1.style.display = 'none';
                
                // 중앙에 콘텐츠 표시
                contentsWrap.style.display = 'flex';
                d2.style.display = 'flex';
                
                // rightDetail은 계속 보이도록 유지
                rightDetail.style.opacity = 1;
                rightDetail.style.width = '46%';
                
                requestAnimationFrame(() => {
                    contentsWrap.style.opacity = 1;
                    d2.style.opacity = 1;
                });
            }, 700);
        }

        // 처방 > 복용
        else if (currentSection === 1 && index === 2) {
            // 왼쪽 리스트 숨기기
            if (listWrap) {
                listWrap.style.width = '0';
                listWrap.style.padding = '0';
                listWrap.style.opacity = '0';
            }
            
            // d_2 페이드아웃
            if (d2) d2.style.opacity = 0;
            
            setTimeout(() => {
                if (listWrap) listWrap.classList.add('hidden');
                
                // d_2 숨기고 taking_content 표시
                if (d2) d2.style.display = 'none';
                if (takingContent) {
                    takingContent.classList.add('active');
                    takingContent.style.display = 'flex';
                    takingContent.style.width = '46%';
                    
                    requestAnimationFrame(() => {
                        takingContent.style.opacity = 1;
                    });
                }
            }, 600);
        }

        // 복용 > 처방
        else if (currentSection === 2 && index === 1) {
            if (takingContent) takingContent.style.opacity = 0;
            
            setTimeout(() => {
                if (takingContent) {
                    takingContent.style.display = 'none';
                    takingContent.classList.remove('active');
                }
                if (listWrap) {
                    listWrap.classList.remove('hidden');
                    listWrap.style.width = '19%';
                    listWrap.style.padding = '60px';
                    listWrap.style.opacity = '1';
                }
                
                // d2 다시 표시
                if (d2) {
                    d2.style.display = 'flex';
                    d2.style.opacity = 0;
                }
                
                requestAnimationFrame(() => {
                    if (d2) d2.style.opacity = 1;
                });
            }, 600);
        }

        // 처방 > 진단
        else if (currentSection === 1 && index === 0) {
            contentsWrap.style.opacity = 0;
            d2.style.opacity = 0;
            
            setTimeout(() => {
                contentsWrap.style.display = 'none';
                d2.style.display = 'none';
                
                // d_1 다시 표시
                const d1 = document.querySelector('.d_1');
                if (d1) d1.style.display = 'flex';
                
                raderChart.style.display = 'flex';
                
                // rightDetail은 계속 보이도록 유지
                rightDetail.style.opacity = 1;
                rightDetail.style.width = '46%';
                
                setTimeout(() => {
                    raderChart.style.opacity = 1;
                    
                    // d_1 내용 페이드인
                    for (let child of rightDetailChildren) {
                        if (child.classList.contains('d_1')) {
                            child.style.opacity = 1;
                            child.style.visibility = 'visible';
                        }
                    }
                }, 10);
            }, 500);
        }

        // 진단 > 복용
        else if (currentSection === 0 && index === 2) {
            if (raderChart) raderChart.style.opacity = 0;
            if (listWrap) {
                listWrap.style.width = '0';
                listWrap.style.padding = '0';
                listWrap.style.opacity = '0';
            }
            
            // d_1 페이드아웃
            setTimeout(() => {
                for (let child of rightDetailChildren) {
                    if (child.classList.contains('d_1')) {
                        child.style.opacity = 0;
                    }
                }
            }, 200);
            
            setTimeout(() => {
                if (raderChart) raderChart.style.display = 'none';
                if (listWrap) listWrap.classList.add('hidden');
                
                // d_1 숨기기
                const d1 = document.querySelector('.d_1');
                if (d1) d1.style.display = 'none';
                
                // contents_wrap 표시
                if (contentsWrap) {
                    contentsWrap.style.display = 'flex';
                    contentsWrap.style.opacity = 0;
                }
                
                // taking_content 표시
                if (takingContent) {
                    takingContent.classList.add('active');
                    takingContent.style.display = 'flex';
                    takingContent.style.width = '46%';
                    takingContent.style.opacity = 0;
                }
                
                requestAnimationFrame(() => {
                    if (contentsWrap) contentsWrap.style.opacity = 1;
                    if (takingContent) takingContent.style.opacity = 1;
                });
            }, 700);
        }

        // 복용 > 진단
        else if (currentSection === 2 && index === 0) {
            if (takingContent) takingContent.style.opacity = 0;
            if (contentsWrap) contentsWrap.style.opacity = 0;
            
            setTimeout(() => {
                if (takingContent) {
                    takingContent.style.display = 'none';
                    takingContent.classList.remove('active');
                }
                if (contentsWrap) contentsWrap.style.display = 'none';
                
                if (listWrap) {
                    listWrap.classList.remove('hidden');
                    listWrap.style.width = '19%';
                    listWrap.style.padding = '60px';
                    listWrap.style.opacity = '1';
                }
                
                // d_1 다시 표시
                const d1 = document.querySelector('.d_1');
                if (d1) d1.style.display = 'flex';
                
                if (raderChart) raderChart.style.display = 'flex';
                
                // rightDetail은 계속 보이도록 유지
                rightDetail.style.opacity = 1;
                rightDetail.style.width = '46%';
                
                setTimeout(() => {
                    if (raderChart) raderChart.style.opacity = 1;
                    
                    // d_1 내용 페이드인
                    for (let child of rightDetailChildren) {
                        if (child.classList.contains('d_1')) {
                            child.style.opacity = 1;
                            child.style.visibility = 'visible';
                        }
                    }
                }, 10);
            }, 600);
        }

        currentSection = index;
    });
});

// 화살표 버튼 클릭 시 → 처방(02)으로 전환
const nextBtn = document.querySelector('.rader_chart .next_btn button');
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentSection === 0) {
            listItems[1].click(); // 처방으로 전환
        }
    });
}

// 복용 페이지 이전 버튼 클릭 시 → 처방(02)으로 전환
const backBtn = document.querySelector('.taking_content .back_arrow button');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        if (currentSection === 2) {
            listItems[1].click(); // 처방으로 전환
        }
    });
}

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
                pointRadius: 6,
                pointHoverRadius: 8,
                borderWidth: 3
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
                            size: 13
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 15,
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
        }, 1600);
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
        width: 700,
        height: 700,
        background: "transparent",
        wireframes: false
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

const centerX = 350, centerY = 350;
const maxRadius = 240;
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
    const positions = [];

    function findNonOverlappingPosition(size) {
        let attempts = 0;
        let x, y, angle, radius;
        
        while (attempts < 50) {
            angle = Math.random() * Math.PI * 2;
            radius = Math.random() * maxRadius * 0.4;
            x = centerX + radius * Math.cos(angle);
            y = centerY + radius * Math.sin(angle);
            
            let isOverlapping = false;
            for (let pos of positions) {
                const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                if (distance < size + pos.size + 10) {
                    isOverlapping = true;
                    break;
                }
            }
            
            if (!isOverlapping) {
                return { x, y };
            }
            
            attempts++;
        }
        
        return { x, y };
    }

    for (let i = 0; i < 9; i++) {
        const randomSize = 10 + Math.random() * 20;
        const position = findNonOverlappingPosition(randomSize);
        const x = position.x;
        const y = position.y;
        
        positions.push({ x, y, size: randomSize });
        
        let renderOptions;
        if (useImages) {
            const randomImage = PILL_IMAGES[Math.floor(Math.random() * PILL_IMAGES.length)];
            const scale = (randomSize * 2) / 100;
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
window.addEventListener('load', () => {
    createChart(true);
});