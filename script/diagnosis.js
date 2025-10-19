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