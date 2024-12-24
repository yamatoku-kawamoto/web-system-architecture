enum Mode {
  View = 0,
  Edit = 1,
}

type financial = {
  prefix: string;
  code: string;
  name: string;
};

type branch = {
  prefix: string;
  financial: financial;
  name: string;
  furigana: string;
  code: string;
};

type master = {
  financial: financial;
  branch: branch;
};

class Account {
  Financial: string = "";
  FinancialCode: string = "";
  Branch: string = "";
  BranchCode: string = "";
  BranchFurigana: string = "";
  AccountType: AccountType = AccountType.Normal;
  AccountNumber: string = "";
  AccountName: string = "";
  isJapanPost(): boolean {
    return this.FinancialCode === "9900";
  }
  submitData() {
    if (this.isJapanPost()) {
      return {
        financial: this.Financial,
        code: this.FinancialCode,
        branch: this.Branch,
        branchFurigana: this.BranchFurigana,
        branchCode: this.BranchCode,
        accountNumber: this.AccountNumber,
        accountName: this.AccountName,
      };
    }
    return {
      financial: this.Financial,
      code: this.FinancialCode,
      branch: this.Branch,
      branchCode: this.BranchCode,
      branchFurigana: this.BranchFurigana,
      accountType: this.AccountType,
      accountNumber: this.AccountNumber,
      accountName: this.AccountName,
    };
  }
}

enum AccountType {
  Normal = "普通",
  Current = "当座",
  Saving = "貯蓄",
}

enum Sequence {
  //   金融機関選択(ひらがな)
  FinancialInstitutionHiragana = 0,
  //   金融機関選択
  FinancialInstitution = 1,
  // 支店選択(ひらがな)
  BranchHiragana = 2,
  // 支店選択
  Branch = 3,
  //   確認
  Confirm = 4,
}

const JapaneseCharacters = [
  [
    ["あ", "ア"],
    ["い", "イ"],
    ["う", "ウ"],
    ["え", "エ"],
    ["お", "オ"],
  ],
  [
    ["か", "カ"],
    ["き", "キ"],
    ["く", "ク"],
    ["け", "ケ"],
    ["こ", "コ"],
  ],
  [
    ["さ", "サ"],
    ["し", "シ"],
    ["す", "ス"],
    ["せ", "セ"],
    ["そ", "ソ"],
  ],
  [
    ["た", "タ"],
    ["ち", "チ"],
    ["つ", "ツ"],
    ["て", "テ"],
    ["と", "ト"],
  ],
  [
    ["な", "ナ"],
    ["に", "ニ"],
    ["ぬ", "ヌ"],
    ["ね", "ネ"],
    ["の", "ノ"],
  ],
  [
    ["は", "ハ"],
    ["ひ", "ヒ"],
    ["ふ", "フ"],
    ["へ", "ヘ"],
    ["ほ", "ホ"],
  ],
  [
    ["ま", "マ"],
    ["み", "ミ"],
    ["む", "ム"],
    ["め", "メ"],
    ["も", "モ"],
  ],
  [
    ["や", "ヤ"],
    ["ゆ", "ユ"],
    ["よ", "ヨ"],
  ],
  [
    ["ら", "ラ"],
    ["り", "リ"],
    ["る", "ル"],
    ["れ", "レ"],
    ["ろ", "ロ"],
  ],
  [["わ", "ワ"]],
];

export {
  Mode,
  type financial,
  type branch,
  type master,
  Account,
  AccountType,
  Sequence,
  JapaneseCharacters,
};
