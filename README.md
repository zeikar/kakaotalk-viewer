# KakaoTalk Viewer

KakaoTalk chat viewer. 카카오톡 내보내기 뷰어.

Inspired by [kokoa-clone-2020](https://github.com/nomadcoders/kokoa-clone-2020)

# Demo

[https://zeikar.github.io/kakaotalk-viewer](https://zeikar.github.io/kakaotalk-viewer)

<img src="./docs/assets/kakaotalk-viewer-demo.png" alt="KakaoTalk Viewer demo screenshot" width="720">

# Supports

- Windows: v3.3.6.2992
- MacOS: v2.9.9
- Android: v9.6.1

# Stack

Preact + TypeScript + Vite + Tailwind, virtualized list via [react-virtuoso](https://virtuoso.dev).

# Development

```sh
npm install
npm run dev      # http://localhost:5173/kakaotalk-viewer/
npm test
npm run build    # type-check + production build to ./dist
npm run preview  # serve ./dist locally
```

# Deployment

`master` 브랜치에 푸시하면 [.github/workflows/deploy.yml](.github/workflows/deploy.yml) 가 빌드해서 `gh-pages` 브랜치에 자동 배포. 저장소 Settings → Pages → Source 를 `gh-pages` 브랜치로 설정해두면 됨.
