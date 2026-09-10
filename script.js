

// ==========================================
// ⬇️ تعليمات إضافة المنهج الخاص بك ⬇️
// 1. انسخ أي كتلة تبدأ بـ { title: "...", lesson: "...", questions: [...] }
// 2. غير النصوص كما تشاء.
// 3. تأكد أن الإجابة الصحيحة (a) مكتوبة بنفس حروف أحد الخيارات (options) بالضبط.
// ==========================================

const syllabus =
        branches: أكمل حديث: «من صام رمضان إيمانا واحتسابا...» ، واذكر بعض فوائده؟

ج - عن أبي هريرة رَضِيَ اللَّهُ عَنْهُ، أن رسول اللَّه صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قال: «من صام رمضان إيماناً واحتساباً؛ غُفر له ما تقدم من ذنبه» متفق عليه.

* **الفوائد:**
* الحث على صيام شهر رمضان مع الإيمان بالله واحتساب الأجر والثواب عنده.
* أن صيام رمضان إيماناً واحتساباً سبب لتكفير الذنوب السابقة.نا
];

// ==========================================
// نهاية منطقة المنهج
// ==========================================

let cIdx = 0; // مؤشر الباب
let bIdx = 0; // مؤشر الدرس
let qIdx = 0; // مؤشر السؤال
let needsLesson = true; 

// جوائز المزرعة (تظهر بالترتيب عند الإجابات الصحيحة)
const farmRewards = ["🐄", "🌳", "🐑", "🐥", "🚜", "🍎", "🐎", "🌻", "🐐", "🏡", "🦆", "🌾", "🐄", "🌳", "🐑", "🐥", "🚜", "🍎", "🐎", "🌻"];
let currentFarmSlot = 0;

window.onload = () => {
    createFarm();
    populateIndex();
};

// إنشاء 20 مربع للمزرعة
function createFarm() {
    const grid = document.getElementById('farm-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const plot = document.createElement('div');
        plot.className = 'farm-plot';
        plot.id = `plot-${i}`;
        grid.appendChild(plot);
    }
}

// بناء الفهرس من المصفوفة
function populateIndex() {
    const select = document.getElementById('lesson-index');
    select.innerHTML = '';
    syllabus.forEach((chap, cIndex) => {
        let optGroup = document.createElement('optgroup');
        optGroup.label = chap.chapter;
        chap.branches.forEach((branch, bIndex) => {
            let opt = document.createElement('option');
            opt.value = `${cIndex}-${bIndex}`;
            opt.innerText = branch.title;
            optGroup.appendChild(opt);
        });
        select.appendChild(optGroup);
    });
}

// القفز لدرس محدد من الفهرس
function jumpToLesson() {
    const val = document.getElementById('lesson-index').value;
    const [c, b] = val.split('-');
    cIdx = parseInt(c);
    bIdx = parseInt(b);
    qIdx = 0;
    needsLesson = true;
    document.getElementById('message').innerText = `تم اختيار: ${syllabus[cIdx].branches[bIdx].title}`;
}

// بدء سحب السؤال
function drawQuestion() {
    if (currentFarmSlot >= 20) {
        alert("🎉 ما شاء الله! لقد اكتملت مزرعتك بالكامل!");
        return;
    }
    if (cIdx >= syllabus.length) {
        alert("🎉 انتهت جميع الأسئلة في الفهرس!");
        return;
    }
    
    // تحديث الفهرس ليعكس المكان الحالي برمجياً
    document.getElementById('lesson-index').value = `${cIdx}-${bIdx}`;
    
    if (needsLesson) showLessonUI(false);
    else showQuestion();
}

// عرض الشرح (سواء أول مرة أو كعقاب عند الخطأ)
function showLessonUI(isRetry) {
    const branchData = syllabus[cIdx].branches[bIdx];
    document.getElementById('lesson-title').innerText = branchData.title;
    
    let textToShow = branchData.lesson;
    if (isRetry) {
        document.getElementById('lesson-title').innerText = "❌ حاول مرة أخرى!";
        textToShow = "راجع هذه المعلومة:\n\n" + textToShow;
    }
    
    document.getElementById('lesson-text').innerText = textToShow;
    document.getElementById('lesson-section').classList.remove('hidden');
    document.getElementById('question-section').classList.add('hidden');
    document.getElementById('quiz-modal').classList.remove('hidden');
}

// عرض السؤال وخياراته
function showQuestion() {
    const chapterData = syllabus[cIdx];
    const branchData = chapterData.branches[bIdx];
    const questionData = branchData.questions[qIdx];
    
    document.getElementById('chapter-branch-label').innerText = `${chapterData.chapter} - ${branchData.title}`;
    document.getElementById('question-counter').innerText = `السؤال ${qIdx + 1} من ${branchData.questions.length}`;
    document.getElementById('question-text').innerText = questionData.q;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    questionData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, questionData.a);
        optionsDiv.appendChild(btn);
    });
    
    document.getElementById('lesson-section').classList.add('hidden');
    document.getElementById('question-section').classList.remove('hidden');
    document.getElementById('quiz-modal').classList.remove('hidden');
}

// التحقق من الإجابة والمكافأة
function checkAnswer(selected, correct) {
    if (selected === correct) {
        // إجابة صحيحة: منح المكافأة
        document.getElementById('quiz-modal').classList.add('hidden');
        
        const reward = farmRewards[currentFarmSlot];
        const plot = document.getElementById(`plot-${currentFarmSlot}`);
        plot.innerText = reward;
        plot.classList.add('pop-in');
        
        document.getElementById('message').innerText = `✅ رائع! حصلت على ${reward} لمزرعتك.`;
        currentFarmSlot++;
        
        // التقدم في الأسئلة
        qIdx++;
        needsLesson = false;
        if (qIdx >= syllabus[cIdx].branches[bIdx].questions.length) {
            qIdx = 0;
            bIdx++;
            needsLesson = true; // فرع جديد يحتاج شرح
            if (bIdx >= syllabus[cIdx].branches.length) {
                bIdx = 0;
                cIdx++;
            }
        }
    } else {
        // إجابة خاطئة: إعادة الشرح
        needsLesson = true;
        showLessonUI(true);
    }
}




