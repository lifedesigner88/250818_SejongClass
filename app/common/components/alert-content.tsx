import type { getPublicUserData } from "#app/feature/users/quries.js";
import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

type GetPublicUserDataType = Awaited<ReturnType<typeof getPublicUserData>>;
type NotificationsType = NonNullable<GetPublicUserDataType>["notifications"]

interface AlertContentProps {
    notifications: NotificationsType | undefined;
}

export const AlertContent = ({ notifications }: AlertContentProps) => {

    console.log(notifications);

    return (
        <Tabs defaultValue="no" >
            <TabsList>
                <TabsTrigger value="no">🚨</TabsTrigger>
                <TabsTrigger value="yes">✅</TabsTrigger>
            </TabsList>
            <TabsContent value="no">미확인한 내용들 입니다.</TabsContent>
            <TabsContent value="yes">확인한 내용</TabsContent>
        </Tabs>

    )
}

