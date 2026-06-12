/* === 3D-эффекты Spider-Man: tilt карточки, поворот сцены, паук следит за курсором === */

(function () {
    const scene3d = document.querySelector('.scene-3d');
    const card = document.querySelector('.content');
    const spider = document.querySelector('.spider-logo');

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function tick() {
        curX += (targetX - curX) * 0.07;
        curY += (targetY - curY) * 0.07;

        if (scene3d) {
            const rx = -curY * 4;
            const ry =  curX * 6;
            scene3d.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        }

        if (card) {
            const tiltX = -curY * 8;
            const tiltY =  curX * 10;
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        }

        if (spider) {
            const followX = curX * 25;
            const followY = curY * 25;
            spider.style.translate = `${followX}px ${followY}px`;
        }

        requestAnimationFrame(tick);
    }

    tick();

    // Web-shoot по клику
    document.addEventListener('click', (e) => {
        if (e.target.closest('a, button, input, textarea')) return;
        spawnWebShot(e.clientX, e.clientY);
    });

    function spawnWebShot(x, y) {
        const shot = document.createElement('div');
        shot.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.85);
            box-shadow: 0 0 20px rgba(255, 80, 80, 0.7);
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9999;
            transition: width 0.6s ease-out, height 0.6s ease-out, opacity 0.6s ease-out;
        `;
        document.body.appendChild(shot);
        requestAnimationFrame(() => {
            shot.style.width = '120px';
            shot.style.height = '120px';
            shot.style.opacity = '0';
        });
        setTimeout(() => shot.remove(), 700);
    }
})();
