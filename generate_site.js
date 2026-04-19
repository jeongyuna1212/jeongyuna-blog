const fs = require('fs');
const path = require('path');

const outputDir = __dirname;
const TOTAL_POSTS = 50;

const categories = [
    { id: 'univ', name: '대학교 과목', badgeClass: 'univ' },
    { id: 'dev', name: '개발 공부', badgeClass: 'dev' },
    { id: 'daily', name: '일상/학습', badgeClass: 'motiv' }
];

const sentencePools = {
    univ: [
        "이번 학기 전공 수업은 정말 많은 것을 배우게 해줍니다.",
        "교수님의 열정적인 강의 덕분에 어려운 개념도 조금씩 이해가 갑니다.",
        "과제가 많아 힘들긴 하지만, 그만큼 성장하는 기분이 듭니다.",
        "이산수학에서 배운 논리 구조는 프로그래밍의 훌륭한 뼈대가 됩니다.",
        "컴퓨터 구조 수업을 통해 하드웨어와 소프트웨어의 상호작용을 깊이 있게 배웠습니다.",
        "대학에서 만난 동기들과 스터디를 하며 협업의 중요성을 깨달았습니다.",
        "시험 기간이 다가오면서 배운 내용을 복습하는 데 여념이 없습니다.",
        "전공 기초 과목들은 앞으로의 학습에 튼튼한 토대가 될 것이라 확신합니다.",
        "팀 프로젝트를 진행하면서 의사소통 능력도 함께 키울 수 있었습니다.",
        "어셈블리어의 복잡함 속에 숨겨진 컴퓨터의 진짜 모습을 발견했습니다.",
        "전공 서적을 읽는 것이 처음엔 낯설었지만, 이제는 꽤 익숙해졌습니다.",
        "강의 시간에 배운 알고리즘을 직접 코드로 구현해보니 이해가 훨씬 빠릅니다."
    ],
    dev: [
        "새로운 프로그래밍 언어를 배우는 과정은 항상 설레고 흥미롭습니다.",
        "코드의 오류를 디버깅하면서 문제 해결 능력을 기르고 있습니다.",
        "알고리즘 문제를 풀며 효율적인 시간 복잡도를 고민하는 연습을 합니다.",
        "개발자로서 클린 코드를 작성하는 방법을 꾸준히 공부하고 있습니다.",
        "오픈소스 프로젝트에 기여해보고 싶은 목표가 생겼습니다.",
        "데이터베이스 설계의 중요성을 깨닫고 정규화 과정을 깊이 있게 학습했습니다.",
        "최근 핫한 프레임워크를 도입해보니 개발 속도가 비약적으로 향상되었습니다.",
        "깃허브를 이용한 버전 관리는 이제 선택이 아닌 필수라는 것을 절감합니다.",
        "에러 메시지를 피하지 않고 깊이 있게 분석하는 습관을 들이고 있습니다.",
        "서버와 클라이언트의 통신 방식을 이해하면서 웹 개발의 큰 그림을 그렸습니다.",
        "보안 관련 취약점들을 살펴보며 더 안전한 코드를 고민하게 되었습니다.",
        "매일 꾸준한 코딩 습관이 결국 큰 실력을 만든다고 믿습니다."
    ],
    daily: [
        "오늘 하루도 알차게 보내기 위해 아침 일찍 하루 계획을 세웠습니다.",
        "휴식 시간엔 기술 블로그나 IT 트렌드 기사를 읽는 무언가를 즐깁니다.",
        "가끔은 복잡한 화면에서 벗어나 산책하며 생각을 정리하는 것이 좋습니다.",
        "개발자로서의 성장은 단순한 코딩을 넘어 논리적인 사고방식을 기르는 데 있습니다.",
        "꾸준함이라는 무기가 얼마나 대단한 결과를 만들어내는지 요즘 깨닫고 있죠.",
        "실패를 두려워하지 않고, 새로운 도전을 즐기는 마인드셋을 가지려 노력합니다.",
        "시간 관리가 가장 어려운 과제지만, 뽀모도로 기법으로 집중력을 높이고 있습니다.",
        "책상 앞의 작은 화분을 보며 눈의 피로도 풀고 마음의 여유도 찾습니다.",
        "다른 개발자분들과의 커피챗은 언제나 새로운 통찰력을 줍니다.",
        "오늘 배운 것을 나만의 언어로 정리하며 깊이 있는 학습을 이어가고 있습니다.",
        "목표를 너무 높게 잡기보다, 매일 조금씩 발전하는 것에 초점을 맞춥니다.",
        "때로는 아무것도 안 하는 시간이 새로운 창의력을 불어넣기도 합니다."
    ]
};

const titles = {
    univ: [
        "컴퓨터 구조와 메모리 이해하기", "이산수학 정리와 응용", "알고리즘 분석 기초",
        "자료구조 과제 회고록", "첫 팀 프로젝트 경험담", "수업에서 배운 협업의 중요성",
        "시험 기간 벼락치기? 꾸준함의 승리!", "오늘의 전공 강의 내용 요약", "전공 기초 핵심 개념 정리",
        "중간고사 준비 중 느낀 점", "어셈블리어 첫 경험", "운영체제 스케줄링 알아보기"
    ],
    dev: [
        "C언어 포인터 완전 정복", "클린 코드를 향해: 리팩토링 일지", "알고리즘 문제 풀이 - 구현 편",
        "버전 관리의 시작, Git 활용법", "디버깅 연습하며 겪은 시행착오", "에러 로그를 분석하는 나만의 방법",
        "웹 사이트 성능 최적화 경험", "데이터베이스 정규화 기초 다지기", "새로운 기술 스택 도입 이야기",
        "REST API 설계의 핵심", "백엔드 아키텍처 고민", "코드 리뷰의 중요성을 깨닫다"
    ],
    daily: [
        "오늘의 커피와 한 줄의 코드", "산책하며 얻은 아이디어", "주말 해커톤을 마치며",
        "꾸준함의 힘, 1일 1커밋의 성과", "번아웃을 극복하는 나만의 휴식 방법", "독서 기록: 클린 코더",
        "개발자들의 커피챗에서 배운 것들", "하루의 끝에서 작성하는 개발 일기", "새로운 노트북과 함께하는 다짐",
        "오픈소스 생태계를 바라보며", "목표 설정과 타임 매니지먼트", "나만의 학습 루틴 만들기"
    ]
};

const dateStart = new Date('2025-06-01');
const dateEnd = new Date('2026-04-19');

function getRandomDate() {
    const time = dateStart.getTime() + Math.random() * (dateEnd.getTime() - dateStart.getTime());
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

function getRandomSentences(pool, count) {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).join(" ");
}

const posts = [];
const catCounts = { univ: 0, dev: 0, daily: 0 };

for (let i = 1; i <= TOTAL_POSTS; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    catCounts[category.id]++;
    const date = getRandomDate();
    
    const titleCandidates = titles[category.id];
    const postTitle = titleCandidates[Math.floor(Math.random() * titleCandidates.length)] + " (Part " + (Math.floor(Math.random()*10)+1) + ")";
    
    const paragraphs = [
        getRandomSentences(category.id === 'univ' ? sentencePools.univ : Math.random() > 0.5 ? sentencePools.univ : sentencePools.daily, 4),
        getRandomSentences(sentencePools[category.id], 5),
        getRandomSentences(category.id === 'dev' ? sentencePools.dev : Math.random() > 0.5 ? sentencePools.dev : sentencePools.daily, 4)
    ];

    posts.push({
        id: "post_" + i,
        filename: "post_" + i + ".html",
        title: postTitle,
        category: category,
        date: date,
        author: '정유나',
        summary: getRandomSentences(sentencePools[category.id], 1).substring(0, 45) + "...",
        content: paragraphs
    });
}

posts.sort((a, b) => new Date(b.date) - new Date(a.date));


// 1. Export JSON data for static Client-Side Search
const postsDataJson = JSON.stringify(posts.map(p => ({
    title: p.title,
    summary: p.summary,
    filename: p.filename,
    categoryName: p.category.name,
    categoryClass: p.category.badgeClass,
    date: p.date
})));
fs.writeFileSync(path.join(outputDir, 'posts_data.js'), 'window.BLOG_POSTS = ' + postsDataJson + ';', 'utf8');


// New Sidebar Layout
function generateSidebarHtml() {
    return `
    <aside class="sidebar">
        <div class="sidebar-profile">
            <div class="profile-img">🪐</div>
            <h2 class="blog-name">정유나 | Log</h2>
            <p class="blog-author">학생 개발자</p>
        </div>
        <div class="sidebar-stats">
            <div>
                <span class="stat-label">전체 방문자</span>
                <span class="stat-val" id="stat-total">0</span>
            </div>
            <div>
                <span class="stat-label">오늘</span>
                <span class="stat-val" id="stat-today">0</span>
            </div>
        </div>
        <div class="sidebar-search">
            <div class="search-box">
                <span>🔍</span>
                <input type="text" id="searchInput" placeholder="검색어 입력 후 엔터">
            </div>
        </div>
        <div class="sidebar-category">
            <h3>분류 전체보기 <span class="cat-count">(${TOTAL_POSTS})</span></h3>
            <ul>
                <li><a href="category_univ.html">대학교 과목 <span class="cat-count">(${catCounts.univ})</span></a></li>
                <li><a href="category_dev.html">개발 공부 <span class="cat-count">(${catCounts.dev})</span></a></li>
                <li><a href="category_daily.html">일상/학습 <span class="cat-count">(${catCounts.daily})</span></a></li>
            </ul>
        </div>
        <div class="sidebar-footer">
            <a href="index.html">🏠 홈 (Home)</a>
            <a href="about.html">👋 소개글 보기 (About)</a>
            <button id="theme-toggle" aria-label="다크 모드 전환">🌙 모드 스위치</button>
        </div>
    </aside>`;
}


function generateFooterHtml() {
    return `
    <footer>
        <div style="margin-bottom: 0.5rem; font-weight: 600;">정유나의 기술 블로그</div>
        <p>&copy; 2026 정유나. 눈이 편안한 감성 디자인 & 사이드바 레이아웃으로 다시 태어난 정장 블로그입니다.</p>
    </footer>`;
}

// Generate Post Pages
posts.forEach((post, index) => {
    const prevPost = index < posts.length - 1 ? posts[index + 1] : null;
    const nextPost = index > 0 ? posts[index - 1] : null;

    let prevBtn = prevPost ? `<a href="${prevPost.filename}" class="post-nav-card"><span>&larr; 이전 글</span><h4>${prevPost.title}</h4></a>` : '<div></div>';
    let nextBtn = nextPost ? `<a href="${nextPost.filename}" class="post-nav-card" style="text-align: right;"><span>다음 글 &rarr;</span><h4>${nextPost.title}</h4></a>` : '<div></div>';

    let paragraphHtmlItems = post.content.map(p => '<p>' + p + '</p>');
    let joinedParagraphs = paragraphHtmlItems.join('\n');

    let postHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - 정유나의 블로그</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="progress-container"><div class="progress-bar" id="myBar"></div></div>
    
    <div class="layout-wrapper">
        ${generateSidebarHtml()}
        <main class="main-content">
            <article class="post-detail">
                <header class="post-ambient-header">
                    <div class="orb orb-1"></div>
                    <div class="orb orb-2"></div>
                    <div class="post-header-content">
                        <div class="post-meta-badges">
                            <span class="badge ${post.category.badgeClass}">${post.category.name}</span>
                        </div>
                        <h1 class="post-title">${post.title}</h1>
                        <div class="meta-info">
                            <span>✍️ ${post.author}</span>
                            <span>📅 ${post.date}</span>
                        </div>
                    </div>
                </header>

                <section class="post-detail-content">
                    ${joinedParagraphs}
                </section>
                
                <div class="post-navigation">
                    ${prevBtn}
                    ${nextBtn}
                </div>
            </article>
            ${generateFooterHtml()}
        </main>
    </div>
    
    <button id="scrollTopBtn" aria-label="위로 가기">↑</button>
    <script src="script.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(outputDir, post.filename), postHtml, 'utf8');
});

const POSTS_PER_PAGE = 10;
const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

function generatePostListHtml(postList) {
    let htmlArray = postList.map(post => {
        return `
        <a href="${post.filename}" class="post-card">
            <span class="badge ${post.category.badgeClass}">${post.category.name}</span>
            <h3>${post.title}</h3>
            <p>${post.summary}</p>
            <div class="post-card-meta">
                <span>📅 ${post.date}</span>
                <span>· ✍️ ${post.author}</span>
            </div>
        </a>`;
    });
    return htmlArray.join('\n');
}

function generatePaginationHtml(currentPage, total, baseFileName) {
    let pagesHtml = '<div class="pagination">';
    for (let i = 1; i <= total; i++) {
        const file = i === 1 ? `${baseFileName}.html` : `${baseFileName}_${i}.html`;
        if (i === currentPage) {
            pagesHtml += `<span>${i}</span>`;
        } else {
            pagesHtml += `<a href="${file}">${i}</a>`;
        }
    }
    pagesHtml += '</div>';
    return pagesHtml;
}

for (let page = 1; page <= totalPages; page++) {
    const startIdx = (page - 1) * POSTS_PER_PAGE;
    const pagePosts = posts.slice(startIdx, startIdx + POSTS_PER_PAGE);
    
    // Ambient Animated Hero section with Typing Effect (Only on index page 1)
    let heroHtml = page === 1 ? `
        <section class="ambient-hero">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="hero-content">
                <h1 class="typing-text">Welcome to Yuna's Space 🪐</h1>
                <p class="hero-description">
                    편안한 색상 속에 담은 저의 치열한 공부 기록입니다.<br>
                    컴퓨터공학과 게임개발을 아우르며 지식을 탐구합니다.
                </p>
            </div>
        </section>` : '';

    let listHtml = generatePostListHtml(pagePosts);
    let html = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>정유나의 편안한 공간 - 페이지 ${page}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="progress-container"><div class="progress-bar" id="myBar"></div></div>
    
    <div class="layout-wrapper">
        ${generateSidebarHtml()}
        <main class="main-content">
            ${heroHtml}
            <section class="posts-section">
                <h2 class="section-title">최신 글</h2>
                <div class="post-list">
                    ${listHtml}
                </div>
                ${generatePaginationHtml(page, totalPages, 'index')}
            </section>
            ${generateFooterHtml()}
        </main>
    </div>

    <button id="scrollTopBtn" aria-label="위로 가기">↑</button>
    <script src="script.js"></script>
</body>
</html>`;

    const fileName = page === 1 ? 'index.html' : `index_${page}.html`;
    fs.writeFileSync(path.join(outputDir, fileName), html, 'utf8');
}

// Generate Category Pages
categories.forEach(cat => {
    const catPosts = posts.filter(p => p.category.id === cat.id);
    const catTotalPages = Math.ceil(catPosts.length / POSTS_PER_PAGE);
    
    for (let page = 1; page <= catTotalPages; page++) {
        const startIdx = (page - 1) * POSTS_PER_PAGE;
        const pagePosts = catPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);
        
        let listHtml = generatePostListHtml(pagePosts);
        let html = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cat.name} 카테고리 - 정유나의 블로그</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="progress-container"><div class="progress-bar" id="myBar"></div></div>
    
    <div class="layout-wrapper">
        ${generateSidebarHtml()}
        <main class="main-content">
            <section class="posts-section">
                <h2 class="section-title">'${cat.name}' 카테고리 글</h2>
                <div class="post-list">
                    ${listHtml}
                </div>
                ${generatePaginationHtml(page, catTotalPages, `category_${cat.id}`)}
            </section>
            ${generateFooterHtml()}
        </main>
    </div>

    <button id="scrollTopBtn" aria-label="위로 가기">↑</button>
    <script src="script.js"></script>
</body>
</html>`;

        const fileName = page === 1 ? `category_${cat.id}.html` : `category_${cat.id}_${page}.html`;
        fs.writeFileSync(path.join(outputDir, fileName), html, 'utf8');
    }
});


// GENERATE SEACH.HTML
const searchHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>검색 결과 - 정유나의 학생 블로그</title>
    <link rel="stylesheet" href="style.css">
    <script src="posts_data.js"></script> <!-- Client side indexing -->
</head>
<body>
    <div class="progress-container"><div class="progress-bar" id="myBar"></div></div>
    
    <div class="layout-wrapper">
        ${generateSidebarHtml()}
        <main class="main-content">
            <section class="posts-section" style="padding-top: 1rem;">
                <!-- dynamic JS Title -->
                <h2 class="section-title" id="search-query-display">검색 중...</h2>
                <div class="post-list" id="search-results-container">
                    <!-- results populate here -->
                </div>
            </section>
            ${generateFooterHtml()}
        </main>
    </div>
    
    <button id="scrollTopBtn" aria-label="위로 가기">↑</button>
    <script src="script.js"></script>
</body>
</html>`;
fs.writeFileSync(path.join(outputDir, 'search.html'), searchHtml, 'utf8');


// GENERATE ABOUT.HTML AT THE END SO IT ALIGNS WITH EVERYTHING
const aboutHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>정유나 님 소개 - 학생 개발자 블로그</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="progress-container"><div class="progress-bar" id="myBar"></div></div>
    
    <div class="layout-wrapper">
        ${generateSidebarHtml()}
        <main class="main-content">
            <section class="ambient-hero" style="padding: 4rem 2rem; margin-bottom: 3rem;">
                <div class="orb orb-1" style="width: 250px; height: 250px; animation-duration: 15s;"></div>
                <div class="hero-content">
                    <h1 style="font-size: 2.2rem; color: var(--text-main); margin-bottom: 1rem;">🧑‍💻 학부생 개발자 정유나입니다.</h1>
                    <p style="font-size: 1.2rem; line-height: 1.8; word-break: keep-all; color: var(--text-muted);">
                        끝없는 호기심으로<br>
                        <strong style="color: var(--primary-color);">컴퓨터공학</strong>의 튼튼한 뿌리와<br>
                        <strong style="color: var(--secondary-color);">게임 개발</strong>의 화려한 잎을<br>
                        모두 동경합니다.
                    </p>
                </div>
            </section>

            <article class="post-detail-content" style="background: var(--card-bg); padding: 3rem; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow);">
                <h2 class="section-title">학업 및 진로 고민 🎓</h2>
                <p>제 이름은 정유나, 올해 공학 3계열 1학년으로 입학한 풋풋한 신입생입니다. 컴퓨터 내부의 코어가 어떻게 연산하는지 깊이 파고드는 <strong>컴퓨터공학과</strong>의 학문적 매력도 넘치지만, 알록달록한 그래픽과 생동감 넘치는 반응을 통해 사용자에게 즐거움을 선사하는 <strong>게임 개발</strong>에도 남다른 애정을 가지고 있습니다.</p>
                <p>지금은 하나를 섣불리 선택하기 보다, 과제나 여러 사이드 프로젝트를 통해 컴퓨터의 하드웨어부터 소프트웨어 설계, 그리고 가벼운 프론트엔드 제작까지 넓은 렌즈로 세상을 바라보는 시기를 보내고 있습니다. 이 블로그는 저 정유나의 단순한 과제 제출물을 넘어, 그런 고민과 성장 궤적을 꼼꼼히 기록해 두는 일기장입니다.</p>

                <h2 class="section-title" style="margin-top: 3.5rem;">현재의 기술 스택 (Tech Stack) 🛠️</h2>
                <p style="margin-bottom: 1rem;">탄탄한 기초공사 중입니다.</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 2rem;">
                    <li><strong>HTML / CSS:</strong> 눈이 편안한 앰비언트 모던 레이아웃 및 몽환적인 감성 스타일링</li>
                    <li><strong>JavaScript (Vanilla):</strong> LocalStorage 제어 및 프로그래스 바 등의 사용성 편의성 증대</li>
                    <li><strong>C 언어:</strong> 포인터 구조 이해를 통한 하드웨어 메모리의 추적 관제</li>
                </ul>

                <h2 class="section-title" style="margin-top: 3.5rem;">정유나의 당면 과제 🚀</h2>
                <p>1학년의 끝자락에는 저의 모든 코딩 지식을 총동원하여 '나만의 작은 토이웹앱'이나 '2D 슈팅 게임'을 배포하고 싶습니다.</p>
            </article>
            ${generateFooterHtml()}
        </main>
    </div>

    <button id="scrollTopBtn" aria-label="위로 가기">↑</button>
    <script src="script.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'about.html'), aboutHtml, 'utf8');

console.log('Successfully generated Soft Ambient style blog pages with Search and Tracker!');
