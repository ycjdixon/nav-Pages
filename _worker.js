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
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>蓝精灵的网址导航</title>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
            font-family: "Microsoft YaHei", "Segoe UI", "PingFang SC", sans-serif;
        }
        /* ... 这里粘贴原CSS代码的全部内容（请确保完整粘贴） ... */
    </style>
</head>
<body>
    <!-- ... 这里粘贴原HTML body代码的全部内容（请确保完整粘贴） ... -->
    
    <script>
        let searchEngine = 'baidu';
        let currentCate = '常用';

        document.addEventListener('DOMContentLoaded', () => {
            showCate('常用');
            // ... 原JS代码的其他部分 ...
        });

        // ... 原JS函数代码 ...
        
        // 修改后的checkPwd和save函数（如上面所示）
        async function checkPwd() {
            // ... 修改后的代码 ...
        }
        
        async function save() {
            // ... 修改后的代码 ...
        }
        
        // ... 原JS代码的其他部分 ...
    </script>
</body>
</html>
        `;
        
        return new Response(html, {
            headers: { 
                'Content-Type': 'text/html;charset=UTF-8',
                'Cache-Control': 'no-cache'
            }
        });
    }
};