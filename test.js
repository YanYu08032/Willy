// 1. 初始化資料結構
let galleryData = {
    daily: [],
    graduation: [],
    scenery: [],
    food: []
};

// 2. 核心功能：從 Cloudflare Worker 抓取 Notion 資料
async function initWebsite() {
    const workerUrl = 'https://notion-api-worker.hqs6f6g44p.workers.dev/'; 

    try {
        const response = await fetch(workerUrl);
        const data = await response.json();

        // 重置資料，避免重複加載
        galleryData = { daily: [], graduation: [], scenery: [], food: [] };

       data.results.forEach(page => {
    const props = page.properties;
    
    // 檢查是否有分類且有圖片
    if (props.Category.multi_select.length > 0 && props.Photo.files.length > 0) {
        const category = props.Category.multi_select[0].name.toLowerCase();
        
        // --- 修改這裡：如果標題為空，自動給一個預設值 ---
        let title = " ";
        if (props.Title && props.Title.title && props.Title.title.length > 0) {
            title = props.Title.title[0].plain_text;
        }
        // ------------------------------------------

        const imgUrl = props.Photo.files[0].file.url;

        if (galleryData[category]) {
            galleryData[category].push({ src: imgUrl, title: title });
        }
    }
});

        console.log("✅ Notion Gallery Loaded Successfully!");
        
        // 抓完資料後，檢查目前是否在 Portfolio 頁面，如果是則顯示
        const activePage = document.querySelector('.page.active').id;
        if(activePage === 'portfolio') {
            // 可以在此觸發初始渲染
        }

    } 
    catch (error) {
        console.error("❌ Failed to load Notion data:", error);
    }
}

// 3. 顯示子相簿邏輯
function openSubGallery(category) {
    const mainDiv = document.getElementById('portfolio-main');
    const detailDiv = document.getElementById('portfolio-detail');
    const contentDiv = document.getElementById('gallery-content');
    const titleH2 = document.getElementById('gallery-title');

    titleH2.innerText = category.toUpperCase();
    contentDiv.innerHTML = '';
    
    if(galleryData[category] && galleryData[category].length > 0) {
        galleryData[category].forEach(item => {
           // 修改 script.js 裡的 innerHTML 部分
    contentDiv.innerHTML += `
        <div class="project-card">
            <img src="${item.src}" loading="lazy" onclick="openLightbox(this.src)">
            <p>${item.title}</p>
        </div>
            `;
        });
    } else {
        contentDiv.innerHTML = '<p style="grid-column: 1/-1; color: #999;">這個分類目前還沒有照片喔！</p>';
    }

    mainDiv.style.display = 'none';
    detailDiv.style.display = 'block';
    window.scrollTo({ top: 250, behavior: 'smooth' });
}

// 4. 其餘導覽與燈箱功能 (保持不變)
function closeSubGallery() {
    document.getElementById('portfolio-main').style.display = 'block';
    document.getElementById('portfolio-detail').style.display = 'none';
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav ul li').forEach(li => li.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.getElementById('nav-' + pageId).classList.add('active');
    if (pageId !== 'portfolio') closeSubGallery();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').style.display = 'flex';
}

// 5. 啟動網站

initWebsite();



