// ==================== 전역 변수 ====================
const userData = {
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    step1Emotion: '', // 1-5 중 하나
    step1EmotionName: '', // 슬픔, 분노, 무감각, 설렘, 불안
    step2Reason: '',
    intensity: 20,
    direction: '', // 증폭, 완화, 전환
    transformEmotion: '', // 전환 시 선택한 감정
    finalEmotion: '' // 최종 감정 (알약 및 메시지용)
};

// 감정 매핑 데이터
// 알약 순서: pill_01(기쁨) / pill_02(설렘) / pill_03(슬픔) / pill_04(분노) / pill_05(불안) / pill_06(혼란) / pill_07(피로) / pill_08(무감각)
// circle 이미지: circle_1(기쁨) / circle_2(설렘) / circle_3(슬픔) / circle_4(분노) / circle_5(불안) / circle_6(혼란) / circle_7(피로) / circle_8(무감각)
const emotionData = {
    '복잡함': {
        mainEmotion: '슬픔',
        code: 'sadness',
        step2Options: [
            { value: 'disappointed', text: '기대했던 일이<br>무산되거나 잘 되지 않았어요.', image: 'circle_3.png' },
            { value: 'self-blame', text: '스스로를<br>자책하게 됐어요.', image: 'circle_5.png' },
            { value: 'distance', text: '관계에서<br>거리감이 느껴졌어요.', image: 'circle_3.png' },
            { value: 'alone', text: '감정이 너무 깊어져서<br>혼자 있고 싶었어요.', image: 'circle_8.png' }
        ],
        transform: [
            { value: '혼란', text: '혼란: 감정의 깊이를 다른 형태로 살펴 보세요.' },
            { value: '무감각', text: '무감각: 모든 감정을 잠시 멈춰도 괜찮아요.' },
            { value: '기쁨', text: '기쁨: 어둠 속에서도 작은 빛을 피워 봐요.' }
        ],
        pills: ['pill_07', 'pill_03', 'pill_06']  // 피로, 슬픔, 혼란
    },
    '짜증남': {
        mainEmotion: '분노',
        code: 'anger',
        step2Options: [
            { value: 'unfair', text: '누군가의 말이나 행동이<br>부당하게 느껴졌어요.', image: 'circle_4.png' },
            { value: 'no-result', text: '노력한 만큼의<br>결과가 나오지 않았어요.', image: 'circle_7.png' },
            { value: 'repeat', text: '반복되는 상황이<br>답답했어요.', image: 'circle_5.png' },
            { value: 'no-express', text: '내 감정을 제대로<br>표현할 수 없었어요.', image: 'circle_4.png' }
        ],
        transform: [
            { value: '슬픔', text: '슬픔: 분노 속 상처를 들여다보신 적 있나요?' },
            { value: '피로', text: '피로: 피로감도 하나의 해방이 될 수 있어요.' },
            { value: '불안', text: '불안: 분노가 가라앉은 자리에 남은 불안을 살펴 보세요.' }
        ],
        pills: ['pill_05', 'pill_06', 'pill_04']  // 불안, 혼란, 분노
    },
    '혼란스러움': {
        mainEmotion: '무감각',
        code: 'numb',
        step2Options: [
            { value: 'too-much', text: '감정이 너무 많아서<br>아무것도 느껴지지 않았어요.', image: 'circle_6.png' },
            { value: 'routine', text: '반복되는 일상에 익숙해져서<br>무뎌졌어요.', image: 'circle_8.png' },
            { value: 'unclear', text: '스스로의 감정이<br>잘 구분되지 않았어요.', image: 'circle_6.png' },
            { value: 'exhausted', text: '몸도 마음도<br>다 지쳐버린 느낌이에요.', image: 'circle_7.png' }
        ],
        transform: [
            { value: '슬픔', text: '슬픔: 감정의 회복은 때때로 눈물을 동반하죠.' },
            { value: '혼란', text: '혼란: 조용한 마음 속 다시 파동을 일으켜요.' },
            { value: '설렘', text: '설렘: 새로운 시작의 설렘을 되찾을 시간이에요.' }
        ],
        pills: ['pill_07', 'pill_03', 'pill_08']  // 피로, 슬픔, 무감각
    },
    '설렘': {
        mainEmotion: '설렘',
        code: 'excitement',
        step2Options: [
            { value: 'new-person', text: '새로운 사람이나 일을 만나서<br>기분이 새로웠어요.', image: 'circle_2.png' },
            { value: 'long-time', text: '오랜만에 나를 설레게 하는<br>일이 있었어요.', image: 'circle_1.png' },
            { value: 'different', text: '평소와 다른 분위기나 공간이<br>자극이 되었어요.', image: 'circle_2.png' },
            { value: 'special', text: '작지만 특별한 순간이<br>기억에 남았어요.', image: 'circle_1.png' }
        ],
        transform: [
            { value: '기쁨', text: '기쁨: 설렘의 파동을 따뜻한 기쁨의 안정으로 바꿔 봐요.' },
            { value: '불안', text: '불안: 적당한 긴장감은 새로운 방향을 볼 수 있는 길이에요.' },
            { value: '혼란', text: '혼란: 감정의 떨림이 어디로 향하는지 점검할 시간이에요.' }
        ],
        pills: ['pill_02', 'pill_01', 'pill_08']  // 설렘, 기쁨, 무감각
    },
    '불안함': {
        mainEmotion: '불안',
        code: 'anxiety',
        step2Options: [
            { value: 'uncertain', text: '내 생각이나 행동이<br>맞는지 확신이 없었어요.', image: 'circle_5.png' },
            { value: 'unpredictable', text: '상황이 예측되지 않아서<br>마음이 불안했어요.', image: 'circle_5.png' },
            { value: 'others', text: '다른 사람의 반응이나 시선이<br>신경 쓰였어요.', image: 'circle_6.png' },
            { value: 'thoughts', text: '해야 할 일들이<br>머릿속을 계속 맴돌았어요.', image: 'circle_7.png' }
        ],
        transform: [
            { value: '혼란', text: '혼란: 모든 걸 통제하지 않아도 괜찮아요.' },
            { value: '피로', text: '피로: 긴장된 마음을 잠시 내려놓아 봐요.' },
            { value: '기쁨', text: '기쁨: 불안의 틈에서 새로운 활기를 발견해보세요.' }
        ],
        pills: ['pill_05', 'pill_06', 'pill_04']  // 불안, 혼란, 분노
    }
};

// 최종 감정별 메시지
// 알약 순서: pill_01(기쁨) / pill_02(설렘) / pill_03(슬픔) / pill_04(분노) / pill_05(불안) / pill_06(혼란) / pill_07(피로) / pill_08(무감각)
const emotionMessages = {
    '슬픔-증폭': {
        message: '지금 느끼는 그 슬픔,<br>깊이 느껴도 괜찮아요.',
        pills: ['pill_07', 'pill_03', 'pill_06']  // 피로, 슬픔, 혼란
    },
    '슬픔-완화': {
        message: '슬픔의 무게를 조금씩<br>내려놓아도 괜찮아요.',
        pills: ['pill_07', 'pill_03', 'pill_06']  // 피로, 슬픔, 혼란
    },
    '분노-증폭': {
        message: '지금 느끼는 그 분노,<br>충분히 타당한 감정이에요.',
        pills: ['pill_05', 'pill_06', 'pill_04']  // 불안, 혼란, 분노
    },
    '분노-완화': {
        message: '분노의 열기를 천천히<br>식혀나가도 괜찮아요.',
        pills: ['pill_05', 'pill_06', 'pill_04']  // 불안, 혼란, 분노
    },
    '무감각-증폭': {
        message: '아무것도 느껴지지 않아도,<br>그 또한 하나의 감정이에요.',
        pills: ['pill_07', 'pill_03', 'pill_08']  // 피로, 슬픔, 무감각
    },
    '무감각-완화': {
        message: '무뎌진 감각을 조금씩<br>깨워나가도 괜찮아요.',
        pills: ['pill_07', 'pill_03', 'pill_08']  // 피로, 슬픔, 무감각
    },
    '설렘-증폭': {
        message: '지금 느끼는 그 설렘,<br>마음껏 즐겨도 괜찮아요.',
        pills: ['pill_02', 'pill_01', 'pill_08']  // 설렘, 기쁨, 무감각
    },
    '설렘-완화': {
        message: '설렘을 차분하게<br>음미해도 괜찮아요.',
        pills: ['pill_02', 'pill_01', 'pill_08']  // 설렘, 기쁨, 무감각
    },
    '불안-증폭': {
        message: '지금 느끼는 그 불안,<br>충분히 경계할 만한 신호예요.',
        pills: ['pill_05', 'pill_06', 'pill_04']  // 불안, 혼란, 분노
    },
    '불안-완화': {
        message: '불안한 마음을 조금씩<br>가라앉혀도 괜찮아요.',
        pills: ['pill_05', 'pill_06', 'pill_04']  // 불안, 혼란, 분노
    },
    // 감정 전환 시 선택되는 감정들
    '혼란': {
        message: '혼란스러운 마음,<br>천천히 정리해나가도 괜찮아요.',
        pills: ['pill_05', 'pill_06', 'pill_04']  // 불안, 혼란, 분노
    },
    '무감각': {
        message: '모든 감정을 잠시 멈춰도<br>괜찮아요.',
        pills: ['pill_07', 'pill_03', 'pill_08']  // 피로, 슬픔, 무감각
    },
    '슬픔': {
        message: '슬픔을 느끼고 표현해도<br>괜찮아요.',
        pills: ['pill_07', 'pill_03', 'pill_06']  // 피로, 슬픔, 혼란
    },
    '피로': {
        message: '지친 마음과 몸,<br>충분히 쉬어도 괜찮아요.',
        pills: ['pill_07', 'pill_03', 'pill_08']  // 피로, 슬픔, 무감각
    },
    '기쁨': {
        message: '작은 기쁨의 순간,<br>소중히 간직해도 괜찮아요.',
        pills: ['pill_02', 'pill_01', 'pill_08']  // 설렘, 기쁨, 무감각
    },
    '불안': {
        message: '불안한 마음을 느끼고<br>인정해도 괜찮아요.',
        pills: ['pill_05', 'pill_06', 'pill_04']  // 불안, 혼란, 분노
    },
    '설렘': {
        message: '설렘을 느끼고 즐겨도<br>괜찮아요.',
        pills: ['pill_02', 'pill_01', 'pill_08']  // 설렘, 기쁨, 무감각
    }
};

let currentStep = 0;
let currentQuestionIndex = 0;

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
    document.getElementById('main-header').style.display = 'block';
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
            section.classList.remove('active');
        }
    });
}

function showSection(sectionId) {
    hideAllSections();
    const section = document.getElementById(sectionId);
    if (section) {
        // display는 CSS의 active 클래스로 처리
        section.classList.add('active');
        
        // 헤더 표시/숨김 제어
        const header = document.getElementById('main-header');
        if (sectionId === 'diagnosis-start') {
            header.style.display = 'block';
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
            userData.step1Emotion = this.dataset.value;
            const emotionInfo = emotionData[userData.step1Emotion];
            userData.step1EmotionName = emotionInfo.mainEmotion;
            
            // Step2 옵션 동적으로 업데이트
            updateStep2Options(emotionInfo.step2Options);
            
            // Step4 감정 전환 옵션 동적으로 업데이트
            updateStep4TransformOptions(emotionInfo.transform);
            
            currentQuestionIndex = 1;
            moveQuestionArea();
            updateProcedure();
        });
    });
    
    // 6. Q2 - 감정 원인 선택
    const reasonCircles = document.querySelectorAll('.q2 .select_circle');
    reasonCircles.forEach(circle => {
        circle.addEventListener('click', function() {
            userData.step2Reason = this.dataset.value;
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
                currentQuestionIndex = 4;
                moveQuestionArea();
            } else {
                // 증폭 또는 완화 선택 시 바로 최종 감정 결정
                userData.finalEmotion = userData.step1EmotionName + '-' + userData.direction;
                goToLoading();
            }
        });
    });
    
    // 9. Q4-1 - 감정 전환 옵션은 동적으로 생성되므로 여기서는 설정 안 함
    
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
    if (emotionNameSpan && userData.step1EmotionName) {
        emotionNameSpan.textContent = userData.step1EmotionName;
    }
}

// ==================== Step2 옵션 동적 업데이트 ====================
function updateStep2Options(options) {
    const circleWrap = document.querySelector('.q2 .select_circle_wrap');
    if (!circleWrap) return;
    
    circleWrap.innerHTML = '';
    
    options.forEach(option => {
        const li = document.createElement('li');
        li.className = 'select_circle';
        li.dataset.value = option.value;
        li.innerHTML = `
            <div class="blur_bg"><img src="./images/${option.image}" alt="bg이미지"></div>
            <p>${option.text}</p>
        `;
        
        li.addEventListener('click', function() {
            userData.step2Reason = this.dataset.value;
            currentQuestionIndex = 2;
            moveQuestionArea();
            updateProcedure();
            updateEmotionNameInQ3();
        });
        
        circleWrap.appendChild(li);
    });
}

// ==================== Step4 감정 전환 옵션 동적 업데이트 ====================
function updateStep4TransformOptions(transformOptions) {
    const transformWrap = document.querySelector('.q4_1 .select_transform_wrap');
    if (!transformWrap) return;
    
    transformWrap.innerHTML = '';
    
    transformOptions.forEach(option => {
        const li = document.createElement('li');
        li.className = 'select_transform';
        li.dataset.value = option.value;
        li.innerHTML = `<span>${option.text}</span>`;
        
        li.addEventListener('click', function() {
            const allOptions = document.querySelectorAll('.q4_1 .select_transform');
            allOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            userData.transformEmotion = this.dataset.value;
            userData.finalEmotion = option.value;
            
            setTimeout(() => {
                goToLoading();
            }, 300);
        });
        
        transformWrap.appendChild(li);
    });
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
    
    // 4초 후에 blur_message 디졸브 효과로 표시
    setTimeout(() => {
        const blurMsg = document.querySelector('.blur_message');
        if (blurMsg) {
            blurMsg.style.display = 'flex';
            // display를 먼저 flex로 바꾼 후, 약간의 딜레이를 주고 opacity를 1로 변경
            setTimeout(() => {
                blurMsg.style.opacity = '1';
            }, 50);
        }
    }, 4000);
}

// ==================== 결과 메시지 업데이트 ====================
function updateResultMessage() {
    const messageElement = document.querySelector('.result .message');
    if (!messageElement) return;
    
    const emotionKey = userData.finalEmotion;
    const messageData = emotionMessages[emotionKey];
    
    if (messageData) {
        messageElement.innerHTML = messageData.message;
    } else {
        // 기본 메시지
        messageElement.innerHTML = '지금 느끼는 그 감정,<br>그대로 느껴도 괜찮아요.';
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

const sizeOptions = [100, 120, 180, 250];

function dropRandomPills() {
    const count = 20;
    
    // 최종 감정에 따른 알약 이미지 선택
    const emotionKey = userData.finalEmotion;
    const messageData = emotionMessages[emotionKey];
    let pillImages = [];
    
    console.log('Final Emotion:', emotionKey); // 디버깅용
    console.log('Message Data:', messageData); // 디버깅용
    
    if (messageData && messageData.pills) {
        pillImages = messageData.pills.map(pillName => ({
            src: `./images/${pillName}.svg`,
            xScale: 1.0,
            yScale: 1.0
        }));
    } else {
        // 기본 알약 (pill_01~08 중에서)
        pillImages = [
            { src: './images/pill_01.svg', xScale: 1.0, yScale: 1.0 },
            { src: './images/pill_02.svg', xScale: 1.0, yScale: 1.0 },
            { src: './images/pill_03.svg', xScale: 1.0, yScale: 1.0 }
        ];
    }
    
    console.log('Pill Images:', pillImages); // 디버깅용
    
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