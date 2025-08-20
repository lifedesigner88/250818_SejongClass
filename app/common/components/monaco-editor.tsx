import { Editor } from '@monaco-editor/react';

interface MonacoEditorProps {
    code: string;
    setCode: (value: string) => void;
    options?: object;
}

export default function MonacoEditor({ code, setCode, options }: MonacoEditorProps) {
    return (
        <div
            className="border rounded overflow-hidden"
            style={{
                resize: "vertical",
                minHeight: '200px',
                maxHeight: '800px',
                height: '500px'
            }}
        >
            <Editor
                height="100%"
                defaultLanguage="python"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme={'hc-black'}
                options={{
                    fontSize: 14,
                    lineHeight: 26,
                    padding: { top: 25 },
                    minimap: { enabled: true },
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    quickSuggestions: { other: true, comments: true, strings: true, },
                    suggest: {
                        showKeywords: true,
                        showFunctions: true,
                        showClasses: true,
                        showStructs: true,
                        showInterfaces: true,
                        showModules: true,
                        showMethods: true,
                        showProperties: true,
                        showFields: true,
                        showConstructors: true,
                    },
                    cursorStyle: 'block',
                    ...options
                }}
            />

        </div>
    );

}
