const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// This serves the HTML/JS to the user's browser
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Matrix Proxy V1.2</title>
    <style>
        body { 
            margin: 0; background: #000; color: #0f0; 
            font-family: 'Courier New', monospace; overflow: hidden; 
            perspective: 1000px; height: 100vh; width: 100vw;
            display: flex; justify-content: center; align-items: center;
        }
        #canvas { 
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
            transform-style: preserve-3d; transition: transform 0.1s ease-out; z-index: 1;
        }
        .shard { 
            position: absolute; border: 1px solid rgba(0, 255, 0, 0.4); 
            background: rgba(0, 15, 0, 0.9); padding: 10px; font-size: 11px; 
            transform-style: preserve-3d; width: 220px; height: 160px; 
            overflow: hidden; word-break: break-all; pointer-events: none; user-select: none;
        }
        .ui-container {
            position: relative; z-index: 100; text-align: center;
            background: rgba(0, 0, 0, 0.8); padding: 30px; border: 1px solid #0f0;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
        }
        .search-box {
            background: #000; border: 1px solid #0f0; color: #0f0; padding: 12px;
            width: 320px; font-family: 'Courier New', monospace; outline: none; text-align: center;
        }
    </style>
</head>
<body>
    <div id="canvas"></div>
    <div class="ui-container">
        <h1>MATRIX PROXY V1.2</h1>
        <form action="https://www.google.com/search" method="GET">
            <input type="text" name="q" class="search-box" placeholder="[ENTER_QUERY_HERE]" autocomplete="off">
        </form>
        <div style="font-size: 0.7rem; margin-top: 15px; opacity: 0.6;">BY THE OFFICIAL NOVA</div>
    </div>

    <script>
        const canvas = document.getElementById('canvas');
        let shards = [];
        const ART_STRINGS = ["VOID_CORE: 0123456789", "EXISTENCE_IS_DATA", "SYSTEM_DUMP", "USER_OBSERVES_VOID", "STATIC_ETERNITY"];

        function spawn() {
            const el = document.createElement('div');
            el.className = 'shard';
            el.innerText = ART_STRINGS[Math.floor(Math.random() * ART_STRINGS.length)];
            const x = (Math.random() - 0.5) * window.innerWidth * 8; 
            const y = (Math.random() - 0.5) * window.innerHeight * 8; 
            const z = -6000; 
            const obj = { el, x, y, z, rx: Math.random()*360, ry: Math.random()*360, speed: 15 + Math.random()*25 };
            canvas.appendChild(el);
            shards.push(obj);
        }

        function render() {
            for (let i = shards.length - 1; i >= 0; i--) {
                let s = shards[i];
                s.z += s.speed; s.rx += 0.1; s.ry += 0.1;
                s.el.style.transform = "translate3d(" + s.x + "px," + s.y + "px," + s.z + "px) rotateX(" + s.rx + "deg) rotateY(" + s.ry + "deg)";
                if (s.z > 1500) { s.el.remove(); shards.splice(i, 1); }
            }
            if (shards.length < 80) spawn();
            requestAnimationFrame(render);
        }
        render();

        window.onmousemove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 100; 
            const y = (e.clientY / window.innerHeight - 0.5) * -100;
            canvas.style.transform = "rotateY(" + x + "deg) rotateX(" + y + "deg)";
        };
    </script>
</body>
</html>
    `);
});

app.listen(port, () => {
    console.log('Matrix Proxy active on port ' + port);
});
