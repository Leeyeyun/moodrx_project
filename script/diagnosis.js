window.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('birth_year');
    const monthSelect = document.getElementById('birth_month');
    const daySelect = document.getElementById('birth_day');

    // 년도: 현재년도부터 과거 100년
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 80; y--) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }

    // 월: 01 ~ 12
    for (let m = 1; m <= 12; m++) {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = String(m).padStart(2, '0');
        monthSelect.appendChild(option);
    }

    // 일: 01 ~ 31
    for (let d = 1; d <= 31; d++) {
        const option = document.createElement('option');
        option.value = d;
        option.textContent = String(d).padStart(2, '0');
        daySelect.appendChild(option);
    }
});


// q1에서 card 선택했을 때 다음 질문 넘어감
document.addEventListener('DOMContentLoaded', () => {
    const selectCards = document.querySelectorAll('.select_card');

    selectCards.forEach(card => {
        card.addEventListener('click', () => {
        const questionArea = document.querySelector('.question_area');
        questionArea.style.top = '-100vh'; // 위로 이동
        });
    });
});

// q2에서 card 선택했을 때 다음 질문 넘어감
document.addEventListener('DOMContentLoaded', () => {
    const selectCards = document.querySelectorAll('.select_circle');

    selectCards.forEach(card => {
        card.addEventListener('click', () => {
        const questionArea = document.querySelector('.question_area');
        questionArea.style.top = '-200vh'; // 위로 이동
        });
    });
});

// q3에서 card 선택했을 때 다음 질문 넘어감
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.querySelector('.next_btn_wrap');

    nextBtn.addEventListener('click', () => {
        const questionArea = document.querySelector('.question_area');
        questionArea.style.top = '-300vh'; // 위로 이동
    });
});

// slider 막대기 활성화
const slider = document.querySelector('#slider');

function updateSliderBackground(slider) {
    const val = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #5CBFFF ${val}%, #F5F7FA ${val}%)`;
}

slider.addEventListener('input', () => updateSliderBackground(slider));

// 초기 배경도 설정해줘야 함!
updateSliderBackground(slider);


// q4 질문 선택 후 로딩화면 넘어감
const selectDirection = document.querySelectorAll('.q4 .select_direction');
const diagTest = document.querySelector('.diag_test');
const loading = document.querySelector('.loading');
const result = document.querySelector('.result');
const loadingTxt = document.querySelector('.loading_txt');

function goToLoading() {
    // diag_test 숨기고 loading 보이기
    diagTest.style.display = 'none';
    loading.classList.add('active');

    // 숫자 카운트 시작
    let count = 0;
    let interval = 80;

    function increaseCount() {
        count++;
        loadingTxt.textContent = count;

        // 속도 점점 증가
        if (interval > 5) interval -= 2;

        if (count < 100) {
            setTimeout(increaseCount, interval);
            } else {
            // 100 도달 후 5초 대기
            setTimeout(() => {
                loading.classList.remove('active');
                loading.style.display = 'none';
                result.classList.add('active');
                result.style.display = 'block';

                // result 화면 진입 시 알약 떨어뜨리기
                dropRandomPills(); // <-- 여기에 위치시켜야 타이밍 맞음

            }, 2000);
        }
    }

    setTimeout(increaseCount, interval);
}

// .q4의 3가지 선택지 클릭 시 실행
selectDirection.forEach(btn => {
    btn.addEventListener('click', goToLoading);
});


// Matter.js 기본 설정
const { Engine, Render, World, Bodies, Runner } = Matter;

// 1. 엔진 생성
const engine = Engine.create();
const world = engine.world;

// 2. 렌더링 설정
const render = Render.create({
    element: document.getElementById('pill-canvas'),
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#fefefe'  // 필요시 배경색 변경
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// 3. 바닥과 벽 추가
const ground = Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight + 50,
    window.innerWidth,
    100,
    {
        isStatic: true,
        render: { visible: false }
    }
);

// 왼쪽 벽
const wallLeft = Bodies.rectangle(
    -50,
    window.innerHeight / 2,
    100,
    window.innerHeight * 2,
    {
        isStatic: true,
        render: { visible: false }
    }
);

// 오른쪽 벽
const wallRight = Bodies.rectangle(
    window.innerWidth + 50,
    window.innerHeight / 2,
    100,
    window.innerHeight * 2,
    {
        isStatic: true,
        render: { visible: false }
    }
);

World.add(world, [ground, wallLeft, wallRight]);

const pillImages = [
    './images/pill_03.svg',
    './images/pill_05.svg',
    './images/pill_06.svg',
    './images/pill_08.svg'
];

// 4. 랜덤 원형 알약 생성 함수
const sizeOptions = [100, 120, 180, 250];  // px 단위

function dropRandomPills() {
    const count = 15; // 고정 개수

    for (let i = 0; i < count; i++) {
        const radius = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
        const diameter = radius * 2;

        const x = Math.random() * (window.innerWidth - diameter) + radius;
        const y = -Math.random() * 500;

        const image = pillImages[Math.floor(Math.random() * pillImages.length)];

        const pill = Bodies.circle(x, y, radius, {
            restitution: 0,
            friction: 0.5,
            render: {
                sprite: {
                    texture: image,
                    xScale: diameter / 150,  // 이미지 기준 크기 조정
                    yScale: diameter / 150
                }
            }
        });

        World.add(world, pill);
    }
}