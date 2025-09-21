import './tiptab-css.css'
import 'katex/dist/katex.min.css'
import { EditorContent, type JSONContent, useEditor, useEditorState } from "@tiptap/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Quote, Heading1, Heading2, Calculator, Sigma } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import Math, { migrateMathStrings } from '@tiptap/extension-mathematics'
import Blockquote from "@tiptap/extension-blockquote";
import Paragraph from "@tiptap/extension-paragraph";
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Text from "@tiptap/extension-text";
import type { Editor } from "@tiptap/core";

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
        extensions: [
            Blockquote,
            Paragraph,
            Document,
            Text,
            Heading.configure({
                levels: [1, 2],
            }),
            Math.configure({
                inlineOptions: { onClick: (node, pos) => clickInlineMathNode(node, pos) },
                blockOptions: { onClick: (node, pos) => clickBlockMathNode(node, pos) },
                katexOptions: {
                    throwOnError: false, // don't throw an error if the LaTeX code is invalid
                },
            }),
        ],

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
        onCreate: ({ editor: currentEditor }) => {
            migrateMathStrings(currentEditor) // latex
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
                heading1: {
                    isActive: ctx.editor?.isActive('heading', { level: 1 }),
                    canToggle: ctx.editor?.can().toggleHeading({ level: 1 }),
                },
                heading2: {
                    isActive: ctx.editor?.isActive('heading', { level: 2 }),
                    canToggle: ctx.editor?.can().toggleHeading({ level: 2 }),
                },
                blockquote: {
                    isActive: ctx.editor?.isActive('blockquote'),
                    canToggle: ctx.editor?.can().toggleBlockquote(),
                },
            };
        },
    });

    const clickInlineMathNode = useCallback((node: { attrs: { latex: string | undefined; }; }, pos: number) => {
        const katex = prompt('Enter new calculation:', node.attrs.latex)
        console.log(katex)
        if (katex && editor) {
            editor?.chain().setNodeSelection(pos).updateInlineMath({ latex: katex }).focus().run()
        }
    }, [editor])

    const onInsertInlineMath = useCallback(() => {
        const katex = prompt("latex 수식을 입력해주세요.")
        if (katex && editor) {
            editor.chain().focus().insertInlineMath({ latex: katex }).run()
        }
    }, [editor])

    const clickBlockMathNode = useCallback((node: { attrs: { latex: string | undefined; }; }, pos: number) => {
        const katex = prompt('Enter new calculation:', node.attrs.latex)
        if (katex && editor) {
            editor?.chain().setNodeSelection(pos).updateBlockMath({ latex: katex }).focus().run()
        }
    }, [editor])

    const onInsertBlockMath = useCallback(() => {
        const katex = prompt("latex 수식을 입력해주세요.")
        if (katex && editor) {
            editor.chain().focus().insertBlockMath({ latex: katex }).run()
        }
    }, [editor])

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
                    value={"heading1"}
                    aria-label="Toggle heading 1"
                    disabled={!editorState?.heading1.canToggle}
                    data-state={editorState?.heading1.isActive ? 'on' : 'off'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                    <Heading1 className="h-4 w-4"/>
                </ToggleGroupItem>

                <ToggleGroupItem
                    value="heading2"
                    aria-label="Toggle heading 2"
                    disabled={!editorState?.heading2.canToggle}
                    data-state={editorState?.heading2.isActive ? 'on' : 'off'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <Heading2 className="h-4 w-4"/>
                </ToggleGroupItem>


                <ToggleGroupItem
                    value="blockquote"
                    aria-label="Toggle blockquote"
                    disabled={!editorState?.blockquote.canToggle}
                    data-state={editorState?.blockquote.isActive ? 'on' : 'off'}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote className="h-4 w-4"/>
                    {/* Ctrl + Shift + B */}
                </ToggleGroupItem>

                <ToggleGroupItem
                    value="inline-math"
                    aria-label="인라인 수학 수식"
                    // disabled={!editorState?.inlineMath.canInsert}
                    // data-state={editorState?.inlineMath.isActive ? 'on' : 'off'}
                    onClick={onInsertInlineMath}
                >
                    <Sigma className="h-4 w-4"/>
                </ToggleGroupItem>

                <ToggleGroupItem
                    value="block-math"
                    aria-label="블록 수학 수식"
                    // disabled={!editorState?.blockMath.canInsert}
                    // data-state={editorState?.blockMath.isActive ? 'on' : 'off'}
                    onClick={onInsertBlockMath}
                >
                    <Calculator className="h-4 w-4"/>
                </ToggleGroupItem>


            </ToggleGroup>
            <EditorContent editor={editor}/>
        </div>
    )
}

export default Tiptap