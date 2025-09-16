import { Form, redirect, useOutletContext } from "react-router";
import type { Route } from "./+types/unit-page";
import { getUnitAndConceptsByUnitId, updateUnitReadmeContent } from "../queries";
import { z } from "zod";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Play, BookOpen, Brain } from "lucide-react";
import colors from "~/feature/textbooks/major-color";
import { MarkdownViewer } from "@/components/markdownViewr";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { useState } from "react";
import type { OutletContextType } from "~/feature/textbooks/pages/textbook-page";

export const loader = async ({ params }: Route.LoaderArgs) => {
    const paramsSchema = z.object({
        "unit-id": z.coerce.number().min(1),
        "textbook-id": z.coerce.number().min(1)
    });

    const { success, data } = paramsSchema.safeParse(params);
    if (!success) throw redirect("/404");

    const unitData = await getUnitAndConceptsByUnitId(data["unit-id"]);
    if (!(unitData
        && data["textbook-id"] === unitData.middle.major.textbook.textbook_id))
        throw redirect("/404");



    return { unitData }
}

export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData();
    const schema = z.object({
        content: z.string().min(1)
    });

    const { success, data } = schema.safeParse(Object.fromEntries(formData));
    if (!success) throw new Error('Invalid form data');

    await updateUnitReadmeContent(1, data?.content);

    return { success: true };
};


export default function UnitPage({ loaderData }: Route.ComponentProps) {

    const { isEnrolled, setOpenEnrollWindow } = useOutletContext<OutletContextType>();

    if (!isEnrolled) {
        setOpenEnrollWindow(true)
        return
    }



    const { unitData } = loaderData;
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <div className="container mx-auto p-6 max-w-7xl h-[calc(100vh-64px)] overflow-y-auto">
            <div className="space-y-6">
                {/* 영상 섹션 */}
                <Collapsible defaultOpen>
                    <CollapsibleTrigger
                        className={`flex items-center justify-between w-full p-4 ${colors[0].badge} rounded-lg hover:opacity-50 transition-opacity`}>
                        <div className="flex items-center space-x-2">
                            <Play className="h-5 w-5"/>
                            <h2 className="text-xl font-semibold">{unitData.title}</h2>
                        </div>
                        <ChevronDown
                            className="h-5 w-5 transition-transform duration-200 data-[state=closed]:rotate-180"/>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                        <div className="aspect-video rounded-lg overflow-hidden border">
                            <iframe
                                src={`https://www.youtube.com/embed/${unitData.youtube_video_id}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* 콘텐츠 섹션 */}
                <Collapsible defaultOpen>
                    <CollapsibleTrigger
                        className={`flex items-center justify-between w-full p-4 ${colors[3].badge} rounded-lg hover:opacity-80 transition-opacity`}>
                        <div className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5"/>
                            <h2 className="text-xl font-semibold">학습 내용</h2>
                        </div>
                        <ChevronDown
                            className="h-5 w-5 transition-transform duration-200 data-[state=closed]:rotate-180"/>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border">
                            <MarkdownViewer content={unitData.readme_content ?? ""}/>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <Form method="post" className="space-y-4">
                    <input type="hidden" name="content" value={testReadme}/>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        콘텐츠 저장하기
                    </button>
                </Form>
            </div>

            {/* 개념 보기 Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <button
                        className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
                        aria-label="개념 보기"
                    >
                        <Brain className="h-6 w-6"/>
                    </button>
                </SheetTrigger>
                <SheetContent side="right" >
                    <SheetTitle className="p-10 flex items-center gap-3 text-xl">
                        <div className="p-2 bg-purple-500/10 rounded-xl">
                            <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400"/>
                        </div>
                        학습 개념
                    </SheetTitle>
                    <SheetDescription>
                        {unitData.dealings && unitData.dealings.length > 0 ? (
                            unitData.dealings.map((dealing, index) => (
                                <div
                                    key={dealing.concept.concept_id}
                                    className="m-5 group p-4 rounded-2xl backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                                    <div className={"flex items-center space-x-4"}>
                                        <div
                                            className={`flex-shrink-0 w-10 h-10 ${colors[index % colors.length].bg} text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            {index + 1}
                                        </div>
                                        <h3 className="font-bold text-xl text-gray-900 ">
                                            {dealing.concept.name}
                                        </h3>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {dealing.concept.definition && (
                                            <div className="mt-4 p-1 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                {dealing.concept.definition}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                                <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl inline-block mb-6">
                                    <Brain className="h-16 w-16 mx-auto opacity-50"/>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">개념이 없습니다</h3>
                                <p>이 단원에 등록된 개념이 아직 없습니다.</p>
                            </div>
                        )}
                    </SheetDescription>
                </SheetContent>
            </Sheet>

        </div>
    );
}

const testReadme: string = String.raw`
# 수학 공식 테스트
성취기준: [2수01-01], [2수01-04] - 수의 필요성과 0~100까지 수 개념, 수 분해와 합성으로 수감각 기르기
## 기본 공식들

### 이차방정식의 해
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

### 피타고라스 정리
$$
a^2 + b^2 = c^2
$$

### 오일러 공식
$$
e^{i\pi} + 1 = 0
$$

### 미분과 적분
$$
\frac{d}{dx}\int_a^x f(t)dt = f(x)
$$

### 극한

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$


# 물리학 공식 테스트

## 고전역학

### 뉴턴의 운동법칙
$$
F = ma
$$

### 운동에너지
$$
KE = \frac{1}{2}mv^2
$$

## 전자기학

### 맥스웰 방정식
$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_0}
$$
$$
\nabla \times \mathbf{B} = \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
$$

## 상대성이론

### 질량-에너지 등가성
$$
E = mc^2
$$

### 로렌츠 변환
$$
t' = \gamma\left(t - \frac{vx}{c^2}\right)
$$


# 선형대수 테스트

## 행렬과 벡터

### 행렬 곱셈
$$
\mathbf{C} = \mathbf{A}\mathbf{B}
$$
$$
c_{ij} = \sum_{k=1}^{n} a_{ik}b_{kj}
$$

### 역행렬
$$
\mathbf{A}^{-1} = \frac{1}{\det(\mathbf{A})}\text{adj}(\mathbf{A})
$$

### 고유값과 고유벡터
$$
\mathbf{A}\mathbf{v} = \lambda\mathbf{v}
$$

## 벡터 공간

### 내적
$$
\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^{n}u_i v_i
$$

### 외적
$$
\mathbf{u} \times \mathbf{v} = \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
u_1 & u_2 & u_3 \\
v_1 & v_2 & v_3
\end{vmatrix}
$$

### 행렬의 대각화
$$
\mathbf{A} = \mathbf{P}\mathbf{D}\mathbf{P}^{-1}
$$
# 통계학 공식 테스트

## 기본 통계량

### 평균과 표준편차
표본평균: 
$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n}x_i
$$

표준편차: 
$$
\sigma = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(x_i - \mu)^2}
$$

## 확률분포

### 정규분포
$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$

### 이항분포
$$
P(X = k) = \binom{n}{k}p^k(1-p)^{n-k}
$$

### 베이즈 정리
$$
P(A|B) = \frac{P(B|A)P(A)}{P(B)}
$$

## 가설검정

### t-검정 통계량
$$
t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}
$$
`

