import { Resend } from "resend"
import WelcomeUser from "react-email-starter/emails/welcome";
import type { Route } from "./+types/welcome";


const resned = new Resend(process.env.RESEND_API_KEY)

export const action = async ({ request }: Route.LoaderArgs) => {
    if (request.method !== "POST") return new Response(null, { status: 404 })
    const header = request.headers.get("X-SEJONG")
    const secretKey = process.env.SEJONG_SECRET_KEY
    if (!header || header !== secretKey) return new Response(null, { status: 404 })

    const jsonData = await request.json()
    const { email, username } = jsonData as { email: string; username: string }

    const { data, error } = await resned.emails.send({
        from: "SejongClass <welcome@sejongclass.kr>",
        to: email,
        subject: `🚀 ${username}님 가입 감사합니다.`,
        react: <WelcomeUser username={username}/>
    })
    return Response.json({ data, error })
}