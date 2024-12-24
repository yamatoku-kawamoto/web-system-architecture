import { Match, Show, Switch } from "solid-js";
import {
  account,
  controlChar,
  mode,
  nextSequence,
  sequence,
  setAccount,
  setControlChar,
  setMode,
  setSequence,
} from "./signals";
import * as types from "./types";
import { AccountRegistration } from "./Registration";
import "./index.scss";

function development() {
  // setAccount(()=>{
  //     const account = new types.Account();
  //     account.Financial = "愛知銀行";
  //     account.FinancialCode = "001";
  //     account.Branch = "名古屋支店";
  //     account.BranchCode = "10001";
  //     account.BranchFurigana = "ナゴヤ";
  //     account.AccountNumber = "1234***";
  //     account.AccountName = "ヤマダ タロウ";
  //     return account;
  // })
  setAccount(() => {
    const account = new types.Account();
    account.Financial = "ゆうちょ銀行";
    account.FinancialCode = "9900";
    account.Branch = "二二八支店";
    account.BranchCode = "228";
    account.BranchFurigana = "ニイニイハチ";
    account.AccountNumber = "1234***";
    account.AccountName = "ヤマダ タロウ";
    return account;
  });
}

window.addEventListener("load", () => {
  development();

  const clonedAccount = JSON.parse(JSON.stringify(account));
  history.pushState(
    { mode: mode(), account: clonedAccount },
    "",
    location.href
  );
});

window.addEventListener("popstate", (e) => {
  const state = e.state;
  if (state) {
    if (state.account) {
      setAccount(state.account);
    }
    setMode(state.mode === undefined ? types.Mode.Edit : state.mode);
    setSequence(state.sequence || 0);
    setControlChar(state.controlChar);
  }
});

const master: types.master[] = [
  {
    financial: {
      prefix: "ア",
      code: "001",
      name: "愛知銀行",
    } as types.financial,
    branch: {
      prefix: "ナ",
      code: "10001",
      name: "名古屋支店",
      furigana: "ナゴヤ",
    } as types.branch,
  },
  {
    financial: {
      prefix: "ア",
      code: "001",
      name: "愛知銀行",
    } as types.financial,
    branch: {
      prefix: "ナ",
      code: "10002",
      name: "名古屋駅前支店",
      furigana: "ナゴヤエキマエ",
    } as types.branch,
  },
  {
    financial: {
      prefix: "ユ",
      code: "9900",
      name: "ゆうちょ銀行",
    } as types.financial,
    branch: {
      prefix: "ニ",
      code: "219",
      name: "二一九支店",
      furigana: "ニイイチキュウ",
    } as types.branch,
  },
];

function App() {
  const cancel = () => {
    location.reload();
  };
  return (
    <div>
      <Switch>
        <Match when={mode() === types.Mode.View}>
          <ViewAccount />
        </Match>
        <Match when={mode() === types.Mode.Edit}>
          <RegistrationAccount />
          <div class="control">
            <button type="button" onClick={() => history.back()}>
              戻る
            </button>
            <button type="button" onClick={() => cancel()}>
              キャンセル
            </button>
          </div>
          <div>
            <pre>{JSON.stringify(account, null, 2)}</pre>
            <div>sequence: {sequence()}</div>
            <div>controlChar: {controlChar()}</div>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

export { App };

function ViewAccount() {
  const setEditMode = () => {
    history.pushState({ sequence: sequence() }, "", location.href);
    setMode(types.Mode.Edit);
    setAccount(new types.Account());
  };
  return (
    <div>
      <button type="button" onClick={setEditMode}>
        口座登録
      </button>
      <Show when={account.Financial !== ""}>
        <Switch>
          <Match when={account.isJapanPost()}>
            <table>
              <tbody>
                <tr>
                  <td>銀行名</td>
                  <td>{account.Financial}</td>
                </tr>
                <tr>
                  <td>支店名</td>
                  <td>{account.Branch}</td>
                </tr>
                <tr>
                  <td>支店番号</td>
                  <td>{account.BranchCode}</td>
                </tr>
                <tr>
                  <td>口座番号</td>
                  <td>{account.AccountNumber}</td>
                </tr>
                <tr>
                  <td>口座名義</td>
                  <td>{account.AccountName}</td>
                </tr>
              </tbody>
            </table>
          </Match>
          <Match when={!account.isJapanPost()}>
            <table>
              <tbody>
                <tr>
                  <td>金融機関</td>
                  <td>{account.Financial}</td>
                </tr>
                <tr>
                  <td>金融機関コード</td>
                  <td>{account.FinancialCode}</td>
                </tr>
                <tr>
                  <td>支店名</td>
                  <td>{account.Branch}</td>
                </tr>
                <tr>
                  <td>支店名(フリガナ)</td>
                  <td>{account.BranchFurigana}</td>
                </tr>
                <tr>
                  <td>支店番号</td>
                  <td>{account.BranchCode}</td>
                </tr>
                <tr>
                  <td>口座種別</td>
                  <td>{account.AccountType}</td>
                </tr>
                <tr>
                  <td>口座番号</td>
                  <td>{account.AccountNumber}</td>
                </tr>
                <tr>
                  <td>口座名義</td>
                  <td>{account.AccountName}</td>
                </tr>
              </tbody>
            </table>
          </Match>
        </Switch>
      </Show>
    </div>
  );
}

function RegistrationAccount() {
  const submit = () => {
    window.alert("submit");
    console.debug(account.submitData());
  };
  return (
    <div>
      <Breadcrumb />
      <div class="registration">
        <Switch>
          <Match
            when={
              sequence() >= types.Sequence.FinancialInstitutionHiragana &&
              sequence() <= types.Sequence.FinancialInstitution
            }
          >
            <SelectFinancial />
          </Match>
          <Match
            when={
              sequence() >= types.Sequence.BranchHiragana &&
              sequence() <= types.Sequence.Branch
            }
          >
            <SelectBranch />
          </Match>
          <Match when={sequence() === types.Sequence.Confirm}>
            <AccountRegistration submit={submit} />
          </Match>
        </Switch>
      </div>
    </div>
  );
}

function SelectFinancial() {
  const financial = Array.from(
    new Map(
      master
        .map((master) => master.financial)
        .map((financial) => [financial.code, financial])
    ).values()
  );
  const selectFinancial = (financialName: string) => () => {
    setAccount("Financial", financialName);
    setControlChar("");
    nextSequence();
  };
  return (
    <>
      <Switch>
        <Match
          when={sequence() === types.Sequence.FinancialInstitutionHiragana}
        >
          <h2>金融機関選択(ひらがな)</h2>
          <SelectControlChar />
        </Match>
        <Match when={sequence() === types.Sequence.FinancialInstitution}>
          <h2>金融機関選択</h2>
          <table>
            <thead>
                <tr>
                    <td>金融機関名</td>
                    <td>金融機関コード</td>
                    <td />
                </tr>
            </thead>
            <tbody>
              {financial
                .filter((financial) => financial.prefix === controlChar())
                .map((financial) => (
                  // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
                  <tr>
                    <td>{financial.name}</td>
                    <td>{financial.code}</td>
                    <td>
                      <button
                        type="button"
                        onClick={selectFinancial(financial.name)}
                      >
                        選択
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Match>
      </Switch>
    </>
  );
}

function SelectBranch() {
  const selectBranch = (master: types.master) => () => {
    setAccount("FinancialCode", master.financial.code);
    setAccount("Branch", master.branch.name);
    setAccount("BranchCode", master.branch.code);
    setAccount("BranchFurigana", master.branch.furigana);
    setControlChar("");
    nextSequence();
  };
  return (
    <div>
      <Switch>
        <Match when={sequence() === types.Sequence.BranchHiragana}>
          <h2>支店選択(ひらがな)</h2>
          <SelectControlChar />
        </Match>
        <Match when={sequence() === types.Sequence.Branch}>
          <h2>支店選択</h2>
          <table>
            <tbody>
              {master
                .filter((master) => master.financial.name == account.Financial)
                .filter((master) => master.branch.prefix === controlChar())
                .map((master) => (
                  <tr>
                    <td>{master.branch.name}</td>
                    <td>{master.branch.code}</td>
                    <td>
                      <button type="button" onClick={selectBranch(master)}>
                        選択
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Match>
      </Switch>
    </div>
  );
}

function Breadcrumb() {
  const setSequenceTop = () => {
    history.pushState(
      { sequence: sequence(), controlChar: controlChar() },
      "",
      location.href
    );
    setMode(types.Mode.View);
    setAccount(new types.Account());
    setSequence(0);
    setControlChar("");
  };
  const setSequenceFinancial = () => {
    history.pushState(
      { sequence: sequence(), controlChar: controlChar() },
      "",
      location.href
    );
    setSequence(types.Sequence.FinancialInstitutionHiragana);
    setAccount(new types.Account());
  };
  const setSequenceBranch = () => {
    history.pushState(
      { sequence: sequence(), controlChar: controlChar() },
      "",
      location.href
    );
    setSequence(types.Sequence.BranchHiragana);
    setAccount((prev) => {
      const account = new types.Account();
      account.Financial = prev.Financial;
      return account;
    });
  };
  return (
    <ul class="breadcrumb">
      <li>
        <span onclick={setSequenceTop}>口座情報</span>
      </li>
      <Show when={sequence() > types.Sequence.FinancialInstitutionHiragana}>
        <li>
          <span onclick={setSequenceFinancial}>金融機関</span>
        </li>
      </Show>
      <Show when={sequence() > types.Sequence.BranchHiragana}>
        <li>
          <span onclick={setSequenceBranch}>支店検索</span>
        </li>
      </Show>
    </ul>
  );
}

function SelectControlChar() {
  return (
    <div class="grid-root">
      <div class="grid-container">
        {types.JapaneseCharacters.slice(0, 5).map((row) => (
          <div class="grid-parent">
            {row.map((char) => (
              <button
                type="button"
                class="grid-child"
                onClick={() => {
                  setControlChar(char[1]);
                  nextSequence();
                }}
              >
                {char[0]}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div class="grid-container">
        {types.JapaneseCharacters.slice(5).map((row) => (
          <div class="grid-parent">
            {row.map((char) => (
              <button
                type="button"
                class="grid-child"
                onClick={() => {
                  setControlChar(char[1]);
                  nextSequence();
                }}
              >
                {char[0]}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
