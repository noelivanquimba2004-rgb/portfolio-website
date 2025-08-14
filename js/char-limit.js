document.addEventListener('DOMContentLoaded', function() {
    const inputsWithLimit = document.querySelectorAll('input[maxlength], textarea[maxlength]');
    
    initializeCharacterLimits();

    function initializeCharacterLimits() {
        inputsWithLimit.forEach(input => {
            const maxLength = parseInt(input.getAttribute('maxlength'));
            const charCountElement = findCharCountElement(input);
            
            if (charCountElement && maxLength) {

                updateCharacterCount(input, charCountElement, maxLength);
                
                input.addEventListener('input', () => {
                    updateCharacterCount(input, charCountElement, maxLength);
                });
                
                input.addEventListener('keydown', (e) => {
                    handleKeydown(e, input, maxLength);
                });
                
                input.addEventListener('paste', (e) => {
                    setTimeout(() => {
                        handlePaste(input, maxLength);
                        updateCharacterCount(input, charCountElement, maxLength);
                    }, 0);
                });
            }
        });
    }

    function findCharCountElement(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            return formGroup.querySelector('.char-count');
        }
        return null;
    }

    function updateCharacterCount(input, charCountElement, maxLength) {
        const currentLength = input.value.length;
        const remaining = maxLength - currentLength;
        
        charCountElement.textContent = `${currentLength}/${maxLength}`;
        
        charCountElement.classList.remove('warning', 'error');
        input.classList.remove('warning', 'error');
        
        if (currentLength >= maxLength) {
            charCountElement.classList.add('error');
            input.classList.add('error');
        } else if (currentLength >= maxLength * 0.8) {
            charCountElement.classList.add('warning');
            input.classList.add('warning');
        }
        
        updateInputValidation(input, currentLength, maxLength);
        
        const charLimitEvent = new CustomEvent('charLimitUpdate', {
            detail: {
                input: input,
                currentLength: currentLength,
                maxLength: maxLength,
                remaining: remaining
            }
        });
        document.dispatchEvent(charLimitEvent);
    }

    function handleKeydown(event, input, maxLength) {
        const currentLength = input.value.length;
        
        const allowedKeys = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
            'ArrowUp', 'ArrowDown', 'Tab', 'Escape', 'Enter'
        ];
        
        const isCtrlKey = event.ctrlKey || event.metaKey;
        const allowedCtrlKeys = ['a', 'c', 'v', 'x', 'z'];
        
        if (allowedKeys.includes(event.key) || 
            (isCtrlKey && allowedCtrlKeys.includes(event.key.toLowerCase()))) {
            return;
        }
        
        if (currentLength >= maxLength && input.selectionStart === input.selectionEnd) {
            event.preventDefault();
            showCharacterLimitWarning(input);
        }
    }

    function handlePaste(input, maxLength) {
        const currentValue = input.value;
        
        if (currentValue.length > maxLength) {
            input.value = currentValue.substring(0, maxLength);
            showCharacterLimitWarning(input);
        }
    }

    function showCharacterLimitWarning(input) {
        let warningElement = input.parentNode.querySelector('.char-limit-warning');
        
        if (!warningElement) {
            warningElement = document.createElement('div');
            warningElement.className = 'char-limit-warning';
            warningElement.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                background-color: #fee2e2;
                color: #991b1b;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                font-weight: 600;
                z-index: 10;
                animation: fadeInOut 2s ease-out;
                pointer-events: none;
            `;
            
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.style.position = 'relative';
                formGroup.appendChild(warningElement);
            }
        }
        
        const currentLanguage = getCurrentLanguage();
        warningElement.textContent = currentLanguage === 'fil' ? 
            'Naabot na ang limitasyon ng mga karakter!' : 
            'Character limit reached!';
        
        setTimeout(() => {
            if (warningElement.parentNode) {
                warningElement.remove();
            }
        }, 2000);
    }

    function updateInputValidation(input, currentLength, maxLength) {
        input.classList.remove('invalid', 'valid');
        
        if (input.hasAttribute('required')) {
            if (currentLength === 0) {
                input.classList.remove('valid', 'invalid');
            } else if (currentLength <= maxLength) {
                input.classList.add('valid');
            } else {
                input.classList.add('invalid');
            }
        }
    }

    function getCurrentLanguage() {
        return (window.getCurrentLanguage && window.getCurrentLanguage()) || 
               localStorage.getItem('language') || 'en';
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% {
                opacity: 0;
                transform: translateY(-5px);
            }
            20%, 80% {
                opacity: 1;
                transform: translateY(0);
            }
            100% {
                opacity: 0;
                transform: translateY(-5px);
            }
        }
        
        .char-count.warning {
            color: #f59e0b !important;
            font-weight: 600;
        }
        
        .char-count.error {
            color: #ef4444 !important;
            font-weight: 600;
        }
        
        input.warning,
        textarea.warning {
            border-color: #f59e0b !important;
            box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1) !important;
        }
        
        input.error,
        textarea.error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
        }
    `;
    document.head.appendChild(style);

    window.charLimit = {
        updateAll: function() {
            inputsWithLimit.forEach(input => {
                const maxLength = parseInt(input.getAttribute('maxlength'));
                const charCountElement = findCharCountElement(input);
                if (charCountElement && maxLength) {
                    updateCharacterCount(input, charCountElement, maxLength);
                }
            });
        },
        
        setLimit: function(inputElement, newLimit) {
            inputElement.setAttribute('maxlength', newLimit);
            const charCountElement = findCharCountElement(inputElement);
            if (charCountElement) {
                updateCharacterCount(inputElement, charCountElement, newLimit);
            }
        }
    };

    document.addEventListener('languageChanged', function() {
        const warnings = document.querySelectorAll('.char-limit-warning');
        warnings.forEach(warning => {
            const currentLanguage = getCurrentLanguage();
            warning.textContent = currentLanguage === 'fil' ? 
                'Naabot na ang limitasyon ng mga karakter!' : 
                'Character limit reached!';
        });
    });
});

