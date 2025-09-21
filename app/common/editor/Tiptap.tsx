import './tiptab-css.css'
import 'katex/dist/katex.min.css'
import { EditorContent, type JSONContent, useEditor, useEditorState } from "@tiptap/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Quote, Heading1, Heading2, Calculator, Sigma, SquareSigma } from "lucide-react";
import React, { useEffect, useCallback, useState, useRef } from "react";
import Math, { migrateMathStrings } from '@tiptap/extension-mathematics'
import Blockquote from "@tiptap/extension-blockquote";
import Paragraph from "@tiptap/extension-paragraph";
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Text from "@tiptap/extension-text";
import { Node } from "@tiptap/pm/model";
import { UndoRedo } from '@tiptap/extensions'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


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
            UndoRedo,
            Heading.configure({
                levels: [1, 2],
            }),
            Math.configure({
                inlineOptions: {
                    onClick: (node: Node, pos: number) => {
                        const katex = prompt('Enter new calculation:', node.attrs.latex)
                        if (katex && editorRef.current)
                            editorRef.current.chain().setNodeSelection(pos).updateInlineMath({ latex: katex }).focus().run()
                    }
                },
                blockOptions: {
                    onClick: (node: Node, pos: number) => {
                        const katex = prompt('Enter new calculation:', node.attrs.latex)
                        if (katex && editorRef.current)
                            editorRef.current.chain().setNodeSelection(pos).updateBlockMath({ latex: katex }).focus().run()
                    }
                },
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
            migrateMathStrings(currentEditor); // latex
        },
    })

    const editorRef = useRef(editor)

    useEffect(() => {
        if (editor && content) {
            const currentContent = editor.getJSON();
            // 현재 내용과 새 내용이 다를 때만 업데이트
            if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
                editor.commands.setContent(content);
            }
        }
        editorRef.current = editor;
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


    const [latexDialogOpen, setLatexDialogOpen] = useState(false)

    const onInsertInlineMath = () => {
        const katex = prompt("latex 수식을 입력해주세요.")
        if (katex && editorRef.current)
            editorRef.current.chain().focus().insertInlineMath({ latex: katex }).run()
    }

    const onInsertBlockMath = () => {
        const katex = prompt("latex 수식을 입력해주세요.")
        if (katex && editorRef.current)
            editorRef.current.chain().focus().insertBlockMath({ latex: katex }).run()
    }

    if (!editor) {
        return null
    }

    return (
        <div className="border border-gray-200 rounded-lg p-2">
            {editable ?
                <Dialog open={latexDialogOpen} onOpenChange={setLatexDialogOpen}>
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
                            data-state={"off"}
                            onClick={onInsertInlineMath}>
                            <Sigma className="h-4 w-4"/>
                        </ToggleGroupItem>

                        <ToggleGroupItem
                            value="block-math"
                            aria-label="블록 수학 수식"
                            data-state={"off"}
                            onClick={onInsertBlockMath}>
                            <SquareSigma className="h-4 w-4"/>
                        </ToggleGroupItem>


                    </ToggleGroup>
                </Dialog>
                : null
            }
            <EditorContent editor={editor}/>

        </div>

    )
}

export default Tiptap

const LaTexInputDialog = ({
                              initialValue = '',
                              onConfirm,
                              trigger
                          }: {
    initialValue?: string
    onConfirm: (latex: string) => void
    trigger: React.ReactNode
}) => {
    const [latex, setLatex] = useState(initialValue)
    const [open, setOpen] = useState(false)

    const handleConfirm = () => {
        onConfirm(latex)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>LaTeX 수식 입력</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="latex">수식</Label>
                        <Input
                            id="latex"
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                            placeholder="예: x^2 + y^2 = z^2"
                            className="font-mono"
                        />
                    </div>
                    {/* 미리보기 */}
                    {latex && (
                        <div className="p-2 border rounded bg-gray-50">
                            <Label className="text-xs text-gray-600">미리보기:</Label>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: window.katex?.renderToString(latex, { throwOnError: false }) || latex
                                }}
                            />
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            취소
                        </Button>
                        <Button onClick={handleConfirm}>
                            확인
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}