/* Подгружает HTML сцены кота, потом запускает cat.js */
(async function () {
    // путь до папки cat/ относительно текущего скрипта
    const base = new URL('.', document.currentScript.src);

    try {
        const res = await fetch(new URL('cat-scene.html', base));
        const html = await res.text();
        document.body.insertAdjacentHTML('afterbegin', html);
    } catch (e) {
        console.error('Не удалось загрузить cat-scene.html:', e);
        return;
    }

    const script = document.createElement('script');
    script.src = new URL('cat.js', base).href;
    document.body.appendChild(script);
})();
