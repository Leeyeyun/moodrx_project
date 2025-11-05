// ==================== 사용자 데이터 로드 ====================
let userData = null;

// localStorage에서 사용자 데이터 불러오기
function loadUserData() {
    const storedData = localStorage.getItem('moodrx_user_data');
    if (storedData) {
        userData = JSON.parse(storedData);
        console.log('Loaded user data:', userData);
        updateUserInfo();
        // 레이더 차트 데이터 생성
        generateRadarData();
        // 콘텐츠 데이터베이스 초기화
        initializeContentDatabase();
    } else {
        console.warn('No user data found in localStorage');
        // 데이터가 없으면 기본값 설정
        userData = {
            name: '홍길동',
            finalEmotion: '슬픔-증폭',
            step1EmotionName: '슬픔',
            direction: '증폭',
            intensity: 60
        };
        updateUserInfo();
        generateRadarData();
        initializeContentDatabase();
    }
    
    // 상세 설명 생성은 페이지 로드 후 약간의 딜레이를 주고 실행
    setTimeout(() => {
        generateDetailedDescription();
    }, 500);
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

// 감정에 따른 처방 설명 업데이트 (Prescription 상단 설명)
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
        
        // 전환 감정별 처방 텍스트 (더 간결하고 명확하게)
        '슬픔-전환-혼란': '슬픔에서 벗어나 혼란을 통해 새로운 시각을 발견할 수 있도록, 다층적이고 재해석적인 경험을 제공합니다.',
        '슬픔-전환-무감각': '슬픔을 잠시 내려놓고 무감각 속에서 휴식하며, 내면의 침묵과 잠재력을 발견할 수 있도록 정제된 미학을 제공합니다.',
        '슬픔-전환-피로': '슬픔의 무게를 피로로 전환하여 휴식의 필요성을 인정하고, 회복의 시간을 가질 수 있도록 성찰적 몰입을 유도합니다.',
        '슬픔-전환-기쁨': '슬픔을 딛고 기쁨으로 나아가며, 깊고 지속적인 긍정적 감정을 경험할 수 있도록 밝고 따뜻한 시각적 몰입을 제공합니다.',
        
        '분노-전환-혼란': '분노를 혼란으로 전환하여 새로운 이해와 질서를 찾을 수 있도록, 재해석적 경험을 제공합니다.',
        '분노-전환-무감각': '분노를 내려놓고 무감각 속에서 마음을 비우며, 내면의 평온을 되찾을 수 있도록 정제된 미학을 제공합니다.',
        '분노-전환-피로': '분노의 에너지를 피로로 전환하여 휴식이 필요함을 인식하고, 회복의 시간을 가질 수 있도록 성찰적 경험을 제공합니다.',
        '분노-전환-기쁨': '분노를 극복하고 기쁨으로 전환하며, 긍정적 에너지를 확장할 수 있도록 밝고 따뜻한 시각적 경험을 제공합니다.',
        
        '무감각-전환-혼란': '무감각에서 벗어나 혼란을 통해 감각을 깨우고, 새로운 이해의 출발점을 만들 수 있도록 재해석적 경험을 제공합니다.',
        '무감각-전환-피로': '무감각을 피로로 인식하여 적극적인 휴식을 취하고, 회복의 과정을 시작할 수 있도록 성찰적 몰입을 유도합니다.',
        '무감각-전환-기쁨': '무감각에서 벗어나 기쁨을 발견하며, 다시 감정을 느끼고 삶의 활력을 되찾을 수 있도록 밝은 시각적 경험을 제공합니다.',
        
        '설렘-전환-혼란': '설렘을 혼란으로 전환하여 감정을 정리하고, 명료함을 찾을 수 있도록 구조적이고 균형잡힌 경험을 제공합니다.',
        '설렘-전환-불안': '과도한 설렘을 불안으로 인식하여 감정을 조절하고, 안정을 되찾을 수 있도록 평온한 시각적 경험을 제공합니다.',
        '설렘-전환-기쁨': '설렘을 지속 가능한 기쁨으로 전환하며, 안정적이고 깊은 긍정적 감정을 경험할 수 있도록 따뜻한 시각적 몰입을 제공합니다.',
        
        '불안-전환-혼란': '불안을 혼란으로 전환하여 감정을 재해석하고, 새로운 관점을 발견할 수 있도록 다층적 경험을 제공합니다.',
        '불안-전환-무감각': '불안을 내려놓고 무감각 속에서 잠시 쉬며, 마음의 평정을 되찾을 수 있도록 정제된 미학을 제공합니다.',
        '불안-전환-피로': '불안을 피로로 인식하여 휴식의 필요성을 받아들이고, 회복의 시간을 가질 수 있도록 성찰적 경험을 제공합니다.',
        '불안-전환-기쁨': '불안을 극복하고 기쁨을 발견하며, 긍정적 감정으로 전환할 수 있도록 밝고 따뜻한 시각적 경험을 제공합니다.',
        
        // 단일 감정 (케어 방향 없이)
        '혼란': '혼란스러운 마음을 정리하고 명료함을 찾을 수 있도록, 구조적이고 균형 잡힌 시각적 경험을 제공합니다.',
        '무감각': '무감각 상태에서 벗어나 다시 감정을 느낄 수 있도록, 자극적이고 생동감 있는 시각적 경험을 제공합니다.',
        '슬픔': '슬픔을 있는 그대로 느끼고 표현하며, 그 과정에서 치유를 경험할 수 있도록 깊이 있는 시각적 경험을 제공합니다.',
        '피로': '지친 마음과 몸을 회복할 수 있도록, 편안하고 부드러운 시각적 휴식을 제공합니다.',
        '기쁨': '기쁨이라는 감정을 온전히 누리고 확장할 수 있도록, 밝고 따뜻한 시각적 경험을 제공합니다.',
        '불안': '불안을 인정하고 다스릴 수 있도록, 안정감 있고 규칙적인 시각적 경험을 제공합니다.',
        '설렘': '설렘을 즐기고 그 에너지를 긍정적으로 활용할 수 있도록, 생동감 넘치는 시각적 경험을 제공합니다.'
    };
    
    // 전환 감정인 경우 키 생성
    let emotionKey = userData.finalEmotion;
    if (userData.direction === '전환' && userData.transformEmotion) {
        emotionKey = `${userData.step1EmotionName}-전환-${userData.transformEmotion}`;
    }
    
    const prescriptionText = prescriptionTexts[emotionKey] || '당신의 감정을 케어하기 위한 맞춤형 시각적 경험을 제공합니다.';
    
    descElement.textContent = prescriptionText;
}

// 처방 페이지 상세 설명 생성 (d_2 페이지)
function generateDetailedDescription() {
    const descElement = document.querySelector('.d_2 .desc p');
    if (!descElement || !userData) return;
    
    const userName = userData.name;
    const targetEmotion = userData.step1EmotionName;
    const direction = userData.direction;
    const intensity = userData.intensity || 60;
    
    // 레이더 차트에서 해당 감정의 수치 가져오기
    const emotionIndex = emotionLabels.indexOf(targetEmotion);
    const emotionScore = emotionValues[emotionIndex] || 60;
    
    // 감정별 기본 설명 템플릿
    const emotionDescriptions = {
        '슬픔': {
            '증폭': `<span class="user_name">${userName}</span>님은 현재 일상 속에서 슬픔을 깊이 느끼고 계십니다. 슬픔은 ${emotionScore}점으로 측정되었으며, 피로와 혼란이 함께 작용해 감정이 더욱 복잡하게 얽혀있는 상태입니다. 이러한 슬픔을 회피하지 않고 온전히 경험하고자 하는 의지가 감지됩니다. 전반적으로 <span class="user_name">${userName}</span>님은 슬픔이라는 감정을 더 깊이 이해하고, 그 속에서 자신을 발견하고 싶어하는 상태로 해석됩니다.`,
            '완화': `<span class="user_name">${userName}</span>님은 현재 일상 속에서 슬픔을 느끼고 있지만, 그 무게가 점차 부담스러워지고 있습니다. 슬픔은 ${emotionScore}점으로 측정되었으며, 피로와 무감각이 함께 작용해 일상의 활력이 저하된 상태입니다. 슬픔의 감정을 조금씩 내려놓고 마음의 평온을 되찾고 싶어하는 욕구가 관찰됩니다. 전반적으로 <span class="user_name">${userName}</span>님은 슬픔으로부터 벗어나 더 가벼운 마음 상태로 이동하고 싶어하는 상태로 해석됩니다.`,
            '전환': `<span class="user_name">${userName}</span>님은 현재 슬픔이라는 감정에서 벗어나 새로운 감정의 방향을 모색하고 계십니다. 슬픔은 ${emotionScore}점으로 측정되었으며, 이 감정이 고착되지 않고 다른 형태로 변화할 수 있음을 인지하고 계십니다. 전반적으로 <span class="user_name">${userName}</span>님은 슬픔을 딛고 새로운 감정의 영역으로 이동하고 싶어하는 상태로 해석됩니다.`
        },
        '분노': {
            '증폭': `<span class="user_name">${userName}</span>님은 현재 분노라는 감정을 강하게 느끼고 계십니다. 분노는 ${emotionScore}점으로 측정되었으며, 불안과 혼란이 함께 작용해 감정이 격렬하게 표출되고 있는 상태입니다. 이러한 분노를 억압하지 않고 충분히 느끼고자 하는 의지가 감지됩니다. 전반적으로 <span class="user_name">${userName}</span>님은 분노의 에너지를 정당하게 표현하고, 그 정당성을 확인받고 싶어하는 상태로 해석됩니다.`,
            '완화': `<span class="user_name">${userName}</span>님은 현재 분노를 느끼고 있지만, 그 강도가 점차 소진되어가고 있습니다. 분노는 ${emotionScore}점으로 측정되었으며, 이 감정이 오래 지속되면서 피로감도 함께 증가하고 있습니다. 분노의 열기를 식히고 차분함을 되찾고 싶어하는 욕구가 관찰됩니다. 전반적으로 <span class="user_name">${userName}</span>님은 분노로부터 거리를 두고 더 안정적인 마음 상태로 이동하고 싶어하는 상태로 해석됩니다.`,
            '전환': `<span class="user_name">${userName}</span>님은 현재 분노라는 감정을 다른 형태로 전환하고자 하는 의지가 있습니다. 분노는 ${emotionScore}점으로 측정되었으며, 이 에너지를 건설적인 방향으로 재구성할 가능성을 모색하고 계십니다. 전반적으로 <span class="user_name">${userName}</span>님은 분노를 새로운 감정의 원동력으로 활용하고 싶어하는 상태로 해석됩니다.`
        },
        '무감각': {
            '증폭': `<span class="user_name">${userName}</span>님은 현재 무감각한 상태를 경험하고 계십니다. 무감각은 ${emotionScore}점으로 측정되었으며, 피로와 슬픔이 함께 작용해 모든 자극에 대한 반응이 무뎌진 상태입니다. 이러한 무감각을 있는 그대로 받아들이고 그 속에 머물고자 하는 의지가 감지됩니다. 전반적으로 <span class="user_name">${userName}</span>님은 무감각이라는 보호막 속에서 잠시 쉬고 싶어하는 상태로 해석됩니다.`,
            '완화': `<span class="user_name">${userName}</span>님은 현재 무감각한 상태에서 벗어나고 싶어하십니다. 무감각은 ${emotionScore}점으로 측정되었지만, 이 상태가 오래 지속되면서 답답함과 갈증을 느끼고 계십니다. 다시 감각을 깨우고 생동감을 되찾고 싶어하는 욕구가 관찰됩니다. 전반적으로 <span class="user_name">${userName}</span>님은 무감각으로부터 벗어나 다시 감정을 느낄 수 있는 상태로 이동하고 싶어하는 것으로 해석됩니다.`,
            '전환': `<span class="user_name">${userName}</span>님은 현재 무감각한 상태를 다른 감정으로 전환하고자 합니다. 무감각은 ${emotionScore}점으로 측정되었으며, 이 정체된 에너지를 새로운 방향으로 흐르게 하고 싶어하는 의지가 있습니다. 전반적으로 <span class="user_name">${userName}</span>님은 무감각이라는 중립지대에서 벗어나 명확한 감정의 영역으로 이동하고 싶어하는 상태로 해석됩니다.`
        },
        '설렘': {
            '증폭': `<span class="user_name">${userName}</span>님은 현재 일상 속에서 설렘을 느끼고 계십니다. 설렘은 ${emotionScore}점으로 측정되었으며, 기쁨과 함께 작용해 삶의 활력이 높아진 상태입니다. 이러한 설렘을 더욱 크게 키우고 싶어하는 욕구가 감지됩니다. 전반적으로 <span class="user_name">${userName}</span>님은 설렘의 감정을 극대화하여 더욱 역동적인 삶을 살고 싶어하는 상태로 해석됩니다.`,
            '완화': `<span class="user_name">${userName}</span>님은 현재 설렘을 느끼고 있지만, 그 강도가 다소 과도하게 느껴집니다. 설렘은 ${emotionScore}점으로 측정되었으며, 불안이 함께 작용해 감정이 불안정하게 요동치는 상태입니다. 설렘을 차분하게 가라앉히고 안정적인 기쁨으로 전환하고 싶어하는 욕구가 관찰됩니다. 전반적으로 <span class="user_name">${userName}</span>님은 설렘을 더 지속 가능한 형태로 조정하고 싶어하는 상태로 해석됩니다.`,
            '전환': `<span class="user_name">${userName}</span>님은 현재 설렘이라는 감정을 다른 형태로 전환하고자 합니다. 설렘은 ${emotionScore}점으로 측정되었으며, 이 역동적인 에너지를 새로운 방향으로 활용하고 싶어하는 의지가 있습니다. 전반적으로 <span class="user_name">${userName}</span>님은 설렘을 발판 삼아 새로운 감정의 영역으로 확장하고 싶어하는 상태로 해석됩니다.`
        },
        '불안': {
            '증폭': `<span class="user_name">${userName}</span>님은 현재 불안을 강하게 느끼고 계십니다. 불안은 ${emotionScore}점으로 측정되었으며, 혼란과 피로가 함께 작용해 마음이 계속 긴장된 상태입니다. 이러한 불안을 회피하지 않고 직면하고자 하는 의지가 감지됩니다. 전반적으로 <span class="user_name">${userName}</span>님은 불안이라는 신호를 통해 스스로를 더 경계하고 주의깊게 관찰하고 싶어하는 상태로 해석됩니다.`,
            '완화': `<span class="user_name">${userName}</span>님은 현재 불안을 느끼고 있지만, 그 강도가 점차 부담스러워지고 있습니다. 불안은 ${emotionScore}점으로 측정되었으며, 이 감정이 오래 지속되면서 피로감과 무력감이 함께 증가하고 있습니다. 불안을 진정시키고 마음의 평온을 되찾고 싶어하는 욕구가 관찰됩니다. 전반적으로 <span class="user_name">${userName}</span>님은 불안으로부터 벗어나 더 안정적인 마음 상태로 이동하고 싶어하는 상태로 해석됩니다.`,
            '전환': `<span class="user_name">${userName}</span>님은 현재 불안을 다른 감정으로 전환하고자 합니다. 불안은 ${emotionScore}점으로 측정되었으며, 이 긴장된 에너지를 새로운 방향으로 재구성하고 싶어하는 의지가 있습니다. 전반적으로 <span class="user_name">${userName}</span>님은 불안을 딛고 새로운 감정의 영역으로 이동하고 싶어하는 상태로 해석됩니다.`
        }
    };
    
    // 해당 감정과 방향에 맞는 설명 선택
    let description = '';
    if (emotionDescriptions[targetEmotion] && emotionDescriptions[targetEmotion][direction]) {
        description = emotionDescriptions[targetEmotion][direction];
    } else {
        description = `<span class="user_name">${userName}</span>님은 현재 ${targetEmotion}이라는 감정을 경험하고 계십니다. ${targetEmotion}은 ${emotionScore}점으로 측정되었으며, 다양한 감정들이 복합적으로 작용하고 있는 상태입니다. 전반적으로 <span class="user_name">${userName}</span>님은 현재의 감정 상태를 ${direction === '증폭' ? '더욱 깊이 경험하고' : direction === '완화' ? '부드럽게 완화하고' : '새로운 방향으로 전환하고'} 싶어하는 상태로 해석됩니다.`;
    }
    
    descElement.innerHTML = description;
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
            // 슬라이드 자동재생 멈추기
            if (workSwiper && workSwiper.autoplay) {
                workSwiper.autoplay.stop();
            }
            
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
                        // 복용 페이지로 전환 완료 후 콘텐츠 인터랙션 업데이트
                        updateContentInteraction();
                        // 현재 슬라이드에 맞는 콘텐츠 정보 표시
                        updateTakingContentInfo(workSwiper.realIndex);
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
                
                // 슬라이드 자동재생 다시 시작
                if (workSwiper && workSwiper.autoplay) {
                    workSwiper.autoplay.start();
                }
                
                requestAnimationFrame(() => {
                    if (d2) d2.style.opacity = 1;
                    // 처방 페이지로 돌아갈 때 콘텐츠 인터랙션 복구
                    updateContentInteraction();
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
            // 슬라이드 자동재생 멈추기
            if (workSwiper && workSwiper.autoplay) {
                workSwiper.autoplay.stop();
            }
            
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
                    // 복용 페이지로 전환 완료 후 콘텐츠 인터랙션 업데이트
                    updateContentInteraction();
                    // 현재 슬라이드에 맞는 콘텐츠 정보 표시
                    updateTakingContentInfo(workSwiper.realIndex);
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
                    
                    // 진단 페이지로 돌아갈 때 콘텐츠 인터랙션 복구
                    updateContentInteraction();
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

// 복용 페이지 상태에 따라 콘텐츠 클릭 비활성화
function updateContentInteraction() {
    const contentImages = document.querySelectorAll('.swiper-slide .image');
    const hoverSpans = document.querySelectorAll('.swiper-slide .image span');
    // ⭐ 버튼 관련 코드 제거 - 버튼은 항상 보이도록!
    
    if (currentSection === 2) {
        // 복용 페이지: 클릭 및 호버만 비활성화 (버튼은 유지)
        contentImages.forEach(img => {
            img.style.pointerEvents = 'none';
            img.style.cursor = 'default';
        });
        hoverSpans.forEach(span => {
            span.style.display = 'none';
        });
    } else {
        // 처방 페이지: 클릭 및 호버 활성화
        contentImages.forEach(img => {
            img.style.pointerEvents = 'auto';
            img.style.cursor = 'pointer';
        });
        hoverSpans.forEach(span => {
            span.style.display = 'flex';
        });
    }
}


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
    },
    on: {
        slideChange: function() {
            // 복용 페이지에서만 콘텐츠 정보 업데이트
            if (currentSection === 2) {
                updateTakingContentInfo(this.realIndex);
            }
        }
    }
});

// 슬라이드 콘텐츠 동적 생성
function generateSlideContents() {
    const swiperWrapper = document.querySelector('.work-slide .swiper-wrapper');
    if (!swiperWrapper || !contentDatabase || contentDatabase.length === 0) return;
    
    // 기존 슬라이드 제거
    swiperWrapper.innerHTML = '';
    
    // 콘텐츠 데이터로 슬라이드 생성
    contentDatabase.forEach((content, index) => {
        const slide = document.createElement('div');
        slide.className = `swiper-slide w_0${index + 1}`;
        
        slide.innerHTML = `
            <div class="image">
                <img src="${content.image}" alt="${content.title}">
                <span>
                    <strong>해당 콘텐츠<br>복용하기</strong>
                    <img src="./images/capsules.png" alt="복용 아이콘">
                </span>
            </div>
            <div class="work_info">
                <h3 class="contents_title">${content.title}</h3>
                <h4 class="name">${content.type}</h4>
            </div>
        `;
        
        swiperWrapper.appendChild(slide);
    });
    
    // Swiper 업데이트
    if (workSwiper) {
        workSwiper.update();
        workSwiper.slideTo(0, 0); // 첫 슬라이드로 이동
    }
    
    // 슬라이드 이미지 클릭 이벤트 재설정
    setupSlideClickEvents();
}

// 슬라이드 클릭 이벤트 설정
function setupSlideClickEvents() {
    const imageSlides = document.querySelectorAll('.swiper-slide .image');
    
    imageSlides.forEach(image => {
        image.addEventListener('click', () => {
            if (currentSection !== 2) {
                listItems[2].click(); // 복용으로 전환
            }
        });
    });
}


// 감정별 콘텐츠 데이터베이스 (8가지 감정 × 3개 콘텐츠)
const emotionContentsDatabase = {
    '기쁨': {
        prescription: '기쁨이라는 감정이 단순히 밝은 상태를 넘어서, 깊고 지속적인 감정으로 자리잡을 수 있도록 시각적 몰입 유도',
        contents: [
            {
                type: 'Art',
                title: 'Mark Rothko, Untitled (Yellow and Blue)',
                info: 'Oil on canvas, 269 × 178 cm<br>Museum of Fine Arts, Houston Collection',
                image: './images/contents/joycontents_01.jpg',
                caption: '화면은 두 개의 커다란 색면으로 구성되어 있으며, 밝은 노란색과 깊은 파란색이 상하로 배치되어 있다. 작가는 색채를 감정의 직접적인 매개로 사용하며, 물리적 형태나 구체적 이미지 없이 순수한 정서를 전달한다. 노란색은 따뜻함과 확산의 감정을, 파란색은 깊이와 안정의 감정을 상징한다. 두 색의 접점에서는 미세한 진동이 발생하며, 시각적 리듬이 감정의 상승을 유도한다. 작품은 기쁨을 외부 자극이 아닌 내면의 감각적 에너지로 인식하게 한다.'
            },
            {
                type: 'Exhibit',
                title: '히무로 유리: 오늘의 기쁨',
                info: '그라운드시소 한남<br>2025.10.03 ~2025.11.30',
                image: './images/contents/joycontents_02.jpg',
                caption: '전시는 일상의 평범한 순간들을 밝고 환한 색채로 담아낸다. 보는 이로 하여금 사소한 행복을 재발견하게 만들며, 공간 전체에 퍼지는 희망과 따스함이 마음을 맑게 씻어낸다. 삶의 기쁨이 우리의 곁에 늘 존재한다는 믿음을 선물한다.'
            },
            {
                type: 'Movie',
                title: '위플래쉬 Whiplash',
                info: '2014.01.16<br>데이미언 셔젤 Damien Chazelle',
                image: './images/contents/joycontents_03.jpg',
                caption: '열정을 잃지 않고 자신의 한계를 돌파하려는 주인공의 모습이 반복되는 노력 끝에 찾아오는 진짜 기쁨을 보여준다. 빠른 리듬과 에너지가 관객까지 끌어올리며, 끝없는 연습이 결실을 맺는 순간의 감격이 인상적이다. 성장통을 지나 마침내 도달한 환희를 체험하게 만든다.'
            }
        ]
    },
    '설렘': {
        prescription: '설렘이라는 감정이 단순히 기대의 상태를 넘어서, 미래에 대한 신뢰가 가득한 경험으로 확대될 수 있도록 감각적 각성 유도',
        contents: [
            {
                type: 'Art',
                title: 'Olafur Eliasson, Your uncertain shadow',
                info: '2010, Installation (light, sensors, projection)<br>Olafur Eliasson Studio',
                image: './images/contents/tinglecontents_01.jpg',
                caption: '작품은 관람자의 움직임에 따라 벽면에 여러 색의 그림자가 투사되도록 설계되어 있다. 빛의 분리와 중첩이 즉각적인 감각적 반응을 유도하며, 관람자는 자신의 존재가 공간 속에서 실시간으로 변형되는 경험을 한다. 작가는 물리적 현상과 감각적 인식의 관계를 탐구하며, \'설렘\'을 감정적 반응이 아닌 지각의 확장으로 제시한다. 빛의 상호작용은 시각적 쾌감을 넘어, 감정이 순간적으로 생성되고 변화하는 과정을 보여준다.'
            },
            {
                type: 'Exhibit',
                title: '파라오의 이집트, 빛으로 깨어난 고대 문명',
                info: '빛의 시어터<br>2025.05.01 ~2025.11.30',
                image: './images/contents/tinglecontents_02.jpg',
                caption: '나일강 유역을 따라 펼쳐지는 고대 이집트의 신비로운 세계가 빛과 음악으로 되살아난다. 피라미드와 파라오의 무덤, 황금 유물들이 거대한 공간을 가득 메우며 관람객을 몰입감 깊은 예술 경험으로 인도한다. 미지의 문명 속에서 느끼는 경탄과 설렘이 시간을 초월해 전해진다.'
            },
            {
                type: 'Place',
                title: '익선동 골목길',
                info: '',
                image: './images/contents/tinglecontents_03.jpg',
                caption: '구불구불한 골목길을 따라 걷는 발걸음마다 앳된 설렘이 피어난다. 옛집과 현대적인 가게들이 어우러져, 익숙함과 새로움이 교차한다. 참신한 발견과 조용한 설렘이 일상을 환기시키는 곳이다.'
            }
        ]
    },
    '슬픔': {
        prescription: '슬픔이라는 감정을 단순히 부정적인 상태를 넘어서, 성찰과 치유로 나아가는 과정으로 받아들일 수 있도록 감정적 공명 유도',
        contents: [
            {
                type: 'Art',
                title: 'Edward Hopper, Nighthawks',
                info: 'Oil on canvas, 84.1 × 152.4 cm<br>Art Institute of Chicago Collection',
                image: './images/contents/sadnesscontents_01.jpg',
                caption: '작품은 밤의 도시 속 식당 내부를 묘사한다. 네 명의 인물은 서로 마주보고 있으나 대화를 나누지 않는다. 강한 조명 아래 인물들의 고립감이 강조되며, 관람자는 유리창 바깥에서 내부를 바라보는 시점에 위치한다. 작가는 이러한 구도를 통해 도시인의 정서적 고독을 시각적으로 표현하며, 빛과 그림자의 대비가 정적인 긴장감을 형성하며, 슬픔의 감정을 정제된 형태로 전달한다.'
            },
            {
                type: 'Exhibit',
                title: '내 슬픈 전설의 101페이지',
                info: '서울미술관 제 1전시실<br>2025.09.24 ~2026.01.25',
                image: './images/contents/sadnesscontents_02.jpg',
                caption: '작가의 자전적 서사와 여성에 대한 깊은 시선은 아픔, 상실, 그리고 보이지 않는 위로로 이어진다. 섬세한 채색은 슬픔의 결을 따라 흐르고, 관람자는 자신의 내면을 차분히 마주하게 된다. 이 전시는 슬픔을 감추는 대신, 살아가는 과정의 일부로 받아들인다.'
            },
            {
                type: 'Place',
                title: '망원 한강공원',
                info: '',
                image: './images/contents/sadnesscontents_03.jpg',
                caption: '평평한 강변에 앉으면 도심의 소음이 잦아들고, 마음속 슬픈 감정과 조용히 마주할 수 있다. 저녁 무렵 물결 위로 비치는 빛이 잔잔하게 위로를 전한다. 이 곳의 고요는 무언의 슬픔마저 자연스럽게 풀어내게 한다.'
            }
        ]
    },
    '분노': {
        prescription: '분노라는 감정이 단순히 파괴적인 상태를 넘어서, 변화와 성장을 향한 에너지로 재해석될 수 있도록 미적 표현 유도',
        contents: [
            {
                type: 'Art',
                title: 'Francis Bacon, Study after Velázquez\'s Portrait of Pope Innocent X',
                info: 'Oil on canvas, 152 × 118 cm<br>Des Moines Art Center Collection',
                image: './images/contents/angercontents_01.jpg',
                caption: '작품은 디에고 벨라스케스의 \'교황 인노첸시오 10세 초상\'을 재해석한 것이다. 원작의 권위적 인물상은 베이컨의 붓 아래서 극단적으로 왜곡된 형상으로 변형된다. 인물은 절규하듯 입을 벌리고 있으며, 세로 방향으로 흘러내린 붓자국이 화면 전체를 흔들고 있다. 작가는 신체를 뒤틀고 색면을 찢어내듯 표현하여, 내면의 불안과 억눌린 분노를 시각적으로 드러낸다.'
            },
            {
                type: 'Exhibit',
                title: '올해의 작가상 2025',
                info: '국립현대미술관 서울관<br>2025.08.29~2026.02.01',
                image: './images/contents/angercontents_02.jpg',
                caption: '동시대 한국 미술의 현재를 보여주는 전시로, 사회적 이슈와 개인의 억압된 감정을 예술적으로 표현한 작품들을 만날 수 있다. 전시는 작가들의 날카로운 시선과 저항의 메시지를 통해 분노를 성장의 동력으로 승화시킨다. 서로 다른 목소리가 모여 큰 변화의 흐름을 만든다.'
            },
            {
                type: 'Movie',
                title: '조커 Joker',
                info: '2019.10.02<br>토드 필립스 Todd Phillips',
                image: './images/contents/angercontents_03.jpg',
                caption: '소외와 부당함, 반복되는 모멸 앞에서 차츰 고조되는 분노가 폭발로 이어진다. 조커가 되어가는 과정은 억눌렀던 감정과 사회의 그림자까지 드러낸다. 불편하지만 눈을 뗄 수 없는 몰입감으로, 분노를 외면하지 않고 마주하는 힘을 던진다.'
            }
        ]
    },
    '불안': {
        prescription: '불안이라는 감정이 단순히 두려움의 상태를 넘어서, 새로운 가능성과 변화의 신호로 재인식될 수 있도록 다층적 경험 유도',
        contents: [
            {
                type: 'Art',
                title: 'Yayoi Kusama, Infinity Mirror Rooms',
                info: 'Mixed media installation',
                image: './images/contents/anxietycontents_01.jpg',
                caption: '작품은 거울과 빛을 이용하여 공간의 경계를 무한히 확장한다. 그 공간 속에서 관람자는 자신의 형상이 무수히 반사되는 장면 속에서 방향 감각을 상실하게 된다. 작가는 강박과 불안의 감정을 반복과 반사 구조로 전환하며, 시각적 환영을 통해 내면의 상태를 외부화한다. 끝없이 이어지는 공간은 불안의 순환 구조를 상징하고, 동시에 몰입과 해소의 이중적 경험을 유도한다.'
            },
            {
                type: 'Exhibit',
                title: '제13회 서울미디어시티비엔날레: 강령, 영혼의 기술',
                info: '서울시립미술관<br>2025.08.26 ~2025.11.23',
                image: './images/contents/anxietycontents_02.jpg',
                caption: '영적 세계와 현실의 경계에서 느끼는 불안과 긴장이 전시 전반에 흐른다. 미래에 대한 두려움과 기대가 복합적으로 어우러진 미디어 아트 작품들이 관람객의 내면을 흔들며 사고의 깊이를 확장한다. 불안이 곧 새로운 가능성임을 깨닫게 한다.'
            },
            {
                type: 'Place',
                title: '서울로7017 - 야간 산책',
                info: '',
                image: './images/contents/anxietycontents_03.jpg',
                caption: '야간의 고가 보행로는 도시의 개방감과 고립감을 동시에 전달한다. 아래로 보이는 도심의 불빛과 위로 솟은 빌딩 구조가 시각적 대비를 이루며 긴장된 분위기를 형성한다. 걷는 행위는 불안의 감각을 물리적 움직임으로 치환하며, 시야의 변화를 통해 정서적 이완을 유도한다. 해당 공간은 감정의 진폭을 인식하고 조절하는 경험을 제공한다.'
            }
        ]
    },
    '혼란': {
        prescription: '혼란이라는 감정이 단순히 불명확한 상태를 넘어서, 새로운 질서와 이해의 출발점이 될 수 있도록 재해석적 경험 유도',
        contents: [
            {
                type: 'Art',
                title: 'Jackson Pollock, Number 1A, 1948',
                info: 'Enamel and oil on canvas, 172.7 × 264.2 cm<br>Museum of Modern Art, New York',
                image: './images/contents/confusioncontents_01.jpg',
                caption: '작품은 캔버스 전체에 무작위로 흩뿌려진 선, 점, 물감의 흐름으로 구성되어 있다. 작가는 행위의 즉흥성과 통제의 경계에서 감정의 혼란을 시각화한다. 표면의 밀도는 복잡하지만, 리듬과 방향성이 내재되어 있어 혼란 속의 질서를 암시한다. 작품은 감정의 폭발이 아닌, 내면의 불안정한 구조를 인식하게 한다. 해당 작품은 혼란의 감정이 파괴적이기보다 창조적 에너지로 작용함을 보여준다.'
            },
            {
                type: 'Exhibit',
                title: '스토리지 스토리 : 또 다른 이야기',
                info: '서울시립 사진미술관<br>2025.10.16 ~2025.11.23',
                image: './images/contents/confusioncontents_02.jpg',
                caption: '사진 아카이브와 기억의 층위를 탐색하며 현실과 기록 사이의 경계를 흐린다. 혼돈은 부정적이지 않으며, 감각과 인식의 재구성을 촉진하는 출발점으로 제시된다. 이 전시는 새로운 사고와 감정의 틀을 모색하는 중요한 기회를 제공한다.'
            },
            {
                type: 'Place',
                title: '남산오르미',
                info: '',
                image: './images/contents/confusioncontents_03.jpg',
                caption: '서울 한복판에서 오르막과 내리막, 예기치 않은 굴곡이 가득한 길. 나아가는 방향을 알 수 없는 순간마다 심리적 혼란이 물리적 감각으로 분출된다. 길 끝에서 세상이 다르게 보이는, 혼돈에서 시작되는 새로운 감각을 선사하는 공간이다.'
            }
        ]
    },
    '피로': {
        prescription: '피로라는 감정이 단순히 고갈의 상태를 넘어서, 휴식과 회복이 갖는 의미를 깊이 있게 체감할 수 있도록 성찰적 몰입 유도',
        contents: [
            {
                type: 'Art',
                title: 'Chiharu Shiota, The Key in the Hand',
                info: 'Installation (keys, red yarn, boats)<br>Venice Biennale Japan Pavilion',
                image: './images/contents/fatiguecontents_01.jpg',
                caption: '작품은 수천 개의 열쇠를 붉은 실로 엮어 천장에 매단 대형 설치 작업이다. 해당 작업에서 작가는 기억과 시간, 관계의 무게를 상징하는 오브제를 통해 심리적 누적을 시각화한다. 실의 복잡한 구조는 피로한 정신 상태를 연상시키지만, 동시에 감정의 연결과 해소를 상징한다. 관람자는 얽힌 구조물 아래를 걸으며, 피로가 단순한 소진이 아니라 기억의 집적임을 인식하게 된다.'
            },
            {
                type: 'Exhibit',
                title: 'Mark Bradford: Keep Walking',
                info: '아모레퍼시픽미술관<br>2025.08.01~2026.01.25',
                image: './images/contents/fatiguecontents_02.jpg',
                caption: '중첩과 반복의 텍스처가 도시 생활과 인간의 피로를 상징적으로 담아낸다. 전시는 욕망과 지친 현실 속에서 멈추지 않는 현대인의 모습을 그리며, 무게감과 동시에 회복의 가능성을 제시한다. 관람은 피로를 인식하고 치유로 나아가는 여정이다.'
            },
            {
                type: 'Movie',
                title: '노매드랜드 Nomadland',
                info: '2020.09.11<br>클로이 자오 Chloé Zhao',
                image: './images/contents/fatiguecontents_03.jpg',
                caption: '쉼 없이 이동하고 떠도는 삶은 피로와 단절의 연속이다. 매 장면마다 반복되는 고단함이 누적되어, 결국 인간다운 쉼과 연대의 소중함을 일깨워준다. 피곤하지만 다시 길을 나서는 용기가 조용히 녹아든 영화를 통해 피로를 받아들인다.'
            }
        ]
    },
    '무감각': {
        prescription: '무감각이라는 감정이 단순히 공허한 상태를 넘어서, 내면의 침묵과 잠재력을 발견하는 기회가 될 수 있도록 정제된 미학 유도',
        contents: [
            {
                type: 'Art',
                title: 'On Kawara, Date Paintings',
                info: 'Gouache on canvas',
                image: './images/contents/blankcontents_01.jpg',
                caption: '작품은 특정한 날짜만이 새겨진 단색 화면으로 구성되어 있다. 작가는 매일 날짜를 기록하는 행위를 통해 "존재의 확인"과 "시간의 흐름"을 시각화한다. 화면에는 감정적 표현이 완전히 배제되어 있으며, 대신 반복과 규율이 감각의 구조를 이룬다. 색채는 날마다 다르지만 형식은 동일하게 유지되어, 감정의 소멸과 지속이 동시에 느껴진다. 작가의 방식은 무감각을 공허로 규정하지 않고, 의식의 절제와 존재의 지속성을 탐구하는 행위로 제시한다.'
            },
            {
                type: 'Exhibit',
                title: '전국광: 쌓는 친구, 허무는 친구',
                info: '서울시립 남서울미술관<br>2025.09.24 ~2026.02.22',
                image: './images/contents/blankcontents_02.jpg',
                caption: '정제된 미니멀리즘과 반복적 구조로 무감각과 공허함, 그리고 내면의 침묵을 주제로 한다. 공간 전체가 감정의 결핍과 그 너머의 잠재력을 표현하며, 관람자에게 무감각이 내포하는 미묘함을 경험시키는 전시다. 이러한 관람 경험은 예술을 통해 다시 감각을 깨운다.'
            },
            {
                type: 'Movie',
                title: '사랑도 통역이 되나요? Lost in Translation',
                info: '2004.02.20<br>소피아 코폴라 Sofia Coppola',
                image: './images/contents/blankcontents_03.jpg',
                caption: '익숙하지 않은 도시, 낯선 언어와 풍경 속에서 주인공들은 아무 감정도 느끼지 못하는 무표정함에 빠진다. 반복되는 하루와 멍한 시선, 그리고 묘한 공허는 무감각의 정서를 섬세하게 그려낸다. 그러나 그 침묵의 틈에서 미세한 떨림이 시작된다.'
            }
        ]
    }
};

// 현재 사용자의 감정에 맞는 콘텐츠 가져오기
function getEmotionContents(emotionName) {
    // 전환 감정 처리
    let targetEmotion = emotionName;
    
    // 감정 매핑 (진단에서 사용되는 감정명 -> 콘텐츠 데이터베이스 키)
    const emotionMapping = {
        '슬픔': '슬픔',
        '분노': '분노',
        '무감각': '무감각',
        '설렘': '설렘',
        '불안': '불안',
        '혼란': '혼란',
        '피로': '피로',
        '기쁨': '기쁨'
    };
    
    targetEmotion = emotionMapping[emotionName] || '기쁨';
    
    return emotionContentsDatabase[targetEmotion] || emotionContentsDatabase['기쁨'];
}

// 콘텐츠 정보 데이터베이스 (기존 코드와의 호환성 유지)
let contentDatabase = [];

// 사용자 감정에 맞는 콘텐츠로 초기화
function initializeContentDatabase() {
    if (!userData) return;
    
    let targetEmotion = userData.step1EmotionName;
    
    // 전환 방향이면 전환된 감정 사용
    if (userData.direction === '전환' && userData.transformEmotion) {
        targetEmotion = userData.transformEmotion;
    }
    
    const emotionData = getEmotionContents(targetEmotion);
    contentDatabase = emotionData.contents;
    
    console.log('Initialized content database for emotion:', targetEmotion);
    console.log('Contents:', contentDatabase);
    
    // 슬라이드 콘텐츠 생성
    setTimeout(() => {
        generateSlideContents();
    }, 100);
}


// 현재 사용자 감정에 맞는 콘텐츠 가져오기
function getCurrentEmotionContents() {
    if (!userData || !userData.step1EmotionName) {
        return emotionContentDatabase['기쁨'].contents; // 기본값
    }
    
    const emotion = userData.step1EmotionName;
    
    // 전환 방향이면 전환된 감정 사용
    if (userData.direction === '전환' && userData.transformEmotion) {
        const transformedEmotion = userData.transformEmotion;
        if (emotionContentDatabase[transformedEmotion]) {
            return emotionContentDatabase[transformedEmotion].contents;
        }
    }
    
    // 해당 감정의 콘텐츠 반환
    if (emotionContentDatabase[emotion]) {
        return emotionContentDatabase[emotion].contents;
    }
    
    // 기본값
    return emotionContentDatabase['기쁨'].contents;
}

// 복용 페이지 콘텐츠 정보 업데이트 함수
function updateTakingContentInfo(slideIndex) {
    const content = contentDatabase[slideIndex];
    if (!content) return;
    
    // Type 업데이트
    const typeElement = document.querySelector('.taking_content .top_wrap li:first-child h4');
    if (typeElement) {
        typeElement.textContent = content.type;
    }
    
    // 작품 정보 업데이트 (contents_info)
    const contentsInfoTitle = document.querySelector('.taking_content .btm_wrap .contents_info h3');
    const contentsInfoText = document.querySelector('.taking_content .btm_wrap .contents_info p');
    
    if (contentsInfoTitle) {
        contentsInfoTitle.textContent = content.title;
    }
    if (contentsInfoText) {
        contentsInfoText.innerHTML = content.info;
    }
    
    // Caption 업데이트
    const captionText = document.querySelector('.taking_content .btm_wrap .caption p');
    if (captionText) {
        captionText.textContent = content.caption;
    }
}

// ==================== 레이더 차트 관련 ====================

// Chart.js 레이더 차트 설정
const chartCtx = document.getElementById("radarChart").getContext("2d");
const emotionLabels = ['기쁨', '설렘', '슬픔', '분노', '불안', '혼란', '무감각', '피로'];

// 감정별 기본 레이더 차트 패턴 (0-100) - 큰 값으로 설정
const emotionPatterns = {
    '슬픔': {
        '기쁨': 35,
        '설렘': 30,
        '슬픔': 90,
        '분노': 45,
        '불안': 60,
        '혼란': 55,
        '무감각': 50,
        '피로': 75
    },
    '분노': {
        '기쁨': 30,
        '설렘': 40,
        '슬픔': 50,
        '분노': 95,
        '불안': 70,
        '혼란': 65,
        '무감각': 35,
        '피로': 60
    },
    '무감각': {
        '기쁨': 25,
        '설렘': 20,
        '슬픔': 55,
        '분노': 35,
        '불안': 45,
        '혼란': 60,
        '무감각': 90,
        '피로': 75
    },
    '설렘': {
        '기쁨': 85,
        '설렘': 95,
        '슬픔': 30,
        '분노': 35,
        '불안': 45,
        '혼란': 40,
        '무감각': 25,
        '피로': 35
    },
    '불안': {
        '기쁨': 40,
        '설렘': 45,
        '슬픔': 55,
        '분노': 60,
        '불안': 90,
        '혼란': 75,
        '무감각': 45,
        '피로': 65
    }
};

// 케어 방향에 따른 조정 (증폭/완화/전환)
function adjustEmotionValues(basePattern, targetEmotion, direction, transformEmotion = null) {
    const adjusted = { ...basePattern };
    
    if (direction === '증폭') {
        // 타겟 감정 강화 (+5), 관련 감정들도 증가
        adjusted[targetEmotion] = Math.min(100, adjusted[targetEmotion] + 5);
        Object.keys(adjusted).forEach(key => {
            if (key !== targetEmotion && key !== '기쁨' && key !== '설렘') {
                adjusted[key] = Math.min(100, adjusted[key] + 3);
            }
        });
    } else if (direction === '완화') {
        // 타겟 감정 감소 (-20), 긍정 감정 증가
        adjusted[targetEmotion] = Math.max(25, adjusted[targetEmotion] - 20);
        adjusted['기쁨'] = Math.min(100, adjusted['기쁨'] + 20);
        adjusted['설렘'] = Math.min(100, adjusted['설렘'] + 15);
    } else if (direction === '전환') {
        // 전환된 감정 강화, 원래 감정 감소
        if (transformEmotion && adjusted[transformEmotion] !== undefined) {
            adjusted[transformEmotion] = Math.min(100, adjusted[transformEmotion] + 25);
            adjusted[targetEmotion] = Math.max(25, adjusted[targetEmotion] - 15);
        }
    }
    
    return adjusted;
}

let emotionValues = [80, 70, 50, 60, 45, 55, 35, 40]; // 기본값
let radarChart;

// 레이더 차트 데이터 생성
function generateRadarData() {
    if (!userData) return;
    
    const targetEmotion = userData.step1EmotionName; // 슬픔, 분노, 무감각, 설렘, 불안
    const direction = userData.direction; // 증폭, 완화, 전환
    const transformEmotion = userData.transformEmotion; // 전환 시 선택한 감정
    
    // 기본 패턴 가져오기
    let basePattern = emotionPatterns[targetEmotion];
    if (!basePattern) {
        // 기본 패턴이 없으면 균형잡힌 패턴 사용
        basePattern = {
            '기쁨': 60,
            '설렘': 55,
            '슬픔': 50,
            '분노': 45,
            '불안': 50,
            '혼란': 50,
            '무감각': 40,
            '피로': 55
        };
    }
    
    // 방향에 따라 조정
    const adjustedPattern = adjustEmotionValues(basePattern, targetEmotion, direction, transformEmotion);
    
    // 배열로 변환 (emotionLabels 순서에 맞춰)
    emotionValues = emotionLabels.map(label => adjustedPattern[label] || 50);
    
    console.log('Generated radar data:', emotionValues);
}

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

// ==================== Matter.js 물리 엔진 설정 ====================

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

// 감정별 알약 이미지 매핑
const emotionPillMapping = {
    '슬픔': ['./images/pill_07.svg', './images/pill_03.svg', './images/pill_06.svg'], // 피로, 슬픔, 혼란
    '분노': ['./images/pill_05.svg', './images/pill_06.svg', './images/pill_04.svg'], // 불안, 혼란, 분노
    '무감각': ['./images/pill_07.svg', './images/pill_03.svg', './images/pill_08.svg'], // 피로, 슬픔, 무감각
    '설렘': ['./images/pill_02.svg', './images/pill_01.svg', './images/pill_08.svg'], // 설렘, 기쁨, 무감각
    '불안': ['./images/pill_05.svg', './images/pill_06.svg', './images/pill_04.svg'], // 불안, 혼란, 분노
    
    // 전환 감정용
    '혼란': ['./images/pill_05.svg', './images/pill_06.svg', './images/pill_04.svg'],
    '무감각': ['./images/pill_07.svg', './images/pill_03.svg', './images/pill_08.svg'],
    '피로': ['./images/pill_07.svg', './images/pill_03.svg', './images/pill_08.svg'],
    '기쁨': ['./images/pill_02.svg', './images/pill_01.svg', './images/pill_08.svg']
};

// 사용할 알약 이미지 결정
function getPillImages() {
    if (!userData) {
        return ['./images/pill_01.svg', './images/pill_02.svg', './images/pill_03.svg'];
    }
    
    let targetEmotion = userData.step1EmotionName;
    
    // 전환 방향이면 전환된 감정 사용
    if (userData.direction === '전환' && userData.transformEmotion) {
        targetEmotion = userData.transformEmotion;
    }
    
    return emotionPillMapping[targetEmotion] || ['./images/pill_01.svg', './images/pill_02.svg', './images/pill_03.svg'];
}

function initPills() {
    // 기존 구슬 제거
    pills.forEach(pill => Composite.remove(engine.world, pill));
    pills = [];

    const PILL_IMAGES = getPillImages();
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
        
        const randomImage = PILL_IMAGES[Math.floor(Math.random() * PILL_IMAGES.length)];
        const scale = (randomSize * 2) / 100;
        
        const renderOptions = {
            sprite: {
                texture: randomImage,
                xScale: scale,
                yScale: scale
            }
        };

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