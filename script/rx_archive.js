// Rx Archive 페이지 전용 레이더 차트 초기화
window.addEventListener('DOMContentLoaded', () => {
    const radarChartCanvas = document.getElementById('radarChart');
    const worldCanvas = document.getElementById('worldCanvas');
    
    if (!radarChartCanvas || !worldCanvas) {
        console.log('레이더 차트 요소를 찾을 수 없습니다.');
        return;
    }

    const PILL_IMAGES = [
        './images/pill_01.svg',
        './images/pill_02.svg',
        './images/pill_03.svg',
        './images/pill_04.svg',
        './images/pill_05.svg',
        './images/pill_06.svg',
        './images/pill_07.svg',
        './images/pill_08.svg',
    ];

    const prescriptionData = {
        '25.10.15': {
            emotionValues: [65, 60, 55, 95, 85, 75, 50, 70], // 키운 값
            care: '증폭',
            careEn: 'Amplify',
            target: '기쁨',
            targetEn: 'Joy',
            description: '기쁨이라는 감정이 단순히 밝은 상태를 넘어서, 깊고 지속적인 감정으로 자리잡을 수 있도록 시각적으로 몰입을 유도합니다.',
            changes: [
                { percent: '+55%', emotion: '기쁨', pill: 'pill_01.svg' },
                { percent: '+13%', emotion: '설렘', pill: 'pill_02.svg' },
                { percent: '-12%', emotion: '무감각', pill: 'pill_08.svg' }
            ]
        },
        '25.09.28': {
            emotionValues: [50, 55, 60, 95, 80, 65, 55, 75], // 키운 값
            care: '완화',
            careEn: 'Relieve',
            target: '피로',
            targetEn: 'Fatigue',
            description: '지속적인 피로감을 완화하고 에너지를 회복할 수 있도록 편안한 분위기를 조성합니다.',
            changes: [
                { percent: '-45%', emotion: '피로', pill: 'pill_07.svg' },
                { percent: '+20%', emotion: '기쁨', pill: 'pill_01.svg' },
                { percent: '-15%', emotion: '무감각', pill: 'pill_08.svg' }
            ]
        },
        '25.09.15': {
            emotionValues: [55, 65, 60, 95, 85, 75, 55, 70], // 키운 값
            care: '완화',
            careEn: 'Relieve',
            target: '분노',
            targetEn: 'Anger',
            description: '강렬한 분노의 감정을 진정시키고 내면의 평화를 찾을 수 있도록 차분한 콘텐츠를 제공합니다.',
            changes: [
                { percent: '-38%', emotion: '분노', pill: 'pill_04.svg' },
                { percent: '-25%', emotion: '불안', pill: 'pill_05.svg' },
                { percent: '+18%', emotion: '기쁨', pill: 'pill_01.svg' }
            ]
        },
        '25.09.01': {
            emotionValues: [60, 70, 65, 90, 75, 80, 65, 75], // 키운 값
            care: '증폭',
            careEn: 'Amplify',
            target: '설렘',
            targetEn: 'Excitement',
            description: '설레는 감정을 더욱 풍부하게 만들어 일상에 활력을 불어넣고 긍정적인 에너지를 확장합니다.',
            changes: [
                { percent: '+62%', emotion: '설렘', pill: 'pill_02.svg' },
                { percent: '+28%', emotion: '기쁨', pill: 'pill_01.svg' },
                { percent: '-18%', emotion: '무감각', pill: 'pill_08.svg' }
            ]
        }
    };

    const emotionLabels = ['기쁨', '설렘', '슬픔', '분노', '불안', '혼란', '피로', '무감각'];
    
    let currentDate = '25.10.15';
    let currentData = prescriptionData[currentDate];

    const chartCtx = radarChartCanvas.getContext("2d");
    let radarChart;

    function createChart(emotionValues, animated = true) {
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
                    backgroundColor: 'rgba(255, 125, 45, 0.2)',
                    borderColor: 'rgba(255, 125, 45, 1)',
                    pointBackgroundColor: 'rgba(255, 125, 45, 1)',
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
                            font: { size: 13 }
                        },
                        pointLabels: {
                            font: { size: 15, weight: 'bold' }
                        },
                        grid: { color: '#ddd' },
                        angleLines: { color: '#ccc' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        if (animated) {
            setTimeout(() => {
                updateWalls(emotionValues);
                initPills();
            }, 1600);
        } else {
            updateWalls(emotionValues);
            initPills();
        }
    }

    const { Engine, Render, Runner, Bodies, Composite } = Matter;

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

    function updateWalls(emotionValues) {
        const points = getRadarPoints(emotionValues);
        containerWalls.forEach(w => Composite.remove(engine.world, w));
        containerWalls = [];

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

    // ============================================
    // 미니 레이더 차트 생성 - 수치 키움
    // ============================================
    const miniChartInstances = [];

    function createMiniCharts() {
        const rxCards = document.querySelectorAll('.rx_card');
        
        // 미니 차트용 수치 증가 (차트를 더 크게)
        const miniChartData = {
            '25.10.15': [65, 60, 55, 95, 85, 75, 50, 70],
            '25.09.28': [50, 55, 60, 95, 80, 65, 55, 75],
            '25.09.15': [55, 65, 60, 95, 85, 75, 55, 70],
            '25.09.01': [60, 70, 65, 90, 75, 80, 65, 75]
        };
        
        rxCards.forEach((card, cardIndex) => {
            const date = card.dataset.date;
            const data = prescriptionData[date];
            const miniRadar = card.querySelector('.mini-radar');
            const miniWorld = card.querySelector('.mini-world');
            
            if (miniRadar && data) {
                miniRadar.width = 300;
                miniRadar.height = 300;

                if (miniChartInstances[cardIndex]) {
                    miniChartInstances[cardIndex].destroy();
                }

                const ctx = miniRadar.getContext('2d');
                ctx.clearRect(0, 0, miniRadar.width, miniRadar.height);
                
                miniChartInstances[cardIndex] = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['기쁨', '설렘', '슬픔', '분노', '불안', '혼란', '피로', '무감각'],
                        datasets: [{
                            data: miniChartData[date],
                            backgroundColor: 'rgba(200, 200, 200, 0.2)',
                            borderColor: 'rgba(150, 150, 150, 0.5)',
                            pointBackgroundColor: 'rgba(150, 150, 150, 0.5)',
                            pointRadius: 3,
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                        animation: false,
                        scales: {
                            r: {
                                min: 0,
                                max: 100,
                                beginAtZero: true,
                                ticks: { 
                                    display: false,
                                    stepSize: 25
                                },
                                pointLabels: { display: false },
                                grid: { color: '#e0e0e0' },
                                angleLines: { color: '#e0e0e0' }
                            }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        }
                    }
                });

                // 미니 차트용 Matter.js 설정
                if (miniWorld) {
                    const miniEngine = Engine.create();
                    const miniRender = Render.create({
                        canvas: miniWorld,
                        engine: miniEngine,
                        options: {
                            width: 300,
                            height: 300,
                            background: "transparent",
                            wireframes: false
                        }
                    });
                    Render.run(miniRender);
                    Runner.run(Runner.create(), miniEngine);

                    const miniCenterX = 150, miniCenterY = 150;
                    const miniMaxRadius = 100;

                    function getMiniRadarPoints(values) {
                        return values.map((val, i) => {
                            const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;
                            const r = (val / 100) * miniMaxRadius;
                            return {
                                x: miniCenterX + r * Math.cos(angle),
                                y: miniCenterY + r * Math.sin(angle)
                            };
                        });
                    }

                    const miniPoints = getMiniRadarPoints(miniChartData[date]);
                    for (let i = 0; i < miniPoints.length; i++) {
                        const a = miniPoints[i];
                        const b = miniPoints[(i + 1) % miniPoints.length];
                        const len = Math.hypot(b.x - a.x, b.y - a.y);
                        const angle = Math.atan2(b.y - a.y, b.x - a.x);
                        const wall = Bodies.rectangle(
                            (a.x + b.x) / 2,
                            (a.y + b.y) / 2,
                            len,
                            8,
                            { isStatic: true, angle, render: { visible: false } }
                        );
                        Composite.add(miniEngine.world, wall);
                    }

                    // 알약 생성 - 각 카드마다 하드코딩
                    const pillConfigs = [];
                    
                    if (date === '25.10.15') {
                        // 기쁨, 설렘, 무감각
                        pillConfigs.push(
                            { x: 120, y: 120, size: 8, texture: './images/pill_01.svg' },
                            { x: 180, y: 130, size: 10, texture: './images/pill_02.svg' },
                            { x: 150, y: 160, size: 7, texture: './images/pill_08.svg' },
                            { x: 140, y: 180, size: 9, texture: './images/pill_01.svg' },
                            { x: 170, y: 170, size: 11, texture: './images/pill_02.svg' },
                            { x: 160, y: 140, size: 8, texture: './images/pill_08.svg' }
                        );
                    } else if (date === '25.09.28') {
                        // 피로, 기쁨, 무감각
                        pillConfigs.push(
                            { x: 125, y: 125, size: 9, texture: './images/pill_07.svg' },
                            { x: 175, y: 135, size: 8, texture: './images/pill_01.svg' },
                            { x: 155, y: 165, size: 10, texture: './images/pill_08.svg' },
                            { x: 135, y: 175, size: 7, texture: './images/pill_07.svg' },
                            { x: 165, y: 145, size: 11, texture: './images/pill_01.svg' },
                            { x: 145, y: 155, size: 9, texture: './images/pill_08.svg' }
                        );
                    } else if (date === '25.09.15') {
                        // 분노, 불안, 기쁨
                        pillConfigs.push(
                            { x: 130, y: 120, size: 10, texture: './images/pill_04.svg' },
                            { x: 170, y: 140, size: 8, texture: './images/pill_05.svg' },
                            { x: 150, y: 170, size: 9, texture: './images/pill_01.svg' },
                            { x: 140, y: 160, size: 11, texture: './images/pill_04.svg' },
                            { x: 160, y: 130, size: 7, texture: './images/pill_05.svg' },
                            { x: 175, y: 165, size: 8, texture: './images/pill_01.svg' }
                        );
                    } else if (date === '25.09.01') {
                        // 설렘, 기쁨, 무감각
                        pillConfigs.push(
                            { x: 115, y: 130, size: 9, texture: './images/pill_02.svg' },
                            { x: 185, y: 125, size: 10, texture: './images/pill_01.svg' },
                            { x: 145, y: 155, size: 8, texture: './images/pill_08.svg' },
                            { x: 165, y: 175, size: 11, texture: './images/pill_02.svg' },
                            { x: 135, y: 145, size: 7, texture: './images/pill_01.svg' },
                            { x: 155, y: 135, size: 9, texture: './images/pill_08.svg' }
                        );
                    }

                    // 설정된 알약들 생성
                    pillConfigs.forEach(config => {
                        const scale = (config.size * 2) / 100;
                        const miniPill = Bodies.circle(config.x, config.y, config.size, {
                            restitution: 0.8,
                            friction: 0.005,
                            render: {
                                sprite: {
                                    texture: config.texture,
                                    xScale: scale,
                                    yScale: scale
                                },
                                opacity: 0.3
                            }
                        });
                        Composite.add(miniEngine.world, miniPill);
                    });
                }
            }
        });
    }

    function updateUserRx(date) {
        const data = prescriptionData[date];
        if (!data) return;

        pills.forEach(pill => Composite.remove(engine.world, pill));
        pills = [];

        if (radarChart) {
            radarChart.destroy();
            radarChart = null;
        }

        document.querySelector('.rx_name span').textContent = date;

        const careWrap = document.querySelectorAll('.user_result .top_wrap li')[1];
        careWrap.querySelector('.txt_wrap h4:first-child').textContent = data.care;
        careWrap.querySelector('.txt_wrap h4:last-child').textContent = data.careEn;

        const targetWrap = document.querySelectorAll('.user_result .top_wrap li')[2];
        targetWrap.querySelector('.txt_wrap h4:first-child').textContent = data.target;
        targetWrap.querySelector('.txt_wrap h4:last-child').textContent = data.targetEn;

        document.querySelector('.user_result .desc p').textContent = data.description;

        const valueItems = document.querySelectorAll('.report .value');
        data.changes.forEach((change, index) => {
            if (valueItems[index]) {
                valueItems[index].querySelector('h3').textContent = change.percent;
                valueItems[index].querySelector('p').textContent = change.emotion;
                const pillImgs = valueItems[index].querySelectorAll('.pill_wrap img');
                pillImgs.forEach(img => {
                    img.src = `./images/${change.pill}`;
                });
            }
        });

        setTimeout(() => {
            createChart(data.emotionValues, true);
        }, 300);
    }

    const rxCards = document.querySelectorAll('.rx_card');
    
    rxCards.forEach(card => {
        card.addEventListener('click', function() {
            rxCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const date = this.dataset.date;
            currentDate = date;
            currentData = prescriptionData[date];
            
            updateUserRx(date);
            
            document.querySelector('.user_rx').scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        });
    });

    createChart(currentData.emotionValues, true);
    createMiniCharts();
    
    if (rxCards.length > 0) {
        rxCards[0].classList.add('active');
    }
});