import { 상품목록_레이아웃_로딩, 상품목록_레이아웃_로딩완료 } from "./templetes.js";
import { getProducts } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  document.querySelector("#root").innerHTML = 상품목록_레이아웃_로딩;

  getProducts({}).then((products) => {
    console.log(products);
    document.querySelector("#root").innerHTML = 상품목록_레이아웃_로딩완료;
  });
  // ${상품목록_레이아웃_로딩}
  // <br />
  // ${상품목록_레이아웃_로딩완료}
  // <br />
  // ${상품목록_레이아웃_카테고리_1Depth}
  // <br />
  // ${상품목록_레이아웃_카테고리_2Depth}
  // <br />
  // ${토스트}
  // <br />
  // ${장바구니_비어있음}
  // <br />
  // ${장바구니_선택없음}
  // <br />
  // ${장바구니_선택있음}
  // <br />
  // ${상세페이지_로딩}
  // <br />
  // ${상세페이지_로딩완료}
  // <br />
  // ${_404_}
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
