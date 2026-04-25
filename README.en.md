# KakaoTalk Viewer

KakaoTalk chat viewer. 카카오톡 내보내기 뷰어.

KakaoTalk Viewer is an open-source KakaoTalk chat export viewer. Open your exported KakaoTalk chat file in the browser, browse long conversations smoothly, search messages, and jump by date without installing a desktop app.

[한국어](README.md)

## Demo

[https://zeikar.github.io/kakaotalk-viewer](https://zeikar.github.io/kakaotalk-viewer)

<img src="./docs/assets/kakaotalk-viewer-demo.png" alt="KakaoTalk Viewer demo screenshot showing a KakaoTalk exported chat rendered in a browser" width="720">

## Features

- Automatically detects Windows, macOS, Android, and iOS KakaoTalk exports.
- Renders `.txt` and `.csv` chat files directly in the browser.
- Supports Korean exports and known English date/system-message patterns.
- Search messages and jump by date, oldest, or latest.
- Separates your messages from others after owner selection.
- Keeps long chat histories responsive with virtual scrolling.
- Displays date headers, invite/leave notifications, multiline messages, and links.

## Privacy

Your chat file is not uploaded to a server. KakaoTalk Viewer reads and renders the selected file in your local browser, so the chat contents are not sent to an external server.

## How to Use

1. Open [KakaoTalk Viewer](https://zeikar.github.io/kakaotalk-viewer).
2. Export a KakaoTalk conversation and select the generated `.txt` or `.csv` file.
3. Choose your own name from the user list.
4. Browse the conversation with search, date navigation, and scrolling.

## Supported Export Versions

KakaoTalk export files from the following versions or newer are supported.

| Platform | Version |
| --- | --- |
| KakaoTalk for Windows | v3.3.6.2992+ |
| KakaoTalk for macOS | v2.9.9+ |
| KakaoTalk for Android | v9.6.1+ |
| KakaoTalk for iOS | v26.3.3+ |

KakaoTalk export formats may differ by app version and OS language. If your file cannot be opened, please remove private information from a small sample and share it in an [Issue](https://github.com/zeikar/kakaotalk-viewer/issues).

## Who This Is For

- People who want to browse backed-up KakaoTalk conversations in a readable view.
- People who need to quickly find a message or link in a long chat history.
- People who want to view KakaoTalk chat exports on a desktop browser.
- Developers who want to test or improve KakaoTalk export parsing.

## Bugs and Feature Requests

Bugs, unsupported export formats, and UI improvement ideas are welcome. Please open a [GitHub Issue](https://github.com/zeikar/kakaotalk-viewer/issues).

## Development

KakaoTalk Viewer is built with Preact, TypeScript, Vite, and Tailwind CSS. Long message lists are rendered with [react-virtuoso](https://virtuoso.dev).

```sh
npm install
npm run dev      # http://localhost:5173/kakaotalk-viewer/
npm test         # unit tests + coverage thresholds
npm run build    # type-check + production build to ./dist
npm run preview  # serve ./dist locally
```

Coverage is enforced at 100% for `src/lib/**` and `src/parser/**`. Parser or library changes should include matching tests.

## Deployment

Pushing to `master` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml) and deploys the built site to the `gh-pages` branch. The Vite base path is `/kakaotalk-viewer/`.

## Contributing

Issues and pull requests are welcome. Good contributions include parser fixes for new KakaoTalk export formats, search/navigation improvements, accessibility improvements, and documentation updates.

## License

This project is licensed under the [MIT License](LICENSE).

## Credits

Inspired by [kokoa-clone-2020](https://github.com/nomadcoders/kokoa-clone-2020).
