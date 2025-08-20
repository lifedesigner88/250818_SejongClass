import { useState } from 'react';
import { Button } from '~/common/components/ui/button';
import MonacoEditor from '~/common/components/monaco-editor';
import { PYTHON_CODE } from "~/common/constants/python-code";

export default function MonacoDemo() {

    const [theme, setTheme] = useState('hc-black');
    const [code, setCode] = useState(PYTHON_CODE.basic);

    const toggleTheme = () => {
        // 테마 순환: vs-dark -> vs -> hc-black -> vs-dark
        if (theme === 'vs-dark') {
            setTheme('vs');
        } else if (theme === 'vs') {
            setTheme('hc-black');
        } else {
            setTheme('vs-dark');
        }
    };



    // 에디터 초기화 함수
    const handleReset = () => {
        setCode('# 코드를 입력하세요');
    };

    // 예제 코드 적용 함수
    const handleExample = () => setCode(PYTHON_CODE.math);

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
            <div className="flex gap-4">
                <Button onClick={handleReset} variant="outline">
                    코드 초기화
                </Button>
                <Button onClick={handleExample} variant="outline">
                    예제 코드 적용
                </Button>
                <Button onClick={toggleTheme} variant="outline">
                    모드변경
                </Button>
            </div>

            {/* 코드 미리보기 */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">코드 미리보기</h3>
                <pre className=" p-4 rounded-lg overflow-auto">
          <code>{code}</code>
        </pre>
            </div>
        </div>
    );
}