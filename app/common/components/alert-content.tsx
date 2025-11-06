import type { getPublicUserData } from "#app/feature/users/quries.js";
import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "./ui/item";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useFetcher } from "react-router";
import { DateTime } from "luxon";

type GetPublicUserDataType = Awaited<ReturnType<typeof getPublicUserData>>;
export type NotificationsType = NonNullable<GetPublicUserDataType>["notifications"]

interface AlertContentProps {
    notifications: NotificationsType | undefined;
}

export const AlertContent = ({ notifications }: AlertContentProps) => {

    const confirm_yes: NotificationsType = []
    const confirm_no: NotificationsType = []

    notifications?.forEach((notification) => {
        if (notification.is_checked == true)
            confirm_yes.push(notification)
        else
            confirm_no.push(notification)
    })

    const fetcher = useFetcher()
    const checkConfirm = (notification_id: number) => {
        void fetcher.submit({
            notification_id,
            type:"confirm"
        }, {
            method: "POST",
            action: "/api/notifi/check-notifi"
        })
    }

    const deleteNotifi = (notification_id: number) => {
        void fetcher.submit({
            notification_id,
            type:"delete"
        }, {
            method: "POST",
            action: "/api/notifi/check-notifi"
        })
    }

    return (
        <Tabs defaultValue="no" >
            <TabsList>
                <TabsTrigger value="no">🚨</TabsTrigger>
                <TabsTrigger value="yes">✅</TabsTrigger>
            </TabsList>


            <TabsContent value="no">
                {confirm_no.map(noti => (
                    <Item
                        key={noti.notification_id}
                        className={"my-2.5 shadow-md"} variant="outline" size="sm" asChild>
                        <a href={noti.where_url || "#"}>
                            <ItemMedia>
                                <Avatar className="size-11">
                                    <AvatarImage
                                        src={noti.from?.profile_url || ""}
                                        alt={"from"}
                                    />
                                    <AvatarFallback>
                                        {noti.from?.nickname
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle>
                                    {noti.from?.nickname}
                                    <span className="text-xs text-gray-400">@{noti.from?.username}{" 🚨 "}
                                    {DateTime.fromJSDate(noti.created_at!) .setLocale("ko") .toRelative()}</span>
                                </ItemTitle>
                                <ItemDescription>{noti.message}</ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <Button onClick={() => checkConfirm(noti.notification_id)}>확인</Button>
                            </ItemActions>
                        </a>
                    </Item>
                ))}
            </TabsContent>
                                      
            <TabsContent value="yes">
                {confirm_yes.map(noti => (
                    <Item
                        key={noti.notification_id}
                        className={"my-2.5 shadow-md"} variant="outline" size="sm" asChild>
                        <a href={noti.where_url || "#"}>
                            <ItemMedia>
                                <Avatar className="size-11">
                                    <AvatarImage
                                        src={noti.from?.profile_url || ""}
                                        alt={"from"}
                                    />
                                    <AvatarFallback>
                                        {noti.from?.nickname
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle>
                                    {noti.from?.nickname}
                                    <span className="text-xs text-gray-400">@{noti.from?.username} 
                                        {" ✅ "}
                                    {DateTime.fromJSDate(noti.created_at!) .setLocale("ko") .toRelative()}
                                    </span>
                                </ItemTitle>
                                <ItemDescription>{noti.message}</ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <Button
                                    variant={"outline"}
                                    className="bg-red-400 text-white"
                                    onClick={() => deleteNotifi(noti.notification_id)}>삭제</Button>
                            </ItemActions>
                        </a>
                    </Item>
                ))}
            </TabsContent>
        </Tabs>

    )
}

