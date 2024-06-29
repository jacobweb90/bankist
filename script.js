'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//////////////////// Adding openModal function to each of the buttons on the website

// Simplified
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// Before Simplified
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////  Smooth SCROLLING /////////////////////////////////////////////////////

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////// PAGE NAVIGATION - EVENT BUBBLING (EVENT DELEGATION) ///////////////////////

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////////////////// BUILDING TABS /////////////////////////////////

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  // Guard clause
  if (!clicked) return;

  // REMOVE '--active' from all the tabs and content
  tabs.forEach(function (t) {
    t.classList.remove('operations__tab--active');
  });

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // ADD '--active' to classList for Active Tab & Content

  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////////////  MENU FADE ANIMATION /////////////////////////////////

const handleHover = function (e) {
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    /// Select all the relevant elements
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    /// Change the opacity of the siblings
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // because of .bind, this = opacity passed in
    });
    logo.style.opacity = this;
  }
};

// FADE IN
nav.addEventListener('mouseover', handleHover.bind(0.5));

// FADE OUT
nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////  STICKY NAVIGATION BAR /////////////////////////////////

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; // const entry = entries[0]; since we only have 1 threshold '0'
  if (!entry.isIntersecting)
    nav.classList.add('sticky'); // when isIntersecting = false
  else nav.classList.remove('sticky');
};

const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // the pixel of a box applied outside target element
};

const headerObserver = new IntersectionObserver(stickyNav, options);
headerObserver.observe(header);

//////////////////////////////////  REVEALING ELEMENTS ON SCROLL /////////////////////////////////

// The section slides in when we scroll approaching

// Intersection Observer API
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  /// Only the intersected section will be revealed

  // Guard clause for first section
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  /// Unobserve after all revealed
  observer.unobserve(entry.target);
};

const revealOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, revealOptions);

allSections.forEach(function (section) {
  sectionObserver.observe(section);
});

//////////////////////////////////  LAZY LOADING IMAGES /////////////////////////////////

// LAZY LOADING images to optimise the images on the website for better performance

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  /// Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  /// Remove lazy image filter after the image finished loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const imgObserver = new IntersectionObserver(loadImg, imgOptions);

imgTargets.forEach(function (image) {
  imgObserver.observe(image);
});

//////////////////////////////////  BUILDING SLIDER - PART 1  /////////////////////////////////

// ------ SLIDER -------
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length; // length of the nodeList

  // ------ FUNCTIONS  -------

  // Dots Highlighting Function
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    /// Clear all the dots__dot--active
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    /// Add dots__dot--active to the current slide
    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Changing Slide Function
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next Slide function
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous Slide function
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1; //4-1
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Call all the function to begin as webpage reload
  const init = function () {
    goToSlide(0); // set first slide to 0
    createDots();
    activateDot(0);
  };

  init();

  // ------ EventListerner -------

  // Changing slides to Next slide
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Changing slides with keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide(); // e.key === 'ArrowLeft' && prevSlide();
    if (e.key === 'ArrowRight') nextSlide(); // e.key === 'ArrowRight' && nextSlide();
  });

  // Changing Slides with Dots
  dotContainer.addEventListener('click', function (e) {
    // Clicking on the dots
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide; // const {slide} = e.target.dataset.slide
      goToSlide(slide);
      activateDot(slide);
    }
    // Highlight the current dot
  });
};

slider();
