//获取编辑器的格式内容
function getEditorHTML(editorid) {
    return UE.getEditor(editorid).getContent();
}

//获取编辑器的纯文本
function getEditorText(editorid) {
    return UE.getEditor(editorid).getPlainTxt();
}

//给编辑器设置内容。在追加内容
function setEditorContent(editorid,content) {
    return  UE.getEditor(editorid).setContent(content, true);
}