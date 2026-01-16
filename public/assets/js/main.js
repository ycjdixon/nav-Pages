// 全局变量
let searchEngine = 'baidu';
const SETTINGS_PASSWORD = window.SETTINGS_PASSWORD || '123.321'; // 密码从环境变量或默认值获取
let currentCate = '常用';

// 页面加载完成初始化
document.addEventListener('DOMContentLoaded', () => {
    showCate('常用');
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const clearBtn = document.querySelector('.clear-btn');
        clearBtn.style.opacity = this.value ? '1' : '0.7';
        clearBtn.style.visibility = this.value ? 'visible' : 'visible';
    });
    setSearch('baidu');

    // 分类选择器联动
    document.getElementById('cateSelect').addEventListener('change', loadCateToEditor);
    
    // ESC关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
});

// 显示指定分类的内容
async function showCate(cate) {
    currentCate = cate;
    // 重置所有分类按钮样式
    document.querySelectorAll('.left-cate-buttons .btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === cate) {
            btn.classList.add('active');
        }
    });

    // 从API获取分类内容
    try {
        const res = await fetch(`/api/get?cate=${encodeURIComponent(cate)}`);
        const content = await res.text();
        const contentEl = document.getElementById('content');
        
        if (!content || content.trim() === '') {
            contentEl.innerHTML = '<p class="empty-tip">暂无内容，点击右上角「设置」添加</p>';
            return;
        }

        // 解析内容并渲染
        const links = content.trim().split('\n').filter(line => line.trim() && line.includes('|'));
        let html = `<div class="cate-section"><h2 class="cate-title">${cate}</h2><div class="link-btns">`;
        links.forEach(line => {
            const [name, url] = line.split('|').map(item => item.trim());
            if (name && url) {
                html += `<a href="${url}" target="_blank" class="link-btn">${name}</a>`;
            }
        });
        html += `</div></div>`;
        contentEl.innerHTML = html;
    } catch (err) {
        console.error('加载分类失败:', err);
        document.getElementById('content').innerHTML = '<p class="empty-tip">加载失败，请刷新重试</p>';
    }
}

// 设置搜索引擎
function setSearch(engine) {
    searchEngine = engine;
    // 重置按钮样式
    document.getElementById('baiduBtn').className = engine === 'baidu' ? 'btn btn-blue' : 'btn btn-gray';
    document.getElementById('googleBtn').className = engine === 'google' ? 'btn btn-blue' : 'btn btn-gray';
}

// 清空搜索框
function clearSearch() {
    document.getElementById('searchInput').value = '';
    const clearBtn = document.querySelector('.clear-btn');
    clearBtn.style.opacity = '0.7';
}

// 执行搜索
function search() {
    const keyword = document.getElementById('searchInput').value.trim();
    if (!keyword) return;
    
    let searchUrl = '';
    if (searchEngine === 'baidu') {
        searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`;
    } else if (searchEngine === 'google') {
        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
    }
    window.open(searchUrl, '_blank');
}

// 打开设置模态框
function openSettings() {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('pwdSection').style.display = 'block';
    document.getElementById('editSection').style.display = 'none';
    document.getElementById('pwdInput').value = '';
    document.getElementById('pwdInput').focus();
}

// 关闭模态框
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// 验证密码
function checkPwd() {
    const inputPwd = document.getElementById('pwdInput').value.trim();
    if (inputPwd === SETTINGS_PASSWORD) {
        document.getElementById('pwdSection').style.display = 'none';
        document.getElementById('editSection').style.display = 'block';
        loadCateToEditor();
    } else {
        alert('密码错误！');
        document.getElementById('pwdInput').value = '';
        document.getElementById('pwdInput').focus();
    }
}

// 加载选中分类的内容到编辑器
async function loadCateToEditor() {
    const cate = document.getElementById('cateSelect').value;
    try {
        const res = await fetch(`/api/get?cate=${encodeURIComponent(cate)}`);
        const content = await res.text();
        document.getElementById('editor').value = content || '';
    } catch (err) {
        console.error('加载编辑器内容失败:', err);
        alert('加载失败，请刷新重试');
    }
}

// 保存分类内容
async function save() {
    const cate = document.getElementById('cateSelect').value;
    const content = document.getElementById('editor').value.trim();
    
    try {
        const res = await fetch(`/api/save?cate=${encodeURIComponent(cate)}`, {
            method: 'POST',
            body: content
        });
        
        if (res.ok) {
            alert('保存成功！');
            showCate(cate); // 刷新当前分类
            closeModal();
        } else {
            alert('保存失败，请重试');
        }
    } catch (err) {
        console.error('保存失败:', err);
        alert('保存失败，请检查网络');
    }
}