import { openNotification } from './notification.js';
import { isLoading } from './isLoading.js';
import { goIndex } from './locations.js';
import { hash } from './hash.js';
import { regexp } from './emailRegexp.js';

const login = document.querySelector('.form__input_mail');
const password = document.querySelector('.form__input_pass');
const confirmation = document.querySelector('.form__input_confirm');
const captchaData = document.querySelector('.form__input_captcha');
const csrfRegData = document.querySelector('#csrfReg');
const authButton = document.querySelector('.buttons__button_auth');

const isEmail = email => {
    const emailRegex = new RegExp(regexp);
    const result = emailRegex.exec(email);
    if (result) {
        return true;
    };
    return false;
};

const passwordValidation = password => {
    const count = [/[a-z]/, /[A-Z]/, /\d/, /\W/].reduce(
        (count, regex) => count + (regex.test(password) ? 1 : 0),
        0
    );
    return count > 2;
};

const regValidation = (login, password, confirmation) => {
    if (login === '' || password === '' || confirmation === '') {
        openNotification('Fields cannot be empty', 'error');
    } else if (login.includes(' ') || password.includes(' ')) {
        openNotification('Fields must not contain spaces', 'error');
    } else if (!isEmail(login)) {
        openNotification('The login must be an e-mail', 'error');
    } else if (password.length < 10) {
        openNotification('The password is less than 10 symbols', 'error');
    } else if (password.length > 160) {
        openNotification('The password is more than 160 symbols', 'error');
    } else if (!passwordValidation(password)) {
        openNotification(`The password must contain at least 3 out of 4 characters:
      one upper case, one lower case, one numeric, one special char`, 'error');
    } else if (password !== confirmation) {
        openNotification('The password is not confirmed', 'error');
    } else {
        return true;
    }
    return false;
};

const sendRegData = async (email, password, captchaText, csrf) => {
    isLoading(true);
    try {
        const response = await fetch('/register', {
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

        openNotification(result.result, 'success');
    } catch (error) {
        isLoading(false);
        openNotification('Something went wrong', 'error');
    }
};

const regProcess = () => {
    const loginValue = login.value;
    const passwordValue = password.value;
    const confirmationValue = confirmation.value;
    const captchaValue = captchaData.value;
    const csrfValue = csrfRegData.value;
    if (!regValidation(loginValue, passwordValue, confirmationValue)) return;
    const passwordHash = hash(passwordValue);
    sendRegData(loginValue, passwordHash, captchaValue, csrfValue);
};

authButton.addEventListener('click', goIndex);
document.addEventListener('submit', e => {
    e.preventDefault();
    regProcess();
});
