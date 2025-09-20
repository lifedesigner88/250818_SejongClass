import type { Editor, JSONContent } from "@tiptap/react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import {
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Type,
    Undo
} from "lucide-react";

interface MenuBarProps {
    editor: Editor;
}

interface ButtonConfig {
    key: string;
    icon: React.ComponentType<{ size?: number }>;
    action: () => void;
    isActive?: boolean;
    canExecute?: boolean;
    label?: string;
}

interface ButtonGroupConfig {
    buttons: ButtonConfig[];
}

function MenuBar({ editor }: MenuBarProps) {
    const editorState = useEditorState({
        editor,
        selector: ctx => {
            return {
                bold: { isActive: ctx.editor.isActive('bold'), canExecute: ctx.editor.can().toggleBold() },
                italic: { isActive: ctx.editor.isActive('italic'), canExecute: ctx.editor.can().toggleItalic() },
                strike: { isActive: ctx.editor.isActive('strike'), canExecute: ctx.editor.can().toggleStrike() },
                code: { isActive: ctx.editor.isActive('code'), canExecute: ctx.editor.can().toggleCode() },
                paragraph: { isActive: ctx.editor.isActive('paragraph'), canExecute: true },
                h1: { isActive: ctx.editor.isActive('heading', { level: 1 }), canExecute: true },
                h2: { isActive: ctx.editor.isActive('heading', { level: 2 }), canExecute: true },
                h3: { isActive: ctx.editor.isActive('heading', { level: 3 }), canExecute: true },
                bulletList: { isActive: ctx.editor.isActive('bulletList'), canExecute: true },
                orderedList: { isActive: ctx.editor.isActive('orderedList'), canExecute: true },
                blockquote: { isActive: ctx.editor.isActive('blockquote'), canExecute: true },
                undo: { isActive: false, canExecute: ctx.editor.can().undo() },
                redo: { isActive: false, canExecute: ctx.editor.can().redo() },
            };
        },
    });

    const buttonGroups: ButtonGroupConfig[] = [
        // 텍스트 스타일
        {
            buttons: [
                {
                    key: 'bold',
                    icon: Bold,
                    action: () => editor.chain().focus().toggleBold().run(), ...editorState.bold
                },
                {
                    key: 'italic',
                    icon: Italic,
                    action: () => editor.chain().focus().toggleItalic().run(), ...editorState.italic
                },
                {
                    key: 'strike',
                    icon: Strikethrough,
                    action: () => editor.chain().focus().toggleStrike().run(), ...editorState.strike
                },
                {
                    key: 'code',
                    icon: Code,
                    action: () => editor.chain().focus().toggleCode().run(), ...editorState.code
                },
            ]
        },
        // 헤딩과 문단
        {
            buttons: [
                {
                    key: 'paragraph',
                    icon: Type,
                    action: () => editor.chain().focus().setParagraph().run(), ...editorState.paragraph
                },
                {
                    key: 'h1',
                    icon: Heading1,
                    action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), ...editorState.h1
                },
                {
                    key: 'h2',
                    icon: Heading2,
                    action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), ...editorState.h2
                },
                {
                    key: 'h3',
                    icon: Heading3,
                    action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), ...editorState.h3
                },
            ]
        },
        // 리스트와 인용
        {
            buttons: [
                {
                    key: 'bulletList',
                    icon: List,
                    action: () => editor.chain().focus().toggleBulletList().run(), ...editorState.bulletList
                },
                {
                    key: 'orderedList',
                    icon: ListOrdered,
                    action: () => editor.chain().focus().toggleOrderedList().run(), ...editorState.orderedList
                },
                {
                    key: 'blockquote',
                    icon: Quote,
                    action: () => editor.chain().focus().toggleBlockquote().run(), ...editorState.blockquote
                },
            ]
        },
        // 실행취소/재실행
        {
            buttons: [
                { key: 'undo', icon: Undo, action: () => editor.chain().focus().undo().run(), ...editorState.undo },
                { key: 'redo', icon: Redo, action: () => editor.chain().focus().redo().run(), ...editorState.redo },
            ]
        }
    ];

    const renderButton = ({ key, icon: Icon, action, isActive, canExecute }: ButtonConfig) => (
        <button
            key={key}
            onClick={action}
            disabled={canExecute === false}
            className={`p-2 rounded hover:bg-gray-100 disabled:opacity-50 ${
                isActive ? 'bg-gray-200 text-blue-600' : ''
            }`}
        >
            <Icon size={16}/>
        </button>
    );

    const renderButtonGroup = (group: ButtonGroupConfig, index: number) => (
        <div key={index} className="flex gap-1">
            {group.buttons.map(renderButton)}
        </div>
    );

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
            {buttonGroups.map((group, index) => (
                <>
                    {renderButtonGroup(group, index)}
                    {index < buttonGroups.length - 1 && (
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    )}
                </>
            ))}
        </div>
    );
}

const Tiptap = ({
                    editable,
                    content,
                    onChange,
                    showMenuBar = true
                }: {
    editable: boolean,
    content?: JSONContent | null,
    onChange?: (content: JSONContent) => void,
    showMenuBar?: boolean
}) => {

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit.configure({
            heading: {
                levels: [1, 2, 3],
            }
        })],
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
                class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none p-4 min-h-[200px]',
            },
        }
    })

    useEffect(() => {
        if (editor && content) {
            const currentContent = JSON.stringify(editor.getJSON());
            if (currentContent !== JSON.stringify(content)) {
                editor.commands.setContent(content);
            }
        }
    }, [editor, content]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {showMenuBar && editable && <MenuBar editor={editor}/>}
            <EditorContent
                editor={editor}
                className="[&_.tiptap]:outline-none [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h1]:mb-4 [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-bold [&_.tiptap_h2]:mb-3 [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-bold [&_.tiptap_h3]:mb-2 [&_.tiptap_p]:mb-3 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-gray-300 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_code]:bg-gray-100 [&_.tiptap_code]:px-1 [&_.tiptap_code]:rounded"
            />
        </div>
    )
}

export default Tiptap