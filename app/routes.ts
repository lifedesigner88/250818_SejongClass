import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
    index("common/pages/home-page.tsx"),
    route("/themes", "feature/themes/pages/themes-page.tsx"),

    route("/:theme-slug", "feature/subjects/pages/subjects-page.tsx"),
    route("/:theme-slug/:subject-slug/:textbook-id", "feature/textbooks/layout/textbook-layout.tsx", [
        index("feature/textbooks/pages/textbook-page.tsx"),
        ...prefix(":unit-id", [index("feature/units/pages/unit-page.tsx")])
    ]),


    route("/login", "feature/auth/pages/login-page.tsx"),
    route("/logout", "feature/auth/pages/logout-page.tsx"),
    route("/logintest", "feature/auth/pages/login-test-page.tsx"),
    route("/callback", "feature/auth/pages/callback-page.tsx"),


    // - 임시 -
    route("/curriculums", "feature/curriculums/pages/curriculums-page.tsx"),
    route("/monaco-demo", "common/components/pages/monaco-demo.tsx"),
    route("/numpy-demo", "common/components/pages/numpy-demo.tsx"),

    route("/hover-demo", "lib/hover-demo.tsx"),
    route("/allcontents", "lib/all-contents.tsx"),

    route("/404", "common/pages/incorrect-path.tsx"),
    route("*", "common/pages/not-found.tsx")
] satisfies RouteConfig;
