let pyodideReadyPromise: Promise<any> | null = null;
let isInitializing = false;

function isBrowser(): boolean {
    return typeof window !== "undefined" && typeof document !== "undefined";
}

export async function getPyodide(): Promise<any> {

    // 브라우저 환경체크.
    if (!isBrowser()) throw new Error("Pyodide can only be used in the browser environment");

    if (pyodideReadyPromise) return pyodideReadyPromise;
    const w = window as any;
    if (!w.loadPyodide) {
        const start = Date.now();
        while (!w.loadPyodide && Date.now() - start < 10000) {
            await new Promise((r) => setTimeout(r, 50));
        }
        if (!w.loadPyodide) {
            throw new Error("Pyodide script not loaded. Ensure the CDN script tag is present and has loaded.");
        }
    }

    // 실제 라이브러리 다운로드
    if (!isInitializing) {
        isInitializing = true;
        pyodideReadyPromise = w.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.2/full/",
        });
    }
    return pyodideReadyPromise!;
}

export interface RunResult {
    stdout: string;
    stderr: string;
    result?: any;
    error?: string;
}

// Simple mutex to avoid mixed stdout when running concurrently
let running = false;

export async function runPython(code: string): Promise<RunResult> {
    const pyodide = await getPyodide();

    // pyoide가 실행중이면 잠시 대기.
    while (running) {
        await new Promise((r) => setTimeout(r, 10));
    }
    running = true;

    let out = "";
    let err = "";
    const originalStdout = (pyodide as any)._stdout;
    const originalStderr = (pyodide as any)._stderr;

    try {
        // Capture stdout/stderr using batched handlers
        pyodide.setStdout({
            batched: (s: string) => {
                out += s + "\n";
            },
        });
        pyodide.setStderr({
            batched: (s: string) => {
                err += s + "\n";
            },
        });

        // Run asynchronously to support await and long-running code
        const prefix = "import builtins\n" +
            "def custom_input(prompt=''):\n" +
            "    from js import window\n" +
            "    return window.prompt(prompt)\n" +
            "builtins.input = custom_input\n";

        const result = await pyodide.runPythonAsync(prefix + code);
        return { stdout: out, stderr: err, result };

    } catch (e: any) {
        const message = e && e.message ? e.message : String(e);
        return { stdout: out, stderr: err, error: message };
    } finally {
        if (originalStdout) pyodide.setStdout(originalStdout);
        if (originalStderr) pyodide.setStderr(originalStderr);
        running = false;
    }
}
