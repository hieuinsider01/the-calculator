// Minimal, robust calculator logic with keyboard support

const displayEl = document.getElementById('display');

const state = {
  displayValue: '0',
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false,
};

function updateDisplay() {
  // trim long numbers for UI
  const txt = String(state.displayValue);
  displayEl.textContent = txt;
}

function inputDigit(d) {
  if (state.waitingForSecondOperand) {
    state.displayValue = d === '.' ? '0.' : d;
    state.waitingForSecondOperand = false;
  } else {
    if (d === '.' && state.displayValue.includes('.')) return;
    state.displayValue = state.displayValue === '0' && d !== '.' ? d : state.displayValue + d;
  }
  updateDisplay();
}

function handleOperator(nextOp) {
  const inputValue = parseFloat(state.displayValue);
  if (state.operator && state.waitingForSecondOperand) {
    state.operator = nextOp;
    return;
  }

  if (state.firstOperand == null && !Number.isNaN(inputValue)) {
    state.firstOperand = inputValue;
  } else if (state.operator) {
    const result = operate(state.operator, state.firstOperand, inputValue);
    if (result === 'Error') {
      state.displayValue = 'Error';
      state.firstOperand = null;
      state.operator = null;
      state.waitingForSecondOperand = false;
      updateDisplay();
      return;
    }
    state.displayValue = formatNumber(result);
    state.firstOperand = parseFloat(state.displayValue);
  }

  state.waitingForSecondOperand = true;
  state.operator = nextOp;
  updateDisplay();
}

function handleEquals() {
  if (!state.operator || state.waitingForSecondOperand) return;
  const second = parseFloat(state.displayValue);
  const result = operate(state.operator, state.firstOperand, second);
  if (result === 'Error') {
    state.displayValue = 'Error';
  } else {
    state.displayValue = formatNumber(result);
    state.firstOperand = parseFloat(state.displayValue);
  }
  state.operator = null;
  state.waitingForSecondOperand = false;
  updateDisplay();
}

function clearAll() {
  state.displayValue = '0';
  state.firstOperand = null;
  state.operator = null;
  state.waitingForSecondOperand = false;
  updateDisplay();
}

function backspace() {
  if (state.waitingForSecondOperand) return;
  if (state.displayValue.length <= 1 || (state.displayValue.length === 2 && state.displayValue.startsWith('-'))) {
    state.displayValue = '0';
  } else {
    state.displayValue = state.displayValue.slice(0, -1);
  }
  updateDisplay();
}

function toggleSign() {
  if (state.displayValue === '0') return;
  if (state.displayValue.startsWith('-')) state.displayValue = state.displayValue.slice(1);
  else state.displayValue = '-' + state.displayValue;
  updateDisplay();
}

function percent() {
  const val = parseFloat(state.displayValue);
  state.displayValue = formatNumber(val / 100);
  updateDisplay();
}

function operate(op, a, b) {
  if (!isFinite(a) || !isFinite(b)) return 'Error';
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) return 'Error';
      return a / b;
    default: return b;
  }
}

function formatNumber(n) {
  if (!isFinite(n)) return 'Error';
  // limit to 10 decimal places, remove trailing zeros
  const rounded = Math.round((n + Number.EPSILON) * 1e10) / 1e10;
  return String(rounded).replace(/(?:\.0+|(\.\d+?)0+)$/, '$1');
}

/* UI wiring */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const b = e.currentTarget;
    if (b.classList.contains('num')) {
      inputDigit(b.dataset.value);
      return;
    }
    if (b.classList.contains('op')) {
      handleOperator(b.dataset.op);
      return;
    }
    // system buttons
    const action = b.dataset.action;
    if (action === 'clear') clearAll();
    else if (action === 'backspace') backspace();
    else if (action === 'toggle-sign') toggleSign();
    else if (action === 'percent') percent();
    else if (action === 'equals') handleEquals();
  });
});

/* Keyboard support */
window.addEventListener('keydown', (e) => {
  const k = e.key;
  if ((/^[0-9]$/).test(k)) {
    inputDigit(k);
    return;
  }
  if (k === '.') {
    inputDigit('.');
    return;
  }
  if (k === '+' || k === '-' || k === '*' || k === '/') {
    handleOperator(k);
    return;
  }
  if (k === 'Enter' || k === '=') {
    e.preventDefault();
    handleEquals();
    return;
  }
  if (k === 'Backspace') {
    backspace();
    return;
  }
  if (k === 'Escape' || k.toLowerCase() === 'c') {
    clearAll();
    return;
  }
  if (k === '%') {
    percent();
    return;
  }
});

/* initialize */
updateDisplay();