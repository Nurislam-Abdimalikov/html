/* Подгружает HTML сцены Spider-Man, потом запускает spider.js */
(async function () {
    // путь до папки spider/ относительно текущего скрипта
    const base = new URL('.', document.currentScript.src);

    try {
        const res = await fetch(new URL('spider-scene.html', base));
        const html = await res.text();
        document.body.insertAdjacentHTML('afterbegin', html);
    } catch (e) {
        console.error('Не удалось загрузить spider-scene.html:', e);
        return;
    }

    const script = document.createElement('script');
    script.src = new URL('spider.js', base).href;
    document.body.appendChild(script);
})();
