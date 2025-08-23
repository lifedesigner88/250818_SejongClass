import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

// Minimal shadcn/ui-like button (avoid external deps for a single-file demo)
function Button(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "ghost" }
) {
    const { className = "", variant = "default", ...rest } = props;
    const base =
        "px-4 py-2 rounded-2xl text-sm font-medium shadow-sm focus:outline-none focus:ring disabled:opacity-60 disabled:cursor-not-allowed";
    const styles =
        variant === "ghost"
            ? "bg-transparent border border-gray-300 hover:bg-gray-50"
            : "bg-black text-white hover:bg-gray-800";
    return <button className={`${base} ${styles} ${className}`} {...rest} />;
}

// Types for Pyodide kept as 'any' to keep this file drop-in and framework-agnostic
// You can add @types/pyodide later for better DX.
export default function PyodideSympyPlayground() {
    const [status, setStatus] = useState<
        | "idle"
        | "loading-pyodide"
        | "loading-packages"
        | "ready"
        | "error"
    >("idle");
    const [message, setMessage] = useState<string>("");
    const [pyOut, setPyOut] = useState<string>("");
    const [latexOut, setLatexOut] = useState<string>("");
    const [timeMs, setTimeMs] = useState<number>(0);
    const pyodideRef = useRef<any | null>(null);

    // Demo snippets
    const sympyDemo = useMemo(
        () =>
            `# SymPy: symbolic differentiation + LaTeX export\n` +
            `from sympy import symbols, sin, exp, diff, latex\n` +
            `x = symbols('x')\n` +
            `expr = exp(sin(x)) * x**2\n` +
            `d = diff(expr, x)\n` +
            `latex(d)  # return LaTeX string\n`,
        []
    );

    const numpyDemo = useMemo(
        () =>
            `# NumPy: simple linear algebra\n` +
            `import numpy as np\n` +
            `A = np.array([[3, 1], [2, 4]], dtype=float)\n` +
            `b = np.array([7, 10], dtype=float)\n` +
            `x = np.linalg.solve(A, b)\n` +
            `x  # solution vector\n`,
        []
    );

    // Inject KaTeX (CSS + JS) once
    useEffect(() => {
        const katexCssHref = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
        const katexJsSrc = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";

        if (!document.querySelector(`link[href='${katexCssHref}']`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = katexCssHref;
            document.head.appendChild(link);
        }
        if (!document.querySelector(`script[src='${katexJsSrc}']`)) {
            const script = document.createElement("script");
            script.src = katexJsSrc;
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    // Load Pyodide once
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setStatus("loading-pyodide");
                setMessage("Downloading Pyodide (Python→WASM)…");

                // Pick a tested version. You may bump this when upgrading.
                const indexURL = "https://cdn.jsdelivr.net/pyodide/v0.28.2/full/";

                // Dynamically load pyodide.js
                if (!(window as any).loadPyodide) {
                    await new Promise<void>((resolve, reject) => {
                        const s = document.createElement("script");
                        s.src = `${indexURL}pyodide.js`;
                        s.async = true;
                        s.onload = () => resolve();
                        s.onerror = () => reject(new Error("Failed to load pyodide.js"));
                        document.body.appendChild(s);
                    });
                }

                const t0 = performance.now();
                const pyodide = await (window as any).loadPyodide({ indexURL });
                const t1 = performance.now();
                if (cancelled) return;

                pyodideRef.current = pyodide;
                setStatus("loading-packages");
                setMessage("Loading NumPy/SymPy packages…");

                // Preload common scientific packages for instant imports
                await pyodide.loadPackage(["numpy", "sympy"]);

                setTimeMs(t1 - t0);
                setStatus("ready");
                setMessage("Ready. Type Python below and run.");
            } catch (err: any) {
                console.error(err);
                if (!cancelled) {
                    setStatus("error");
                    setMessage(err?.message || String(err));
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const runPython = async (code: string, expectLatex = false) => {
        setPyOut("");
        setLatexOut("");
        try {
            const py = pyodideRef.current;
            if (!py) throw new Error("Pyodide not ready yet");

            // Capture stdout
            const wrapped = `\nimport sys, io\n_stdout = io.StringIO()\n_sys_stdout = sys.stdout\nsys.stdout = _stdout\n\n_result = None\ntry:\n    _result = (\n${code
                .split("\n")
                .map((l) => "        " + l)
                .join("\n")}\n    )\nexcept Exception as e:\n    import traceback\n    traceback.print_exc()\nfinally:\n    sys.stdout = _sys_stdout\n_out = _stdout.getvalue()\n`; // returns _out and _result

            const result = py.runPython(wrapped, { filename: "<playground>" });
            // Get _out and _result from globals
            const out = py.runPython("_out");
            const val = py.runPython("_result");

            setPyOut(String(out ?? ""));

            if (expectLatex) {
                const latex = String(val ?? "");
                setLatexOut(latex);
                // Try to render with KaTeX if available
                const katex: any = (window as any).katex;
                const host = document.getElementById("latex-host");
                if (katex && host) {
                    try {
                        katex.render(latex, host, { throwOnError: false, displayMode: true });
                    } catch (e) {
                        // ignore render errors; show raw LaTeX below
                    }
                }
            } else {
                setLatexOut("");
            }
        } catch (e: any) {
            setPyOut((prev) => prev + "\n[Error] " + (e?.message || String(e)));
        }
    };

    const [code, setCode] = useState<string>(
        `# You can run any Python here.\n# Example: SymPy → LaTeX\nfrom sympy import symbols, sin, exp, diff, latex\nx = symbols('x')\nexpr = exp(sin(x)) * x**2\nd = diff(expr, x)\nlatex(d)  # The returned string will be rendered below with KaTeX\n`
    );

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 p-6">
            <div className="mx-auto max-w-5xl">
                <motion.h1
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-2xl md:text-3xl font-bold tracking-tight"
                >
                    🐍 Pyodide + NumPy/SymPy Playground (No Anaconda/Jupyter)
                </motion.h1>
                <p className="mt-1 text-sm text-slate-600">
                    Runs entirely in your browser. First load may take a moment.
                </p>

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    <div className="lg:col-span-2 space-y-3">
                        <div className="rounded-2xl border bg-white shadow-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs uppercase tracking-wider text-slate-500">Status</div>
                                <div
                                    className="text-xs text-slate-500">{timeMs ? `Pyodide loaded in ${timeMs.toFixed(0)} ms` : null}</div>
                            </div>
                            <div className="text-sm">
                <span className="inline-flex items-center gap-2">
                  <span
                      className={`h-2.5 w-2.5 rounded-full ${
                          status === "ready"
                              ? "bg-emerald-500"
                              : status === "error"
                                  ? "bg-red-500"
                                  : "bg-amber-500"
                      }`}
                  />
                  <span className="font-medium">{status.replace("-", " ")}</span>
                </span>
                                <span className="ml-2 text-slate-600">{message}</span>
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-white shadow-sm p-4">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                <Button onClick={() => setCode(sympyDemo)}>Load SymPy demo</Button>
                                <Button onClick={() => setCode(numpyDemo)}>Load NumPy demo</Button>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        setCode(
                                            `# Blank cell\nprint('Hello from Python in the browser!')\n`
                                        )
                                    }
                                >
                                    New cell
                                </Button>
                            </div>
                            <textarea
                                className="w-full h-64 font-mono text-sm rounded-xl border p-3 focus:outline-none focus:ring disabled:opacity-50"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                spellCheck={false}
                                placeholder="# Write Python here"
                            />
                            <div className="mt-3 flex gap-2">
                                <Button onClick={() => runPython(code, true)} disabled={status !== "ready"}>
                                    Run (capture LaTeX)
                                </Button>
                                <Button onClick={() => runPython(code, false)} disabled={status !== "ready"}>
                                    Run (text/array output)
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-white shadow-sm p-4">
                            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Stdout / Value</div>
                            <pre
                                className="whitespace-pre-wrap text-sm bg-slate-50 rounded-xl p-3 min-h-[5rem] border overflow-auto">
{pyOut || "(no output)"}
              </pre>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="rounded-2xl border bg-white shadow-sm p-4">
                            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Rendered LaTeX</div>
                            <div id="latex-host" className="min-h-[4rem]"/>
                            {latexOut && (
                                <>
                                    <div className="mt-2 text-xs uppercase tracking-wider text-slate-500">Raw LaTeX
                                    </div>
                                    <pre
                                        className="whitespace-pre-wrap text-sm bg-slate-50 rounded-xl p-3 border overflow-auto">{latexOut}</pre>
                                </>
                            )}
                        </div>

                        <div className="rounded-2xl border bg-white shadow-sm p-4">
                            <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Tips</div>
                            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                                <li>First run downloads Python/WASM (~10–20MB). Subsequent runs are cached.</li>
                                <li><code>pyodide.loadPackage(["numpy", "sympy"])</code> preloads popular packages. You
                                                                                         can import more on-demand.
                                </li>
                                <li>Use <code>latex(expr)</code> in SymPy to get a TeX string, which we render via
                                    KaTeX.
                                </li>
                                <li>Everything runs client-side: no server, no Anaconda, no Jupyter.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
