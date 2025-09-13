import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import components from './markdown-box';
import { Button } from "@/components/ui/button";

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const isScrollingRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // activeId 변경에 debounce 적용
    const setActiveIdWithDelay = (newId: string) => {
        // 기존 타이머 취소
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // 새로운 타이머 설정 (200ms 딜레이)
        debounceTimeoutRef.current = setTimeout(() => {
            setActiveId(newId);
        }, 200);
    };

    // 목차 추출
    useEffect(() => {
        const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
        const toc = headings.map((heading) => {
            const level = (heading.match(/^#+/) || [''])[0].length;
            const text = heading.replace(/^#+\s+/, '');
            const id = text
                .toLowerCase()
                .replace(/[^\w가-힣\s-]/g, '')
                .replace(/\s+/g, '-');
            return { id, text, level };
        });
        setTocItems(toc);
    }, [content]);

    // 스크롤 시 활성 섹션 감지 (개선된 로직)
    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                // 수동 스크롤 중일 때는 observer 무시
                if (isScrollingRef.current) return;

                // 가장 많이 보이는 요소 찾기
                const visibleEntries = entries.filter(entry => entry.isIntersecting);
                if (visibleEntries.length > 0) {
                    // 가장 위에 있는 요소를 활성화 (딜레이 적용)
                    const topEntry = visibleEntries.reduce((prev, current) =>
                        current.boundingClientRect.top < prev.boundingClientRect.top ? current : prev
                    );
                    setActiveIdWithDelay(topEntry.target.id);
                }
            },
            {
                rootMargin: '-10% 0px -70% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1]
            }
        );

        // 약간의 지연 후 헤딩 요소들을 관찰 시작
        const timer = setTimeout(() => {
            const headingElements = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
            headingElements.forEach((el) => observerRef.current?.observe(el));
        }, 100);

        return () => {
            clearTimeout(timer);
            observerRef.current?.disconnect();
        };
    }, [content]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // 수동 스크롤 시작
            isScrollingRef.current = true;
            setActiveId(id);

            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // 스크롤 완료 후 observer 재활성화
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 1000); // 스크롤 애니메이션 완료를 위한 충분한 시간
        }
    };

    return (
        <div className="grid grid-cols-10 gap-6">
            {/* 마크다운 콘텐츠 */}
            <div className={`col-span-7 flex-1 min-w-0 prose prose-gray dark:prose-invert max-w-none h-100 overflow-hidden ${className}`}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeHighlight, rehypeSlug, rehypeKatex]}
                    components={components}
                >
                    {content}
                </ReactMarkdown>
            </div>
            {/* 목차 */}
            <div className="col-span-3 flex-shrink-0  w-full">
                <div className={"sticky top-6"}>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        목차
                    </h3>
                    {tocItems.map((item) => (
                        <Button
                            variant="ghost"
                            key={item.id}
                            onClick={() => scrollToHeading(item.id)}
                            aria-pressed={activeId === item.id}         // 접근성 보강(토글 성격이면 유용)
                            data-active={activeId === item.id}          // data-*로 스타일링 트리거
                            className={`block w-full text-left text-sm transition-colors 
                            hover:text-blue-600 dark:hover:text-blue-400
                            data-[active=true]:bg-blue-50 dark:data-[active=true]:bg-blue-950/30
                            `}
                            style={{ paddingLeft: `${item.level * 24}px` }}
                        >
                            {item.text} {activeId === item.id ? " — ✅" : ""}
                        </Button>

                    ))}
                </div>
            </div>
        </div>
    );
}


