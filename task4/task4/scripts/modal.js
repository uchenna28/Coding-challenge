import { goMain } from './locations.js';
import { isLoading } from './isLoading.js';
import { openNotification } from './notification.js';
import { noImage } from './noImage.js';
import { sanitizeEscape, decodeEscape } from './sanitize.js';

const modalHeader = document.querySelector('.modal__header');
const modalImage = document.querySelector('.modal__image');
const imageResetButton = document.querySelector('.modal__image-reset');
const cancelButton = document.querySelector('.modal__button_cancel');
const captchaData = document.querySelector('.modal__input_captcha');
const csrfModalData = document.getElementById('csrfModal');
const titleField = document.getElementById('title');
const imageField = document.getElementById('image');
const descriptionField = document.getElementById('description');

let taskId = localStorage.getItem('taskId');
const modalId = localStorage.getItem('modalId');

let modalImageCheck = false;

const localStorageClear = () => {
    localStorage.removeItem('taskId');
    localStorage.removeItem('modalId');
};

const imageValidation = file => {
    if (!(/^image\//.test(file.type))) {
        openNotification('The file type must be an image', 'error');
    } else if (/[#%&{}\\<>*?/ \[\]$!'":@+`|=]/.test(file.name)) {
        openNotification('A filename cannot contain special chars', 'error');
    } else if (file.size > 204800) {
        openNotification('File size more than 200KB', 'error');
    } else {
        return true;
    }
    return false;
};

imageField.addEventListener('change', () => {
    const file = imageField.files[0];
    if (!file || !imageValidation(file)) return;
    isLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        modalImageCheck = true;
        modalImage.src = reader.result;
        isLoading(false);
    };
});

const getImageURL = () => modalImageCheck ? modalImage.src : '';

const addTaskRequest = async () => {
    isLoading(true);
    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                title: sanitizeEscape(titleField.value),
                description: sanitizeEscape(descriptionField.value),
                imageURL: getImageURL(),
                captchaText: captchaData.value,
                _csrf: csrfModalData.value
            })
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

const modeAdd = () => {
    modalHeader.textContent = 'Add your task';
    modalImage.src = noImage;

    document.addEventListener('submit', e => {
        e.preventDefault();
        addTaskRequest();
    });
};

const editTaskRequest = async () => {
    isLoading(true);
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                title: sanitizeEscape(titleField.value),
                description: sanitizeEscape(descriptionField.value),
                imageURL: getImageURL(),
                captchaText: captchaData.value,
                _csrf: csrfModalData.value
            })
        });

        const result = await response.json();

        if (result.error !== null) {
            isLoading(false);
            openNotification(result.error, 'error');
            return;
        }

        localStorageClear();
        goMain();
    } catch (error) {
        isLoading(false);
        openNotification('Something went wrong', 'error');
    }
};

const getTaskData = async () => {
    isLoading(true);
    try {
        const responce = await fetch(`/tasks/${taskId}`);
        const result = await responce.json()

        if (result.error !== null) {
            isLoading(false);
            openNotification(result.error, 'error');
            return;
        }

        isLoading(false);
        return result.result;
    } catch (error) {
        isLoading(false);
        openNotification('Something went wrong', 'error');
    }
};

const modeEdit = async () => {
    const bytes = CryptoJS.AES.decrypt(taskId, modalId);
    taskId = bytes.toString(CryptoJS.enc.Utf8);
    modalHeader.textContent = 'Edit your task';
    const taskData = await getTaskData();

    titleField.value = decodeEscape(taskData.title);
    if (taskData.imageURL) {
        modalImageCheck = true;
        modalImage.src = taskData.imageURL;
    } else {
        modalImage.src = noImage;
    }
    descriptionField.value = decodeEscape(taskData.description);

    document.addEventListener('submit', e => {
        e.preventDefault();
        editTaskRequest();
    });
};

imageResetButton.addEventListener('click', () => {
    imageField.value = '';
    modalImageCheck = false;
    modalImage.src = noImage;
});

cancelButton.addEventListener('click', () => {
    isLoading(true);
    localStorageClear();
    goMain();
});

taskId && modalId ? modeEdit() : modeAdd();
