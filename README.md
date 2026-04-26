# KakaoTalk Viewer

KakaoTalk viewer. 카카오톡 내보내기 뷰어.

카카오톡 대화 내보내기 파일을 브라우저에서 바로 열어볼 수 있는 오픈소스 카카오톡 채팅 뷰어입니다. Windows, macOS, Android, iOS에서 내보낸 카카오톡 대화 파일을 읽고, 실제 메신저처럼 날짜별로 정리된 메시지를 검색하고 탐색할 수 있습니다.

[English](README.en.md)

## 데모

[https://zeikar.github.io/kakaotalk-viewer](https://zeikar.github.io/kakaotalk-viewer)

<img src="./docs/assets/kakaotalk-viewer-demo.png" alt="KakaoTalk Viewer demo screenshot" width="720">

## 주요 기능

- Windows, macOS, Android, iOS 카카오톡 내보내기 파일 자동 감지
- `.txt`, `.csv` 대화 파일 브라우저 렌더링
- 한국어 내보내기와 영어 날짜/시스템 메시지 형식 지원
- 메시지 검색, 사용자별 필터, 날짜 이동, 맨 처음/맨 끝 이동
- 본인 이름 설정으로 내 메시지와 상대 메시지 구분
- 긴 대화방도 부드럽게 볼 수 있는 가상 스크롤
- 날짜 구분선, 초대/나가기 알림, 여러 줄 메시지, 링크 표시

## 개인정보

대화 파일은 서버로 업로드되지 않습니다. 선택한 파일은 사용자의 로컬 브라우저에서 읽고 렌더링하며, 카카오톡 대화 내용이 외부 서버로 전송되지 않습니다.

## 사용 방법

1. [KakaoTalk Viewer](https://zeikar.github.io/kakaotalk-viewer)를 엽니다.
2. 카카오톡에서 대화를 내보낸 뒤 생성된 `.txt` 또는 `.csv` 파일을 선택합니다.
3. 사용자 목록에서 본인의 이름을 선택합니다.
4. 검색, 날짜 이동, 스크롤을 사용해 대화를 확인합니다.

## 지원하는 내보내기 버전

아래 버전 이상에서 내보낸 대화 파일을 기준으로 지원합니다.

| 플랫폼 | 지원 버전 |
| --- | --- |
| Windows용 카카오톡 | v3.3.6.2992 이상 |
| macOS용 카카오톡 | v2.9.9 이상 |
| Android용 카카오톡 | v9.6.1 이상 |
| iOS용 카카오톡 | v26.3.3 이상 |

내보내기 형식은 카카오톡 앱 버전과 OS 언어 설정에 따라 달라질 수 있습니다. 읽히지 않는 파일이 있다면 샘플에서 개인정보를 제거한 뒤 [Issue](https://github.com/zeikar/kakaotalk-viewer/issues)에 알려주세요.

## 이런 분에게 유용합니다

- 백업해 둔 카카오톡 대화를 보기 좋게 다시 확인하고 싶은 분
- 긴 대화방에서 특정 메시지나 링크를 빠르게 찾고 싶은 분
- 모바일 앱 없이 PC 브라우저에서 카카오톡 대화 내역을 확인하고 싶은 분
- 카카오톡 내보내기 파일의 포맷을 테스트하거나 개선하고 싶은 개발자

## 버그 제보와 개선 제안

버그, 지원되지 않는 내보내기 형식, UI 개선 아이디어는 모두 환영합니다. [GitHub Issues](https://github.com/zeikar/kakaotalk-viewer/issues)에 등록해 주세요.

## 개발

KakaoTalk Viewer는 Preact, TypeScript, Vite, Tailwind CSS로 만들어졌습니다. 긴 메시지 목록은 [react-virtuoso](https://virtuoso.dev) 기반 가상 스크롤로 렌더링합니다.

```sh
npm install
npm run dev      # http://localhost:5173/kakaotalk-viewer/
npm test         # 단위 테스트 + 커버리지 확인
npm run build    # 타입 검사 + 프로덕션 빌드
npm run preview  # 빌드 결과 로컬 확인
```

`src/lib/**`, `src/parser/**`는 테스트 커버리지 100%가 강제됩니다. 파서나 라이브러리 코드를 수정할 때는 테스트도 함께 추가하거나 수정해 주세요.

## 배포

`master` 브랜치에 푸시하면 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)이 실행되어 빌드 결과를 `gh-pages` 브랜치로 배포합니다. Vite base path는 `/kakaotalk-viewer/`입니다.

## 기여

이슈와 풀 리퀘스트를 환영합니다. 새로운 카카오톡 내보내기 형식 지원, 검색/탐색 개선, 접근성 개선, 문서 개선 모두 좋습니다.

## 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.

## 참고

[kokoa-clone-2020](https://github.com/nomadcoders/kokoa-clone-2020)에서 영감을 받았습니다.
