import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";


const Tiptap = () => {

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit.configure({
            heading:{
                levels: [1, 2, 3],
            }
        })], // define your extension array
        content: '<p>Hello World!</p>', // initial content
        autofocus: true,
        editable: true,
    })

    return (
        <>
            <EditorContent editor={editor}/>
        </>
    )
}

export default Tiptap

//https://tiptap.dev/docs/editor/getting-started/configure