// 1. 初始化資料結構
let galleryData = {
    daily: [],
    graduation: [],
    scenery: [],
    food: []
};

let currentCategory = '';
let currentIndex = 0;

// 2. 核心功能：從 Cloudflare Worker 抓取 Notion 資料
async function initWebsite() {
    const workerUrl = 'https://notion-api-worker.hqs6f6g44p.workers.dev/'; 
    const spinner = document.getElementById('loading-spinner');

    try {
        if(spinner) spinner.style.display = 'block';
        
        const response = await fetch(workerUrl);
        const data = await response.json();

        galleryData = { daily: [], graduation: [], scenery: [], food: [] };

        data.results.forEach(page => {
            const props = page.properties;
            if (props.Category.multi_select.length > 0 && props.Photo.files.length > 0) {
                const category = props.Category.multi_select[0].name.toLowerCase();
                let title = " ";
                if (props.Title && props.Title.title && props.Title.title.length > 0) {
                    title = props.Title.title[0].plain_text;
                }
                const imgUrl = props.Photo.files[0].file.url;
                if (galleryData[category]) {
                    galleryData[category].push({ src: imgUrl, title: title });
                }
            }
        });

        console.log("✅ Notion Gallery Loaded Successfully!");
        if(spinner) spinner.style.display = 'none';

    } 
    catch (error) {
        console.error("❌ Failed to load Notion data:", error);
        if(spinner) spinner.innerHTML = '<p style="color:red;">載入失敗，請檢查網路連線。</p>';
    }
}

// 3. 顯示子相簿邏輯
function openSubGallery(category) {
    currentCategory = category;
    const mainDiv = document.getElementById('portfolio-main');
    const detailDiv = document.getElementById('portfolio-detail');
    const contentDiv = document.getElementById('gallery-content');
    const titleH2 = document.getElementById('gallery-title');

    titleH2.innerText = category.toUpperCase();
    contentDiv.innerHTML = '';
    
    if(galleryData[category] && galleryData[category].length > 0) {
        galleryData[category].forEach((item, index) => {
            contentDiv.innerHTML += `
                <div class="project-card" onclick="openLightboxByIndex(${index})">
                    <img src="${item.src}" loading="lazy">
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

function closeSubGallery() {
    document.getElementById('portfolio-main').style.display = 'block';
    document.getElementById('portfolio-detail').style.display = 'none';
}

// 4. 改良版燈箱功能
function openLightboxByIndex(index) {
    currentIndex = index;
    updateLightbox();
    document.getElementById('lightbox').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 禁止背景捲動
}

// 兼容原本 index.html 中的 openLightbox(this.src)
function openLightbox(src) {
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    img.src = src;
    caption.innerText = "";
    document.getElementById('lightbox').style.display = 'flex';
    // 單張圖隱藏切換按鈕
    document.querySelectorAll('.nav-btn').forEach(btn => btn.style.display = 'none');
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.querySelectorAll('.nav-btn').forEach(btn => btn.style.display = 'block');
}

function changeImage(step) {
    if (!currentCategory || !galleryData[currentCategory]) return;
    
    currentIndex += step;
    if (currentIndex >= galleryData[currentCategory].length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = galleryData[currentCategory].length - 1;
    
    updateLightbox();
}

function updateLightbox() {
    const item = galleryData[currentCategory][currentIndex];
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = item.src;
        caption.innerText = item.title;
        img.style.opacity = '1';
    }, 200);
}

// 鍵盤支援
window.addEventListener('keydown', (e) => {
    if (document.getElementById('lightbox').style.display === 'flex') {
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
        if (e.key === 'Escape') closeLightbox();
    }
});

// 5. 導覽功能
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav ul li').forEach(li => li.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.getElementById('nav-' + pageId).classList.add('active');
    if (pageId !== 'portfolio') closeSubGallery();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 6. 啟動網站
initWebsite();
