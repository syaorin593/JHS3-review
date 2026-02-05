// --- 問題データ ---
const questionsData = [
    // --- 並び替え問題 ---
    { 
        type: 'sort',
        q: "「私はテニスをします。」", 
        a: "I play tennis", 
        words: ["I", "play", "tennis", "plays"], 
        category: "語順", 
        hint: "主語は「私(I)」。I のときは s はつきません。" 
    },
    { 
        type: 'sort',
        q: "「あなたは寿司が好きですか？」", 
        a: "Do you like sushi", 
        words: ["Do", "you", "like", "sushi", "Are"], 
        category: "語順", 
        hint: "「〜しますか？」と動作を聞くときは Do を使います。Are は使いません。" 
    },
    { 
        type: 'sort',
        q: "「彼は先生です。」", 
        a: "He is a teacher", 
        words: ["He", "is", "a", "teacher", "am"], 
        category: "語順", 
        hint: "彼は一人なので is。am は「私(I)」のときだけ！" 
    },
    { 
        type: 'sort',
        q: "「これはあなたのペンではありません。」", 
        a: "This is not your pen", 
        words: ["This", "is", "not", "your", "pen", "no"], 
        category: "語順", 
        hint: "否定文は is の後ろに not を置きます。" 
    },
    { 
        type: 'sort',
        q: "「私は泳ぐことができます。」", 
        a: "I can swim", 
        words: ["I", "can", "swim", "swims"], 
        category: "語順", 
        hint: "can（助動詞）の後ろは、そのままの形（原形）です。s は不要！" 
    },

    // --- スペル問題 ---
    { 
        type: 'type',
        q: "「友達」を英語で？", 
        a: "friend", 
        category: "スペル", 
        hint: "フリエンドと覚えると書けるかも？ (fri - end)" 
    },
    { 
        type: 'type',
        q: "「学校」を英語で？", 
        a: "school", 
        category: "スペル", 
        hint: "s - ch - ool (スクール)" 
    },
    { 
        type: 'type',
        q: "「夏」を英語で？", 
        a: "summer", 
        category: "スペル", 
        hint: "m は2回重ねます！" 
    },

    // --- 文法4択 ---
    { 
        type: 'choice',
        q: "My mother ( ) Japanese food.", 
        a: "cooks", 
        choices: ["cook", "cooks", "cooking", "cooked"], 
        category: "文法", 
        hint: "母(My mother)は「彼女(She)」と同じ扱い。動詞に s が必要！" 
    },
    { 
        type: 'choice',
        q: "Ken is ( ) hard now.", 
        a: "studying", 
        choices: ["study", "studies", "studying", "studied"], 
        category: "文法", 
        hint: "is + ing で「〜しているところ（進行形）」" 
    }
];

// --- ゲームシステム変数 ---
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let mistakes = []; 
let currentSortAnswer = [];

// --- ゲーム開始 ---
function startGame() {
    questionsData.sort(() => Math.random() - 0.5);
    currentQuestions = questionsData.slice(0, Math.min(10, questionsData.length));
    
    currentIndex = 0;
    score = 0;
    mistakes = [];
    
    document.getElementById('screen-title').classList.add('hidden');
    document.getElementById('screen-result').classList.add('hidden');
    document.getElementById('screen-game').classList.remove('hidden');
    
    showQuestion();
}

// --- 問題表示 ---
function showQuestion() {
    const q = currentQuestions[currentIndex];
    
    document.getElementById('question-count').innerText = `STAGE ${currentIndex + 1} / ${currentQuestions.length}`;
    document.getElementById('score-display').innerText = `Score: ${score}`;
    document.getElementById('q-category').innerText = q.category;
    document.getElementById('q-text').innerText = q.q;
    
    // 並び替えのときだけ注意書きを表示
    const subText = document.getElementById('q-sub-text');
    if (q.type === 'sort') {
        subText.innerText = "※使わない語が1つあります";
        subText.classList.remove('hidden');
    } else {
        subText.classList.add('hidden');
    }

    const pct = (currentIndex / currentQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = `${pct}%`;

    document.querySelectorAll('.input-area').forEach(el => el.classList.add('hidden'));
    document.getElementById('feedback-area').classList.add('hidden');

    if (q.type === 'choice') renderChoice(q);
    else if (q.type === 'sort') renderSort(q);
    else if (q.type === 'type') renderType(q);
}

// 4択表示
function renderChoice(q) {
    const area = document.getElementById('area-choice');
    area.classList.remove('hidden');
    const grid = document.getElementById('choices-grid');
    grid.innerHTML = "";
    
    const choices = [...q.choices].sort(() => Math.random() - 0.5);
    choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = "btn-choice";
        btn.innerText = c;
        btn.onclick = () => checkAnswer(c === q.a, q.a, q);
        grid.appendChild(btn);
    });
}

// 並び替え表示
function renderSort(q) {
    const area = document.getElementById('area-sort');
    area.classList.remove('hidden');
    currentSortAnswer = [];
    updateSortUI(q);
}

function updateSortUI(q) {
    const ansBox = document.getElementById('sort-answer-box');
    const poolBox = document.getElementById('sort-pool-box');
    ansBox.innerHTML = "";
    poolBox.innerHTML = "";

    // 選んだ単語
    currentSortAnswer.forEach((word, idx) => {
        const span = document.createElement('span');
        span.className = "sort-word";
        span.innerText = word;
        span.onclick = () => {
            currentSortAnswer.splice(idx, 1);
            updateSortUI(q);
        };
        ansBox.appendChild(span);
    });

    // 選択肢（選ばれていないもの）
    let poolWords = [...q.words];
    currentSortAnswer.forEach(w => {
        const i = poolWords.indexOf(w);
        if(i > -1) poolWords.splice(i, 1);
    });

    poolWords.sort().forEach(word => {
        const span = document.createElement('span');
        span.className = "sort-word";
        span.style.backgroundColor = "#b2bec3";
        span.innerText = word;
        span.onclick = () => {
            currentSortAnswer.push(word);
            updateSortUI(q);
        };
        poolBox.appendChild(span);
    });
}

function resetSort() {
    currentSortAnswer = [];
    updateSortUI(currentQuestions[currentIndex]);
}

function checkSortAnswer() {
    const userAnsString = currentSortAnswer.join(" ");
    const q = currentQuestions[currentIndex];
    const normalize = (str) => str.replace(/[.,?!]/g, "").trim();
    checkAnswer(normalize(userAnsString) === normalize(q.a), q.a, q);
}

// スペル表示
function renderType(q) {
    const area = document.getElementById('area-type');
    area.classList.remove('hidden');
    const input = document.getElementById('type-input');
    input.value = "";
    input.focus();
    input.onkeydown = (e) => { if(e.key === 'Enter') checkTypeAnswer(); };
}

function checkTypeAnswer() {
    const input = document.getElementById('type-input');
    const userAns = input.value.trim();
    const q = currentQuestions[currentIndex];
    checkAnswer(userAns.toLowerCase() === q.a.toLowerCase(), q.a, q);
}


// --- 答え合わせ & 解説表示 ---
function checkAnswer(isCorrect, correctAnswerText, qData) {
    const feedback = document.getElementById('feedback-area');
    const title = document.getElementById('feedback-title');
    const detail = document.getElementById('feedback-detail');
    
    feedback.classList.remove('hidden');

    if (isCorrect) {
        score += 10;
        title.innerText = "EXCELLENT!!";
        title.className = "correct";
        detail.innerHTML = `
            <div style="font-weight:bold; font-size:1.2rem; color:#00b894;">正解！</div>
            <p>${correctAnswerText}</p>
            <p style="font-size:0.9rem; color:#666;">${qData.hint}</p>
        `;
    } else {
        title.innerText = "MISS...";
        title.className = "wrong";
        detail.innerHTML = `
            <div style="font-weight:bold; color:#d63031;">残念...</div>
            <p><strong>正解:</strong> ${correctAnswerText}</p>
            <hr style="border:none; border-top:1px dashed #ccc; margin:10px 0;">
            <p><strong>【解説】</strong><br>${qData.hint}</p>
        `;
        mistakes.push(qData);
    }
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < currentQuestions.length) {
        showQuestion();
    } else {
        endGame();
    }
}

// --- 終了画面 ---
function endGame() {
    document.getElementById('screen-game').classList.add('hidden');
    document.getElementById('screen-result').classList.remove('hidden');
    
    document.getElementById('final-score').innerText = score;
    
    const comment = document.getElementById('result-comment');
    if (score === 100) comment.innerText = "PERFECT!! 素晴らしい英語力です！🏆";
    else if (score >= 80) comment.innerText = "GREAT! 基礎はバッチリです！✨";
    else if (score >= 60) comment.innerText = "GOOD! 復習すればもっと伸びます！👍";
    else comment.innerText = "Don't give up! 繰り返し練習しよう💪";

    const list = document.getElementById('review-list');
    list.innerHTML = "";
    if (mistakes.length > 0) {
        list.innerHTML = "<strong>【Review List】</strong><br>";
        mistakes.forEach(m => {
            list.innerHTML += `
                <div style="margin-bottom:15px; padding-bottom:10px; border-bottom:1px dashed #ccc;">
                    <div style="font-weight:bold;">${m.q}</div>
                    <div style="color:#d63031;">正解: ${m.a}</div>
                    <div style="font-size:0.85rem; color:#666;">💡 ${m.hint}</div>
                </div>
            `;
        });
    } else {
        list.innerHTML = "復習項目はありません。完璧です！";
    }

    const savedBest = localStorage.getItem('english_powerup_best') || 0;
    if (score > savedBest) {
        localStorage.setItem('english_powerup_best', score);
        document.getElementById('best-score').innerText = score;
    } else {
        document.getElementById('best-score').innerText = savedBest;
    }
}

// --- ★ここに追加：タイトルへ戻る機能 ---
function backToTitle() {
    // ゲーム画面と結果画面を隠す
    document.getElementById('screen-game').classList.add('hidden');
    document.getElementById('screen-result').classList.add('hidden');
    
    // タイトル画面を表示
    document.getElementById('screen-title').classList.remove('hidden');
}

window.onload = () => {
    document.getElementById('best-score').innerText = localStorage.getItem('english_powerup_best') || 0;
};
