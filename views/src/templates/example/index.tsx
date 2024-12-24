/* @refresh reload */
import { render } from "solid-js/web";

import "./index.scss";

function App() {
  return (
    <div>
      <h1>Hello world!</h1>
    </div>
  );
}

const root = document.getElementById("root");

// biome-ignore lint/style/noNonNullAssertion: <explanation>
render(() => <App />, root!);
