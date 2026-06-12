/* === 3D-параллакс: горы и облака реагируют на мышь и прокрутку === */

(function () {
    const mountain = document.querySelector('.mountain-img');
    const clouds = Array.from(document.querySelectorAll('.cloud'));
    const sun = document.querySelector('.sun-glow');

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });

    function tick() {
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;

        if (mountain) {
            const mx = -currentX * 25;
            const my = -currentY * 15 + scrollY * 0.15;
            mountain.style.transform =
                `translate3d(${mx}px, ${my}px, 0) scale(1.04)`;
        }

        clouds.forEach((cloud, i) => {
            const depth = 30 + i * 15;
            const cx = -currentX * depth;
            const cy = -currentY * (depth * 0.4) + scrollY * 0.05;
            cloud.style.translate = `${cx}px ${cy}px`;
        });

        if (sun) {
            sun.style.transform = `translate(${currentX * 20}px, ${currentY * 12}px)`;
        }

        requestAnimationFrame(tick);
    }

    tick();
})();
