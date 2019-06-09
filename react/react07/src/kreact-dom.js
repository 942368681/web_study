import { initVNode } from "./kvdom";

function render(vdom, container) {
  //   container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`;
  const node = initVNode(vdom); // 返回的真实DOM
  container.appendChild(node);
}

export default { render };
