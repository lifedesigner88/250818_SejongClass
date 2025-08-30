import { redirect } from "react-router";
import type { Route } from "./+types/unit-page";
import { getUnitAndConceptsByUnitId } from "../queries";
import { z } from "zod";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Play, BookOpen } from "lucide-react";
import colors from "~/feature/textbooks/major-color";

export const loader = async ({ params }: Route.LoaderArgs) => {
    const paramsSchema = z.object({
        "unit-id": z.coerce.number().min(1),
        "textbook-id": z.coerce.number().min(1)
    });

    const { success, data } = paramsSchema.safeParse(params);
    if (!success) throw redirect("/404");

    const unitData = await getUnitAndConceptsByUnitId(data["unit-id"]);
    console.dir(unitData, { depth: null });
    if (!(unitData
        && data["textbook-id"] === unitData.middle.major.textbook.textbook_id))
        throw redirect("/404");

    return { unitData }
}

export default function UnitPage({ loaderData }: Route.ComponentProps) {
    const { unitData } = loaderData;

    return (
        <div className="container mx-auto p-6 max-w-4xl">


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
                                src={`https://www.youtube.com/embed/8i_8OoBoZKA`}
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
                        <div className="p-6 bg-gray-50 rounded-lg border">
                            <div
                                className="prose max-w-none whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: testReadme || '' }}
                            />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    );
}


const testReadme = "# 📚 수학 개념 정리\n" +
    "\n" +
    "## 1. 주요 개념\n" +
    "\n" +
    "### 1.1 함수의 정의\n" +
    "- 한 집합의 원소를 다른 집합의 원소에 대응시키는 관계\n" +
    "- 입력값과 출력값이 1:1 또는 다:1 관계를 가짐\n" +
    "\n" +
    "### 1.2 함수의 종류\n" +
    "1. **일대일 함수**\n" +
    "2. **항등 함수**\n" +
    "3. **상수 함수**\n" +
    "\n" +
    "## 2. 중요 공식\n" +
    "\n" +
    "```math\n" +
    "f(x) = ax² + bx + c\n" +
    "```\n" +
    "\n" +
    "## 3. 파이썬 예제\n" +
    "\n" +
    "### 예제 1: 이차함수 그래프 그리기\n" +
    "```python\n" +
    "import numpy as np\n" +
    "import matplotlib.pyplot as plt\n" +
    "\n" +
    "x = np.linspace(-5, 5, 100)\n" +
    "y = x**2 + 2*x + 1\n" +
    "\n" +
    "plt.plot(x, y)\n" +
    "plt.grid(True)\n" +
    "plt.show()\n" +
    "```\n" +
    "\n" +
    "### 예제 2: 함수값 계산기\n" +
    "```python\n" +
    "def calculate_function(x):\n" +
    "    return x**2 + 2*x + 1\n" +
    "\n" +
    "result = calculate_function(3)\n" +
    "print(f'f(3) = {result}')\n" +
    "```\n" +
    "\n" +
    "### 예제 3: 함수의 근 찾기\n" +
    "```python\n" +
    "from scipy.optimize import fsolve\n" +
    "\n" +
    "def equation(x):\n" +
    "    return x**2 + 2*x + 1\n" +
    "\n" +
    "roots = fsolve(equation, [-2, 0])\n" +
    "print(f'근: {roots}')\n" +
    "```\n" +
    "\n" +
    "### 예제 4: 여러 함수 비교\n" +
    "```python\n" +
    "import numpy as np\n" +
    "import matplotlib.pyplot as plt\n" +
    "\n" +
    "x = np.linspace(-5, 5, 100)\n" +
    "y1 = x**2  # 이차함수\n" +
    "y2 = 2*x + 1  # 일차함수\n" +
    "y3 = np.sin(x)  # 삼각함수\n" +
    "\n" +
    "plt.plot(x, y1, label='y = x²')\n" +
    "plt.plot(x, y2, label='y = 2x + 1')\n" +
    "plt.plot(x, y3, label='y = sin(x)')\n" +
    "plt.legend()\n" +
    "plt.grid(True)\n" +
    "plt.show()\n" +
    "```\n" +
    "\n" +
    "## 4. 학습 체크리스트\n" +
    "\n" +
    "- [x] 함수의 정의 이해하기\n" +
    "- [x] 함수의 종류 구분하기\n" +
    "- [ ] 함수의 그래프 그리기\n" +
    "\n" +
    "## 5. 예제 문제\n" +
    "\n" +
    "### 문제 1\n" +
    "> f(x) = 2x + 1 일 때, f(3)의 값은?\n" +
    "\n" +
    "**풀이**:\n" +
    "1. x에 3을 대입\n" +
    "2. f(3) = 2(3) + 1\n" +
    "3. f(3) = 6 + 1 = 7\n" +
    "\n" +
    "## 6. 참고 자료\n" +
    "\n" +
    "| 개념 | 정의 | 예시 |\n" +
    "|------|------|------|\n" +
    "| 정의역 | 함수의 입력값 집합 | {x ∈ R} |\n" +
    "| 공역 | 함수의 출력값 집합 | {y ∈ R} |\n" +
    "\n" +
    "---\n" +
    "\n" +
    "> 💡 **참고**: 이 내용은 고등학교 수학I 교과과정의 일부입니다.\n"