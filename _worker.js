// 1. 将你的完整 index.html 内容进行 Base64 编码
// 你可以用这个命令（Mac/Linux）： base64 -i index.html
// 或者用在线工具，将编码后的一长串字符（不含换行）放在下面
const htmlBase64 = '这里是你的 index.html 经过 Base64 编码后的一大串字符...';

// 2. 解码并返回
const decoder = new TextDecoder();
const html = decoder.decode(Uint8Array.from(atob(htmlBase64), c => c.charCodeAt(0)));

return new Response(html, {
    headers: { 
        'Content-Type': 'text/html;charset=UTF-8'
    }
});
export default {
    async fetch(request, env, ctx) {
        const SETTINGS_PASSWORD = env.SETTINGS_PASSWORD || '123.321';
        // 核心修改：变量名从 KV_NAMESPACE 改为 KV_NAMESPACE_PAGES
        const KV_PAGES = env.KV_NAMESPACE_PAGES;
        
        const url = new URL(request.url);
        
        // 1. 处理API请求
        if (url.pathname.startsWith('/api/')) {
            // 获取分类数据
            if (url.pathname === '/api/get') {
                const cate = url.searchParams.get('cate');
                const content = await KV_PAGES.get(cate) || '';
                return new Response(content, {
                    headers: { 
                        'Content-Type': 'text/plain;charset=UTF-8',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
            
            // 验证密码
            if (url.pathname === '/api/check-pwd' && request.method === 'POST') {
                const { password } = await request.json();
                
                if (password === SETTINGS_PASSWORD) {
                    return new Response('OK', { status: 200 });
                } else {
                    return new Response('Invalid password', { status: 401 });
                }
            }
            
            // 保存数据
            if (url.pathname === '/api/save' && request.method === 'POST') {
                const cate = url.searchParams.get('cate');
                const { content, password } = await request.json();
                
                // 验证密码
                if (password !== SETTINGS_PASSWORD) {
                    return new Response('Invalid password', { status: 401 });
                }
                
                await KV_PAGES.put(cate, content);
                return new Response('OK', { status: 200 });
            }
            
            return new Response('Not Found', { status: 404 });
        }
        
        // 2. 处理静态文件请求（返回index.html）
        // 读取index.html文件并返回
       const html = `
<!DOCTYPE html>
<html>
<head><title>测试页</title></head>
<body style="padding:20px;">
    <h1>Pages站点基础功能正常！</h1>
    <p>这说明 _worker.js 已成功执行并返回HTML。</p>
    <hr>
    <h3>测试KV数据读取：</h3>
    <button onclick="fetch('/api/get?cate=常用').then(r=>r.text()).then(d=>alert('结果：'+ (d||'空'))).catch(e=>alert('失败'+e))">点击测试 /api/get</button>
    <p>（如果KV无数据，会返回空）</p>
</body>
</html>`;

return new Response(html, {
    headers: { 
        'Content-Type': 'text/html;charset=UTF-8'
    }
});
