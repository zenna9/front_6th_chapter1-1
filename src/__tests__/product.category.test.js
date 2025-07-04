import { afterEach, beforeAll, describe, expect, test } from "vitest";
import { screen } from "@testing-library/dom";
import { userEvent } from "@testing-library/user-event";
import { server } from "./mockServerHandler.js";

const goTo = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
};

beforeAll(async () => {
  document.body.innerHTML = '<div id="root"></div>';
  await import("../main.js");
});

afterEach(() => {
  // 각 테스트 후 상태 초기화
  document.getElementById("root").innerHTML = "";
  localStorage.removeItem("shopping_cart");
  server.resetHandlers();
});

describe("7. 카테고리 선택", () => {
  test("현재 선택된 카테고리 경로가 브레드크럼으로 표시된다", async () => {
    goTo("/");

    await screen.findByText(/총 의 상품/i);
    const target = screen.getByText("생활/건강");

    await userEvent.click(target);

    expect(window.location.search).toBe("?category1=%EC%83%9D%ED%99%9C%2F%EA%B1%B4%EA%B0%95&current=1");
    expect(await screen.findByText("300개")).toBeInTheDocument();

    expect(screen.getByText("카테고리:").parentNode.textContent.trim()).toMatch(/생활\/건강/);

    const category2 = await screen.findByText("자동차용품");
    await userEvent.click(category2);
    expect(window.location.search).toBe(
      "?category1=%EC%83%9D%ED%99%9C%2F%EA%B1%B4%EA%B0%95&current=1&category2=%EC%9E%90%EB%8F%99%EC%B0%A8%EC%9A%A9%ED%92%88",
    );
    expect(await screen.findByText("11개")).toBeInTheDocument();
    expect(screen.getByText("카테고리:").parentNode.textContent.trim()).toMatch(/생활\/건강/);
    expect(screen.getByText("카테고리:").parentNode.textContent.trim()).toMatch(/자동차용품/);
  });

  test("브레드크럼 클릭으로 상위 카테고리로 이동할 수 있다", async () => {
    goTo("/?current=1&category1=생활%2F건강&category2=자동차용품");

    // 1depth 카테고리 브레드크럼 클릭
    await userEvent.click(await screen.findByText("생활/건강"));

    expect(window.location.search).toBe("?current=1&category1=%EC%83%9D%ED%99%9C%2F%EA%B1%B4%EA%B0%95");
    expect(await screen.findByText("300개")).toBeInTheDocument();

    await userEvent.click(await screen.findByText("전체"));

    expect(window.location.search).toBe("?current=1");
    expect(await screen.findByText("340개")).toBeInTheDocument();
  });
});
