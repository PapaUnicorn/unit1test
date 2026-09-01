const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const warningScreen = document.getElementById('warning-screen');

const infoForm = document.getElementById('info-form');
const fullNameInput = document.getElementById('full-name');
const gradeInput = document.getElementById('grade');

const nextBtn = document.getElementById('next-btn');
const retryBtn = document.getElementById('retry-btn');
const warningRetryBtn = document.getElementById('warning-retry-btn');

const questionCounter = document.getElementById('question-counter');
const sectionTitleEl = document.getElementById('section-title');
const progressFill = document.getElementById('progress-fill');
const passagePanel = document.getElementById('passage-panel');
const passageTitleEl = document.getElementById('passage-title');
const passageTextEl = document.getElementById('passage-text');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const studentNameDisplayEl = document.getElementById('student-name-display');
const studentMetaEl = document.getElementById('student-meta');
const overallScoreEl = document.getElementById('overall-score');
const scoreBreakdownEl = document.getElementById('score-breakdown');

const PAIR_COLORS = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#eab308', '#ec4899', '#06b6d4'];
const SECTION_TITLES = [...new Set(QUESTIONS.map(q => q.sectionTitle))];

let currentIndex = 0;
let score = 0;
let selectedOption = null;
let studentName = '';
let studentGrade = '';
let quizActive = false;
let sectionScores = {};

// Matching-question state
let matchingAssignments = [];
let matchingShuffledRight = [];
let selectedLeftIndex = null;

// Word-bank question state
let blankAssignments = [];
let shuffledBank = [];
let selectedBlankId = null;

// Crossword question state
let crosswordLetters = {};

function showScreen(screen) {
  [startScreen, quizScreen, resultScreen, warningScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

function isFullscreenActive() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

function enterFullscreen() {
  const el = document.documentElement;
  const request = el.requestFullscreen
    ? el.requestFullscreen.bind(el)
    : el.webkitRequestFullscreen
      ? el.webkitRequestFullscreen.bind(el)
      : el.msRequestFullscreen
        ? el.msRequestFullscreen.bind(el)
        : null;
  if (!request) return;
  const result = request();
  if (result && typeof result.catch === 'function') {
    result.catch(() => {});
  }
}

function exitFullscreenIfActive() {
  if (!isFullscreenActive()) return;
  const exit = document.exitFullscreen
    ? document.exitFullscreen.bind(document)
    : document.webkitExitFullscreen
      ? document.webkitExitFullscreen.bind(document)
      : document.msExitFullscreen
        ? document.msExitFullscreen.bind(document)
        : null;
  if (!exit) return;
  const result = exit();
  if (result && typeof result.catch === 'function') {
    result.catch(() => {});
  }
}

function handleFullscreenChange() {
  if (!isFullscreenActive() && quizActive) {
    score = 0;
    finishQuiz();
  }
}

function backToStart() {
  quizActive = false;
  exitFullscreenIfActive();
  showScreen(startScreen);
}

function startQuiz() {
  currentIndex = 0;
  score = 0;
  quizActive = true;
  sectionScores = {};
  SECTION_TITLES.forEach(title => { sectionScores[title] = { earned: 0, max: 0 }; });
  QUESTIONS.forEach(q => { sectionScores[q.sectionTitle].max += q.maxPoints; });
  showScreen(quizScreen);
  renderQuestion();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderQuestion() {
  selectedOption = null;
  nextBtn.disabled = true;

  const q = QUESTIONS[currentIndex];

  questionCounter.textContent = `Question ${currentIndex + 1} of ${QUESTIONS.length}`;
  sectionTitleEl.textContent = q.sectionTitle || '';
  progressFill.style.width = `${(currentIndex / QUESTIONS.length) * 100}%`;
  questionText.textContent = q.question;

  if (q.passage) {
    passagePanel.style.display = 'block';
    passageTitleEl.textContent = q.passageTitle || '';
    passageTextEl.textContent = q.passage;
  } else {
    passagePanel.style.display = 'none';
  }

  optionsContainer.innerHTML = '';
  if (q.type === 'matching') {
    renderMatching(q);
  } else if (q.type === 'wordbank') {
    renderWordbank(q);
  } else if (q.type === 'crossword') {
    renderCrossword(q);
  } else {
    renderChoice(q);
  }

  nextBtn.textContent = currentIndex === QUESTIONS.length - 1 ? 'Finish' : 'Next';
}

function renderChoice(q) {
  q.options.forEach((optionText, idx) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.textContent = optionText;
    div.addEventListener('click', () => selectOption(idx, div));
    optionsContainer.appendChild(div);
  });
}

function selectOption(idx, el) {
  document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  selectedOption = idx;
  nextBtn.disabled = false;
}

function renderMatching(q) {
  matchingAssignments = new Array(q.pairs.length).fill(null);
  selectedLeftIndex = null;
  matchingShuffledRight = shuffle(q.pairs.map((p, idx) => ({ text: p.right, pairIndex: idx })));
  drawMatching(q);
}

function drawMatching(q) {
  optionsContainer.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'matching-grid';

  const leftCol = document.createElement('div');
  leftCol.className = 'matching-col';

  const rightCol = document.createElement('div');
  rightCol.className = 'matching-col';

  q.pairs.forEach((p, leftIndex) => {
    const item = document.createElement('div');
    item.className = 'matching-item';
    item.textContent = p.left;

    const assignedRight = matchingAssignments[leftIndex];
    if (assignedRight !== null) {
      item.classList.add('matched');
      item.style.setProperty('--pair-color', PAIR_COLORS[leftIndex % PAIR_COLORS.length]);
    }
    if (selectedLeftIndex === leftIndex) {
      item.classList.add('selected');
    }
    item.addEventListener('click', () => clickMatchLeft(leftIndex, q));
    leftCol.appendChild(item);
  });

  matchingShuffledRight.forEach((rItem, rightIdx) => {
    const item = document.createElement('div');
    item.className = 'matching-item';
    item.textContent = rItem.text;

    const pairedLeftIndex = matchingAssignments.findIndex(v => v === rightIdx);
    if (pairedLeftIndex !== -1) {
      item.classList.add('matched');
      item.style.setProperty('--pair-color', PAIR_COLORS[pairedLeftIndex % PAIR_COLORS.length]);
    }
    item.addEventListener('click', () => clickMatchRight(rightIdx, q));
    rightCol.appendChild(item);
  });

  grid.appendChild(leftCol);
  grid.appendChild(rightCol);
  optionsContainer.appendChild(grid);

  nextBtn.disabled = !matchingAssignments.every(v => v !== null);
}

function clickMatchLeft(leftIndex, q) {
  if (matchingAssignments[leftIndex] !== null) {
    matchingAssignments[leftIndex] = null;
    selectedLeftIndex = null;
  } else {
    selectedLeftIndex = selectedLeftIndex === leftIndex ? null : leftIndex;
  }
  drawMatching(q);
}

function clickMatchRight(rightIdx, q) {
  const existingLeft = matchingAssignments.findIndex(v => v === rightIdx);
  if (existingLeft !== -1) {
    matchingAssignments[existingLeft] = null;
  }
  if (selectedLeftIndex !== null) {
    matchingAssignments[selectedLeftIndex] = rightIdx;
    selectedLeftIndex = null;
  }
  drawMatching(q);
}

function renderWordbank(q) {
  blankAssignments = new Array(q.answers.length).fill(null);
  selectedBlankId = null;
  shuffledBank = shuffle(q.wordBank.map(word => ({ text: word })));
  drawWordbank(q);
}

function drawWordbank(q) {
  optionsContainer.innerHTML = '';

  const pool = document.createElement('div');
  pool.className = 'wordbank-pool';
  shuffledBank.forEach((word, pos) => {
    const pill = document.createElement('div');
    pill.className = 'wordbank-pill';
    pill.textContent = word.text;
    if (blankAssignments.includes(pos)) {
      pill.classList.add('used');
    }
    pill.addEventListener('click', () => clickBankWord(pos, q));
    pool.appendChild(pill);
  });
  optionsContainer.appendChild(pool);

  const list = document.createElement('div');
  list.className = 'wordbank-items';
  q.items.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'wordbank-item';

    if (item.prompt) {
      const promptEl = document.createElement('div');
      promptEl.className = 'wordbank-prompt';
      promptEl.textContent = item.prompt;
      itemEl.appendChild(promptEl);
    }

    const lineEl = document.createElement('div');
    lineEl.className = 'wordbank-line';
    item.template.forEach(part => {
      if (typeof part === 'string') {
        lineEl.appendChild(document.createTextNode(part));
        return;
      }
      const blankId = part.blank;
      const pos = blankAssignments[blankId];

      if (part.number) {
        const numEl = document.createElement('sup');
        numEl.className = 'blank-number';
        numEl.textContent = part.number;
        lineEl.appendChild(numEl);
      }

      const slot = document.createElement('span');
      slot.className = 'blank-slot';
      if (pos !== null) {
        slot.classList.add('filled');
        slot.textContent = shuffledBank[pos].text;
      } else {
        slot.classList.add('empty');
      }
      if (selectedBlankId === blankId) {
        slot.classList.add('selected');
      }
      slot.addEventListener('click', () => clickBlank(blankId, q));
      lineEl.appendChild(slot);
    });
    itemEl.appendChild(lineEl);
    list.appendChild(itemEl);
  });
  optionsContainer.appendChild(list);

  nextBtn.disabled = !blankAssignments.every(v => v !== null);
}

function clickBlank(blankId, q) {
  if (blankAssignments[blankId] !== null) {
    blankAssignments[blankId] = null;
    selectedBlankId = null;
  } else {
    selectedBlankId = selectedBlankId === blankId ? null : blankId;
  }
  drawWordbank(q);
}

function clickBankWord(pos, q) {
  const existingBlank = blankAssignments.findIndex(v => v === pos);
  if (existingBlank !== -1) {
    blankAssignments[existingBlank] = null;
  }
  if (selectedBlankId !== null) {
    blankAssignments[selectedBlankId] = pos;
    selectedBlankId = null;
  }
  drawWordbank(q);
}

function renderCrossword(q) {
  crosswordLetters = {};
  q.clueList.forEach(c => {
    crosswordLetters[c.key] = new Array(c.answer.length).fill('');
  });
  drawCrossword(q);
}

function drawCrossword(q) {
  optionsContainer.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'crossword-wrap';

  [['across', 'Across'], ['down', 'Down']].forEach(([direction, label]) => {
    const clues = q.clueList.filter(c => c.direction === direction);
    if (!clues.length) return;

    const section = document.createElement('div');
    section.className = 'crossword-section';

    const heading = document.createElement('h4');
    heading.textContent = label;
    section.appendChild(heading);

    clues.forEach(c => {
      const row = document.createElement('div');
      row.className = 'crossword-clue';

      const clueText = document.createElement('div');
      clueText.className = 'crossword-clue-text';
      clueText.textContent = `${c.number}. ${c.clue}`;
      row.appendChild(clueText);

      const boxes = document.createElement('div');
      boxes.className = 'crossword-boxes';
      const letters = crosswordLetters[c.key];

      letters.forEach((letter, idx) => {
        const input = document.createElement('input');
        input.className = 'letter-box';
        input.maxLength = 1;
        input.value = letter;
        input.autocomplete = 'off';
        input.spellcheck = false;

        input.addEventListener('input', (e) => {
          const val = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 1).toUpperCase();
          e.target.value = val;
          crosswordLetters[c.key][idx] = val;
          if (val && idx < letters.length - 1) {
            boxes.children[idx + 1].focus();
          }
          updateCrosswordNextState(q);
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !e.target.value && idx > 0) {
            boxes.children[idx - 1].focus();
          }
        });

        boxes.appendChild(input);
      });

      row.appendChild(boxes);
      section.appendChild(row);
    });

    wrap.appendChild(section);
  });

  optionsContainer.appendChild(wrap);
  updateCrosswordNextState(q);
}

function updateCrosswordNextState(q) {
  const allFilled = q.clueList.every(c => crosswordLetters[c.key].every(ch => ch !== ''));
  nextBtn.disabled = !allFilled;
}

function evaluateCurrentStep(q) {
  if (q.type === 'matching') {
    let earned = 0;
    matchingAssignments.forEach((rightIdx, leftIndex) => {
      if (rightIdx !== null && matchingShuffledRight[rightIdx].pairIndex === leftIndex) {
        earned++;
      }
    });
    return earned;
  }
  if (q.type === 'wordbank') {
    let earned = 0;
    blankAssignments.forEach((pos, blankId) => {
      if (pos !== null && shuffledBank[pos].text === q.answers[blankId]) {
        earned++;
      }
    });
    return earned;
  }
  if (q.type === 'crossword') {
    let earned = 0;
    q.clueList.forEach(c => {
      const typed = crosswordLetters[c.key].join('').toLowerCase();
      if (typed === c.answer.toLowerCase()) {
        earned++;
      }
    });
    return earned;
  }
  return selectedOption === q.correctIndex ? 1 : 0;
}

function goToNext() {
  const q = QUESTIONS[currentIndex];
  const pts = evaluateCurrentStep(q);
  score += pts;
  sectionScores[q.sectionTitle].earned += pts;

  if (currentIndex < QUESTIONS.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  quizActive = false;
  exitFullscreenIfActive();
  if (score === 0) {
    showScreen(warningScreen);
  } else {
    renderResultCard();
    showScreen(resultScreen);
  }
}

function renderResultCard() {
  studentNameDisplayEl.textContent = studentName;
  studentMetaEl.textContent = `Grade ${studentGrade} — ${new Date().toLocaleString()}`;

  const percent = Math.round((score / TOTAL_POSSIBLE_POINTS) * 100);
  overallScoreEl.innerHTML = `
    <div class="overall-score-value">${score} / ${TOTAL_POSSIBLE_POINTS}</div>
    <div class="overall-score-percent">${percent}%</div>
  `;

  scoreBreakdownEl.innerHTML = '';
  SECTION_TITLES.forEach(title => {
    const { earned, max } = sectionScores[title];
    const row = document.createElement('div');
    row.className = 'breakdown-row';
    row.innerHTML = `
      <span class="breakdown-title">${title}</span>
      <span class="breakdown-score">${earned} / ${max}</span>
    `;
    scoreBreakdownEl.appendChild(row);
  });
}

function handleVisibilityChange() {
  if (document.hidden && quizActive) {
    score = 0;
    finishQuiz();
  }
}

infoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  studentName = fullNameInput.value.trim();
  studentGrade = gradeInput.value.trim();
  if (!studentName || !studentGrade) return;
  enterFullscreen();
  startQuiz();
});

nextBtn.addEventListener('click', goToNext);
retryBtn.addEventListener('click', backToStart);
warningRetryBtn.addEventListener('click', backToStart);
document.addEventListener('visibilitychange', handleVisibilityChange);
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);
