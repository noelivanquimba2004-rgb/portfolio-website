
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('languageSelect');
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    setLanguage(savedLanguage);
    languageSelect.value = savedLanguage;

    languageSelect.addEventListener('change', function() {
        const selectedLanguage = this.value;
        setLanguage(selectedLanguage);
        
        languageSelect.style.transform = 'scale(0.95)';
        setTimeout(() => {
            languageSelect.style.transform = 'scale(1)';
        }, 150);
    });

    function setLanguage(language) {
        localStorage.setItem('language', language);
        
        document.documentElement.lang = language === 'fil' ? 'fil' : 'en';
        
        const elementsWithLangData = document.querySelectorAll('[data-en], [data-fil]');
        
        elementsWithLangData.forEach(element => {
            const englishText = element.getAttribute('data-en');
            const filipinoText = element.getAttribute('data-fil');
            
            if (language === 'fil' && filipinoText) {
                element.textContent = filipinoText;
            } else if (language === 'en' && englishText) {
                element.textContent = englishText;
            }
        });
        
        updateFormPlaceholders(language);
        
        updatePageTitle(language);
        
        const languageChangeEvent = new CustomEvent('languageChanged', {
            detail: { language: language }
        });
        document.dispatchEvent(languageChangeEvent);
    }

    function updateFormPlaceholders(language) {
        const placeholders = {
            en: {
                name: 'Enter your name',
                email: 'Enter your email',
                subject: 'Enter subject',
                message: 'Enter your message'
            },
            fil: {
                name: 'Ilagay ang inyong pangalan',
                email: 'Ilagay ang inyong email',
                subject: 'Ilagay ang paksa',
                message: 'Ilagay ang inyong mensahe'
            }
        };

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        if (nameInput) nameInput.placeholder = placeholders[language].name;
        if (emailInput) emailInput.placeholder = placeholders[language].email;
        if (subjectInput) subjectInput.placeholder = placeholders[language].subject;
        if (messageInput) messageInput.placeholder = placeholders[language].message;
    }

    function updatePageTitle(language) {
        const titles = {
            en: 'Quimba - Portfolio',
            fil: 'Quimba - Portfolio'
        };
        
        document.title = titles[language];
    }

    function getCurrentLanguage() {
        return localStorage.getItem('language') || 'en';
    }

    window.getCurrentLanguage = getCurrentLanguage;

    languageSelect.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.blur();
        }
    });

    function addLanguageTransition() {
        const elementsWithLangData = document.querySelectorAll('[data-en], [data-fil]');
        
        elementsWithLangData.forEach(element => {
            element.style.transition = 'opacity 0.2s ease';
            element.style.opacity = '0.7';
            
            setTimeout(() => {
                element.style.opacity = '1';
                setTimeout(() => {
                    element.style.transition = '';
                }, 200);
            }, 100);
        });
    }

    document.addEventListener('languageChanged', addLanguageTransition);

    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        
        if (browserLang.startsWith('fil') || browserLang.startsWith('tl')) {
            return 'fil';
        }
        
        return 'en';
    }

    if (!localStorage.getItem('language')) {
        const detectedLanguage = detectBrowserLanguage();
        setLanguage(detectedLanguage);
        languageSelect.value = detectedLanguage;
    }
});

