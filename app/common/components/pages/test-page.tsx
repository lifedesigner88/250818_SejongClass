import type { Route } from "./+types/test-page";
import { createTheme, getThemes } from "~/feature/subjects/helper";
import { Form, useActionData } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { z } from "zod";

export const loader = async () => {

    const themes = await getThemes();

    return { themes };
};

export const action = async ({ request }: { request: Request }) => {

    const ThemeFormSchema = z.object({
        name: z.string().min(1, '테마 이름을 입력해주세요'),
        slug: z.string().min(1, 'Slug를 입력해주세요'),
        sort_order: z.coerce.number("숫자를 입력해주세요").int().positive('정렬 순서는 양수여야 합니다'),
        icon_url: z.url("유효한 URL이 아닙니다.").optional().or(z.literal(''))
    });

    const data = Object.fromEntries(await request.formData());
    const validatedData = ThemeFormSchema.safeParse(data);
    if (!validatedData.success) {
        return {
            error: z.treeifyError(validatedData.error).properties
        };
    }

    const textIntsert = await createTheme(validatedData.data)
    return {
        textIntsert
    }
};

export default function TestPage({ loaderData, actionData }: Route.ComponentProps) {

    if (actionData) console.log("actionData", actionData)
    if (actionData && actionData.error) console.log("errors", actionData.error)

    console.log("loaderData", loaderData)


    return (<>




        <div className={"flex flex-col justify-center items-center h-screen"}>

            <div className={"grid grid-cols-3 gap-4"}>
                {loaderData.themes.map((theme) => (

                    <div className={"w-20 h-20 bg-red-100"}>
                        {theme.name}
                    </div>

                ))}
            </div>
            <Form method={"post"}>
                <div className={"flex flex-col gap-4"}>
                    <Input type={"text"} name={"name"} placeholder={"name"}/>
                    {actionData && actionData.error && actionData.error.name ? (
                            <h1>
                                {actionData.error.name.errors.join()}
                            </h1>)
                        : null
                    }
                    <Input type={"text"} name={"slug"} placeholder={"slug"}/>
                    {actionData && actionData.error && actionData.error.slug ? (
                            <h1>
                                {actionData.error.slug.errors.join()}
                            </h1>)
                        : null
                    }
                    <Input type={"text"} name={"sort_order"} placeholder={"sort_order"}/>
                    {actionData && actionData.error && actionData.error.sort_order ? (
                            <h1>
                                {actionData.error.sort_order.errors.join()}
                            </h1>)
                        : null
                    }
                    <Input type={"text"} name={"icon_url"} placeholder={"icon_url"}/>
                    {actionData && actionData.error && actionData.error.icon_url ? (
                            <h1>
                                {actionData.error.icon_url.errors.join()}
                            </h1>)
                        : null
                    }
                    <Button>hi</Button>
                </div>
            </Form>

        </div>
    </>);
}
