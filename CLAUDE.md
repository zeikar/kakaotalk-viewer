# Project Instructions

## Commands

- `npm run dev` — Vite dev server at `http://localhost:5173/kakaotalk-viewer/`
- `npm test` — `vitest run --coverage` (커버리지 포함)
- `npm run build` — `tsc -b` 후 프로덕션 빌드
- `npm run preview` — 빌드 결과 로컬 서빙

## Coverage is enforced at 100%

[vite.config.ts](vite.config.ts)에서 `src/lib/**`, `src/parser/**`에 대해 branches/functions/lines/statements 모두 100%로 강제됨. 이 디렉토리에 코드 추가/수정할 때는 테스트를 함께 업데이트해야 `npm test`가 통과함.

## Test data must be anonymized

테스트의 username/메시지 텍스트는 실제 카카오톡 export 에서 발췌하지 말고 가공된 placeholder 만 사용. 기존 컨벤션은 username `"테스트"`, `"나"`, `"수아"` 등, 메시지는 `"ㅎㅇ"`, `"반가워"` 등. 사용자가 버그 리포트로 실제 대화 일부를 붙여줘도 그대로 테스트에 옮기지 말고 동일 톤으로 치환해서 재현 케이스를 만들 것. 카카오톡이 자체 생성하는 고정 시스템 문자열(`"The message has been deleted."` 등)은 식별성 없으므로 그대로 사용 가능.

## Preact, not React

런타임은 Preact. [vite.config.ts](vite.config.ts)에서 `react`/`react-dom` 를 `preact/compat` 로 alias. 코드상으로는 `react` import 가능하지만 실제 동작은 Preact 기준이므로 React 전용 API 도입 전 호환성 확인.

## Message model

[src/types.ts](src/types.ts)의 `Message` 유니온 3종: `plain`, `notification`, `select`. 파서(`src/parser/`)와 렌더러(`src/components/`) 양쪽에서 모든 kind 를 다뤄야 함.

## Deployment

`master` 푸시 시 `.github/workflows/deploy.yml` 가 `gh-pages` 브랜치로 자동 배포. Vite `base` 는 `/kakaotalk-viewer/`.
