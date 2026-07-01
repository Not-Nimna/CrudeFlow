import { createFileRoute } from "@tanstack/react-router";
import ScrollVideoSite from "@/components/ScrollVideoSite";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CrudeFlow — Regulatory-grade pipeline data platform" },
      {
        name: "description",
        content:
          "A medallion lakehouse simulating the Trans Mountain corridor: bronze/silver/gold layers, dbt on Databricks + DuckDB, three reporting personas — operations, financial, regulatory.",
      },
      { property: "og:title", content: "CrudeFlow — Pipeline data platform" },
      {
        property: "og:description",
        content:
          "Bronze. Silver. Gold. A regulatory-grade lakehouse for the Trans Mountain corridor.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ScrollVideoSite,
});
