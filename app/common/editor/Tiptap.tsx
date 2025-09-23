import './tiptab-css.css'
import 'katex/dist/katex.min.css'
import { EditorContent, type JSONContent, useEditor, useEditorState } from "@tiptap/react";
import { Quote, Heading1, Heading2, Sigma, SquareSigma, Link2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Math, { migrateMathStrings } from '@tiptap/extension-mathematics'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
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
import { all, createLowlight } from 'lowlight'
import python from 'highlight.js/lib/languages/python'
import latex from 'highlight.js/lib/languages/latex'
import { BulletList, ListItem, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list'
import Link from '@tiptap/extension-link'
import Bold from '@tiptap/extension-bold'
import { Dropcursor } from '@tiptap/extensions'
import ImageTipTap from '@tiptap/extension-image'
import { Image } from 'lucide-react';
const lowlight = createLowlight(all)
lowlight.register('python', python)
lowlight.register('latex', latex)

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
            BulletList,
            Bold,
            OrderedList,
            Dropcursor,
            ImageTipTap,
            ListItem,
            Paragraph,
            Document,
            TaskItem,
            TaskList,
            Text,
            UndoRedo,
            Link,
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
                    maxSize: 10,
                    maxExpand: 1000,
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: 'python',
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

    // 텝키 관련 이벤트 방지.
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab' && editor?.isFocused) {
            e.preventDefault() // 브라우저 기본 Tab 동작 방지

            if (e.shiftKey) {
                // Shift + Tab
                if (editor.isActive('listItem')) {
                    editor.commands.liftListItem('listItem')
                }
            } else {
                // Tab
                if (editor.isActive('listItem')) {
                    editor.commands.sinkListItem('listItem')
                } else {
                    editor.commands.insertContent('    ')
                }
            }
        }
    }

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
                bold: {
                    isActive: ctx.editor?.isActive('bold'),
                    canToggle: ctx.editor?.can().toggleBold(),
                },
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
                pythonCodeBlock: {
                    isActive: ctx.editor?.isActive('codeBlock', { language: 'python' }),
                    canToggle: ctx.editor?.can().toggleCodeBlock({ language: 'python' }),
                },
                latexCodeBlock: {
                    isActive: ctx.editor?.isActive('codeBlock', { language: 'latex' }),
                    canToggle: ctx.editor?.can().toggleCodeBlock({ language: 'latex' }),
                },
                link: {
                    isActive: ctx.editor?.isActive('link'),
                }
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
            {editable ? <div className={"sticky top-0 z-10 py-1 bg-white"}>
                <ToggleGroup
                    variant="outline"
                    type="multiple"
                    className="flex justify-center w-full px-0 sm:px-4 my-4 bg-white
                                [&>button[data-state=on]]:bg-emerald-500
                                [&>button[data-state=on]]:text-white ">
                    <ToggleGroupItem
                        value="bold"
                        aria-label="Toggle bold"
                        disabled={!editorState?.bold.canToggle}
                        data-state={editorState?.bold.isActive ? 'on' : 'off'}
                        onClick={() => editor.chain().focus().toggleBold().run()}>
                        <span className="font-bold">B</span>
                    </ToggleGroupItem>


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
                        value="image"
                        data-state={"off"}
                        aria-label="이미지 삽입"
                        onClick={() => {
                            const url = window.prompt('이미지 URL을 입력해주세요.')
                            if (url) editor.commands.setImage({ src: url })
                        }}>
                        <Image className="h-4 w-4"/>
                    </ToggleGroupItem>

                </ToggleGroup>
                <ToggleGroup
                    variant="outline"
                    type="multiple"
                    className="flex justify-center w-full px-0 sm:px-4 my-4 bg-white
                                [&>button[data-state=on]]:bg-emerald-500
                                [&>button[data-state=on]]:text-white ">

                    <ToggleGroupItem
                        value="python"
                        aria-label="Python 코드"
                        data-state={editorState?.pythonCodeBlock.isActive ? 'on' : 'off'}
                        disabled={!editorState?.pythonCodeBlock.canToggle}
                        onClick={() => editor.chain().focus().toggleCodeBlock({ language: 'python' }).run()}>
                        <img
                            src="/svg/code/python-svgrepo-com.svg"
                            alt="Python"
                            width={20}
                            height={20}
                            className="inline-block"
                        />

                    </ToggleGroupItem>

                    <ToggleGroupItem
                        value="latex"
                        aria-label="LaTeX 코드"
                        data-state={editorState?.latexCodeBlock.isActive ? 'on' : 'off'}
                        disabled={!editorState?.latexCodeBlock.canToggle}
                        onClick={() => editor.chain().focus().toggleCodeBlock({ language: 'latex' }).run()}>
                        <img
                            src="/svg/code/latex-svgrepo-com.svg"
                            alt="Python"
                            width={50}
                            height={20}
                            className="inline-block"
                        />
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

                    <ToggleGroupItem
                        value="link"
                        aria-label="링크 삽입"
                        data-state={"off"}
                        disabled={editor.isActive('link')}
                        onClick={() => {
                            const url = window.prompt('텍스트 선택 후 링크를 넣어주세요')
                            if (url) {
                                const normalizedUrl = url.trim().match(/^https?:\/\/|^mailto:|^tel:/)
                                    ? url.trim()
                                    : `https://${url.trim()}`;

                                editor.commands.setLink({ href: normalizedUrl, target: '_blank' })
                            }
                        }}>
                        <Link2 className="h-4 w-4"/>
                    </ToggleGroupItem>


                </ToggleGroup>
            </div> : null
            }

            < EditorContent onKeyDown={handleKeyDown} editor={editor}/>

            <Dialog open={latexDialogOpen} onOpenChange={setLatexDialogOpen}>
                <DialogContent className="w-full !max-w-5xl max-h-screen overflow-y-auto ">
                    <DialogHeader>
                        <DialogTitle>KaTeX {isInlin ? " - 인라인" : " - 블록"}  </DialogTitle>
                    </DialogHeader>
                    {!isInlin
                        ? <Textarea
                            id="latex"
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                            placeholder="KaTeX - (Latex 의 수식만 지원)"
                            className="font-mono min-h-[200px] resize-y break-words overflow-wrap-anywhere"/>
                        : <Input
                            id="latex"
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                            placeholder="KaTeX - (Latex 의 수식만 지원)"
                            className="font-mono break-words"/>
                    }
                    {/* KaTeX 미리보기 - 가로 스크롤 방지 */}
                    {latex && (
                        <div className="p-2 border rounded bg-gray-50 overflow-x-auto">
                            <div className="min-w-0">
                                <SafeKatexRenderer latex={latex} displayMode={!isInlin}/>
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

    );
}

export default Tiptap


const SafeKatexRenderer = ({ latex, displayMode }: {
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