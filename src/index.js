import "../src/pages/index.css";

document.addEventListener('DOMContentLoaded', function () {
  const hoursElement = document.querySelector('.elements__timer_hours');
  const minutesElement = document.querySelector('.elements__timer_minutes');
  const secondsElement = document.querySelector('.elements__timer_seconds');

  let totalSeconds = 10 * 60;

  function updateTimer() {

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');

    totalSeconds--;

    if (totalSeconds < 0) {
      totalSeconds = 10 * 60;

      const timer = document.querySelector('.elements__timer');
      timer.classList.add('timer-reset');
      setTimeout(() => timer.classList.remove('timer-reset'), 1000);
    }
  }

  // Запуск
  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
});


document.querySelector('.elements__checkbox_button').addEventListener('click', function () {
  this.classList.toggle('active');
  const isChecked = this.classList.contains('active');
  this.setAttribute('aria-checked', isChecked);
});


document.addEventListener('DOMContentLoaded', function() {
  const sliderContainer = document.querySelector('.elements__slider-container');
  const slider = document.querySelector('.elements__cards.slider');
  
  if (!slider || !sliderContainer) {
    console.error('Slider elements not found!');
    return;
  }

  const cards = Array.from(document.querySelectorAll('.elements__card'));
  if (!cards.length) {
    console.error('No cards found!');
    return;
  }

  const cardStyle = window.getComputedStyle(cards[0]);
  const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginLeft) + parseInt(cardStyle.marginRight);
  const containerWidth = sliderContainer.offsetWidth;
  const centerOffset = (containerWidth - cardWidth) / 2;
  const maxScroll = slider.scrollWidth - containerWidth;

  // Точки навигации
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'slider-dots';
  sliderContainer.appendChild(dotsContainer);

  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    if (index === 0) dot.classList.add('active');
    
    dot.addEventListener('click', () => {
      let scrollTo = index * cardWidth - centerOffset;
      scrollTo = Math.min(Math.max(0, scrollTo), maxScroll);
      
      slider.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
      
      setTimeout(updateSlider, 500);
    });
    
    dotsContainer.appendChild(dot);
  });

  function checkScreenSize() {
    return window.innerWidth <= 600;
  }

  function updateSlider() {
    if (!checkScreenSize()) {
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      });
      return;
    }
    
    const scrollLeft = slider.scrollLeft;
    let activeIndex;
   
    if (scrollLeft >= maxScroll - 10) {
      activeIndex = cards.length - 1;
    } else {
      activeIndex = Math.round((scrollLeft + centerOffset) / cardWidth);
      activeIndex = Math.min(activeIndex, cards.length - 1);
    }

    document.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
    
    cards.forEach((card, index) => {
      if (index === activeIndex) {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.opacity = '0';  
        card.style.transform = 'scale(0.85)';
      }
    });
  }

  let isScrolling;
  slider.addEventListener('scroll', () => {
    if (!checkScreenSize()) return;
    
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      updateSlider();
    }, 100);
  });

  window.addEventListener('resize', () => {
    if (checkScreenSize()) {
      slider.style.overflowX = 'auto';
      updateSlider();
    } else {
      slider.style.overflowX = 'hidden';
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
    }
  });

  if (checkScreenSize()) {
    slider.style.overflowX = 'auto';
    slider.scrollTo({
      left: 0,
      behavior: 'auto'
    });
  }
  updateSlider();
});