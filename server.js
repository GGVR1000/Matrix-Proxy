const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Matrix Proxy V1.2</title>
    <style>
        body { margin: 0; background: #000; color: #0f0; font-family: 'Courier New', monospace; overflow: hidden; perspective: 1000px; height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; }
        #canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.1s ease-out; z-index: 1; }
        .shard { position: absolute; border: 1px solid rgba(0, 255, 0, 0.4); background: rgba(0, 15, 0, 0.9); padding: 10px; font-size: 11px; transform-style: preserve-3d; width: 220px; height: 160px; overflow: hidden; word-break: break-all; pointer-events: none; user-select: none; }
        
        .ui-container { position: relative; z-index: 100; text-align: center; background: rgba(0, 0, 0, 0.85); padding: 35px; border: 1px solid #0f0; box-shadow: 0 0 25px rgba(0, 255, 0, 0.3); backdrop-filter: blur(5px); }
        h1 { font-size: 1.3rem; letter-spacing: 5px; margin-bottom: 20px; text-shadow: 0 0 10px #0f0; }
        
        #proxy-form { display: flex; flex-direction: column; align-items: center; }
        .search-box { background: #000; border: 1px solid #0f0; color: #0f0; padding: 12px; width: 350px; font-family: 'Courier New', monospace; outline: none; text-align: center; font-size: 1rem; transition: all 0.3s; }
        .search-box:focus { box-shadow: 0 0 20px #0f0; background: rgba(0, 20, 0, 1); }
        
        .tag { font-size: 0.7rem; margin-top: 15px; opacity: 0.6; letter-spacing: 2px; }
    </style>
</head>
<body>
    <div id="canvas"></div>

    <div class="ui-container">
        <h1>MATRIX PROXY V1.2</h1>
        <form id="proxy-form">
            <input type="text" id="url-input" class="search-box" placeholder="ENTER URL OR SEARCH..." autocomplete="off">
        </form>
        <div class="tag">BY THE OFFICIAL NOVA</div>
    </div>

    <script>
        // --- 1. PROXY LOGIC ---
        const form = document.getElementById('proxy-form');
        const input = document.getElementById('url-input');

        form.onsubmit = (e) => {
            e.preventDefault();
            let query = input.value.trim();
            if (!query) return;

            let targetUrl = "";
            // Check if it looks like a URL
            if (query.includes('.') && !query.includes(' ')) {
                targetUrl = query.startsWith('http') ? query : 'https://' + query;
            } else {
                // Otherwise, search via DuckDuckGo (more privacy focused)
                targetUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
            }

            // Redirect through a public proxy gateway
            // Note: This is a basic implementation. 
            window.location.href = 'https://www.croxyproxy.com/_proxy/php?u=' + encodeURIComponent(targetUrl);
        };

        // --- 2. SHARD ANIMATION ---
        const canvas = document.getElementById('canvas');
        let shards = [];
        const ART = ["VOID_CORE: 0123456789", "EXISTENCE_IS_DATA", "SYSTEM_DUMP", "USER_OBSERVES_VOID", "STATIC_ETERNITY", "ACCESS_GRANTED", "ENCRYPT_001"];
        
        function spawn() {
            const el = document.createElement('div');
            el.className = 'shard';
            el.innerText = ART[Math.floor(Math.random() * ART.length)];
            const x = (Math.random() - 0.5) * window.innerWidth * 8;
            const y = (Math.random() - 0.5) * window.innerHeight * 8;
            const z = -6000;
            const obj = { el, x, y, z, rx: Math.random()*360, ry: Math.random()*360, speed: 18 + Math.random()*22 };
            canvas.appendChild(el);
            shards.push(obj);
        }

        function render() {
            for (let i = shards.length - 1; i >= 0; i--) {
                let s = shards[i];
                s.z += s.speed; s.rx += 0.1; s.ry += 0.1;
                s.el.style.transform = \`translate3d(\${s.x}px,\${s.y}px,\${s.z}px) rotateX(\${s.rx}deg) rotateY(\${s.ry}deg)\`;
                if (s.z > 1500) { s.el.remove(); shards.splice(i, 1); }
            }
            if (shards.length < 90) spawn();
            requestAnimationFrame(render);
        }
        render();

        window.onmousemove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 80;
            const y = (e.clientY / window.innerHeight - 0.5) * -80;
            canvas.style.transform = \`rotateY(\${x}deg) rotateX(\${y}deg)\`;
        };
    </script>
</body>
</html>
    `);
});

app.listen(port, () => {
    console.log('Matrix Proxy Online at port ' + port);
});
