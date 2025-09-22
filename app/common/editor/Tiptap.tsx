import './tiptab-css.css'
import 'katex/dist/katex.min.css'
import { EditorContent, type JSONContent, useEditor, useEditorState } from "@tiptap/react";
import { Quote, Heading1, Heading2, Sigma, SquareSigma } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Math, { migrateMathStrings } from '@tiptap/extension-mathematics'
import React, { useEffect, useState, useRef } from "react";
import Blockquote from "@tiptap/extension-blockquote";
import { Textarea } from "@/components/ui/textarea";
import Paragraph from "@tiptap/extension-paragraph";
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import { UndoRedo } from '@tiptap/extensions';
import Text from "@tiptap/extension-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Node } from "@tiptap/pm/model";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
                        setLatex(node.attrs.latex)
                        setIsInlin(true)
                        setIsNode(true)
                        setLatexDialogOpen(true)
                        setPos(pos)
                    }
                },
                blockOptions: {
                    onClick: (node: Node, pos: number) => {
                        setLatex(node.attrs.latex)
                        setIsInlin(false)
                        setIsNode(true)
                        setLatexDialogOpen(true)
                        setPos(pos)
                    }
                },
                katexOptions: {
                    throwOnError: false,
                    strict: false, // 완벽하지 않은 것도 허용.
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
                class: 'focus:outline-none min-h-[200px] p-0 sm:p-4',
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

    // 수식 입력.
    const [latexDialogOpen, setLatexDialogOpen] = useState(false)
    const [latex, setLatex] = useState("")
    const [isInlin, setIsInlin] = useState(false)
    const [isNode, setIsNode] = useState(false)
    const [pos, setPos] = useState(0)

    const onInsertInlineMath = () => {
        setLatex("")
        setIsInlin(true)
        setIsNode(false)
        setLatexDialogOpen(true)
    }

    const onInsertBlockMath = () => {
        setLatex("")
        setIsInlin(false)
        setIsNode(false)
        setLatexDialogOpen(true)
    }

    const confirmLatex = () => {
        if (!editorRef.current) return
        const editor = editorRef.current.chain()

        // 노드 업데이트 vs 새로 삽입
        const baseChain = isNode ? editor.setNodeSelection(pos) : editor.focus()

        // 인라인 vs 블록
        const action = isNode
            ? (isInlin ? 'updateInlineMath' : 'updateBlockMath')
            : (isInlin ? 'insertInlineMath' : 'insertBlockMath')

        baseChain[action]({ latex }).focus().run()
        setLatexDialogOpen(false)
    }

    if (!editor) return null

    return (
        <div className="border border-gray-200 rounded-lg px-0 sm:p-2">
            {editable ?
                <ToggleGroup
                    variant="outline"
                    type="multiple"
                    className="flex justify-center w-full px-0 sm:p-4
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
                : null
            }
            <EditorContent editor={editor}/>
            
            <Dialog open={latexDialogOpen} onOpenChange={setLatexDialogOpen}>
                <DialogContent className="w-full max-w-2xl max-h-screen overflow-y-auto ">
                    <DialogHeader>
                        <DialogTitle>LaTeX {isInlin ? " - 인라인" : " - 블록"}  </DialogTitle>
                    </DialogHeader>
                    {!isInlin
                        ? <Textarea
                            id="latex"
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                            placeholder="예: x^2 + y^2 = z^2"
                            className="font-mono min-h-[200px] resize-y break-words overflow-wrap-anywhere"/>
                        : <Input
                            id="latex"
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                            placeholder="예: x^2 + y^2 = z^2"
                            className="font-mono break-words"/>
                    }

                    {/* KaTeX 미리보기 - 가로 스크롤 방지 */}
                    {latex && (
                        <div className="p-2 border rounded bg-gray-50 overflow-x-auto">
                            <div className="min-w-0">
                                <SafeKatexRenderer latex={latex} displayMode={!isInlin} />
                            </div>
                        </div>
                    )}

                    {editable
                        ? <DialogFooter>
                            <Button variant="outline" onClick={() => setLatexDialogOpen(false)}>취소</Button>
                            <Button onClick={() => confirmLatex()}>확인</Button>
                        </DialogFooter>
                        : null
                    }
                </DialogContent>
            </Dialog>
        </div>

    )
}

export default Tiptap


const SafeKatexRenderer = ({ latex, displayMode  }: {
    latex: string,
    displayMode: boolean,
}) => {
    const [renderedHtml, setRenderedHtml] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const renderLatex = async () => {
            try {
                // 동적 import 사용
                const katex = await import('katex')
                const html = katex.default.renderToString(latex, {
                    throwOnError: false,
                    strict: false,
                    maxSize: 10,
                    maxExpand: 1000,
                    displayMode
                })
                setRenderedHtml(html)
                setError('')
            } catch (err) {
                console.error('KaTeX rendering error:', err)
                setError('수식 렌더링 오류')
                setRenderedHtml(latex) // fallback
            }
        }

        if (latex.trim()) void renderLatex()
        else setRenderedHtml('')
    }, [latex])

    if (error) return <span className="text-red-500 text-sm">{error}</span>

    return <div
        className="max-w-full overflow-x-auto whitespace-nowrap"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}/>
}