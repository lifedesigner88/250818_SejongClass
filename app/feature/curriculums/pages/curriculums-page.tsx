import { useState } from "react";
import { type LoaderFunctionArgs } from "react-router";
import { useSearchParams } from "react-router";
import {
    getAllcurriculumsTable,
    getcurriculumsTableBySchoolLevel,
    getcurriculumsTableByGradeAndDomain,
    getCurriculumStandardByCode,
    getDomainsBySchoolLevel,
    getSubDomainsByDomain
} from "~/feature/curriculums/querys";
import { Card, CardContent, CardHeader, CardTitle } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/common/components/ui/tabs";
import { Badge } from "~/common/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/common/components/ui/select";
import { Input } from "~/common/components/ui/input";
import type { Route } from "./+types/curriculums-page";

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");
    const schoolLevel = url.searchParams.get("schoolLevel");
    const gradeGroup = url.searchParams.get("gradeGroup");
    const domainNumber = url.searchParams.get("domainNumber");
    const code = url.searchParams.get("code");

    try {
        let data = null;
        let domains = null;
        let subDomains = null;

        if (code) {
            data = await getCurriculumStandardByCode(code);
            data = data ? [data] : [];
        } else if (gradeGroup && domainNumber) {
            data = await getcurriculumsTableByGradeAndDomain(
                parseInt(gradeGroup),
                parseInt(domainNumber)
            );
            if (gradeGroup) {
                subDomains = await getSubDomainsByDomain(
                    parseInt(gradeGroup),
                    parseInt(domainNumber)
                );
            }
        } else if (schoolLevel) {
            data = await getcurriculumsTableBySchoolLevel(schoolLevel);
            domains = await getDomainsBySchoolLevel(schoolLevel);
        } else if (query === "all") {
            data = await getAllcurriculumsTable();
        }

        return {
            data: data || [],
            domains: domains || [],
            subDomains: subDomains || [],
            query: {
                query,
                schoolLevel,
                gradeGroup,
                domainNumber,
                code
            }
        };
    } catch (error) {
        console.error("Query error:", error);
        return {
            data: [],
            domains: [],
            subDomains: [],
            query: { query, schoolLevel, gradeGroup, domainNumber, code },
            error: "쿼리 실행 중 오류가 발생했습니다."
        };
    }
}

export default function CurriculumsPage({ loaderData }: Route.ComponentProps) {
    const { data, domains, subDomains, query, error } = loaderData;
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedSchoolLevel, setSelectedSchoolLevel] = useState(query.schoolLevel || "");
    const [selectedGradeGroup, setSelectedGradeGroup] = useState(query.gradeGroup || "");
    const [selectedDomainNumber, setSelectedDomainNumber] = useState(query.domainNumber || "");
    const [codeInput, setCodeInput] = useState(query.code || "");
    const [loading, setLoading] = useState(false);

    console.log(searchParams.get("query"))

    const schoolLevels = [
        "초등학교 1∼2학년",
        "초등학교 3∼4학년",
        "초등학교 5∼6학년",
        "중학교 1∼3학년",
        "고등학교 1학년 공통수학1",
        "고등학교 1학년 공통수학2",
        "고등학교 2학년 대수",
        "고등학교 2학년 미적분1",
        "고등학교 3학년 확률과 통계",
        "고등학교 3학년 미적분2",
        "고등학교 3학년 기하"
    ];

    const gradeGroups = [
        { value: "2", label: "초등 1∼2학년 (2)" },
        { value: "4", label: "초등 3∼4학년 (4)" },
        { value: "6", label: "초등 5∼6학년 (6)" },
        { value: "9", label: "중학교 (9)" },
        { value: "10", label: "고등학교 1학년 (10)" },
        { value: "12", label: "고등학교 2∼3학년 (12)" }
    ];

    const executeQuery = (queryType: string) => {
        setLoading(true);
        const newParams = new URLSearchParams();

        if (queryType === "all") {
            newParams.set("query", "all");
        } else if (queryType === "schoolLevel" && selectedSchoolLevel) {
            newParams.set("schoolLevel", selectedSchoolLevel);
        } else if (queryType === "gradeAndDomain" && selectedGradeGroup && selectedDomainNumber) {
            newParams.set("gradeGroup", selectedGradeGroup);
            newParams.set("domainNumber", selectedDomainNumber);
        } else if (queryType === "code" && codeInput) {
            newParams.set("code", codeInput);
        }

        setSearchParams(newParams);
        setLoading(false);
    };

    const clearQuery = () => {
        setSearchParams({});
        setSelectedSchoolLevel("");
        setSelectedGradeGroup("");
        setSelectedDomainNumber("");
        setCodeInput("");
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">📚 교육과정 성취기준 쿼리 테스트</h1>
                <p className="text-muted-foreground">
                    다양한 쿼리를 테스트하여 교육과정 데이터를 조회해보세요.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <strong>오류:</strong> {error}
                </div>
            )}

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">기본 쿼리</TabsTrigger>
                    <TabsTrigger value="schoolLevel">학교급별</TabsTrigger>
                    <TabsTrigger value="gradeAndDomain">학년군×영역</TabsTrigger>
                    <TabsTrigger value="code">코드 검색</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>🔍 전체 성취기준 조회</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                모든 활성 상태인 성취기준을 정렬 순서대로 조회합니다.
                            </p>
                            <Button
                                onClick={() => executeQuery("all")}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? "로딩 중..." : "전체 성취기준 조회"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="schoolLevel" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>🏫 학교급별 성취기준 조회</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">학교급 선택</label>
                                <Select value={selectedSchoolLevel} onValueChange={setSelectedSchoolLevel}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="학교급을 선택하세요"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {schoolLevels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                onClick={() => executeQuery("schoolLevel")}
                                disabled={loading || !selectedSchoolLevel}
                                className="w-full"
                            >
                                {loading ? "로딩 중..." : "학교급별 성취기준 조회"}
                            </Button>

                            {domains.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-medium mb-2">📋 해당 학교급의 영역 목록:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {domains.map((domain: any) => (
                                            <Badge key={domain.domain_number} variant="secondary">
                                                ({domain.domain_number}) {domain.domain_name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="gradeAndDomain" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>🎯 학년군 × 영역별 성취기준 조회</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">학년군</label>
                                    <Select value={selectedGradeGroup} onValueChange={setSelectedGradeGroup}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="학년군 선택"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gradeGroups.map((group) => (
                                                <SelectItem key={group.value} value={group.value}>
                                                    {group.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">영역 번호</label>
                                    <Select value={selectedDomainNumber} onValueChange={setSelectedDomainNumber}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="영역 선택"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">(1) 수와 연산 / 다항식</SelectItem>
                                            <SelectItem value="2">(2) 변화와 관계 / 방정식과 부등식</SelectItem>
                                            <SelectItem value="3">(3) 도형과 측정 / 경우의 수</SelectItem>
                                            <SelectItem value="4">(4) 자료와 가능성 / 행렬</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                onClick={() => executeQuery("gradeAndDomain")}
                                disabled={loading || !selectedGradeGroup || !selectedDomainNumber}
                                className="w-full"
                            >
                                {loading ? "로딩 중..." : "학년군×영역별 성취기준 조회"}
                            </Button>

                            {subDomains.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-medium mb-2">📝 하위 영역 목록:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {subDomains.map((subDomain: any, index: number) => (
                                            <Badge key={index} variant="outline">
                                                ({subDomain.sub_domain_number}) {subDomain.sub_domain_name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>🔎 성취기준 코드로 검색</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">성취기준 코드</label>
                                <Input
                                    value={codeInput}
                                    onChange={(e) => setCodeInput(e.target.value)}
                                    placeholder="예: 2수01-01, 9수02-14"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    예시: 2수01-01 (초등1-2학년), 9수02-14 (중학교), 10공수1-01-01 (고등학교)
                                </p>
                            </div>
                            <Button
                                onClick={() => executeQuery("code")}
                                disabled={loading || !codeInput}
                                className="w-full"
                            >
                                {loading ? "로딩 중..." : "성취기준 코드로 검색"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Clear Button */}
            <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={clearQuery}>
                    🧹 검색 결과 지우기
                </Button>
            </div>

            {/* Results */}
            {data.length > 0 && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            📊 검색 결과
                            <Badge variant="secondary">{data.length}개 결과</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 overflow-y-auto">
                            {data.map((item: any) => (
                                <div key={item.standard_id} className=" rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center h-10 gap-2">
                                            <Badge variant="outline">{item.code}</Badge>
                                        </div>
                                        <div className="bg-muted p-3 rounded text-sm">
                                            {item.achievement_text}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {data.length === 0 && query.query && (
                <div className="mt-8 text-center p-8 text-muted-foreground">
                    <p>검색 결과가 없습니다. 다른 조건으로 시도해보세요.</p>
                </div>
            )}
        </div>
    );
}