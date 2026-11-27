# 경기고등학교 방송부 합격 결과 조회 사이트

## 포함 기능
- 접수번호 + 이름으로 합격/불합격/예비합격 조회
- 결과 공개/비공개 설정
- Supabase Auth 기반 관리자 로그인 및 admins 테이블 권한 확인
- 지원자 개별 등록/수정/삭제
- XLSX/XLS/CSV 업로드 및 XLSX 다운로드
- 서버 API를 통한 관리자 전용 데이터 변경
- RLS 및 조회 횟수 제한

## 배포 전 필수 설정
1. Supabase SQL Editor에서 `supabase/schema.sql` 실행 (기존에 같은 스키마를 실행했다면 안전하게 다시 실행 가능)
2. Authentication > Users에서 관리자 계정을 만든 후 확인 이메일을 처리
3. 관리자 UID를 admins에 등록:
   `insert into public.admins(user_id) values ('관리자-UUID') on conflict do nothing;`
4. GitHub 저장소에 이 프로젝트의 폴더 안 파일과 폴더를 업로드
5. Vercel에서 GitHub 저장소를 Import하고 아래 환경변수를 등록

## Vercel 환경변수
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (서버 전용. `NEXT_PUBLIC_` 접두사를 붙이지 말고 절대 공개하지 마세요.)

## 엑셀 양식
첫 번째 시트에 다음 열을 사용하세요: `접수번호`, `이름`, `부서`, `결과`.
결과 값은 `합격`, `불합격`, `예비합격` 또는 빈칸. 접수번호와 이름은 필수입니다. 기존 접수번호와 일치하면 해당 지원자 정보를 갱신합니다.

## 개인정보 및 운영 주의
실제 학생 개인정보를 입력하기 전에 담당 교사의 승인과 학교의 개인정보 처리 기준을 확인하세요. 조회는 접수번호와 이름을 함께 요구하지만 개인정보 보호를 완전히 보장하지 않습니다. 공개 전에 테스트 데이터를 사용해 검증하고, 결과 공개 여부를 신중하게 설정하세요. 조회 제한은 기본적인 방어이며 전문적인 봇 방지 시스템을 대체하지 않습니다.

기존 SQL을 이미 실행했다면 `supabase/admin-policy.sql`도 SQL Editor에서 실행해야 관리자 로그인 시 본인 권한을 확인할 수 있습니다.
