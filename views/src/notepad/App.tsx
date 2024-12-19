import { createSignal } from "solid-js";

const [text, setText] = createSignal("");

const onInput = (e: Event) => {
    const elm = e.target as HTMLTextAreaElement;
    setText(elm.value);
}

function App(){
    return (
        <div>
            <textarea onInput={onInput} />
            <div>{text()}</div>
        </div>
    )
}

export default App