export default {
    async fetch(request, env, ctx) {
        // 终极测试：忽略一切，直接返回一个纯文本HTML
        const html = `<!DOCTYPE html><html><head><title>终极测试</title></head><body><h1>Hello from Pages Functions!</h1><p>如果看到此文字，说明 _worker.js 已被执行。</p></body></html>`;
        
        return new Response(html, {
            headers: { 
                'Content-Type': 'text/html;charset=UTF-8',
                'Cache-Control': 'no-cache'
            }
        });
    }
};
