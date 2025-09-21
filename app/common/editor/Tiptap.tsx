import './tiptab-css.css'
import { EditorContent, type JSONContent, useEditor, useEditorState } from "@tiptap/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Quote } from "lucide-react";
import { useEffect } from "react";
import Blockquote from "@tiptap/extension-blockquote";
import Document from '@tiptap/extension-document'
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

const Tiptap = ({
                    editable,
                    content,
                    onChange,
                }: {
    editable: boolean,
    content?: JSONContent | null,
    onChange?: (content: JSONContent) => void,

}) => {

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [Document, Blockquote, Text, Paragraph],
        autofocus: false,
        injectCSS: true,
        editable,
        content: content || {
            type: 'doc',
            content: []
        },
        onUpdate: ({ editor }) => {
            if (onChange) onChange(editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[200px] p-4',
            },
        },
    })
    useEffect(() => {
        if (editor && content) {
            const currentContent = JSON.stringify(editor.getJSON());
            if (currentContent !== JSON.stringify(content)) {
                editor.commands.setContent(content);
            }
        }
    }, [editor, content]);

    const editorState = useEditorState({
        editor,
        selector: ctx => {
            return {
                blockquote: {
                    isActive: ctx.editor?.isActive('blockquote'),
                    canToggle: ctx.editor?.can().toggleBlockquote(),
                },
            };
        },
    });

    if (!editor) {
        return null
    }

    return (
        <div className="border border-gray-200 rounded-lg p-2">
            <ToggleGroup
                variant="outline"
                type="multiple"
                className="flex justify-center w-full p-4
                [&>button[data-state=on]]:bg-emerald-500
                [&>button[data-state=on]]:text-white ">

                <ToggleGroupItem
                    value="blockquote"
                    aria-label="Toggle blockquote"
                    disabled={!editorState?.blockquote.canToggle}
                    data-state={editorState?.blockquote.isActive ? 'on' : 'off'}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote className="h-4 w-4"/>

                </ToggleGroupItem>

            </ToggleGroup>
            <EditorContent editor={editor}/>
        </div>
    )
}

export default Tiptap