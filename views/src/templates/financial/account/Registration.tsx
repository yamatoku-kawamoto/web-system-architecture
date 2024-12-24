import { Match, Switch } from "solid-js";
import { account, setAccount } from "./signals";
import * as types from './types'

function General() {
  return <div>
    <Readonly label="金融機関" value={account.Financial} />
    <Readonly label="金融機関コード" value={account.FinancialCode} />
    <Readonly label="支店名" value={account.Branch} />
    <Readonly label="支店名(フリガナ)" value={account.BranchFurigana} />
    <Readonly label="支店コード" value={account.BranchCode} />
    <AccountTypeSelection />
    <Input label="口座番号" set={(e: any) => setAccount("AccountNumber", e)} />
    <Input label="口座名義(カナ)" set={(e: any) => setAccount("AccountName", e)} />
  </div>;
}

function JapanPost() {
  return (
    <div>
      <Readonly label="支店名" value={account.Branch} />
      <Readonly label="支店名(フリガナ)" value={account.BranchFurigana} />
      <Readonly label="支店コード" value={account.BranchCode} />
      <Input label="口座番号" set={(e: any) => setAccount("AccountNumber", e)} />
      <Input label="口座名義(カナ)" set={(e: any) => setAccount("AccountName", e)} />
    </div>
  )
}

function AccountRegistration({submit}:{submit: () => void}) {
  return (
    <div class="account-registration">
      <Switch>
        <Match when={!account.isJapanPost()}>
          <General />
        </Match>
        <Match when={account.isJapanPost()}>
          <JapanPost />
        </Match>
      </Switch>
      <Submit submit={submit} />
    </div>
  );
}

function Readonly({ label, value }: {label: string, value: string}) {
  return (
    <label>
      <span>{label}</span>
      <input type="text" readonly value={value} />
    </label>
  );
}

function AccountTypeSelection() {
  return (
    <label>
  <span>口座種別</span>
  {Object.values(types.AccountType).map((accountType) => (
    <label>
      <input
        type="radio"
        name="accountType"
        value={accountType}
        checked={account.AccountType === accountType}
        onChange={() => setAccount("AccountType", accountType)}
      />
      {accountType}
    </label>
  ))}
</label>
  )
}

function Input({ label, set }: {label: string, set: (e: any)=>void}) {
  return (
    <label>
      <span>{label}</span>
      <input type="text" onInput={(e) => set((e.target as HTMLInputElement).value)} />
    </label>
  );
}

function Submit({submit}:{submit: () => void}) {
  return (
    <button type="button" onClick={submit}>
      登録
    </button>
  );
}

export { AccountRegistration };
