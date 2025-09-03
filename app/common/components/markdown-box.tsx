export default {
    // KaTeX 인라인 수식 커스터마이징
    span: ({ children, className, ...props }: any) => {
        if (className?.includes('katex-html')) {
            return (
                <span
                    className={`${className} px-9 py-7 bg-blue-50 dark:bg-blue-900/20 rounded border-blue-200 dark:border-blue-700 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30`}
                    {...props}
                >
            {children}
            </span>
            );
        }
        return <span className={className} {...props}>{children}</span>;
    },

    h1: ({ children, ...props }: any) => (
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-6 pt-6 pb-4 border-b-2 border-blue-200" {...props}>
            ✅ {children}
        </h1>
    ),
    h2: ({ children, ...props }: any) => (
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4 pl-8" {...props}>
         ✔️ {children}
        </h2>
    ),
    h3: ({ children, ...props }: any) => (
        <h3 className="text-1xl font-medium text-gray-700 dark:text-gray-300 mt-6 mb-3 pl-20" {...props}>
        🚀 {children}
        </h3>
    ),


    p: ({ children, ...props }: any) => (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props}>
            🏃‍♀️‍➡️ {children}
        </p>
    ),

    a: ({ children, href, ...props }: any) => (
        <a
            href={href}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors"
            {...props}
        >
            {children}
        </a>
    ),

    code: ({ children, className, ...props }: any) => {
        const isInline = !className;
        if (isInline) {
            return (
                <code
                    className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                >
                    {children}
                </code>
            );
        }
        return (
            <code className={className} {...props}>
                {children}
            </code>
        );
    },

    blockquote: ({ children, ...props }: any) => (
        <blockquote
            className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300"
            {...props}
        >
            {children}
        </blockquote>
    ),

    ul: ({ children, ...props }: any) => (
        <ul className="list-disc pl-6 mb-4 space-y-1" {...props}>
            {children}
        </ul>
    ),

    ol: ({ children, ...props }: any) => (
        <ol className="list-decimal pl-6 mb-4 space-y-1" {...props}>
            {children}
        </ol>
    ),

    table: ({ children, ...props }: any) => (
        <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
                {children}
            </table>
        </div>
    ),

    th: ({ children, ...props }: any) => (
        <th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold" {...props}>
            {children}
        </th>
    ),

    td: ({ children, ...props }: any) => (
        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props}>
            {children}
        </td>
    ),
};