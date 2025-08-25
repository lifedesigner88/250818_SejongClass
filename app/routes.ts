import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("common/pages/home-page.tsx"),
    route("/monaco-demo", "common/components/pages/monaco-demo.tsx"),
    route("/numpy-demo", "common/components/pages/numpy-demo.tsx"),
    route("/test-page", "common/components/pages/test-page.tsx"),
    route("/overview", "feature/themes/page/over-view.tsx"),


    route("*", "common/pages/not-found.tsx")
] satisfies RouteConfig;
