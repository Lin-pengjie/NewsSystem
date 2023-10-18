import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from 'html-to-draftjs'

export default function ComposeEdit(props) {
  const [editorState, seteditorState] = useState('')

  useEffect(() => {
    const html = props.content;

    if (html) {
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        seteditorState(editorState);
      }
    }
  }, [props.content]);

  return (
    <>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editorState) => seteditorState(editorState)}
        onBlur={() => {
          // 子传父：在父组件定义一个函数，在子组件通过props调用，并将数据作为参数传递父组件
          props.getText(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
      />
    </>
  )
}
