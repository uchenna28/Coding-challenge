import { openNotification } from './notification.js';
import { isLoading } from './isLoading.js';
import { goMain, goRegistration } from './locations.js';
import { hash } from './hash.js';

const login = document.querySelector('.form__input_login');
const password = document.querySelector('.form__input_password');
const captchaData = document.querySelector('.form__input_captcha');
const csrfToken = document.querySelector('#csrf');
const registrationButton = document.querySelector(
    '.buttons__button_registration'
);

const authValidation = (login, password) => {
    if (!(login && password)) {
        openNotification('Fields cannot be empty', 'error');
        return false;
    }
    return true;
};

const sendAuthData = async (email, password, captchaText, csrf) => {
    isLoading(true);
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ email, password, captchaText, _csrf: csrf })
        });

        const result = await response.json();

        if (result.error !== null) {
            isLoading(false);
            openNotification(result.error, 'error');
            return;
        }

        goMain();
    } catch (error) {
        isLoading(false);
        openNotification('Something went wrong', 'error');
    }
};

const authProcess = () => {
    const loginValue = login.value;
    const passwordValue = password.value;
    const captchaValue = captchaData.value;
    const csrfValue = csrfToken.value;
    if (!authValidation(loginValue, passwordValue)) return;
    const passwordHash = hash(passwordValue);
    sendAuthData(loginValue, passwordHash, captchaValue, csrfValue);
};

registrationButton.addEventListener('click', goRegistration);
document.addEventListener('submit', e => {
    e.preventDefault();
    authProcess();
});
