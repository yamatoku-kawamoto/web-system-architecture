/* @refresh reload */
import { render } from "solid-js/web";

// import "./index.scss";

// import { App as FinancialAccount } from "./account/bank";
import { App as FinancialAccount } from "./account/Account";

function App() {
  return (
    <div>
      <FinancialAccount />
    </div>
  );
}

const root = document.getElementById("root");

// biome-ignore lint/style/noNonNullAssertion: <explanation>
render(() => <App />, root!);
