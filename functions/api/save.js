// 处理 /api/save 接口，保存分类内容到 KV
export async function onRequestPost(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const cate = url.searchParams.get('cate');

    // 校验分类参数
    if (!cate) {
        return new Response('缺少分类参数', { status: 400 });
    }

    try {
        // 获取 POST 内容
        const content = await request.text();
        // 保存到指定 KV 命名空间（KV_NAMESPACE_PAGES）
        await env.KV_NAMESPACE_PAGES.put(cate, content);
        return new Response('ok', {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        console.error('保存 KV 数据失败:', err);
        return new Response('保存数据失败', { status: 500 });
    }
}
