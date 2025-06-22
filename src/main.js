import { worker } from "./mocks/browser.js";

// 개발 환경에서만 MSW 워커 시작
async function enableMocking() {
  if (import.meta.env.DEV) {
    return worker.start({
      onUnhandledRequest: "bypass", // 처리되지 않은 요청은 그대로 통과
    });
  }
}

// 앱 초기화
async function initApp() {
  // MSW 워커 시작
  await enableMocking();
}

// 앱 시작
initApp().catch(console.error);
