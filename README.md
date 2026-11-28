# 경기고등학교 방송부 신입부원 선발 결과 조회

대학 입학처 합격자 발표 포털 스타일로 만든 **경기고등학교 방송부(KGBS) 신입부원 선발 결과 조회** 페이지입니다.
정적 HTML/CSS/JS로만 만들어져 GitHub Pages에서 바로 열립니다.

- 배포 주소: <https://dehgns.github.io/kgbs-result/>
- 저장소: <https://github.com/dehgns/kgbs-result>

## 파일 구성

| 파일 | 설명 |
| --- | --- |
| `index.html` | 페이지 구조 (헤더·안내·조회 폼·결과 영역) |
| `style.css` | 디자인 (네이비·골드 톤, 모바일/PC 반응형, 인쇄 스타일) |
| `data.js` | **명단·안내 문구 데이터 — 평소에 고칠 파일은 이것 하나입니다** |
| `app.js` | 조회 동작 (학번 확인, 결과 화면 표시) |
| `.nojekyll` | GitHub Pages에서 파일을 그대로 올리기 위한 빈 파일 |

## 명단 바꾸는 방법

1. GitHub에서 `data.js` 파일을 열고 오른쪽 위 **연필(Edit)** 아이콘을 누릅니다.
2. `applicants` 배열의 예시 데이터를 실제 명단으로 바꿉니다.

```js
applicants: [
  { studentId: "10101", name: "김민준", result: "pass", part: "영상제작팀" },
  { studentId: "10205", name: "이서준", result: "pass", part: "아나운서팀" },
  { studentId: "10102", name: "박지호", result: "fail", part: "" }
]
```

- `studentId` : 학번 (숫자 5자리, **중복되지 않게**)
- `name` : 이름
- `result` : `"pass"` 는 합격, `"fail"` 은 불합격
- `part` : 합격자에게 표시할 배정 파트 (불합격자는 `""` 로 비워 두세요)

3. 아래로 내려 **Commit changes** 를 누르면 1~2분 뒤 사이트에 반영됩니다.

### 문구 바꾸기

같은 `data.js` 안에서 다음 부분을 고치면 됩니다.

- `notices` : 상단 **안내 사항** 목록 (굵게 표시하려면 `<strong>…</strong>` 사용)
- `schedule` : 오른쪽 **선발 일정** (`current: true` 를 지금 단계에 붙이면 강조됩니다)
- `contact` : **문의** 안내 문구
- `messages.pass` : 합격 통지서의 인사말·본문·오리엔테이션(OT) 안내
- `messages.fail` : 불합격 안내 문구
- `messages.notFound` : 등록되지 않은 학번 안내 문구

### 테스트용 예시 학번 안내 끄기

실제 명단을 넣은 뒤에는 `data.js` 의 `showExamples: true` 를 `false` 로 바꾸면
화면 맨 아래의 "테스트용 예시 학번" 안내가 사라집니다.

## 확인용 예시 학번

| 학번 | 결과 |
| --- | --- |
| `10101` | 합격 · 영상제작팀 |
| `10205` | 합격 · 아나운서팀 |
| `10102` | 불합격 |
| 그 외 학번 | 조회 결과 없음 |

주소 뒤에 `?id=10101` 을 붙이면 해당 학번으로 자동 조회됩니다.
(예: <https://dehgns.github.io/kgbs-result/?id=10101>)

## 개인정보 주의

이 사이트는 정적 페이지라서 **명단이 소스(data.js)에 그대로 들어 있습니다.**
브라우저 주소창의 `view-source:` 나 GitHub 저장소에서 누구나 명단을 볼 수 있으니,
실제 학생 이름·학번을 올리기 전에 담당 교사의 확인과 학교의 개인정보 처리 기준을 확인해 주세요.
학번만으로 조회하는 방식은 본인 확인 수단이 아니므로, 공개 범위를 신중히 정하시기 바랍니다.

## 직접 수정해서 다시 올리기 (선택)

```bash
git clone https://github.com/dehgns/kgbs-result.git
cd kgbs-result
# data.js 수정 후
git add data.js
git commit -m "명단 업데이트"
git push
```
