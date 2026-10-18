const LEVELS = ['매우 잘함', '잘함', '보통', '노력 요함', '미실시'];
const SUBJECTS = ['국어', '수학', '사회', '과학', '영어', '기타'];
const SETTINGS_KEY = 'learning-journal-class-settings-v1';
const UNIT_OPTIONS = {
  '수학': ['분수의 나눗셈', '소수의 나눗셈', '비와 비율', '비례식과 비례배분', '원의 넓이', '직육면체의 부피와 겉넓이'],
  '국어': ['주장과 근거를 담은 글쓰기', '작품 속 인물의 삶', '자료를 활용한 발표', '관용 표현 알아보기', '글의 구조와 요약'],
  '사회': ['민주주의와 시민 참여', '우리나라의 경제 성장', '세계 여러 나라의 자연과 문화', '지구촌의 평화와 발전', '역사 속 인물과 사건'],
  '과학': ['전기 회로 꾸미기', '계절의 변화', '연소와 소화', '우리 몸의 구조와 기능', '에너지와 생활'],
  '영어': ['자기소개와 학교생활', '경험을 묻고 답하기', '길 안내하기', '의견과 이유 말하기', '읽고 핵심 정보 파악하기'],
  '기타': ['주제 탐구', '프로젝트 학습', '발표와 토의']
};
const STORAGE_KEY = 'learning-journal-demo-v2';
const demoSeed = {
  students: Array.from({ length: 25 }, (_, index) => {
    const number = String(index + 1);
    return { number, pin: number === '12' ? '1234' : String(2300 + index), name: `학생 ${number.padStart(2, '0')}` };
  }),
  assessments: [
    { id: 'a1', subject: '수학', title: '분수의 나눗셈', date: '2025-10-15', rubric: '분수의 나눗셈 원리를 이해하고, 풀이 과정을 알기 쉽게 설명할 수 있어요.', reviewed: true, levels: { '12': '매우 잘함', '7': '잘함', '18': '보통' }, feedback: { '12': '계산 원리를 정확히 이해하고 풀이 과정을 차근차근 설명했어요. 참 잘했어요! 다음에는 친구에게 풀이 방법을 설명해 보는 선생님이 되어 보세요.', '7': '문제를 끝까지 풀어낸 점이 좋아요. 풀이 과정을 한 줄씩 적어 보면 실수를 더 잘 찾을 수 있어요.', '18': '그림으로 분수를 나누어 본 시도가 좋았어요. 다음에는 전체를 몇 묶음으로 나누는지 그림에 표시하며 연습해 봐요.' } },
    { id: 'a2', subject: '국어', title: '주장과 근거를 담은 글쓰기', date: '2025-10-08', rubric: '자신의 주장을 분명하게 쓰고, 알맞은 근거를 들어 의견을 표현할 수 있어요.', reviewed: true, levels: { '12': '잘함', '7': '매우 잘함', '18': '노력 요함' }, feedback: { '12': '자신의 생각을 분명하게 표현했어요. 여러 근거를 찾아본 점도 멋져요. 문단마다 중심 문장을 먼저 써 보는 연습을 이어가요.', '7': '주장과 근거가 자연스럽게 이어지는 글을 썼어요. 읽는 사람을 생각하며 문장을 다듬은 점이 훌륭해요!', '18': '내 생각을 글로 표현하려고 노력한 점이 참 좋아요. 먼저 주장을 한 문장으로 쓰고, 왜 그렇게 생각하는지 한 가지 이유를 붙여 봐요.' } },
    { id: 'a3', subject: '과학', title: '전기 회로 꾸미기', date: '2025-09-29', rubric: '전지, 전구, 전선을 연결해 불이 켜지는 회로를 만들고 원리를 말할 수 있어요.', reviewed: false, levels: { '12': '잘함', '7': '보통', '18': '매우 잘함' }, feedback: { '12': '전기 회로를 차분히 완성하고 연결 방법을 잘 설명했어요. 회로 그림에 전기의 흐름을 화살표로 나타내 보세요.', '7': '여러 방법으로 회로를 고쳐 본 끈기가 좋았어요. 전선이 전지의 양쪽 극과 전구에 모두 닿았는지 순서대로 확인해 봐요.', '18': '전기 회로의 원리를 잘 이해하고 스스로 회로를 완성했어요. 전구를 두 개 연결하는 방법도 탐구해 보면 더 멋지겠어요!' } }
  ]
};
demoSeed.assessments[0].retakes = { '12': 'yes', '7': 'no' };
demoSeed.assessments[1].retakes = {};
demoSeed.assessments[2].retakes = { '18': 'yes' };
demoSeed.assessments.push(
  { id: 'a4', subject: '사회', title: '민주주의와 시민 참여', date: '2025-09-24', rubric: '민주주의의 의미를 이해하고, 공동체의 문제 해결에 참여하는 방법을 설명할 수 있어요.', reviewed: true, levels: {}, feedback: {}, retakes: {} },
  { id: 'a5', subject: '영어', title: '자기소개와 학교생활', date: '2025-09-18', rubric: '배운 영어 표현을 활용해 자신과 학교생활을 소개할 수 있어요.', reviewed: true, levels: {}, feedback: {}, retakes: {} },
  { id: 'a6', subject: '수학', title: '비와 비율', date: '2025-09-12', rubric: '비와 비율의 뜻을 이해하고, 생활 속 상황을 비율로 나타낼 수 있어요.', reviewed: false, levels: {}, feedback: {}, retakes: {} },
  { id: 'a7', subject: '국어', title: '자료를 활용한 발표', date: '2025-09-04', rubric: '주제에 알맞은 자료를 골라 핵심 내용이 잘 드러나도록 발표할 수 있어요.', reviewed: true, levels: {}, feedback: {}, retakes: {} },
  { id: 'a8', subject: '과학', title: '계절의 변화', date: '2025-08-27', rubric: '계절에 따라 달라지는 태양의 남중 고도와 낮의 길이를 설명할 수 있어요.', reviewed: false, levels: {}, feedback: {}, retakes: {} }
);
demoSeed.assessments.forEach((assessment, assessmentIndex) => {
  assessment.feedbackReviewed = {};
  demoSeed.students.forEach((student, studentIndex) => {
    const number = student.number;
    assessment.levels[number] ||= LEVELS[(studentIndex + assessmentIndex) % LEVELS.length];
    assessment.feedback[number] ||= `${assessment.title}의 평가 기준을 바탕으로 차근차근 과제를 해냈어요. 다음에는 풀이와 생각을 한 번 더 점검해 보세요.`;
    assessment.feedbackReviewed[number] = Boolean(assessment.reviewed);
    if (!assessment.retakes[number] && (studentIndex + assessmentIndex) % 6 === 0) assessment.retakes[number] = 'yes';
    else if (!assessment.retakes[number] && (studentIndex + assessmentIndex) % 5 === 0) assessment.retakes[number] = 'no';
  });
});

let data = loadData();
let classSettings = loadClassSettings();
let activeAssessmentId = null;
let activeSubject = null;
let activeReviewSubject = null;
let activeStudent = null;
let activeStudentSubject = null;
let editingStudentNumber = null;
let feedbackTarget = null;
let expandedReviewId = null;
let toastTimer;
let storageWarningShown = false;

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const loaded = saved ? JSON.parse(saved) : structuredClone(demoSeed);
    loaded.assessments.forEach((assessment) => {
      assessment.retakes ||= {};
      assessment.feedbackReviewed ||= {};
      loaded.students.forEach((student) => {
        if (assessment.feedbackReviewed[student.number] === undefined) {
          assessment.feedbackReviewed[student.number] = Boolean(assessment.reviewed && (assessment.levels[student.number] === '미실시' || assessment.feedback[student.number]?.trim()));
        }
      });
    });
    return loaded;
  } catch {
    return structuredClone(demoSeed);
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    if (!storageWarningShown) {
      storageWarningShown = true;
      showToast('브라우저 저장소를 사용할 수 없어 새로고침하면 변경 내용이 사라질 수 있어요.');
    }
  }
}

function loadClassSettings() {
  const defaults = { schoolName: '햇살초등학교', grade: '6', classNumber: '6' };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch {
    return defaults;
  }
}

function saveClassSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(classSettings));
    return true;
  } catch {
    return false;
  }
}

function renderClassInfo() {
  const classLabel = `${classSettings.grade}학년 ${classSettings.classNumber}반`;
  document.querySelector('#school-display').textContent = classSettings.schoolName;
  document.querySelector('#class-display').textContent = classLabel;
  document.querySelector('#class-stat-label').textContent = classLabel;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function levelClass(level) {
  return ({ '매우 잘함': 'level-very', '잘함': 'level-good', '보통': 'level-mid', '노력 요함': 'level-effort', '미실시': 'level-notdone' })[level] || 'level-mid';
}

function subjectClass(subject) {
  return ({ '수학': 'math', '국어': 'korean', '과학': 'science', '영어': 'english', '사회': 'social' })[subject] || 'math';
}

function subjectInitial(subject) {
  return ({ '수학': '수', '국어': '국', '과학': '과', '영어': '영', '사회': '사' })[subject] || subject.slice(0, 1);
}

function updateUnitOptions(subject) {
  const select = document.querySelector('#assessment-unit');
  const units = UNIT_OPTIONS[subject] || UNIT_OPTIONS['기타'];
  select.innerHTML = `<option value="">단원을 선택하세요</option>${units.map((unit) => `<option value="${escapeHtml(unit)}">${escapeHtml(unit)}</option>`).join('')}`;
}

function isReviewed(assessment) {
  return data.students.every((student) => assessment.levels[student.number] && (assessment.levels[student.number] === '미실시' || (assessment.feedback[student.number]?.trim() && assessment.feedbackReviewed[student.number])));
}

function retakeLabel(value) {
  if (value === 'yes') return '재시험 희망';
  if (value === 'no') return '재시험 희망 안 함';
  return '미입력';
}

function makeLocalFeedbackSuggestion(assessment, level) {
  const opening = {
    '매우 잘함': `${assessment.title}의 핵심을 정확히 이해하고 풀이를 잘 설명했어요.`,
    '잘함': `${assessment.title}의 중요한 내용을 이해하고 과제를 차근차근 해냈어요.`,
    '보통': `${assessment.title}을 끝까지 해보려는 노력이 좋았어요.`,
    '노력 요함': `${assessment.title}에 도전하고 끝까지 참여한 점이 의미 있어요.`
  };
  const nextStep = {
    '매우 잘함': '배운 방법을 다른 문제에도 적용해 보며 이해를 넓혀 보세요.',
    '잘함': '풀이 과정을 다시 점검하고 비슷한 문제를 하나 더 풀어 보세요.',
    '보통': '평가 기준을 작은 단계로 나누어 차근차근 연습해 보세요.',
    '노력 요함': '기초 예시부터 다시 살펴보고, 막히는 부분은 선생님께 질문해 보세요.'
  };
  const rubric = assessment.rubric.replace(/[.!?。]+$/, '');
  return `“${rubric}”라는 평가 기준을 바탕으로, ${opening[level]} ${nextStep[level]}`;
}

function renderSubjectCards() {
  document.querySelector('#subject-grid').innerHTML = SUBJECTS.map((subject) => {
    const count = data.assessments.filter((assessment) => assessment.subject === subject).length;
    return `<button class="subject-card" type="button" data-subject="${escapeHtml(subject)}"><span class="subject-mark ${subjectClass(subject)}">${escapeHtml(subjectInitial(subject))}</span><span class="subject-card-copy"><strong>${escapeHtml(subject)}</strong><small>${count}개 수행평가</small></span><svg class="subject-card-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg></button>`;
  }).join('');
}

function renderStudents(filter = document.querySelector('#student-search').value) {
  const query = filter.trim().toLowerCase();
  const students = [...data.students]
    .sort((a, b) => Number(a.number) - Number(b.number))
    .filter((student) => `${student.number} ${student.name}`.toLowerCase().includes(query));
  document.querySelector('#student-count').textContent = data.students.length;
  document.querySelector('#student-management-total').textContent = data.students.length;
  document.querySelector('#stat-students').textContent = data.students.length;
  document.querySelector('#student-list').innerHTML = students.length ? students.map((student) => {
    const completed = data.assessments.filter((assessment) => assessment.levels[student.number]).length;
    return `<div class="roster-row"><strong class="roster-number">${escapeHtml(student.number)}번</strong><span class="roster-student-name">${escapeHtml(student.name)}</span><code class="roster-pin">${escapeHtml(student.pin || '—')}</code><span class="roster-progress">${completed}/${data.assessments.length}개 평가</span><button class="small-action" type="button" data-manage-student="${escapeHtml(student.number)}">수정</button></div>`;
  }).join('') : '<div class="empty-state">검색한 학생이 없어요.</div>';
}

function openStudentDialog(student = null) {
  editingStudentNumber = student?.number || null;
  document.querySelector('#student-form').reset();
  document.querySelector('#student-dialog-title').textContent = student ? '학생 정보 수정' : '학생 등록';
  document.querySelector('#roster-number').value = student?.number || '';
  document.querySelector('#roster-name').value = student?.name || '';
  document.querySelector('#student-form-error').classList.add('hidden');
  document.querySelector('#student-dialog').showModal();
}

function generateDemoPin() {
  let pin;
  do {
    pin = String(Math.floor(1000 + Math.random() * 9000));
  } while (data.students.some((student) => student.pin === pin));
  return pin;
}

function openSubject(subject) {
  activeSubject = subject;
  document.querySelector('#subject-picker').classList.add('hidden');
  document.querySelector('#assessment-pane').classList.remove('hidden');
  document.querySelector('#assessment-heading').textContent = `${subject} 수행평가`;
  document.querySelector('#breadcrumb-current').textContent = `${subject} 평가`;
  document.querySelector('#assessment-search').value = '';
  renderAssessments();
}

function returnToSubjects() {
  activeSubject = null;
  document.querySelector('#assessment-pane').classList.add('hidden');
  document.querySelector('#subject-picker').classList.remove('hidden');
  document.querySelector('#breadcrumb-current').textContent = '평가 관리';
  renderSubjectCards();
}

function renderAssessments(filter = '') {
  const list = document.querySelector('#assessment-list');
  const query = filter.trim().toLowerCase();
  const assessments = [...data.assessments].filter((item) => item.subject === activeSubject && `${item.subject} ${item.title}`.toLowerCase().includes(query));
  document.querySelector('#assessment-count').textContent = data.assessments.length;
  document.querySelector('#stat-assessments').textContent = data.assessments.length;
  document.querySelector('#stat-students').textContent = data.students.length;
  document.querySelector('#stat-reviewed').textContent = data.assessments.filter(isReviewed).length;
  document.querySelector('#stat-reviewed-total').textContent = `/ ${data.assessments.length}`;
  if (!assessments.length) {
    list.innerHTML = `<div class="empty-state">${query ? '검색한 평가가 없어요. 다른 낱말로 찾아보세요.' : `${escapeHtml(activeSubject || '이 과목')}에 등록된 수행평가가 없어요.`}</div>`;
    return;
  }
  list.innerHTML = assessments.map((item) => {
    const complete = Object.keys(item.levels).length;
    const percent = data.students.length ? Math.round((complete / data.students.length) * 100) : 0;
    const reviewed = isReviewed(item);
    const reviewedText = reviewed ? '피드백 확인 완료' : '검토가 필요해요';
    const retakeRows = [...data.students].sort((a, b) => Number(a.number) - Number(b.number)).map((student) => `<div class="retake-student-row"><span>${escapeHtml(student.number)}번 ${escapeHtml(student.name)}</span><span class="retake-state ${item.retakes[student.number] || 'unset'}">${retakeLabel(item.retakes[student.number])}</span></div>`).join('');
    return `<article class="assessment-card ${activeAssessmentId === item.id ? 'expanded' : ''}" data-assessment-card="${escapeHtml(item.id)}">
      <button class="assessment-row" type="button" data-expand="${escapeHtml(item.id)}" aria-expanded="${activeAssessmentId === item.id}">
        <span class="subject-mark ${subjectClass(item.subject)}">${escapeHtml(subjectInitial(item.subject))}</span>
        <span class="assessment-info"><strong>${escapeHtml(item.title)}</strong><span class="assessment-meta"><span>${escapeHtml(item.subject)}</span><span class="meta-dot"></span><span>${formatDate(item.date)}</span></span></span>
        <span class="progress-wrap"><span class="progress-copy"><span>입력 현황</span><strong>${complete}/${data.students.length}</strong></span><span class="progress-track"><span class="progress-fill ${percent === 100 ? 'complete' : ''}" style="width:${percent}%"></span></span></span>
        <span class="status-chip ${reviewed ? 'reviewed' : 'pending'}">${reviewedText}</span>
        <svg class="row-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7.5 5 5 5-5"/></svg>
      </button>
      <div class="assessment-details"><div class="detail-grid">
        <div><span class="detail-label">평가 기준</span><p class="rubric-copy">${escapeHtml(item.rubric)}</p></div>
        <div><span class="detail-label">학생 결과</span><p class="student-completion">${complete}명 입력 · ${reviewed ? '피드백 검토 완료' : '피드백 검토 대기'}</p></div>
        <div class="detail-actions"><button class="small-action" type="button" data-edit-results="${escapeHtml(item.id)}">학생별 입력</button><button class="small-action" type="button" data-bulk-results="${escapeHtml(item.id)}">표에서 한꺼번에 입력</button><button class="small-action delete" type="button" data-delete-assessment="${escapeHtml(item.id)}">평가 삭제</button></div>
        <div class="retake-status-panel"><span class="detail-label">재시험 여부</span><div class="retake-student-list">${retakeRows}</div></div>
      </div></div>
    </article>`;
  }).join('');
}

function renderReviews(filter = document.querySelector('#review-search').value) {
  const query = filter.trim().toLowerCase();
  renderReviewSubjects();
  const groups = data.assessments.map((assessment) => {
    const students = [...data.students].sort((a, b) => Number(a.number) - Number(b.number));
    const pendingCount = students.filter((student) => assessment.levels[student.number] && assessment.levels[student.number] !== '미실시' && !assessment.feedbackReviewed[student.number]).length;
    return { assessment, students, pendingCount };
  }).filter(({ assessment, pendingCount }) => activeReviewSubject && assessment.subject === activeReviewSubject && pendingCount && `${assessment.subject} ${assessment.title}`.toLowerCase().includes(query));
  const pendingTotal = data.assessments.reduce((sum, assessment) => sum + data.students.filter((student) => assessment.levels[student.number] && assessment.levels[student.number] !== '미실시' && !assessment.feedbackReviewed[student.number]).length, 0);
  document.querySelector('#review-count').textContent = pendingTotal;
  document.querySelector('#review-pending-total').textContent = pendingTotal;
  const queue = document.querySelector('#review-queue');
  if (!groups.length) {
    queue.innerHTML = `<div class="empty-state">${!activeReviewSubject ? '과목을 선택해 주세요.' : query ? '검색한 단원이 없어요.' : '이 과목에는 검토 대기 중인 피드백이 없습니다.'}</div>`;
    return;
  }
  queue.innerHTML = groups.map(({ assessment, students, pendingCount }) => {
    const expanded = expandedReviewId === assessment.id;
    const rows = students.map((student) => {
      const level = assessment.levels[student.number];
      const missed = level === '미실시';
      const hasResult = Boolean(level);
      const reviewed = missed || assessment.feedbackReviewed[student.number];
      const feedbackCell = !hasResult
        ? '<span class="review-no-feedback">결과 미입력</span>'
        : missed
          ? '<span class="review-no-feedback">미실시 · 피드백 없음</span>'
          : `<div class="review-feedback-cell"><textarea class="plain-input" rows="2" data-review-feedback="${escapeHtml(student.number)}" aria-label="${escapeHtml(student.number)}번 피드백">${escapeHtml(assessment.feedback[student.number] || '')}</textarea><span class="feedback-review-status ${reviewed ? 'done' : 'pending'}">${reviewed ? '검토 완료' : '검토 대기'}</span></div>`;
      return `<div class="review-bulk-row" data-review-student="${escapeHtml(student.number)}"><strong>${escapeHtml(student.number)}번 ${escapeHtml(student.name)}</strong><span class="level-badge ${hasResult ? levelClass(level) : 'level-notdone'}">${escapeHtml(level || '미입력')}</span>${feedbackCell}</div>`;
    }).join('');
    const editableCount = students.filter((student) => assessment.levels[student.number] && assessment.levels[student.number] !== '미실시').length;
    return `<article class="review-assessment-card ${expanded ? 'expanded' : ''}" data-review-group="${escapeHtml(assessment.id)}"><header class="review-assessment-header"><div><div class="review-card-meta"><span class="review-subject">${escapeHtml(assessment.subject)}</span><span>${formatDate(assessment.date)}</span></div><h3>${escapeHtml(assessment.title)}</h3><p>${pendingCount}명 검토 대기 · 전체 ${students.length}명</p></div><button class="button ${expanded ? 'button-quiet' : 'button-primary'}" type="button" data-toggle-review="${escapeHtml(assessment.id)}" aria-expanded="${expanded}">${expanded ? '목록 접기' : '전체 학생 피드백 검토'}</button></header><div class="review-assessment-editor ${expanded ? '' : 'hidden'}"><div class="review-bulk-head"><span>학생</span><span>성취수준</span><span>피드백</span></div>${rows}<div class="review-publish-bar"><span>검토된 피드백은 해당 평가의 학생들에게 공개됩니다.</span><button class="button button-primary" type="button" data-publish-review="${escapeHtml(assessment.id)}">수정사항 저장 및 전체 공개 (${editableCount}명)</button></div></div></article>`;
  }).join('');
}

function renderReviewSubjects() {
  document.querySelector('#review-subject-grid').innerHTML = SUBJECTS.map((subject) => {
    const assessments = data.assessments.filter((assessment) => assessment.subject === subject);
    if (!assessments.length) return '';
    const pendingCount = assessments.reduce((sum, assessment) => sum + data.students.filter((student) => assessment.levels[student.number] && assessment.levels[student.number] !== '미실시' && !assessment.feedbackReviewed[student.number]).length, 0);
    const status = pendingCount ? `${pendingCount}명 검토 대기` : '검토 대기 없음';
    return `<button class="subject-card" type="button" data-review-subject="${escapeHtml(subject)}"><span class="subject-mark ${subjectClass(subject)}">${escapeHtml(subjectInitial(subject))}</span><span class="subject-card-copy"><strong>${escapeHtml(subject)}</strong><small>${assessments.length}개 평가 · ${status}</small></span><svg class="subject-card-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg></button>`;
  }).join('');
}

function openReviewSubject(subject) {
  activeReviewSubject = subject;
  document.querySelector('#review-subject-picker').classList.add('hidden');
  document.querySelector('#review-assessment-pane').classList.remove('hidden');
  document.querySelector('#review-heading').textContent = `${subject} 검토 대기`;
  document.querySelector('#review-search').value = '';
  renderReviews();
}

function returnToReviewSubjects() {
  activeReviewSubject = null;
  document.querySelector('#review-assessment-pane').classList.add('hidden');
  document.querySelector('#review-subject-picker').classList.remove('hidden');
  document.querySelector('#review-search').value = '';
  renderReviews();
}

function openFeedback(assessmentId, studentNumber) {
  const assessment = data.assessments.find((item) => item.id === assessmentId);
  const student = data.students.find((item) => item.number === studentNumber);
  if (!assessment || !student) return;
  activeAssessmentId = assessmentId;
  feedbackTarget = { assessmentId, studentNumber };
  const studentLabel = document.querySelector('#feedback-student-label');
  studentLabel.classList.remove('roster-preview');
  studentLabel.textContent = `${student.number}번 ${student.name} · ${assessment.subject} / ${assessment.title}`;
  document.querySelector('#level-select').value = assessment.levels[studentNumber] || '보통';
  document.querySelector('#feedback-text').value = assessment.feedback[studentNumber] || '';
  document.querySelector('#single-editor').classList.remove('hidden');
  document.querySelector('#bulk-editor').classList.add('hidden');
  document.querySelector('#save-feedback').classList.remove('hidden');
  document.querySelector('#save-bulk').classList.add('hidden');
  document.querySelector('#feedback-dialog-title').textContent = '성취수준·피드백 검토';
  document.querySelector('#feedback-dialog').showModal();
}

function renderStudentResults(student, subject = activeStudentSubject) {
  const studentAssessments = data.assessments.filter((assessment) => assessment.levels[student.number]);
  document.querySelector('#result-student-name').textContent = student.name.replace(/^(김|이|박|최|정)/, '');
  document.querySelector('#result-count').textContent = `확인 가능한 평가 ${studentAssessments.length}건 · 과목을 선택하세요.`;
  document.querySelector('#student-login-card').classList.add('hidden');
  document.querySelector('#student-results').classList.remove('hidden');
  if (!subject) {
    activeStudentSubject = null;
    document.querySelector('#student-assessment-view').classList.add('hidden');
    document.querySelector('#student-subject-picker').classList.remove('hidden');
    document.querySelector('#student-subject-picker').innerHTML = SUBJECTS.map((item) => {
      const count = studentAssessments.filter((assessment) => assessment.subject === item).length;
      if (!count) return '';
      return `<button class="subject-card" type="button" data-student-subject="${escapeHtml(item)}"><span class="subject-mark ${subjectClass(item)}">${escapeHtml(subjectInitial(item))}</span><span class="subject-card-copy"><strong>${escapeHtml(item)}</strong><small>${count}개 평가 결과</small></span><svg class="subject-card-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg></button>`;
    }).join('');
    return;
  }
  activeStudentSubject = subject;
  const assessments = studentAssessments.filter((assessment) => assessment.subject === subject);
  document.querySelector('#result-count').textContent = `${subject} 평가 결과 ${assessments.length}건`;
  document.querySelector('#student-subject-picker').classList.add('hidden');
  document.querySelector('#student-assessment-view').classList.remove('hidden');
  document.querySelector('#student-assessment-heading').textContent = `${subject} 평가 결과`;
  document.querySelector('#student-assessment-list').innerHTML = assessments.length ? assessments.map((assessment) => {
    const level = assessment.levels[student.number];
    const feedback = level === '미실시'
      ? '평가에 참여하지 않아 미실시로 처리되었습니다.'
      : assessment.feedbackReviewed[student.number]
        ? assessment.feedback[student.number] || '피드백이 아직 등록되지 않았습니다.'
        : '선생님이 피드백 문장을 확인하고 있습니다.';
    const retake = assessment.retakes[student.number] || '';
    return `<article class="result-card"><div class="result-card-head"><div><p class="result-subject">${escapeHtml(assessment.subject)}</p><h3>${escapeHtml(assessment.title)}</h3></div><span class="result-date">${formatDate(assessment.date)}</span></div><span class="level-badge ${levelClass(level)}">${escapeHtml(level)}</span><div class="feedback-box"><p class="feedback-title"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.5 12 8l5.5 2-5.5 2-2 5.5L8 12l-5.5-2L8 8l2-5.5Z"/></svg> 선생님 피드백</p><p>${escapeHtml(feedback)}</p></div><section class="retake-choice" aria-label="재시험 여부"><div class="retake-choice-heading"><strong>재시험 여부</strong><span>${retake ? `현재 선택: ${retakeLabel(retake)}` : '원하는 항목을 선택해 주세요.'}</span></div><div class="retake-choice-buttons"><button class="retake-button ${retake === 'yes' ? 'selected' : ''}" type="button" data-retake-assessment="${escapeHtml(assessment.id)}" data-retake-choice="yes" aria-pressed="${retake === 'yes'}">재시험 희망</button><button class="retake-button ${retake === 'no' ? 'selected' : ''}" type="button" data-retake-assessment="${escapeHtml(assessment.id)}" data-retake-choice="no" aria-pressed="${retake === 'no'}">이번 결과로 마무리</button></div></section></article>`;
  }).join('') : '<div class="empty-state">아직 공개된 평가가 없어요. 선생님이 결과를 입력하면 여기에 보여요.</div>';
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  const activeDialog = document.querySelector('dialog[open]');
  (activeDialog || document.body).append(toast);
  toast.classList.toggle('in-dialog', Boolean(activeDialog));
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function switchView(view) {
  const labels = { teacher: '평가 관리', students: '학생 관리', reviews: '피드백 검토', student: '학생 결과 보기' };
  document.querySelectorAll('.view').forEach((section) => section.classList.toggle('hidden', section.id !== `${view}-view`));
  document.querySelector('#class-settings').classList.toggle('hidden', view === 'student');
  document.querySelector('#breadcrumb-current').textContent = view === 'teacher' && activeSubject ? `${activeSubject} 평가` : labels[view];
  if (view === 'reviews') renderReviews();
  document.querySelectorAll('.nav-item').forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
}

document.querySelectorAll('.nav-item').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.view)));
document.querySelector('#class-settings').addEventListener('click', () => {
  document.querySelector('#school-name-input').value = classSettings.schoolName;
  document.querySelector('#grade-input').value = classSettings.grade;
  document.querySelector('#class-number-input').value = classSettings.classNumber;
  document.querySelector('#class-settings-dialog').showModal();
});
document.querySelector('.settings-close').addEventListener('click', () => document.querySelector('#class-settings-dialog').close());
document.querySelector('.settings-cancel').addEventListener('click', () => document.querySelector('#class-settings-dialog').close());
document.querySelector('#class-settings-form').addEventListener('submit', (event) => {
  event.preventDefault();
  classSettings = {
    schoolName: document.querySelector('#school-name-input').value.trim(),
    grade: document.querySelector('#grade-input').value,
    classNumber: document.querySelector('#class-number-input').value
  };
  renderClassInfo();
  const persisted = saveClassSettings();
  document.querySelector('#class-settings-dialog').close();
  showToast(persisted ? '학교와 학급 정보를 저장했어요.' : '브라우저 저장소를 사용할 수 없어 새로고침하면 설정이 초기화될 수 있어요.');
});
document.querySelector('#assessment-search').addEventListener('input', (event) => renderAssessments(event.target.value));
document.querySelector('#subject-grid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-subject]');
  if (button) openSubject(button.dataset.subject);
});
document.querySelector('#back-to-subjects').addEventListener('click', returnToSubjects);
document.querySelector('#review-search').addEventListener('input', (event) => renderReviews(event.target.value));
document.querySelector('#student-search').addEventListener('input', (event) => renderStudents(event.target.value));
document.querySelector('#add-student').addEventListener('click', () => openStudentDialog());
document.querySelector('#student-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-manage-student]');
  if (!button) return;
  const student = data.students.find((item) => item.number === button.dataset.manageStudent);
  if (student) openStudentDialog(student);
});
document.querySelector('.student-dialog-close').addEventListener('click', () => document.querySelector('#student-dialog').close());
document.querySelector('.student-dialog-cancel').addEventListener('click', () => document.querySelector('#student-dialog').close());
document.querySelector('#student-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const formError = document.querySelector('#student-form-error');
  const rawNumber = document.querySelector('#roster-number').value.trim();
  const numericNumber = Number(rawNumber);
  const number = String(numericNumber);
  const name = document.querySelector('#roster-name').value.trim();
  if (!Number.isSafeInteger(numericNumber) || numericNumber < 1 || !name) {
    formError.textContent = '올바른 출석번호와 학생 이름을 입력해 주세요.';
    formError.classList.remove('hidden');
    return;
  }
  const duplicate = data.students.some((student) => student.number === number && student.number !== editingStudentNumber);
  if (duplicate) {
    formError.textContent = '이미 등록된 출석번호입니다.';
    formError.classList.remove('hidden');
    return;
  }
  if (editingStudentNumber) {
    const student = data.students.find((item) => item.number === editingStudentNumber);
    if (!student) return;
    if (student.number !== number) {
      ['levels', 'feedback', 'retakes', 'feedbackReviewed'].forEach((key) => {
        data.assessments.forEach((assessment) => {
          const values = assessment[key];
          if (Object.prototype.hasOwnProperty.call(values, student.number)) {
            values[number] = values[student.number];
            delete values[student.number];
          }
        });
      });
      student.number = number;
    }
    student.name = name;
  } else {
    data.students.push({ number, name, pin: generateDemoPin() });
  }
  saveData();
  renderStudents(document.querySelector('#student-search').value);
  renderAssessments(document.querySelector('#assessment-search').value);
  renderReviews();
  document.querySelector('#student-dialog').close();
  showToast(editingStudentNumber ? '학생 정보를 수정했어요.' : '학생을 등록했어요. 데모 PIN은 목록에 표시됩니다.');
  editingStudentNumber = null;
});
document.querySelector('#review-subject-grid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-review-subject]');
  if (button) openReviewSubject(button.dataset.reviewSubject);
});
document.querySelector('#back-to-review-subjects').addEventListener('click', returnToReviewSubjects);
document.querySelector('.banner-close').addEventListener('click', () => document.querySelector('.privacy-banner').remove());
document.querySelector('#assessment-subject').addEventListener('change', (event) => updateUnitOptions(event.target.value));

document.querySelector('#review-queue').addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-toggle-review]');
  if (toggle) {
    expandedReviewId = expandedReviewId === toggle.dataset.toggleReview ? null : toggle.dataset.toggleReview;
    renderReviews();
    return;
  }
  const publishButton = event.target.closest('[data-publish-review]');
  if (!publishButton) return;
  const assessment = data.assessments.find((item) => item.id === publishButton.dataset.publishReview);
  const group = publishButton.closest('[data-review-group]');
  if (!assessment || !group) return;
  const feedbackEdits = data.students
    .filter((student) => assessment.levels[student.number] && assessment.levels[student.number] !== '미실시')
    .map((student) => ({
      number: student.number,
      feedback: group.querySelector(`[data-review-feedback="${student.number}"]`)?.value.trim() || ''
    }));
  if (feedbackEdits.some((entry) => !entry.feedback)) {
    showToast('피드백을 비워두지 않았는지 확인해 주세요.');
    return;
  }
  feedbackEdits.forEach(({ number, feedback }) => {
    assessment.feedback[number] = feedback;
    assessment.feedbackReviewed[number] = true;
  });
  data.students.filter((student) => assessment.levels[student.number] === '미실시').forEach((student) => {
    assessment.feedback[student.number] = '';
    assessment.feedbackReviewed[student.number] = true;
  });
  assessment.reviewed = isReviewed(assessment);
  saveData();
  expandedReviewId = null;
  renderAssessments(document.querySelector('#assessment-search').value);
  renderReviews();
  showToast(`${feedbackEdits.length}명의 피드백을 저장하고 공개했어요.`);
});

document.querySelector('#assessment-list').addEventListener('click', (event) => {
  const expand = event.target.closest('[data-expand]');
  const edit = event.target.closest('[data-edit-results]');
  const bulk = event.target.closest('[data-bulk-results]');
  const remove = event.target.closest('[data-delete-assessment]');
  if (expand) {
    activeAssessmentId = activeAssessmentId === expand.dataset.expand ? null : expand.dataset.expand;
    renderAssessments(document.querySelector('#assessment-search').value);
  }
  if (edit) {
    const assessment = data.assessments.find((item) => item.id === edit.dataset.editResults);
    const studentRows = data.students.map((student) => {
      const level = assessment.levels[student.number] || '보통';
      const reviewStatus = level === '미실시' || assessment.feedbackReviewed[student.number] ? '확인 완료' : '검토 필요';
      return `<div class="result-entry-row"><span>${escapeHtml(student.number)}번 ${escapeHtml(student.name)}</span><span class="level-badge ${levelClass(level)}">${escapeHtml(level)}</span><span class="feedback-review-status">${reviewStatus}</span><button class="small-action" type="button" data-edit-student="${escapeHtml(student.number)}">검토</button></div>`;
    }).join('');
    const dialogForm = document.querySelector('#feedback-form');
    dialogForm.querySelector('.feedback-student-label').innerHTML = `<strong>${escapeHtml(assessment.title)}</strong><div class="roster-list">${studentRows}</div>`;
    dialogForm.querySelector('.feedback-student-label').classList.add('roster-preview');
    dialogForm.querySelector('#single-editor').classList.remove('hidden');
    dialogForm.querySelector('#bulk-editor').classList.add('hidden');
    dialogForm.querySelector('#save-feedback').classList.remove('hidden');
    dialogForm.querySelector('#save-bulk').classList.add('hidden');
    feedbackTarget = { assessmentId: assessment.id, studentNumber: null };
    document.querySelector('#feedback-dialog-title').textContent = '피드백 검토';
    document.querySelector('#level-select').value = '잘함';
    document.querySelector('#feedback-text').value = '';
    document.querySelector('#feedback-dialog').showModal();
  }
  if (bulk) {
    const assessment = data.assessments.find((item) => item.id === bulk.dataset.bulkResults);
    if (!assessment) return;
    const bulkEditor = document.querySelector('#bulk-editor');
    const options = (selected) => `<option value="">수준 선택</option>${LEVELS.map((level) => `<option value="${level}" ${selected === level ? 'selected' : ''}>${level}</option>`).join('')}`;
    const commonLevelOptions = `<option value="">성취수준 선택</option>${LEVELS.map((level) => `<option value="${level}">${level}</option>`).join('')}`;
    bulkEditor.innerHTML = `<div class="bulk-toolbar"><label class="bulk-select-all"><input type="checkbox" id="bulk-select-all" />전체 선택</label><div class="bulk-apply"><select class="plain-input" id="bulk-level-select" aria-label="선택 학생에게 적용할 성취수준">${commonLevelOptions}</select><button class="button button-outline" type="button" id="apply-bulk-level">체크한 학생에게 적용</button></div></div><div class="bulk-table-head"><span>선택</span><span>학생</span><span>성취수준</span></div>${data.students.map((student) => `<div class="bulk-row" data-bulk-row="${escapeHtml(student.number)}"><input type="checkbox" data-bulk-check="${escapeHtml(student.number)}" aria-label="${escapeHtml(student.number)}번 ${escapeHtml(student.name)} 선택" /><strong>${escapeHtml(student.number)}번 ${escapeHtml(student.name)}</strong><select class="plain-input" data-bulk-level="${escapeHtml(student.number)}" aria-label="${escapeHtml(student.name)} 성취수준">${options(assessment.levels[student.number])}</select></div>`).join('')}`;
    const masterCheckbox = bulkEditor.querySelector('#bulk-select-all');
    const rowCheckboxes = [...bulkEditor.querySelectorAll('[data-bulk-check]')];
    const updateMasterCheckbox = () => {
      const checkedCount = rowCheckboxes.filter((checkbox) => checkbox.checked).length;
      masterCheckbox.checked = checkedCount === rowCheckboxes.length;
      masterCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
    };
    masterCheckbox.addEventListener('change', () => {
      rowCheckboxes.forEach((checkbox) => { checkbox.checked = masterCheckbox.checked; });
    });
    rowCheckboxes.forEach((checkbox) => checkbox.addEventListener('change', updateMasterCheckbox));
    bulkEditor.querySelector('#apply-bulk-level').addEventListener('click', () => {
      const selectedLevel = bulkEditor.querySelector('#bulk-level-select').value;
      const selectedCheckboxes = rowCheckboxes.filter((checkbox) => checkbox.checked);
      if (!selectedCheckboxes.length) {
        showToast('먼저 학생을 체크해 주세요.');
        return;
      }
      if (!selectedLevel) {
        showToast('적용할 성취수준을 선택해 주세요.');
        return;
      }
      selectedCheckboxes.forEach((checkbox) => {
        bulkEditor.querySelector(`[data-bulk-level="${checkbox.dataset.bulkCheck}"]`).value = selectedLevel;
      });
      showToast(`${selectedCheckboxes.length}명에게 성취수준을 적용했어요.`);
    });
    document.querySelector('#feedback-student-label').textContent = `${assessment.subject} · ${assessment.title} · 표에서는 성취수준만 입력합니다.`;
    document.querySelector('#feedback-dialog-title').textContent = '표에서 한꺼번에 입력';
    document.querySelector('#single-editor').classList.add('hidden');
    bulkEditor.classList.remove('hidden');
    document.querySelector('#save-feedback').classList.add('hidden');
    document.querySelector('#save-bulk').classList.remove('hidden');
    feedbackTarget = { assessmentId: assessment.id, studentNumber: null };
    document.querySelector('#feedback-dialog').showModal();
  }
  if (remove) {
    data.assessments = data.assessments.filter((item) => item.id !== remove.dataset.deleteAssessment);
    if (activeAssessmentId === remove.dataset.deleteAssessment) activeAssessmentId = null;
    saveData();
    renderSubjectCards();
    renderAssessments(document.querySelector('#assessment-search').value);
    renderReviews();
    showToast('평가가 삭제됐어요.');
  }
});

document.querySelector('#assessment-list').addEventListener('click', (event) => {
  const studentButton = event.target.closest('[data-edit-student]');
  if (!studentButton) return;
  const row = studentButton.closest('.assessment-card');
  const assessmentId = row?.dataset.assessmentCard || activeAssessmentId;
  const label = document.querySelector('#feedback-student-label');
  const assessment = data.assessments.find((item) => item.id === assessmentId);
  const student = data.students.find((item) => item.number === studentButton.dataset.editStudent);
  if (!assessment || !student) return;
  label.classList.remove('roster-preview');
  openFeedback(assessmentId, student.number);
});

const assessmentDialog = document.querySelector('#assessment-dialog');
document.querySelector('#new-assessment').addEventListener('click', () => {
  document.querySelector('#assessment-form').reset();
  updateUnitOptions(document.querySelector('#assessment-subject').value);
  document.querySelector('#assessment-date').value = new Date().toISOString().slice(0, 10);
  assessmentDialog.showModal();
});
document.querySelector('.dialog-close').addEventListener('click', () => assessmentDialog.close());
document.querySelector('.dialog-cancel').addEventListener('click', () => assessmentDialog.close());
document.querySelector('#assessment-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const assessment = {
    id: `a${Date.now()}`,
    subject: document.querySelector('#assessment-subject').value,
    title: document.querySelector('#assessment-unit').value,
    date: document.querySelector('#assessment-date').value,
    rubric: document.querySelector('#assessment-rubric').value.trim(),
    reviewed: false,
    levels: {},
    feedback: {},
    retakes: {},
    feedbackReviewed: {}
  };
  data.assessments.unshift(assessment);
  saveData();
  activeAssessmentId = assessment.id;
  renderSubjectCards();
  openSubject(assessment.subject);
  renderReviews();
  assessmentDialog.close();
  showToast('평가가 추가됐어요. 학생 결과를 입력해 주세요.');
});

document.querySelector('#feedback-student-label').addEventListener('click', (event) => {
  const studentButton = event.target.closest('[data-edit-student]');
  if (!studentButton || !feedbackTarget?.assessmentId) return;
  const assessment = data.assessments.find((item) => item.id === feedbackTarget.assessmentId);
  const student = data.students.find((item) => item.number === studentButton.dataset.editStudent);
  if (!assessment || !student) return;
  feedbackTarget.studentNumber = student.number;
  document.querySelector('#feedback-student-label').textContent = `${student.number}번 ${student.name} · ${assessment.subject} / ${assessment.title}`;
  document.querySelector('#level-select').value = assessment.levels[student.number] || '보통';
  document.querySelector('#feedback-text').value = assessment.feedback[student.number] || '';
});

document.querySelector('#level-select').addEventListener('change', (event) => {
  const current = data.assessments.find((item) => item.id === feedbackTarget?.assessmentId)?.levels[feedbackTarget?.studentNumber];
  if (event.target.value !== current || event.target.value === '미실시') document.querySelector('#feedback-text').value = '';
});

document.querySelector('#draft-feedback').addEventListener('click', () => {
  if (!feedbackTarget?.studentNumber) {
    showToast('먼저 학생을 선택해 주세요.');
    return;
  }
  const assessment = data.assessments.find((item) => item.id === feedbackTarget.assessmentId);
  const level = document.querySelector('#level-select').value;
  if (level === '미실시') {
    showToast('미실시 학생에게는 문장 제안을 만들지 않아요.');
    return;
  }
  document.querySelector('#feedback-text').value = makeLocalFeedbackSuggestion(assessment, level);
  showToast('문장 제안을 만들었어요. 확인 후 필요한 부분만 수정해 주세요.');
});

document.querySelector('.feedback-close').addEventListener('click', () => document.querySelector('#feedback-dialog').close());
document.querySelector('.feedback-cancel').addEventListener('click', () => document.querySelector('#feedback-dialog').close());
document.querySelector('#save-feedback').addEventListener('click', () => {
  if (!feedbackTarget?.studentNumber) {
    showToast('먼저 수정할 학생을 선택해 주세요.');
    return;
  }
  const assessment = data.assessments.find((item) => item.id === feedbackTarget.assessmentId);
  if (!assessment) return;
  const number = feedbackTarget.studentNumber;
  const level = document.querySelector('#level-select').value;
  assessment.levels[number] = level;
  assessment.feedback[number] = level === '미실시'
    ? ''
    : document.querySelector('#feedback-text').value.trim() || makeLocalFeedbackSuggestion(assessment, level);
  assessment.feedbackReviewed[number] = true;
  assessment.reviewed = isReviewed(assessment);
  saveData();
  renderAssessments(document.querySelector('#assessment-search').value);
  renderReviews();
  document.querySelector('#feedback-dialog').close();
  showToast('수준과 검토한 피드백을 저장했어요.');
});

document.querySelector('#save-bulk').addEventListener('click', () => {
  const assessment = data.assessments.find((item) => item.id === feedbackTarget?.assessmentId);
  if (!assessment) return;
  const entries = data.students.map((student) => ({
    number: student.number,
    level: document.querySelector(`[data-bulk-level="${student.number}"]`).value
  }));
  const incomplete = entries.find((entry) => !entry.level);
  if (incomplete) {
    showToast('모든 학생의 성취수준을 입력해 주세요.');
    return;
  }
  entries.forEach(({ number, level }) => {
    const changed = assessment.levels[number] !== level;
    assessment.levels[number] = level;
    if (level === '미실시') {
      assessment.feedback[number] = '';
      assessment.feedbackReviewed[number] = true;
    } else if (changed || !assessment.feedback[number]?.trim()) {
      assessment.feedback[number] = makeLocalFeedbackSuggestion(assessment, level);
      assessment.feedbackReviewed[number] = false;
    }
  });
  assessment.reviewed = isReviewed(assessment);
  saveData();
  renderAssessments(document.querySelector('#assessment-search').value);
  renderReviews();
  document.querySelector('#feedback-dialog').close();
  showToast('성취수준을 저장하고 문장 제안을 만들었어요.');
});

document.querySelector('#student-login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const number = document.querySelector('#student-number').value.trim();
  const pin = document.querySelector('#student-pin').value.trim();
  const student = data.students.find((item) => item.number === number && item.pin === pin);
  const error = document.querySelector('#login-error');
  if (!student) {
    error.classList.remove('hidden');
    return;
  }
  error.classList.add('hidden');
  activeStudent = student;
  activeStudentSubject = null;
  renderStudentResults(student);
});
document.querySelector('#student-subject-picker').addEventListener('click', (event) => {
  const button = event.target.closest('[data-student-subject]');
  if (button && activeStudent) renderStudentResults(activeStudent, button.dataset.studentSubject);
});
document.querySelector('#student-back-to-subjects').addEventListener('click', () => {
  if (activeStudent) renderStudentResults(activeStudent, null);
});
document.querySelector('#student-assessment-list').addEventListener('click', (event) => {
  const choice = event.target.closest('[data-retake-assessment]');
  if (!choice || !activeStudent) return;
  const assessment = data.assessments.find((item) => item.id === choice.dataset.retakeAssessment);
  if (!assessment) return;
  assessment.retakes[activeStudent.number] = choice.dataset.retakeChoice;
  saveData();
  renderAssessments(document.querySelector('#assessment-search').value);
  renderStudentResults(activeStudent, activeStudentSubject);
  showToast('재시험 의사를 저장했어요.');
});
document.querySelector('#fill-demo').addEventListener('click', () => {
  document.querySelector('#student-number').value = '12';
  document.querySelector('#student-pin').value = '1234';
  document.querySelector('#login-error').classList.add('hidden');
});
document.querySelector('#logout-student').addEventListener('click', () => {
  activeStudent = null;
  activeStudentSubject = null;
  document.querySelector('#student-login-form').reset();
  document.querySelector('#student-results').classList.add('hidden');
  document.querySelector('#student-login-card').classList.remove('hidden');
});

renderClassInfo();
updateUnitOptions(document.querySelector('#assessment-subject').value);
renderSubjectCards();
renderStudents();
renderAssessments();
renderReviews();
