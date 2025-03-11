import type { AppOpenApi } from "./types";
import packageJson from "../../package.json";

export default function configureOpenApi(app: AppOpenApi) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJson.version,
      title: "Todos API",
    },
  });
}
