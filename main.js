// Create state object and operate function
const calculatorState = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
}
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if (b === 0) {
        return "Cannot divide by zero";
    } else {
        return a / b;
    }
}
// Create operator object
const operator = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide,
};
// Operate Function
function operate(operatorSymbol, a, b) {
    a = Number(a);
    b = Number(b);
    const operationFunction = operator[operatorSymbol];
    if (operationFunction) {
        return operationFunction(a, b);
    } else {
        return null;
    }
}

// Function to handle input digits
function handleInputDigit(value) {
    if (calculatorState.waitingForSecondOperand) {
        calculatorState.displayValue = value;
        calculatorState.waitingForSecondOperand = false;
    }
    console.log("Gia tri da bam: " + value);
}
// Function to setup event
function setupEventListeners() {
    const digitButtons = document.querySelectorAll('.digit-btn');
    digitButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const digitValue = button.dataset.value;
            handleInputDigit(digitValue);
        })
    })
}
setupEventListeners();
// Update display
function updateDisplay() {
    document.getElementById('current-display').textContent = calculatorState.displayValue;
}
updateDisplay();