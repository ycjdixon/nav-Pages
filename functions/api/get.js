// 处理 /api/get 接口，获取指定分类的 KV 数据
export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const cate = url.searchParams.get('cate');

    // 校验分类参数
    if (!cate) {
        return new Response('缺少分类参数', { status: 400 });
    }

    try {
        // 从指定 KV 命名空间（KV_NAMESPACE_PAGES）获取数据
        const content = await env.KV_NAMESPACE_PAGES.get(cate) || '';
        return new Response(content, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        console.error('获取 KV 数据失败:', err);
        return new Response('获取数据失败', { status: 500 });
    }
}
