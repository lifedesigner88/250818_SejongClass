import type { Route } from "./+types/enroll";
import { getUserIdForSever } from "~/feature/auth/useAuthUtil";
import { z } from "zod";
import type { TossPaymentResponse } from "~/api/enrollments/TossReturnType";


const paramsSchema = z.object({
    paymentType: z.string(),
    orderId: z.uuid(),
    paymentKey: z.string(),
    amount: z.coerce.number(),
})

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;

export const action = async ({ request }: Route.ActionArgs) => {






    // 결제가 되었을 때
    const url = new URL(request.url);
    const { success, data } = paramsSchema.safeParse(Object.fromEntries(url.searchParams));
    if (!success) return new Response(null, { status: 400 })

    const encryptedSecretKey = `Basic ${Buffer.from(TOSS_SECRET_KEY + ":").toString("base64")}`;

    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
        method: "POST",
        headers: {
            "Authorization": encryptedSecretKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderId: data.orderId,
            paymentKey: data.paymentKey,
            amount: data.amount,
        })
    })

    const responseData: TossPaymentResponse = await response.json();


    const userId = getUserIdForSever(request)

    // 무료 일때

    console.log("enroll🎉")

    return responseData

};