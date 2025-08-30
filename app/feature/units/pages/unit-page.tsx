import { redirect, useOutletContext } from "react-router";
import type { OutletContextType } from "~/feature/textbooks/pages/textbook-page";
import type { Route } from "./+types/unit-page";
import { getUnitAndConceptsByUnitId } from "../queries";
import { z } from "zod";

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
    const { textbookInfo } = useOutletContext<OutletContextType>();
    const { unitData } = loaderData;

    return (
        <div>
            <h1>{unitData.title}</h1>
            <h3>{unitData.readme_content}</h3>
        </div>
    );
}