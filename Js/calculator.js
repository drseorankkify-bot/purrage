(function () {
  'use strict';

  var form = document.getElementById('age-form');
  var ageInput = document.getElementById('cat-age');
  var ageLabel = document.getElementById('age-label');
  var ageUnit = document.getElementById('age-unit');
  var resultPanel = document.getElementById('result-panel');
  var resultTopline = resultPanel.querySelector('.result-topline');
  var humanAge = document.getElementById('human-age');
  var resultAgeUnit = resultPanel.querySelector('.result-age small');
  var resultStage = document.getElementById('result-stage');
  var resultStageDescription = document.getElementById('result-stage-description');
  var resultNote = document.getElementById('result-note');
  var ageError = document.getElementById('age-error');
  var resultReset = document.getElementById('result-reset');
  var stageCards = document.querySelectorAll('[data-life-stage]');
  var directionButtons = document.querySelectorAll('.direction-btn');

  var lifeStageDescriptions = {
    Kitten: 'Still growing into those tiny paws and a big personality.',
    Junior: 'Curious, confident, and learning the rhythms of the world.',
    Prime: 'In their most playful, capable, and adventurous years.',
    Mature: 'A steady, self-assured companion who knows what they like.',
    Senior: 'Settled, wise, and deserving of a little extra softness.',
    Geriatric: 'A wonderfully seasoned cat with a lifetime of stories.',
  };

  var MAX_CAT_AGE = 30;
  var MAX_HUMAN_AGE = 24 + (MAX_CAT_AGE - 2) * 4; // 136

  var direction = 'cat-to-human';

  function validateCatAge(catAgeInYears) {
    if (
      typeof catAgeInYears !== 'number' ||
      !Number.isFinite(catAgeInYears) ||
      catAgeInYears < 0 ||
      catAgeInYears > MAX_CAT_AGE
    ) {
      throw new Error('Please enter a cat age between 0 and ' + MAX_CAT_AGE + ' years.');
    }

    return catAgeInYears;
  }

  function validateHumanAge(humanAgeInYears) {
    if (
      typeof humanAgeInYears !== 'number' ||
      !Number.isFinite(humanAgeInYears) ||
      humanAgeInYears < 0 ||
      humanAgeInYears > MAX_HUMAN_AGE
    ) {
      throw new Error('Please enter a human age between 0 and ' + MAX_HUMAN_AGE + ' years.');
    }

    return humanAgeInYears;
  }

  function calculateCatAge(catAgeInYears) {
    var age = validateCatAge(catAgeInYears);

    if (age <= 1) {
      return age * 15;
    }

    if (age <= 2) {
      return 15 + ((age - 1) * 9);
    }

    return 24 + ((age - 2) * 4);
  }

  // Inverse of calculateCatAge: given a human-equivalent age, return the cat's age in years.
  function calculateHumanToCatAge(humanAgeInYears) {
    var age = validateHumanAge(humanAgeInYears);

    if (age <= 15) {
      return age / 15;
    }

    if (age <= 24) {
      return 1 + ((age - 15) / 9);
    }

    return 2 + ((age - 24) / 4);
  }

  function getLifeStage(catAgeInYears) {
    var age = validateCatAge(catAgeInYears);

    if (age < 0.5) return 'Kitten';
    if (age < 2) return 'Junior';
    if (age < 6) return 'Prime';
    if (age < 10) return 'Mature';
    if (age < 14) return 'Senior';
    return 'Geriatric';
  }

  window.calculateCatAge = calculateCatAge;
  window.calculateHumanToCatAge = calculateHumanToCatAge;
  window.getLifeStage = getLifeStage;

  function getAgeValue(input) {
    return input.value.trim() === '' ? null : Number(input.value);
  }

  function clearErrors() {
    ageError.textContent = '';
    ageInput.removeAttribute('aria-invalid');
  }

  function currentMax() {
    return direction === 'cat-to-human' ? MAX_CAT_AGE : MAX_HUMAN_AGE;
  }

  function validate() {
    clearErrors();
    var enteredAge = getAgeValue(ageInput);
    var max = currentMax();

    if (
      enteredAge === null ||
      !Number.isFinite(enteredAge) ||
      enteredAge < 0 ||
      enteredAge > max
    ) {
      if (enteredAge === null) {
        ageError.textContent = direction === 'cat-to-human'
          ? 'Add your cat’s age in years.'
          : 'Add your age in years.';
      } else {
        ageError.textContent = 'Please enter a number between 0 and ' + max + ' years.';
      }
      ageInput.setAttribute('aria-invalid', 'true');
      ageInput.focus();
      return false;
    }

    return true;
  }

  function formatAge(age) {
    return Number.isInteger(age) ? String(age) : age.toFixed(1);
  }

  function updateLifeStageGuide(activeStage) {
    stageCards.forEach(function (card) {
      var isCurrent = card.getAttribute('data-life-stage') === activeStage;
      card.classList.toggle('is-current', isCurrent);

      if (isCurrent) {
        card.setAttribute('aria-current', 'true');
      } else {
        card.removeAttribute('aria-current');
      }
    });
  }

  function showResult() {
    var enteredAge = getAgeValue(ageInput);
    var catAgeInYears, displayAge, lifeStage;

    if (direction === 'cat-to-human') {
      catAgeInYears = enteredAge;
      displayAge = calculateCatAge(enteredAge);
      lifeStage = getLifeStage(catAgeInYears);

      resultTopline.lastChild.textContent = ' Their approximate human age';
      resultAgeUnit.textContent = 'years old';
      resultNote.textContent = 'This estimate uses the classic 15 / 9 / 4 rule; real aging is wonderfully individual.';
    } else {
      catAgeInYears = calculateHumanToCatAge(enteredAge);
      displayAge = catAgeInYears;
      lifeStage = getLifeStage(catAgeInYears);

      resultTopline.lastChild.textContent = ' Their approximate cat age';
      resultAgeUnit.textContent = 'years old (in cat years)';
      resultNote.textContent = 'This estimate reverses the classic 15 / 9 / 4 rule; real aging is wonderfully individual.';
    }

    humanAge.textContent = formatAge(displayAge);
    resultStage.textContent = lifeStage;
    resultStageDescription.textContent = lifeStageDescriptions[lifeStage];
    updateLifeStageGuide(lifeStage);
    resultPanel.hidden = false;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resultPanel.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

  function setDirection(newDirection) {
    direction = newDirection;
    clearErrors();
    resultPanel.hidden = true;
    updateLifeStageGuide(null);
    ageInput.value = '';

    directionButtons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-direction') === direction;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (direction === 'cat-to-human') {
      ageLabel.textContent = "Cat's age in years";
      ageUnit.textContent = 'yr';
      ageInput.setAttribute('max', String(MAX_CAT_AGE));
      ageInput.setAttribute('placeholder', '1.5');
    } else {
      ageLabel.textContent = 'Your age in years';
      ageUnit.textContent = 'yr';
      ageInput.setAttribute('max', String(MAX_HUMAN_AGE));
      ageInput.setAttribute('placeholder', '30');
    }

    ageInput.focus();
  }

  directionButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setDirection(btn.getAttribute('data-direction'));
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (validate()) showResult();
  });

  form.addEventListener('reset', function () {
    window.setTimeout(function () {
      clearErrors();
      resultPanel.hidden = true;
      updateLifeStageGuide(null);
      ageInput.focus();
    }, 0);
  });

  resultReset.addEventListener('click', function () {
    form.reset();
  });
})();
