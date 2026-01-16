// 全局中间件，处理跨域
export async function onRequest(context) {
    // 执行下一个函数（API处理逻辑）
    const response = await context.next();
    
    // 添加跨域头
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
}