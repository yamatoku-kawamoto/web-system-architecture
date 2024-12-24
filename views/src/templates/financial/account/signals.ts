import { createSignal } from "solid-js";
import { Account, Mode } from "./types";
import { createStore } from "solid-js/store";
import * as types from "./types";

const [mode, setMode] = createSignal<Mode>(Mode.View);
const [account, setAccount] = createStore<Account>(new Account());
const [controlChar, setControlChar] = createSignal<string>("");
const [sequence, setSequence] = createSignal(
  types.Sequence.FinancialInstitutionHiragana
);

const nextSequence = () => {
  setSequence(sequence() + 1);
  history.pushState(
    { sequence: sequence(), controlChar: controlChar() },
    "",
    location.href
  );
};

export {
  mode,
  setMode,
  account,
  setAccount,
  controlChar,
  setControlChar,
  sequence,
  setSequence,
  nextSequence,
};
