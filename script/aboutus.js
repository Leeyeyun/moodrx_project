const emotionSwiper = new Swiper('.emotion-swiper', {
  direction: 'vertical',
  loop: true,
  slidesPerView: 5,
  centeredSlides: true,
  allowTouchMove: false,
  speed: 800,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false
  },
  spaceBetween: 30,
  watchSlidesProgress: true, // ★ 중요: 중심 슬라이드 계산 정확히
});