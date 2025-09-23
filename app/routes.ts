import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
    index("common/pages/home-page.tsx"),
    route("/themes", "feature/themes/pages/themes-page.tsx"),


    route("/logout", "feature/auth/pages/logout-page.tsx"),
    route("/callback", "feature/auth/pages/callback-page.tsx"),

    route("/privacy-policy", "common/pages/privacy-policy.tsx"),
    route("/terms-of-service", "common/pages/terms-of-service.tsx"),


    ...prefix("/api",[
        ...prefix("/curriculums",[
            route("/toggle-curriculum", "api/curriculums/toggle-curriculum.tsx"),
        ]),
        ...prefix("/units",[
            route("/toggle-unit", "api/units/toggle-unit.tsx"),
            route("/update-readme", "api/units/update-readme.tsx"),
        ]),
        ...prefix("/enrollments",[
            route("/enroll", "api/enrollments/enroll.tsx"),
            route("/enroll-free", "api/enrollments/enroll-free.tsx"),
            // route("/unenroll", "api/enrollments/unenroll.tsx"),
            route("/update-progress", "api/enrollments/update-progress.tsx"),
        ]),
        ...prefix("/cron", [
            route("/calculate-textbook", "api/cron/calculate-textbook.tsx")
        ]),
        ...prefix("/email",[
            route("/welcome", "api/email/welcome.tsx"),
        ])
    ]),

    // - 임시 -
    route("/curriculums", "feature/curriculums/pages/curriculums-page.tsx"),
    route("/monaco-demo", "common/components/pages/monaco-demo.tsx"),
    route("/numpy-demo", "common/components/pages/numpy-demo.tsx"),

    route("/allcontents", "lib/all-contents.tsx"),

    route("/404", "common/pages/incorrect-path.tsx"),

    route("/theme/:theme-slug", "feature/subjects/pages/subjects-page.tsx"),
    route("/test/", "test.tsx"),
    route("/:theme-slug/:subject-slug/:textbook-id", "feature/textbooks/layout/textbook-layout.tsx", [
        index("feature/textbooks/pages/textbook-page.tsx"),
        ...prefix(":unit-id", [index("feature/units/pages/unit-page.tsx")])
    ]),


    route("*", "common/pages/not-found.tsx")
] satisfies RouteConfig;
