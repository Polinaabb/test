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

  cards.forEach(card => {
    card.style.opacity = '1';
    card.style.pointerEvents = 'auto';
    card.style.transform = 'scale(1)';
  });

  function calculateDimensions() {
    const card = cards[0];
    const cardStyle = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth + 
                     parseInt(cardStyle.marginLeft) + 
                     parseInt(cardStyle.marginRight);
    
    const containerWidth = sliderContainer.offsetWidth;
    const centerOffset = Math.max(0, (containerWidth - cardWidth) / 2);
    const maxScroll = slider.scrollWidth - containerWidth;
    
    return { cardWidth, containerWidth, centerOffset, maxScroll };
  }

  let dimensions = calculateDimensions();

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'slider-dots';
  sliderContainer.appendChild(dotsContainer);

  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    if (index === 0) dot.classList.add('active');
    
    dot.addEventListener('click', () => {
      dimensions = calculateDimensions();
      const scrollTo = Math.min(
        index * dimensions.cardWidth - dimensions.centerOffset,
        dimensions.maxScroll
      );
      
      slider.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    });
    
    dotsContainer.appendChild(dot);
  });

  function getActiveCardIndex() {
    dimensions = calculateDimensions();
    const scrollLeft = slider.scrollLeft;

    if (scrollLeft >= dimensions.maxScroll - 10) {
      return cards.length - 1;
    }

    return Math.min(
      Math.round((scrollLeft + dimensions.centerOffset) / dimensions.cardWidth),
      cards.length - 1
    );
  }

  function updateSlider() {
    if (!isMobileView()) {
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.style.transform = 'scale(1)';
      });
      return;
    }
    
    const activeIndex = getActiveCardIndex();

    document.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
    
    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      card.style.opacity = isActive ? '1' : '0';
      card.style.pointerEvents = 'auto';
      card.style.transform = isActive ? 'scale(1)' : 'scale(0.95)';
      card.style.transition = 'all 0.3s ease';
    });
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', function(e) {
      if (parseFloat(this.style.opacity) < 1) {
        dimensions = calculateDimensions();
        const scrollTo = Math.min(
          index * dimensions.cardWidth - dimensions.centerOffset,
          dimensions.maxScroll
        );
        
        slider.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });
        e.preventDefault();
      }
    });
  });

  let scrollTimeout;
  slider.addEventListener('scroll', () => {
    if (!isMobileView()) return;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      requestAnimationFrame(updateSlider);
    }, 100);
  });

  function isMobileView() {
    return window.innerWidth <= 768;
  }

  function handleResize() {
    dimensions = calculateDimensions();
    
    if (isMobileView()) {
      slider.style.overflowX = 'auto';
      slider.style.scrollSnapType = 'x mandatory';
      updateSlider();
    } else {
      slider.style.overflowX = 'hidden';
      slider.style.scrollSnapType = 'none';
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.style.transform = 'none';
      });
    }
  }

  window.addEventListener('resize', handleResize);
  
  handleResize();
  setTimeout(() => {
    slider.scrollTo({ left: 0, behavior: 'auto' });
    updateSlider();
  }, 150);
});