import i18next from "i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import esCustom from "./es/custom.json";
import esZod from "./es/zod.json";

i18next.init({
  lng: "es",
  resources: {
    es: { zod: esZod, custom: esCustom },
  },
});

z.setErrorMap(makeZodI18nMap({ ns: ["zod", "custom"] }));

export { z };
