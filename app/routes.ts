import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("common/pages/home-page.tsx"),
    route("/themes", "feature/themes/pages/themes-page.tsx"),
    route("/theme/:theme-slug", "feature/subjects/pages/subjects-page.tsx"),
    route("/theme/:theme-slug/:subject-slug/:textbook-id", "feature/textbooks/pages/textbook-page.tsx"),


    route("/curriculums", "feature/curriculums/pages/curriculums-page.tsx"),
    route("/monaco-demo", "common/components/pages/monaco-demo.tsx"),
    route("/numpy-demo", "common/components/pages/numpy-demo.tsx"),

    route("/hover-demo", "lib/hover-demo.tsx"),
    route("/allcontents", "lib/all-contents.tsx"),

    route("*", "common/pages/not-found.tsx")
] satisfies RouteConfig;
