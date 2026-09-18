import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { tmpdir } from "node:os";
import path from "node:path";

/** Production session cookies require HTTPS, including in WebKit. */
export function startTestHttps() {
  const directory = mkdtempSync(path.join(tmpdir(), "clubmemo-e2e-"));
  const key = path.join(directory, "key.pem");
  const cert = path.join(directory, "cert.pem");
  const generated = spawnSync(
    "openssl",
    [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-keyout",
      key,
      "-out",
      cert,
      "-days",
      "1",
      "-subj",
      "/CN=localhost",
    ],
    { stdio: "ignore" },
  );
  if (generated.status !== 0) {
    rmSync(directory, { recursive: true, force: true });
    throw new Error("OpenSSL is required for local HTTPS browser tests");
  }
  const proxy = https.createServer(
    { key: readFileSync(key), cert: readFileSync(cert) },
    (request, response) => {
      const upstream = http.request(
        {
          hostname: "127.0.0.1",
          port: 3000,
          path: request.url,
          method: request.method,
          headers: request.headers,
        },
        (incoming) => {
          response.writeHead(incoming.statusCode ?? 502, incoming.headers);
          incoming.pipe(response);
        },
      );
      upstream.on("error", () => {
        response.writeHead(502);
        response.end();
      });
      request.on("aborted", () => upstream.destroy());
      request.pipe(upstream);
    },
  );
  proxy.listen(3443, "127.0.0.1");
  return () => {
    proxy.closeAllConnections();
    proxy.close();
    rmSync(directory, { recursive: true, force: true });
  };
}
