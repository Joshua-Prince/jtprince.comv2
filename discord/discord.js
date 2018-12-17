/*
 * Created by Joshua Prince for jtprince.com, December 2018
 */

/* Enable tooltips for bootstrap */
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

const numStr = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function getMaxMsgLength() {
    const inp = document.getElementById("msgLength").value;
    if (inp < 25) {
        return Number.MAX_SAFE_INTEGER;
    }

    return inp;
}

function getSplitWholeWords() {
    return document.getElementById("wordSplitOnly").checked;
}

function getInput() {
    return document.getElementById("input").value.toUpperCase();
}

function convertCharacter(ch) {
    if (ch >= '0' && ch <= '9') {
        return ":" + numStr[ch - '0'] + ":";
    }

    if (ch.toLowerCase() >= 'a' && ch.toLowerCase() <= 'z') {
        return ":regional_indicator_" + ch.toLowerCase() + ":";
    }

    switch (ch) {
        case "?": return ":grey_question:";
        case "!": return ":grey_exclamation:";
        case ".": return ":record_button:";
    }

    /* Something's not convertible, display warning */
    document.getElementById("alert-jumbo").style.display = "";

    return ch;
}

function convert(text) {
    let output = [""];
    for (const word of text.split(/\s/)) {
        let convertedWord = [];
        let convertedWordLength = 0;
        for (const ch of word) {
            const convertedChar = convertCharacter(ch);
            convertedWord.push(convertedChar);
            convertedWordLength += convertedChar.length + 1;
        }

        if (convertedWordLength > getMaxMsgLength() || !getSplitWholeWords()) {
            /* If word is too long to fit into one message or option is unset, insert character-by-character */
            for (const convertedChar of convertedWord) {
                if (output[output.length - 1].length + convertedChar.length > getMaxMsgLength()) {
                    output.push("");
                }
                output[output.length - 1] += convertedChar + " ";
            }
        } else {
            if (output[output.length - 1].length + convertedWordLength > getMaxMsgLength()) {
                output.push("");
            }
            for (const convertedChar of convertedWord) {
                output[output.length - 1] += convertedChar + " ";
            }
        }

        if (output[output.length - 1].length + 4 <= getMaxMsgLength()) {
            output[output.length - 1] += "    ";
        }
    }

    return output;
}

function updateOutput() {
    document.getElementById("div-output").style.opacity = "1";

    let root = document.getElementById("output-anchor");

    /* Delete existing output */
    while (root.firstChild) {
        root.firstChild.remove();
    }

    for (let alert of document.getElementById("output-alerts").children) {
        alert.style.display = "none";
    }

    if (getInput() === "") {
        document.getElementById("div-output").style.opacity = "0";
        return;
    }

    const output = convert(getInput());
    let template = document.getElementById("output-box-template");

    for (let i = 0; i < output.length; i++) {
        let clone = document.importNode(template.content, true);
        let row = clone.firstElementChild.firstElementChild;
        row.id = "output-row-" + i;
        row.querySelector("textarea").value = output[i];
        root.appendChild(clone);
    }

    if (output.length > 1) {
        document.getElementById("alert-splitting").style.display = "";
        document.getElementById("alert-jumbo").style.display = "none";
    }
}

function copyButton(elem) {
    elem.parentElement.querySelector("textarea").select();
    document.execCommand("copy");
}
