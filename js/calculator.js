(function () {
  'use strict';

  var form = document.getElementById('age-form');
  var ageInput = document.getElementById('cat-age');
  var resultPanel = document.getElementById('result-panel');
  var humanAge = document.getElementById('human-age');
  var resultStage = document.getElementById('result-stage');
  var resultStageDescription = document.getElementById('result-stage-description');
  var resultNote = document.getElementById('result-note');
  var ageError = document.getElementById('age-error');
  var resultReset = document.getElementById('result-reset');
  var stageCards = document.querySelectorAll('[data-life-stage]');
  var lifeStageDescriptions = {
    Kitten: 'Still growing into those tiny paws and a big personality.',
    Junior: 'Curious, confident, and learning the rhythms of the world.',
    Prime: 'In their most playful, capable, and adventurous years.',
    Mature: 'A steady, self-assured companion who knows what they like.',
    Senior: 'Settled, wise, and deserving of a little extra softness.',
    Geriatric: 'A wonderfully seasoned cat with a lifetime of stories.',
  };

  function validateCatAge(catAgeInYears) {
    if (
      typeof catAgeInYears !== 'number' ||
      !Number.isFinite(catAgeInYears) ||
      catAgeInYears < 0 ||
      catAgeInYears > 30
    ) {
      throw new Error('Please enter a cat age between 0 and 30 years.');
    }

    return catAgeInYears;
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
  window.getLifeStage = getLifeStage;

  function getAgeValue(input) {
    return input.value.trim() === '' ? null : Number(input.value);
  }

  function clearErrors() {
    ageError.textContent = '';
    ageInput.removeAttribute('aria-invalid');
  }

  function validate() {
    clearErrors();
    var catAgeInYears = getAgeValue(ageInput);

    if (
      catAgeInYears === null ||
      !Number.isFinite(catAgeInYears) ||
      catAgeInYears < 0 ||
      catAgeInYears > 30
    ) {
      ageError.textContent = catAgeInYears === null
        ? 'Add your cat’s age in years.'
        : 'Please enter a number between 0 and 30 years.';
      ageInput.setAttribute('aria-invalid', 'true');
      ageInput.focus();
      return false;
    }

    return true;
  }

  function formatHumanAge(age) {
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
    var catAgeInYears = getAgeValue(ageInput);
    var age = calculateCatAge(catAgeInYears);
    var lifeStage = getLifeStage(catAgeInYears);

    humanAge.textContent = formatHumanAge(age);
    resultStage.textContent = lifeStage;
    resultStageDescription.textContent = lifeStageDescriptions[lifeStage];
    resultNote.textContent = 'This estimate uses the classic 15 / 9 / 4 rule; real aging is wonderfully individual.';
    updateLifeStageGuide(lifeStage);
    resultPanel.hidden = false;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resultPanel.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

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