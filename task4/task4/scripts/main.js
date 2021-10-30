import { goModal, goMain, goIndex } from './locations.js';
import { openNotification } from './notification.js';
import { noImage } from './noImage.js';
import { isLoading } from './isLoading.js';
import { decodeEscape } from './sanitize.js';

localStorage.clear();

const toDoList = document.querySelector('.tasks__list');
const addTaskButton = document.querySelector('.header__button_add');
const logOutButton = document.querySelector('.header__button_logout');

const getTasksData = async () => {
    isLoading(true);
    try {
        const response = await fetch('/tasks');
        const result = await response.json();

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

const createTask = (id, imageURL, title, description) => {
    const image = document.createElement('img');
    image.className = 'item__image';
    image.src = imageURL;
    image.alt = 'Image is not avaliable';
    image.width = '150';

    const paragraph = document.createElement('p');
    paragraph.className = 'item__description';
    paragraph.textContent = decodeEscape(description);

    const head = document.createElement('h5');
    head.className = 'item__title';
    head.textContent = decodeEscape(title);

    const controlEd = document.createElement('button');
    controlEd.className = 'item__edit';
    controlEd.textContent = 'Edit task';

    const controlDel = document.createElement('button');
    controlDel.className = 'item__remove';
    controlDel.textContent = 'Delete task';

    const buttonsBlock = document.createElement('div');
    buttonsBlock.className = 'item__buttons';
    buttonsBlock.append(controlEd, controlDel);

    const descriptionBlock = document.createElement('div');
    descriptionBlock.className = 'item__info';
    descriptionBlock.append(head, paragraph);

    const mainBlock = document.createElement('div');
    mainBlock.className = 'item__block';
    mainBlock.append(image, descriptionBlock, buttonsBlock);

    const listItem = document.createElement('li');
    listItem.className = 'tasks__item item';
    listItem.id = id;
    listItem.append(mainBlock);

    toDoList.append(listItem);
};

const getTaskId = e => e.target.closest('.tasks__item').id;

const createSalt = () => {
    const salt = new Uint32Array(5);
    window.crypto.getRandomValues(salt);
    return salt.join('');
};

const editTask = e => {
    const taskId = getTaskId(e);
    const salt = createSalt();
    const taskIdCrypted = CryptoJS.AES.encrypt(taskId, salt).toString();
    localStorage.setItem('taskId', taskIdCrypted);
    localStorage.setItem('modalId', salt);
    goModal();
};

const deleteTask = async e => {
    const taskId = getTaskId(e);
    isLoading(true);
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE'
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

const createTasks = tasks => tasks.forEach(task =>
    createTask(
        task._id,
        task.imageURL ? task.imageURL : noImage,
        task.title,
        task.description
    )
);

const displayTasks = async () => {
    const tasksData = await getTasksData();
    createTasks(tasksData);
    const editTaskButtons = document.querySelectorAll('.item__edit');
    const removeTaskButtons = document.querySelectorAll('.item__remove');
    editTaskButtons.forEach(task => task.addEventListener('click', editTask));
    removeTaskButtons.forEach(task => task.addEventListener('click', deleteTask));
};

const logOut = async () => {
    isLoading(true);
    try {
        const response = await fetch('/logout', {
            method: 'POST'
        });

        const result = await response.json();

        if (result.error !== null) {
            isLoading(false);
            openNotification(result.error, 'error');
            return;
        }

        localStorage.clear();
        goIndex();
    } catch (error) {
        isLoading(false);
        openNotification('Something went wrong', 'error');
    }
};

addTaskButton.addEventListener('click', goModal);
logOutButton.addEventListener('click', logOut);

displayTasks();
