// script.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Visit Counter Simulation (LocalStorage)
    // Create a base realistic number if empty
    let totalVisits = parseInt(localStorage.getItem('totalVisits') || '3142');
    let todayVisits = parseInt(localStorage.getItem('todayVisits') || '12');

    // Only increment if it's the first visit of this browser session
    if (!sessionStorage.getItem('visited')) {
        totalVisits++;
        todayVisits++;
        localStorage.setItem('totalVisits', totalVisits);
        localStorage.setItem('todayVisits', todayVisits);
        sessionStorage.setItem('visited', 'true');
    }

    // Print to Sidebar
    const statTotalEl = document.getElementById('stat-total');
    const statTodayEl = document.getElementById('stat-today');
    if (statTotalEl) statTotalEl.innerText = totalVisits.toLocaleString();
    if (statTodayEl) statTodayEl.innerText = todayVisits.toLocaleString();


    // 2. Search Box Implementation
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // 3. Search Results Render Logic (only active on search.html)
    if (window.location.pathname.endsWith('search.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const resultsTitle = document.getElementById('search-query-display');
        const resultsContainer = document.getElementById('search-results-container');
        
        if (query && window.BLOG_POSTS) {
            if(resultsTitle) resultsTitle.innerText = `"${query}" 검색 결과`;
            const lowerQuery = query.toLowerCase();
            const matchedPosts = window.BLOG_POSTS.filter(post => 
                post.title.toLowerCase().includes(lowerQuery) || 
                post.summary.toLowerCase().includes(lowerQuery) || 
                post.categoryName.toLowerCase().includes(lowerQuery)
            );

            if (matchedPosts.length > 0) {
                resultsContainer.innerHTML = matchedPosts.map(post => `
                    <a href="${post.filename}" class="post-card">
                        <span class="badge ${post.categoryClass}">${post.categoryName}</span>
                        <h3>${post.title}</h3>
                        <p>${post.summary}</p>
                        <div class="post-card-meta">
                            <span>📅 ${post.date}</span>
                            <span>· ✍️ 정유나</span>
                        </div>
                    </a>
                `).join('');
            } else {
                resultsContainer.innerHTML = '<p style="padding: 3rem; text-align: center; color: var(--text-muted); font-size: 1.1rem;">일치하는 검색 결과가 없습니다.</p>';
            }
        } else {
            if(resultsTitle) resultsTitle.innerText = '검색어를 입력해주세요.';
        }
    }

    // 4. Dark Mode (Local Storage 연동)
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '☀️ 라이트모드';
        }

        themeToggleBtn.addEventListener('click', () => {
            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerHTML = '🌙 다크모드';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerHTML = '☀️ 라이트모드';
            }
        });
    }

    // 5. Scroll Progress Bar (For post pages ONLY)
    if (window.location.pathname.includes('post_')) {
        const postDetailContent = document.querySelector('.post-detail-content');
        if (postDetailContent) {
            const text = postDetailContent.innerText || postDetailContent.textContent;
            const wordCount = text.trim().split(/\s+/).length;
            const readingTimeInfo = Math.ceil(wordCount / 150); // 한국어 약 150단어/분
            
            const metaInfo = document.querySelector('.meta-info');
            if (metaInfo) {
                const timeSpan = document.createElement('span');
                timeSpan.innerHTML = `⏱️ ${readingTimeInfo}분 소요`;
                metaInfo.appendChild(timeSpan);
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

    // 6. Scroll To Top Button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
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
    }
});
