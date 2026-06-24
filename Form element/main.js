/* ===========================================================
   main.js — валидация формы регистрации
   пока поля не заполнены/невалидны — форма не уходит на /register
   подключение:  <script src="./main.js" defer></script>
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* стили для ошибок вшиваем сюда, чтобы не трогать style.css */
    const style = document.createElement('style');
    style.textContent = `
        .is-invalid{
            border-color:#E5484D !important;
            box-shadow:4px 4px 0 #E5484D !important;
        }
        input[type="radio"].is-invalid,
        input[type="checkbox"].is-invalid{
            box-shadow:0 0 0 3px rgba(229,72,77,.4) !important;
        }
        .error-msg{
            margin:6px 0 0;
            color:#E5484D;
            font-size:.78rem;
            font-weight:600;
            font-family:inherit;
        }
    `;
    document.head.appendChild(style);

    const form = document.querySelector('form');
    if (!form) return;

    /* поля */
    const firstname = document.getElementById('firstname');
    const lastname  = document.getElementById('Lastname');
    const email     = document.getElementById('emailaddress');
    const password  = document.getElementById('password');
    const confirm   = document.getElementById('confirmpassword');
    const gender    = document.querySelectorAll('input[name="gender"]');
    const date      = document.getElementById('date');
    const terms     = document.getElementById('checkbox');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* показать ошибку в блоке поля */
    function showError(container, mark, message){
        clearError(container);
        if (mark) mark.classList.add('is-invalid');
        const p = document.createElement('p');
        p.className = 'error-msg';
        p.textContent = message;
        container.appendChild(p);
    }

    /* убрать ошибку из блока */
    function clearError(container){
        if (!container) return;
        const old = container.querySelector('.error-msg');
        if (old) old.remove();
        container.querySelectorAll('.is-invalid')
                 .forEach(el => el.classList.remove('is-invalid'));
    }

    /* основная проверка, возвращает { valid, firstInvalid } */
    function validate(){
        let firstInvalid = null;

        const fail = (container, mark, message) => {
            showError(container, mark, message);
            if (!firstInvalid) firstInvalid = mark || container;
        };

        // имя
        if (firstname.value.trim() === '')
            fail(firstname.closest('div'), firstname, 'Введите имя');

        // фамилия
        if (lastname.value.trim() === '')
            fail(lastname.closest('div'), lastname, 'Введите фамилию');

        // email
        if (email.value.trim() === '')
            fail(email.closest('div'), email, 'Введите email');
        else if (!emailRegex.test(email.value.trim()))
            fail(email.closest('div'), email, 'Неверный формат email');

        // пароль
        if (password.value === '')
            fail(password.closest('div'), password, 'Введите пароль');
        else if (password.value.length < 6)
            fail(password.closest('div'), password, 'Минимум 6 символов');

        // подтверждение пароля
        if (confirm.value === '')
            fail(confirm.closest('div'), confirm, 'Повторите пароль');
        else if (confirm.value !== password.value)
            fail(confirm.closest('div'), confirm, 'Пароли не совпадают');

        // пол
        const genderChosen = [...gender].some(r => r.checked);
        if (!genderChosen){
            const box = gender[0].closest('div');
            clearError(box);
            gender.forEach(r => r.classList.add('is-invalid'));
            showError(box, null, 'Выберите пол');
            if (!firstInvalid) firstInvalid = gender[0];
        }

        // дата рождения
        if (date.value === '')
            fail(date.closest('div'), date, 'Укажите дату рождения');
        else if (new Date(date.value) > new Date())
            fail(date.closest('div'), date, 'Дата не может быть в будущем');

        // согласие с условиями
        if (!terms.checked)
            fail(terms.closest('div'), terms, 'Нужно принять условия');

        return { valid: firstInvalid === null, firstInvalid };
    }

    /* перехватываем отправку */
    form.addEventListener('submit', (e) => {
        const { valid, firstInvalid } = validate();
        if (!valid){
            e.preventDefault(); // не переходим на /register
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // если valid === true — форма уходит как обычно
    });

    /* убираем ошибку, как только юзер начал исправлять поле */
    [firstname, lastname, email, password, confirm, date].forEach(el => {
        el.addEventListener('input', () => clearError(el.closest('div')));
    });
    gender.forEach(r => r.addEventListener('change', () => clearError(r.closest('div'))));
    terms.addEventListener('change', () => clearError(terms.closest('div')));
});