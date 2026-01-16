export default {
    async fetch(request, env, ctx) {
        // 第一步：先忽略所有API和KV逻辑，只专注于把页面完整显示出来
        const htmlBase64 = '你的Base64编码字符串'; // 请替换这里！
        
        try {
            // 解码Base64字符串得到原始HTML
            const html = atob(htmlBase64);
            
            return new Response(html, {
                headers: { 
                    'Content-Type': 'text/html;charset=UTF-8',
                    'Cache-Control': 'no-cache'
                }
            });
        } catch (e) {
            // 如果解码失败，返回错误信息以便调试
            return new Response('HTML解码失败: ' + e.message, { status: 500 });
        }
    }
};
