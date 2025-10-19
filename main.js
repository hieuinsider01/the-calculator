// State 1
const calculatorState = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
}


// State 2
// Select all digit button
const allDigitBtns = document.querySelector('.digit-btn');
// Loop for all digit button
allDigitBtns.forEach(button => {
    button.addEventListenner('click', (event) => {
        const inputValue = event.target.dataset.value;

        console.log(inputValue)
    })
})
