// ==================== 전역 변수 ====================
const userData = {
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    emotion: '',
    reason: '',
    intensity: 20,
    direction: '',
    transform: ''
};

let currentStep = 0; // 0: start, 1: info, 2: test, 3: loading, 4: result
let currentQuestionIndex = 0; // 질문 인덱스 (0~3)

// ==================== DOM 로드 후 초기화 ====================
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    populateBirthSelects();
    initializeSlider();
});

// ==================== 페이지 초기화 ====================
function initializePage() {
    // 모든 섹션 숨김
    hideAllSections();
    
    // 시작 페이지만 표시
    showSection('diagnosis-start');
    
    // 헤더는 시작 페이지에서만 표시
    document.getElementById('main-header').style.display = 'flex';
}

// ==================== 섹션 제어 ====================
function hideAllSections() {
    const sections = [
        'diagnosis-start',
        'diagnosis-info',
        'diagnosis-test',
        'diagnosis-loading',
        'diagnosis-result'
    ];
    
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = 'none';
            section.classList.remove('active');
        }
    });
}

function showSection(sectionId) {
    hideAllSections();
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'flex';
        setTimeout(() => {
            section.classList.add('active');
        }, 50);
        
        // 헤더 표시/숨김 제어
        const header = document.getElementById('main-header');
        if (sectionId === 'diagnosis-start') {
            header.style.display = 'flex';
        } else {
            header.style.display = 'none';
        }
    }
}

// ==================== 생년월일 select 채우기 ====================
function populateBirthSelects() {
    const yearSelect = document.getElementById('birth_year');
    const monthSelect = document.getElementById('birth_month');
    const daySelect = document.getElementById('birth_day');
    
    if (!yearSelect || !monthSelect || !daySelect) return;
    
    // 년도 (현재 ~ 80년 전)
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 80; y--) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }
    
    // 월 (01~12)
    for (let m = 1; m <= 12; m++) {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = String(m).padStart(2, '0');
        monthSelect.appendChild(option);
    }
    
    // 일 (01~31)
    for (let d = 1; d <= 31; d++) {
        const option = document.createElement('option');
        option.value = d;
        option.textContent = String(d).padStart(2, '0');
        daySelect.appendChild(option);
    }
}

// ==================== 이벤트 리스너 설정 ====================
function setupEventListeners() {
    // 1. 시작 페이지 -> 정보 입력
    const startBtn = document.getElementById('start-diagnosis-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            showSection('diagnosis-info');
            currentStep = 1;
        });
    }
    
    // 2. 정보 입력 페이지 뒤로가기
    const infoBackBtn = document.getElementById('info-back-btn');
    if (infoBackBtn) {
        infoBackBtn.addEventListener('click', () => {
            showSection('diagnosis-start');
            currentStep = 0;
        });
    }
    
    // 3. 정보 입력 -> 테스트 시작
    const startTestBtn = document.getElementById('start-test-btn');
    if (startTestBtn) {
        startTestBtn.addEventListener('click', () => {
            if (validateUserInfo()) {
                saveUserInfo();
                showSection('diagnosis-test');
                updateUserNameInTest();
                currentStep = 2;
                currentQuestionIndex = 0;
                updateProcedure();
            } else {
                alert('이름과 생년월일을 모두 입력해주세요.');
            }
        });
    }
    
    // 4. 테스트 페이지 뒤로가기
    const testBackBtn = document.getElementById('test-back-btn');
    if (testBackBtn) {
        testBackBtn.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                moveQuestionArea();
                updateProcedure();
            } else {
                showSection('diagnosis-info');
                currentStep = 1;
            }
        });
    }
    
    // 5. Q1 - 감정 카드 선택
    const emotionCards = document.querySelectorAll('.q1 .select_card');
    emotionCards.forEach(card => {
        card.addEventListener('click', function() {
            userData.emotion = this.dataset.value;
            currentQuestionIndex = 1;
            moveQuestionArea();
            updateProcedure();
        });
    });
    
    // 6. Q2 - 감정 원인 선택
    const reasonCircles = document.querySelectorAll('.q2 .select_circle');
    reasonCircles.forEach(circle => {
        circle.addEventListener('click', function() {
            userData.reason = this.dataset.value;
            currentQuestionIndex = 2;
            moveQuestionArea();
            updateProcedure();
            updateEmotionNameInQ3();
        });
    });
    
    // 7. Q3 - 다음 버튼
    const q3NextBtn = document.getElementById('q3-next-btn');
    if (q3NextBtn) {
        q3NextBtn.addEventListener('click', () => {
            currentQuestionIndex = 3;
            moveQuestionArea();
            updateProcedure();
        });
    }
    
    // 8. Q4 - 케어 방향 선택
    const directionCards = document.querySelectorAll('.q4 .select_direction');
    directionCards.forEach(card => {
        card.addEventListener('click', function() {
            userData.direction = this.dataset.value;
            
            if (userData.direction === '전환') {
                // 감정 전환 선택 시 추가 질문 표시
                currentQuestionIndex = 4; // q4_1 표시
                moveQuestionArea();
            } else {
                // 바로 로딩 화면으로
                goToLoading();
            }
        });
    });
    
    // 9. Q4-1 - 감정 전환 옵션 선택
    const transformOptions = document.querySelectorAll('.q4_1 .select_transform');
    transformOptions.forEach(option => {
        option.addEventListener('click', function() {
            transformOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            userData.transform = this.dataset.value;
            
            setTimeout(() => {
                goToLoading();
            }, 300);
        });
    });
    
    // 10. 처방으로 이동
    const goPrescriptionBtn = document.getElementById('go-prescription');
    if (goPrescriptionBtn) {
        goPrescriptionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('moodrx_user_data', JSON.stringify(userData));
            window.location.href = 'prescription.html';
        });
    }
}

// ==================== 질문 영역 이동 ====================
function moveQuestionArea() {
    const questionArea = document.querySelector('.question_area');
    if (questionArea) {
        const moveAmount = -100 * currentQuestionIndex;
        questionArea.style.top = moveAmount + 'vh';
    }
}

// ==================== 진행 표시 업데이트 ====================
function updateProcedure() {
    const nums = document.querySelectorAll('.procedure .num');
    
    nums.forEach((num, index) => {
        num.classList.remove('current', 'completed');
        
        if (index < currentQuestionIndex) {
            num.classList.add('completed');
        } else if (index === currentQuestionIndex) {
            num.classList.add('current');
        }
    });
}

// ==================== 슬라이더 초기화 ====================
function initializeSlider() {
    const slider = document.querySelector('#slider');
    if (!slider) return;
    
    function updateSliderBackground(slider) {
        const val = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #5CBFFF ${val}%, #F5F7FA ${val}%)`;
    }
    
    slider.addEventListener('input', function() {
        userData.intensity = this.value;
        updateSliderBackground(this);
    });
    
    // 초기 배경 설정
    updateSliderBackground(slider);
}

// ==================== 사용자 정보 검증 ====================
function validateUserInfo() {
    const name = document.getElementById('user').value.trim();
    const year = document.getElementById('birth_year').value;
    const month = document.getElementById('birth_month').value;
    const day = document.getElementById('birth_day').value;
    
    return name && year && month && day;
}

// ==================== 사용자 정보 저장 ====================
function saveUserInfo() {
    userData.name = document.getElementById('user').value.trim();
    userData.birthYear = document.getElementById('birth_year').value;
    userData.birthMonth = document.getElementById('birth_month').value;
    userData.birthDay = document.getElementById('birth_day').value;
}

// ==================== 테스트 내 사용자 이름 업데이트 ====================
function updateUserNameInTest() {
    const userNameSpans = document.querySelectorAll('.user-name');
    userNameSpans.forEach(span => {
        span.textContent = userData.name;
    });
}

// ==================== Q3에서 감정 이름 업데이트 ====================
function updateEmotionNameInQ3() {
    const emotionNameSpan = document.querySelector('.q3 .emotion-name');
    if (emotionNameSpan && userData.emotion) {
        emotionNameSpan.textContent = userData.emotion;
    }
}

// ==================== 로딩 시작 ====================
function goToLoading() {
    showSection('diagnosis-loading');
    currentStep = 3;
    
    const loadingTxt = document.querySelector('.loading_txt');
    let count = 0;
    let interval = 80;
    
    function increaseCount() {
        count++;
        if (loadingTxt) {
            loadingTxt.textContent = count;
        }
        
        // 속도 점점 증가
        if (interval > 5) interval -= 2;
        
        if (count < 100) {
            setTimeout(increaseCount, interval);
        } else {
            // 100 도달 후 대기
            setTimeout(() => {
                showResult();
            }, 2000);
        }
    }
    
    setTimeout(increaseCount, interval);
}

// ==================== 결과 표시 ====================
function showResult() {
    showSection('diagnosis-result');
    currentStep = 4;
    
    // Matter.js로 알약 애니메이션 시작
    dropRandomPills();
    
    // 결과 메시지 업데이트
    updateResultMessage();
    
    // 5초 후에 blur_message 부드럽게 표시
    setTimeout(() => {
        const blurMsg = document.querySelector('.blur_message');
        if (blurMsg) {
            blurMsg.style.display = 'flex';
            requestAnimationFrame(() => {
                blurMsg.classList.add('active');
            });
        }
    }, 4000);
}

// ==================== 결과 메시지 업데이트 ====================
function updateResultMessage() {
    const messageElement = document.querySelector('.result .message');
    if (!messageElement) return;
    
    const messages = {
        '복잡함': '지금 느끼는 그 복잡한 감정,<br>차근차근 풀어나가도 괜찮아요.',
        '짜증남': '지금 느끼는 그 짜증,<br>충분히 이해할 수 있어요.',
        '혼란스러움': '혼란스러운 마음,<br>천천히 정리해나가도 괜찮아요.',
        '설렘': '지금 느끼는 그 설렘,<br>마음껏 즐기세요.',
        '불안함': '지금 느끼는 그 불안함,<br>그 감정을 억누르지 않아도 괜찮아요.'
    };
    
    if (userData.emotion && messages[userData.emotion]) {
        messageElement.innerHTML = messages[userData.emotion];
    }
}

// ==================== Matter.js 설정 ====================
const { Engine, Render, World, Bodies, Runner } = Matter;

// 엔진 생성
const engine = Engine.create();
engine.gravity.y = 2;
const world = engine.world;

// 렌더링 설정
const render = Render.create({
    element: document.getElementById('pill-canvas'),
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#fefefe'
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// 바닥과 벽 추가
const ground = Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight + 50,
    window.innerWidth,
    100,
    { isStatic: true, render: { visible: false } }
);

const wallLeft = Bodies.rectangle(
    -50,
    window.innerHeight / 2,
    100,
    window.innerHeight * 2,
    { isStatic: true, render: { visible: false } }
);

const wallRight = Bodies.rectangle(
    window.innerWidth + 50,
    window.innerHeight / 2,
    100,
    window.innerHeight * 2,
    { isStatic: true, render: { visible: false } }
);

World.add(world, [ground, wallLeft, wallRight]);

// 알약 이미지 설정
const pillImages = [
    { src: './images/pill_03.svg', xScale: 1.0, yScale: 1.0 },
    { src: './images/pill_05.svg', xScale: 1.0, yScale: 1.0 },
    { src: './images/pill_06.svg', xScale: 1.0, yScale: 1.0 },
    { src: './images/pill_08.svg', xScale: 1.0, yScale: 1.0 }
];

const sizeOptions = [100, 120, 180, 250];

function dropRandomPills() {
    const count = 15;
    
    for (let i = 0; i < count; i++) {
        const radius = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
        const diameter = radius * 2;
        
        const x = Math.random() * (window.innerWidth - diameter) + radius;
        const y = -Math.random() * 500;
        
        const image = pillImages[Math.floor(Math.random() * pillImages.length)];
        
        const pill = Bodies.circle(x, y, radius, {
            restitution: 0.2,
            friction: 0.5,
            frictionAir: 0.001,
            angle: Math.random() * Math.PI * 2,
            angularVelocity: (Math.random() - 0.5) * 0.2,
            render: {
                sprite: {
                    texture: image.src,
                    xScale: (diameter / 155) * image.xScale,
                    yScale: (diameter / 155) * image.yScale
                }
            }
        });
        
        World.add(world, pill);
    }
}

// ==================== 디버깅용 로그 ====================
console.log('MOODRX Diagnosis Unified Page Loaded');