# Google Apps Script 버전

Google Apps Script는 C언어를 실행하지 않습니다. 이 폴더는 같은 웹앱을 Apps Script JavaScript와 HTML Service로 옮긴 소스입니다.

## 설치

1. 학교 Google Workspace 계정으로 새 Google 스프레드시트를 만듭니다.
2. 스프레드시트에서 확장 프로그램 > Apps Script를 엽니다.
3. 이 폴더의 `Code.gs`, `Index.html`, `Styles.html`, `Client.html`에 해당하는 파일을 만들고 내용을 붙여 넣습니다. HTML 파일 이름은 확장자를 제외하고 각각 `Index`, `Styles`, `Client`로 지정합니다.
4. Apps Script 편집기에서 `setupWorkbook`을 한 번 실행하고 요청된 스프레드시트 권한을 승인합니다. `Students`, `Teachers`, `Assessments`, `Results` 시트와 제목 행이 만들어집니다. 실행한 교사 계정은 `Teachers` 시트에 추가됩니다.
5. 다른 교사도 관리해야 한다면 학교 계정 이메일을 `Teachers` 시트에 한 줄씩 추가합니다.
6. 배포 > 새 배포 > 웹 앱을 선택합니다. 실행 사용자는 소유자, 접근 권한은 학교에서 허용한 계정 범위로 제한합니다. 모든 사용자 공개로 배포하지 마세요.
7. 가짜 학생 자료로 등록, 조회, 평가 입력, 피드백 검토, 재시험 응답을 먼저 시험합니다.

## 자료 보호

학생 이름, PIN, 평가 결과는 연결된 스프레드시트에 저장됩니다. 학교에서 Google Sheets 저장과 웹 앱 배포를 승인하기 전에는 실제 학생 자료를 넣지 마세요. 스프레드시트 자체도 교사에게만 공유하세요.

교사 기능은 `Teachers` 시트의 이메일을 서버에서 확인합니다. 학생은 출석번호와 PIN으로 로그인하며 서버는 해당 학생의 결과만 반환합니다. PIN은 데모용 4자리 번호이므로 학교 계정 로그인 정책이 있다면 실제 운영 전에 그 방식으로 교체해야 합니다.

학교에서 AI API 사용을 승인하지 않은 상태이므로 외부 AI 호출은 없습니다. 피드백 제안은 Apps Script에서 평가 기준과 성취수준을 조합하는 규칙 기반 문장입니다.
