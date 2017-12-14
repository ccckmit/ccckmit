function hideToolbar(){
  document.getElementById("toolbar").style.display = "none";
}

function transCallback(result) {
    if (result.translation) {
      alert("原文："+selectText + "\n\n中文："+result.translation);
    }
}

selectText = "";

function translate(text) {
  google.language.translate(text, "", "zh-TW", transCallback);
}

function translateSelected() {
  selectText=((window.getSelection && window.getSelection())
                ||(document.getSelection && document.getSelection())
                ||(document.selection && document.selection.createRange
                   &&document.selection.createRange().text));
  if (!selectText || selectText == "")
    selectText = document.getElementById("sourceText").value;
  document.getElementById("sourceText").value = selectText;
  document.getElementById("msgbar").innerHTML = selectText; // 奇怪，一定要加這兩行才行。
  selectText = document.getElementById("msgbar").innerHTML; // 奇怪，一定要加這兩行才行。
  google.language.translate(selectText, "", "zh-TW", transCallback);
}

function langLoaded() {
}

function pageLoaded() {
  google.load("language", "1", { "callback": langLoaded });
}