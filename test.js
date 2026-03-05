 const galleryData = {
            daily: [
               { src: 'IMG_0120.JPG', title: '' },
                { src: 'IQIL9617.JPG', title: '' }
            ],
            graduation: [
                { src: 'IMG_1147.JPG', title: '' },
                { src: 'IMG_1917.JPG', title: '' }
                
            ],
            scenery: [
                { src: 'IMG_4611.JPG', title: '' },
                { src: 'JYGO0340.JPG', title: '' },
                { src: 'QIOJ2478.JPG', title: '' }
            ],
            food: [
                { src: 'IMG_4578.JPG', title: '' },
                { src: 'IMG_4786.JPG', title: '' },
                { src: 'IMG_4836.JPG', title: '' },
                { src: 'Food.JPG', title: '' }
            ]
        };

        function openSubGallery(category) {
            const mainDiv = document.getElementById('portfolio-main');
            const detailDiv = document.getElementById('portfolio-detail');
            const contentDiv = document.getElementById('gallery-content');
            const titleH2 = document.getElementById('gallery-title');

            titleH2.innerText = category.toUpperCase();
            contentDiv.innerHTML = '';
            
            if(galleryData[category]) {
                galleryData[category].forEach(item => {
                    contentDiv.innerHTML += `
                        <div class="project-card">
                            <img src="${item.src}" onclick="openLightbox(this.src)">
                            <p>${item.title}</p>
                        </div>
                    `;
                });
            }

            mainDiv.style.display = 'none';
            detailDiv.style.display = 'block';
            window.scrollTo({ top: 250, behavior: 'smooth' });
        }

        function closeSubGallery() {
            document.getElementById('portfolio-main').style.display = 'block';
            document.getElementById('portfolio-detail').style.display = 'none';
        }

        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.querySelectorAll('nav ul li').forEach(item => item.classList.remove('active'));

            document.getElementById(pageId).classList.add('active');
            document.getElementById('nav-' + pageId).classList.add('active');

            if (pageId !== 'portfolio') {
                closeSubGallery();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function openLightbox(src) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = src;
            lightbox.style.display = 'flex';
        }