const http = require('http');
const httpProxy = require('http-proxy');

// Create the proxy server with redirection and SSL bypass support
const proxy = httpProxy.createProxyServer({ 
    secure: false, 
    followRedirects: true 
});

// This variable remembers the last site visited to handle sub-links (like /results)
let lastHost = "";

const server = http.createServer((req, res) => {
    // Ignore browser favicon requests
    if (req.url === '/favicon.ico') return res.end();

    // Parse the URL to find the 'url' parameter
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    let targetUrl = urlParams.searchParams.get('url');

    // CATCH-ALL LOGIC: 
    // If a site tries to go to a relative path (e.g., /search), 
    // we attach it to the last known host so the proxy doesn't break.
    if (!targetUrl && lastHost && req.url !== "/") {
        targetUrl = lastHost + req.url;
    }

    // LANDING PAGE: Shown when no URL is being proxied
    if (!targetUrl) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <body style="font-family:sans-serif; text-align:center; background:#121212; color:#0f0; padding-top:100px; margin:0;">
                <h1 style="font-size:3.5rem; letter-spacing:8px; text-shadow: 0 0 10px #0f0;">MATRIX PROXY v2</h1>
                <p style="color:#888; font-size:1.2rem;">Secure Tunnel Active & Ready</p>
                
                <form action="/" method="GET" style="margin-top:40px;">
                    <input type="text" name="url" placeholder="Enter full URL (e.g., https://yewtu.be)" 
                           style="width:500px; padding:18px; border-radius:30px; border:2px solid #0f0; background:#000; color:#0f0; font-size:1rem; outline:none; box-shadow: 0 0 15px rgba(0,255,0,0.2);">
                    <br><br>
                    <button type="submit" 
                            style="padding:12px 40px; border-radius:25px; border:none; background:#0f0; color:#000; font-weight:bold; font-size:1rem; cursor:pointer; transition: 0.3s; box-shadow: 0 4px 10px rgba(0,255,0,0.3);">
                        OPEN TUNNEL
                    </button>
                </form>

                <div style="margin-top:60px; color:#555; font-size:14px; line-height:1.6;">
                    <p>Tip: Use <b>yewtu.be</b> for a proxy-friendly YouTube experience.</p>
                    <div style="margin-top:30px; border-top:1px solid #222; padding-top:20px; display:inline-block; width:300px;">
                        <span style="letter-spacing:2px; color:#0f0;"><b>MADE BY THE.OFFICIAL.NOVA</b></span>
                    </div>
                </div>
            </body>
        `);
        return;
    }

    // PROXY EXECUTION ENGINE
    try {
        // Force https if the user forgot it
        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }

        const parsed = new URL(targetUrl);
        
        // Save the domain so clicking internal links stays inside the proxy
        lastHost = parsed.origin; 

        console.log(`[TUNNELING] -> ${targetUrl}`);

        // Forward the request to the target website
        proxy.web(req, res, { 
            target: targetUrl, 
            changeOrigin: true,
            autoRewrite: true, 
            headers: { 
                'host': parsed.host,
                'User-Agent': req.headers['user-agent']
            }
        }, (err) => {
            console.error("Proxy Connection Error:", err.message);
            if (!res.headersSent) {
                res.writeHead(502);
                res.end(`
                    <body style="background:#000; color:red; font-family:sans-serif; text-align:center; padding-top:50px;">
                        <h2>Tunnel Connection Failed</h2>
                        <p>${err.message}</p>
                        <p>The site might be blocking proxy traffic or the URL is incorrect.</p>
                        <a href="/" style="color:white;">Return to Home</a>
                    </body>
                `);
            }
        });
    } catch (e) {
        res.writeHead(400);
        res.end("Invalid URL format. Please use: https://site.com");
    }
});

// Railway/Cloud platforms provide the port via process.env.PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("=========================================");
    console.log(` PROXY LIVE ON PORT: ${PORT}          `);
    console.log(" CREDITS: THE.OFFICIAL.NOVA              ");
    console.log("=========================================");
});