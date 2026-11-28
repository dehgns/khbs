# 경기고등학교 방송부(KHBS) 신입부원 최종 합격자발표

대학 입학처 합격자 발표 화면 스타일로 만든 **경기고등학교 방송부 신입부원 최종 합격자발표** 페이지입니다.
정적 HTML/CSS/JS로만 만들어져 GitHub Pages에서 바로 열립니다.

- 배포 주소: <https://dehgns.github.io/khbs/>
- 저장소: <https://github.com/dehgns/khbs> (**`gh-pages` 브랜치**가 사이트, `main`은 기존 앱 코드)

## 파일 구성

| 파일 | 설명 |
| --- | --- |
| `index.html` | 페이지 구조 (상단 배너·로고·조회 박스·결과 영역) |
| `style.css` | 디자인 (흰 배경·네이비 배너, 모바일/PC 반응형, 인쇄 스타일) |
| `data.js` | **명단·안내 문구 데이터 — 평소에 고칠 파일은 이것 하나입니다** |
| `app.js` | 조회 동작 (학번 확인, 결과 화면 표시) |
| `.nojekyll` | GitHub Pages에서 파일을 그대로 올리기 위한 빈 파일 |

## 명단 바꾸는 방법

1. GitHub에서 `gh-pages` 브랜치의 `data.js` 파일을 열고 오른쪽 위 **연필(Edit)** 아이콘을 누릅니다.
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

- `notices` : 조회 버튼 아래 **안내 박스** (굵게 표시하려면 `<strong>…</strong>`, 아래 작은 줄은 `sub`)
- `messages.pass` : 합격 화면의 제목·인사말·오리엔테이션(OT) 안내
- `messages.fail` : 불합격 안내 문구
- `messages.notFound` : 등록되지 않은 학번 안내 문구
- `meta` : 학년도·학교·동아리 이름 (상단 결과 화면 설명에 쓰입니다)

### "예시 학번" 안내 끄기

실제 명단을 넣은 뒤에는 `data.js` 의 `showExamples: true` 를 `false` 로 바꾸면
조회 박스 우측 하단의 **예시 학번** 안내가 사라집니다.

## 확인용 예시 학번

| 학번 | 결과 |
| --- | --- |
| `10101` | 합격 · 영상제작팀 |
| `10205` | 합격 · 아나운서팀 |
| `10102` | 불합격 |
| 그 외 학번 | 조회 결과 없음 |

조회 박스 우측 하단 **예시 학번** 버튼으로도 확인할 수 있습니다.
주소 뒤에 `?id=10101` 을 붙이면 해당 학번으로 자동 조회됩니다.
(예: <https://dehgns.github.io/khbs/?id=10101>)

## 개인정보 주의

이 사이트는 정적 페이지라서 **명단이 소스(data.js)에 그대로 들어 있습니다.**
브라우저 주소창의 `view-source:` 나 GitHub 저장소에서 누구나 명단을 볼 수 있으니,
실제 학생 이름·학번을 올리기 전에 담당 교사의 확인과 학교의 개인정보 처리 기준을 확인해 주세요.
학번만으로 조회하는 방식은 본인 확인 수단이 아니므로, 공개 범위를 신중히 정하시기 바랍니다.

## 직접 수정해서 다시 올리기 (선택)

```bash
git clone -b gh-pages https://github.com/dehgns/khbs.git
cd khbs
# data.js 수정 후
git add data.js
git commit -m "명단 업데이트"
git push
```
