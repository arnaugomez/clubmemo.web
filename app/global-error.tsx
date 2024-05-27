"use client";

import { clientLocator } from "@/src/common/di/client-locator";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: unknown }) {
  useEffect(() => {
    clientLocator.ErrorTrackingService().captureError(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* @ts-expect-error next error component is not considered a react component for some reason */}
        <Error />
      </body>
    </html>
  );
}
