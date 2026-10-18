const SHEET_HEADERS = {
  Students: ['AttendanceNo', 'Name', 'Pin'],
  Teachers: ['Email'],
  Assessments: ['Id', 'Subject', 'Unit', 'Date', 'Rubric'],
  Results: ['AssessmentId', 'AttendanceNo', 'Level', 'Feedback', 'FeedbackReviewed', 'Retake']
};
const VALID_LEVELS = ['매우 잘함', '잘함', '보통', '노력 요함', '미실시'];

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('6학년 6반 평가 결과 조회')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function setupWorkbook() {
  const activeEmail = Session.getActiveUser().getEmail();
  const ownerEmail = Session.getEffectiveUser().getEmail();
  if (!activeEmail || activeEmail.toLowerCase() !== ownerEmail.toLowerCase()) {
    throw new Error('스프레드시트 소유자가 Apps Script 편집기에서 초기 설정을 실행해 주세요.');
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEET_HEADERS).forEach((name) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, SHEET_HEADERS[name].length).setValues([SHEET_HEADERS[name]]);
      sheet.setFrozenRows(1);
    }
  });
  const email = Session.getActiveUser().getEmail();
  if (email && !_readObjects_('Teachers').some((teacher) => String(teacher.Email).toLowerCase() === email.toLowerCase())) {
    _sheet_('Teachers').appendRow([email]);
  }
  return '시트 준비 완료. 배포 전 Teachers 시트에 교사 계정을 확인해 주세요.';
}

function getAccessInfo() {
  const email = Session.getActiveUser().getEmail();
  return { teacher: Boolean(email && _isTeacher_(email)) };
}

function getTeacherData() {
  _requireTeacher_();
  const students = _readObjects_('Students').map((row) => ({
    number: String(row.AttendanceNo),
    name: String(row.Name),
    pin: String(row.Pin)
  })).sort((a, b) => Number(a.number) - Number(b.number));
  const results = _readObjects_('Results');
  const assessments = _readObjects_('Assessments').map((row) => {
    const assessment = {
      id: String(row.Id),
      subject: String(row.Subject),
      title: String(row.Unit),
      date: _dateString_(row.Date),
      rubric: String(row.Rubric),
      levels: {},
      feedback: {},
      feedbackReviewed: {},
      retakes: {}
    };
    results.filter((result) => String(result.AssessmentId) === assessment.id).forEach((result) => {
      const number = String(result.AttendanceNo);
      assessment.levels[number] = String(result.Level || '');
      assessment.feedback[number] = String(result.Feedback || '');
      assessment.feedbackReviewed[number] = result.FeedbackReviewed === true || String(result.FeedbackReviewed).toLowerCase() === 'true';
      assessment.retakes[number] = String(result.Retake || '');
    });
    return assessment;
  }).sort((a, b) => b.date.localeCompare(a.date));
  return { students: students, assessments: assessments };
}

function loginStudent(attendanceNo, pin) {
  const number = _validAttendanceNo_(attendanceNo);
  const student = _readObjects_('Students').find((row) => String(row.AttendanceNo) === number && String(row.Pin) === String(pin));
  const cache = CacheService.getUserCache();
  if (!student) {
    const attempts = Number(cache.get('studentLoginAttempts') || 0) + 1;
    cache.put('studentLoginAttempts', String(attempts), 900);
    throw new Error(attempts >= 5 ? '로그인 시도가 잠시 제한됐습니다. 15분 뒤 다시 시도해 주세요.' : '출석번호나 PIN을 확인해 주세요.');
  }
  cache.remove('studentLoginAttempts');
  cache.put('studentAttendanceNo', number, 21600);
  return _studentData_(number, student);
}

function logoutStudent() {
  CacheService.getUserCache().remove('studentAttendanceNo');
  return { loggedOut: true };
}

function _studentData_(number, student) {
  const results = _readObjects_('Results').filter((row) => String(row.AttendanceNo) === number);
  const assessments = _readObjects_('Assessments').flatMap((row) => {
    const result = results.find((item) => String(item.AssessmentId) === String(row.Id));
    if (!result) return [];
    return [{
      id: String(row.Id),
      subject: String(row.Subject),
      title: String(row.Unit),
      date: _dateString_(row.Date),
      level: String(result.Level || ''),
      feedback: String(result.Feedback || ''),
      feedbackReviewed: result.FeedbackReviewed === true || String(result.FeedbackReviewed).toLowerCase() === 'true',
      retake: String(result.Retake || '')
    }];
  }).sort((a, b) => b.date.localeCompare(a.date));
  return { student: { number: number, name: String(student.Name) }, assessments: assessments };
}

function saveStudent(input) {
  _requireTeacher_();
  const number = _validAttendanceNo_(input.number);
  const name = String(input.name || '').trim();
  if (!name) throw new Error('학생 이름을 입력해 주세요.');
  const previous = input.previousNumber ? _validAttendanceNo_(input.previousNumber) : '';
  const sheet = _sheet_('Students');
  const rows = _readObjects_('Students');
  const duplicate = rows.some((row) => String(row.AttendanceNo) === number && String(row.AttendanceNo) !== previous);
  if (duplicate) throw new Error('이미 등록된 출석번호입니다.');
  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    if (previous) {
      const index = rows.findIndex((row) => String(row.AttendanceNo) === previous);
      if (index < 0) throw new Error('수정할 학생을 찾을 수 없습니다.');
      const pin = String(rows[index].Pin);
      sheet.getRange(index + 2, 1, 1, 3).setValues([[number, name, pin]]);
      if (number !== previous) _replaceAttendanceNo_(previous, number);
      return { number: number, name: name, pin: pin, updated: true };
    }
    const pin = _newPin_();
    sheet.appendRow([number, name, pin]);
    return { number: number, name: name, pin: pin, updated: false };
  } finally {
    lock.releaseLock();
  }
}

function createAssessment(input) {
  _requireTeacher_();
  const subject = String(input.subject || '').trim();
  const unit = String(input.unit || '').trim();
  const rubric = String(input.rubric || '').trim();
  if (!subject || !unit || !rubric) throw new Error('과목, 단원, 평가 기준을 모두 입력해 주세요.');
  const id = Utilities.getUuid();
  _sheet_('Assessments').appendRow([id, subject, unit, String(input.date || ''), rubric]);
  return id;
}

function saveLevels(assessmentId, entries) {
  _requireTeacher_();
  const assessment = _findAssessment_(assessmentId);
  const validNumbers = _readObjects_('Students').map((row) => String(row.AttendanceNo));
  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    entries.forEach((entry) => {
      const number = _validAttendanceNo_(entry.number);
      const level = String(entry.level || '');
      if (!validNumbers.includes(number)) throw new Error('등록되지 않은 출석번호가 있습니다.');
      if (!VALID_LEVELS.includes(level)) throw new Error('올바르지 않은 성취수준입니다.');
      const current = _findResult_(assessmentId, number);
      const changed = !current || String(current.Level) !== level;
      const feedback = level === '미실시' ? '' : changed || !current.Feedback ? _feedbackSuggestion_(assessment, level) : String(current.Feedback);
      const reviewed = level === '미실시' ? true : changed ? false : current.FeedbackReviewed === true || String(current.FeedbackReviewed).toLowerCase() === 'true';
      _upsertResult_([assessmentId, number, level, feedback, reviewed, current ? current.Retake || '' : '']);
    });
    return { saved: entries.length };
  } finally {
    lock.releaseLock();
  }
}

function publishFeedback(assessmentId, entries) {
  _requireTeacher_();
  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    entries.forEach((entry) => {
      const number = _validAttendanceNo_(entry.number);
      const current = _findResult_(assessmentId, number);
      if (!current) return;
      if (String(current.Level) !== '미실시' && !String(entry.feedback || '').trim()) throw new Error('피드백을 비워둘 수 없습니다.');
      current.Feedback = String(entry.feedback || '').trim();
      current.FeedbackReviewed = true;
      _upsertResult_([assessmentId, number, current.Level, current.Feedback, true, current.Retake || '']);
    });
    return { published: entries.length };
  } finally {
    lock.releaseLock();
  }
}

function saveRetake(assessmentId, choice) {
  const number = _studentNumberFromSession_();
  if (!['yes', 'no'].includes(choice)) throw new Error('재시험 선택값이 올바르지 않습니다.');
  const current = _findResult_(assessmentId, number);
  if (!current) throw new Error('평가 결과를 찾을 수 없습니다.');
  _upsertResult_([assessmentId, number, current.Level, current.Feedback, current.FeedbackReviewed, choice]);
  return { saved: true };
}

function _studentNumberFromSession_() {
  const cache = CacheService.getUserCache();
  const number = cache.get('studentAttendanceNo');
  if (!number) throw new Error('다시 로그인해 주세요.');
  return number;
}

function _replaceAttendanceNo_(oldNumber, newNumber) {
  const sheet = _sheet_('Results');
  const rows = _readObjects_('Results');
  rows.forEach((row, index) => {
    if (String(row.AttendanceNo) === oldNumber) sheet.getRange(index + 2, 2).setValue(newNumber);
  });
}

function _feedbackSuggestion_(assessment, level) {
  const opening = {
    '매우 잘함': `${assessment.Unit}의 핵심을 정확히 이해하고 풀이를 잘 설명했어요.`,
    '잘함': `${assessment.Unit}의 중요한 내용을 이해하고 과제를 차근차근 해냈어요.`,
    '보통': `${assessment.Unit}을 끝까지 해보려는 노력이 좋았어요.`,
    '노력 요함': `${assessment.Unit}에 도전하고 끝까지 참여한 점이 의미 있어요.`
  };
  const next = {
    '매우 잘함': '배운 방법을 다른 문제에도 적용해 보며 이해를 넓혀 보세요.',
    '잘함': '풀이 과정을 다시 점검하고 비슷한 문제를 하나 더 풀어 보세요.',
    '보통': '평가 기준을 작은 단계로 나누어 차근차근 연습해 보세요.',
    '노력 요함': '기초 예시부터 다시 살펴보고, 막히는 부분은 선생님께 질문해 보세요.'
  };
  const rubric = String(assessment.Rubric).replace(/[.!?。]+$/, '');
  return `“${rubric}”라는 평가 기준을 바탕으로, ${opening[level]} ${next[level]}`;
}

function _upsertResult_(values) {
  const sheet = _sheet_('Results');
  const rows = _readObjects_('Results');
  const index = rows.findIndex((row) => String(row.AssessmentId) === String(values[0]) && String(row.AttendanceNo) === String(values[1]));
  if (index < 0) sheet.appendRow(values);
  else sheet.getRange(index + 2, 1, 1, values.length).setValues([values]);
}

function _findResult_(assessmentId, number) {
  return _readObjects_('Results').find((row) => String(row.AssessmentId) === String(assessmentId) && String(row.AttendanceNo) === String(number));
}

function _findAssessment_(id) {
  const assessment = _readObjects_('Assessments').find((row) => String(row.Id) === String(id));
  if (!assessment) throw new Error('평가를 찾을 수 없습니다.');
  return assessment;
}

function _validAttendanceNo_(value) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1) throw new Error('출석번호는 1 이상의 숫자로 입력해 주세요.');
  return String(number);
}

function _newPin_() {
  const pins = _readObjects_('Students').map((row) => String(row.Pin));
  let pin;
  do {
    pin = String(Math.floor(1000 + Math.random() * 9000));
  } while (pins.includes(pin));
  return pin;
}

function _isTeacher_(email) {
  return _readObjects_('Teachers').some((row) => String(row.Email).trim().toLowerCase() === String(email).trim().toLowerCase());
}

function _requireTeacher_() {
  const email = Session.getActiveUser().getEmail();
  if (!email || !_isTeacher_(email)) throw new Error('교사 계정만 사용할 수 있습니다.');
}

function _sheet_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('setupWorkbook()을 먼저 실행해 시트를 준비해 주세요.');
  return sheet;
}

function _readObjects_(name) {
  const sheet = _sheet_(name);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1).filter((row) => row.some((value) => value !== '')).map((row) => {
    const object = {};
    headers.forEach((header, index) => { object[header] = row[index]; });
    return object;
  });
}

function _dateString_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(value || '');
}
