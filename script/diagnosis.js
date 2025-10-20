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