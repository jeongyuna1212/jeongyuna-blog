// script.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 네비게이션 액티브 표시
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 2. 다크 모드 (Local Storage 연결)
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // 기존 테마 불러오기
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerText = '☀️';
        }

        // 클릭 이벤트
        themeToggleBtn.addEventListener('click', () => {
            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerText = '🌙';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerText = '☀️';
            }
        });
    }

    // 3. 페이지 읽기 프로그래스 바 및 예상 읽기 시간 기능 (게시글 페이지일 때만 주입 및 작동)
    if (window.location.pathname.includes('post')) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = '<div class="progress-bar" id="myBar"></div>';
        document.body.prepend(progressContainer);

        // 새로운 기능: 예상 읽기 시간 계산
        const postContent = document.querySelector('.post-content');
        if (postContent) {
            const text = postContent.innerText || postContent.textContent;
            const wordCount = text.trim().split(/\s+/).length;
            const readingTimeInfo = Math.ceil(wordCount / 150); // 한국어 기준 (약 150단어/분)
            
            const postMeta = document.querySelector('.post-meta');
            if (postMeta) {
                const timeSpan = document.createElement('span');
                timeSpan.innerHTML = `⏱️ 예상 읽기 시간: ${readingTimeInfo}분`;
                timeSpan.style.display = 'inline-flex';
                timeSpan.style.alignItems = 'center';
                // 뱃지보다 앞에 배치
                const badge = postMeta.querySelector('.badge');
                if (badge) {
                    postMeta.insertBefore(timeSpan, badge);
                } else {
                    postMeta.appendChild(timeSpan);
                }
            }
        }

        window.addEventListener('scroll', () => {
            let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (winScroll / height) * 100;
            const myBar = document.getElementById("myBar");
            if(myBar) myBar.style.width = scrolled + "%";
        });
    }

    // 4. 맨 위로 가기 버튼 주입 및 작동
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scrollTopBtn';
    scrollTopBtn.innerText = '↑';
    scrollTopBtn.title = '맨 위로 이동';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        // 스크롤이 300px 이상 내려가면 버튼 표시
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    console.log("Welcome to JUNG YUNA's Dev Blog!");
});
