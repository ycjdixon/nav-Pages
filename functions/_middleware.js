// 全局中间件：处理所有请求的跨域头
export async function onRequest(context) {
    // 执行后续的 Functions 逻辑（api/get.js / api/save.js）
    const response = await context.next();
    
    // 添加跨域响应头
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
}
