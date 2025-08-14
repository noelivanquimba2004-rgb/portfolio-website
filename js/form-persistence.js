
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    const STORAGE_PREFIX = 'portfolio_form_';
    
    initializeFormPersistence();

    function saveFormData() {
        formInputs.forEach(input => {
            const key = STORAGE_PREFIX + input.name;
            const value = input.value;
            
            if (value.trim() !== '') {
                localStorage.setItem(key, value);
            } else {
                localStorage.removeItem(key);
            }
        });
    }

    function loadFormData() {
        formInputs.forEach(input => {
            const key = STORAGE_PREFIX + input.name;
            const savedValue = localStorage.getItem(key);
            
            if (savedValue) {
                input.value = savedValue;
                
                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);
            }
        });
    }

    function clearFormData() {
        formInputs.forEach(input => {
            const key = STORAGE_PREFIX + input.name;
            localStorage.removeItem(key);
        });
    }

    function initializeFormPersistence() {
        loadFormData();
        
        formInputs.forEach(input => {
            input.addEventListener('input', saveFormData);
            input.addEventListener('change', saveFormData);
            
            input.addEventListener('blur', saveFormData);
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            showFormMessage('success', getCurrentLanguage() === 'fil' ? 
                'Salamat! Ang inyong mensahe ay naipadala na.' : 
                'Thank you! Your message has been sent.');
            
            setTimeout(() => {
                contactForm.reset();
                clearFormData();
                
                const charCounts = contactForm.querySelectorAll('.char-count');
                charCounts.forEach(count => {
                    count.textContent = '0/' + count.textContent.split('/')[1];
                    count.classList.remove('warning', 'error');
                });
            }, 2000);
        });
        
        window.addEventListener('beforeunload', function() {

        });
    }

    function showFormMessage(type, message) {
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;
        
        messageElement.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
            font-weight: 600;
            text-align: center;
            animation: slideDown 0.3s ease-out;
            ${type === 'success' ? 
                'background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;' : 
                'background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
            }
        `;
        
        contactForm.insertBefore(messageElement, contactForm.firstChild);
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideUp 0.3s ease-out';
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }
        }, 5000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);

    function getCurrentLanguage() {
        return (window.getCurrentLanguage && window.getCurrentLanguage()) || 
               localStorage.getItem('language') || 'en';
    }

    let saveTimeout;
    function debouncedSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveFormData, 500);
    }

    formInputs.forEach(input => {
        input.addEventListener('input', debouncedSave);
    });

    window.formPersistence = {
        save: saveFormData,
        load: loadFormData,
        clear: clearFormData
    };

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            loadFormData();
        }
    });
});

