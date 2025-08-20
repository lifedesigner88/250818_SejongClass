import { useState } from 'react';
import { Button } from '~/common/components/ui/button';
import MonacoEditor from '~/common/components/monaco-editor';
import { PYTHON_CODE } from "~/common/constants/python-code";
import { runPython } from "~/common/lib/pyodide";

export default function MonacoDemo() {

    const [theme, setTheme] = useState('hc-black');
    const [code, setCode] = useState(PYTHON_CODE.basic);

    const [stdout, setStdout] = useState('');
    const [stderr, setStderr] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const toggleTheme = () => {
        if (theme === 'vs-dark') setTheme('vs')
        else if (theme === 'vs') setTheme('hc-black')
        else setTheme('vs-dark');
    };

    // 에디터 초기화 함수
    const handleReset = () => {
        setCode(PYTHON_CODE.default);
    };

    // 예제 코드 적용 함수
    const handleExample = () => {
        const examples = [
            PYTHON_CODE.math,
            PYTHON_CODE.physics,
            PYTHON_CODE.data,
            PYTHON_CODE.encrypt,
            PYTHON_CODE.game,
            PYTHON_CODE.pattern,
            PYTHON_CODE.prime
        ];
        const randomIndex = Math.floor(Math.random() * examples.length);
        setCode(examples[randomIndex]);
    };

    const handleRun = async () => {
        setIsRunning(true);
        setStdout("");
        setStderr("");
        setResult("");
        setError("");
        try {
            const res = await runPython(code);
            setStdout(res.stdout || "");
            setStderr(res.stderr || "");
            if (res.error) {
                setError(res.error);
            } else if (res.result !== undefined) {
                setResult(String(res.result));
            }
        } catch (e: any) {
            setError(e?.message || String(e));
        } finally {
            setIsRunning(false);
        }
    };

    const handleClear = () => {
        setStdout("");
        setStderr("");
        setResult("");
        setError("");
    }


    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Python 코드 에디터</h1>
                <p className="text-gray-600 mb-4">
                    Python 코드를 작성하고 실행해보세요.
                </p>
            </div>

            {/* 에디터 영역 */}
            <div className="mb-4">
                <MonacoEditor code={code} setCode={setCode} options={{ theme }}/>
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-4 flex-wrap items-center">
                <Button onClick={handleReset} variant="outline">
                    코드 초기화
                </Button>
                <Button onClick={handleExample} variant="outline">
                    예제 코드 적용
                </Button>
                <Button onClick={toggleTheme} variant="outline">
                    모드변경
                </Button>
                <Button onClick={handleRun} disabled={isRunning}>
                    {isRunning ? '실행 중...' : '실행하기'}
                </Button>
                <Button onClick={handleClear} variant="secondary"
                        disabled={isRunning && !stdout && !stderr && !result && !error}>
                    출력 지우기
                </Button>
            </div>

            {/* 실행 결과 */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">표준 출력 (stdout)</h3>
                    <pre
                        className="bg-neutral-900/50 text-sm p-3 rounded overflow-auto min-h-24 max-h-64 whitespace-pre-wrap"><code>{stdout || ' '}</code></pre>
                </div>
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">표준 에러 (stderr)</h3>
                    <pre
                        className="bg-neutral-900/50 text-sm p-3 rounded overflow-auto min-h-24 max-h-64 whitespace-pre-wrap"><code>{stderr || ' '}</code></pre>
                </div>
                <div className="border rounded-lg p-4 md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">반환 값</h3>
                    <pre
                        className="bg-neutral-900/50 text-sm p-3 rounded overflow-auto min-h-12 max-h-40 whitespace-pre-wrap"><code>{result || ' '}</code></pre>
                    {error && (
                        <div className="mt-3 text-red-400 text-sm break-words">오류: {error}</div>
                    )}
                </div>
            </div>
        </div>
    );
}