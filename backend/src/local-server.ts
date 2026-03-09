import http from "http";
import { handler } from "./handlers/eligibilityApi";
import {
  getAllAuditEvents,
  recordAuditEvent,
  putApplication,
  getApplications,
} from "./clients/dynamoClient";
import { transcribeAudio } from "./clients/transcribeClient";
import { generateFormFill, queryKnowledgeBase } from "./clients/bedrockClient";

const PORT = parseInt(process.env.PORT || "3001", 10);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Content-Type": "application/json",
};

const MAX_BODY = 1024 * 1024; // 1 MB limit
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY) {
        req.destroy();
        reject(new Error("Body too large"));
      }
    });
    req.on("end", () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200, CORS);
    res.end();
    return;
  }

  const url = req.url?.split("?")[0] || "";

  // ─── POST /api/eligibility ────────────────────
  if (req.method === "POST" && url === "/api/eligibility") {
    const body = await readBody(req);
    try {
      const result = await handler({ httpMethod: "POST", body });
      res.writeHead(result.statusCode, result.headers);
      res.end(result.body);
    } catch {
      res.writeHead(500, CORS);
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
    return;
  }

  // ─── GET /api/audit ───────────────────────────
  if (req.method === "GET" && url === "/api/audit") {
    const events = await getAllAuditEvents();
    res.writeHead(200, CORS);
    res.end(JSON.stringify({ events, count: events.length }));
    return;
  }

  // ─── POST /api/applications ───────────────────
  if (req.method === "POST" && url === "/api/applications") {
    const body = await readBody(req);
    try {
      const data = JSON.parse(body);
      const appId = `app_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const application = {
        applicationId: appId,
        citizenId: data.citizenId,
        schemeId: data.schemeId,
        schemeName: data.schemeName,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        timeline: [
          {
            status: "submitted",
            timestamp: new Date().toISOString(),
            note: "Application submitted via HaqDaari",
          },
        ],
      };
      await putApplication(appId, application);

      await recordAuditEvent({
        eventId: `audit_${Date.now()}`,
        citizenId: data.citizenId,
        action: "application_submitted",
        timestamp: new Date().toISOString(),
        details: { applicationId: appId, schemeId: data.schemeId },
        source: "applications",
      });

      res.writeHead(201, CORS);
      res.end(JSON.stringify(application));
    } catch {
      res.writeHead(400, CORS);
      res.end(JSON.stringify({ error: "Invalid request body" }));
    }
    return;
  }

  // ─── GET /api/applications ────────────────────
  if (req.method === "GET" && url.startsWith("/api/applications")) {
    const citizenId = new URL(`http://localhost${req.url}`).searchParams.get(
      "citizenId",
    );
    const list = await getApplications(citizenId || undefined);
    res.writeHead(200, CORS);
    res.end(JSON.stringify({ applications: list, count: list.length }));
    return;
  }

  // ─── POST /api/transcribe ────────────────────
  if (req.method === "POST" && url === "/api/transcribe") {
    const body = await readBody(req);
    try {
      const { audioContext } = JSON.parse(body);
      const result = await transcribeAudio(audioContext || "default");
      res.writeHead(200, CORS);
      res.end(JSON.stringify(result));
    } catch {
      res.writeHead(400, CORS);
      res.end(JSON.stringify({ error: "Transcription failed" }));
    }
    return;
  }

  // ─── POST /api/form-fill ─────────────────────
  if (req.method === "POST" && url === "/api/form-fill") {
    const body = await readBody(req);
    try {
      const { citizenName, schemeId } = JSON.parse(body);
      const result = await generateFormFill(citizenName, schemeId);
      res.writeHead(200, CORS);
      res.end(JSON.stringify(result));
    } catch {
      res.writeHead(400, CORS);
      res.end(JSON.stringify({ error: "Form fill failed" }));
    }
    return;
  }

  // ─── POST /api/knowledge-base ────────────────
  if (req.method === "POST" && url === "/api/knowledge-base") {
    const body = await readBody(req);
    try {
      const { query } = JSON.parse(body);
      const result = await queryKnowledgeBase(query);
      res.writeHead(200, CORS);
      res.end(JSON.stringify(result));
    } catch {
      res.writeHead(400, CORS);
      res.end(JSON.stringify({ error: "Knowledge base query failed" }));
    }
    return;
  }

  // ─── 404 ──────────────────────────────────────
  res.writeHead(404, CORS);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(
    `[HaqDaari Backend] Local dev server running on http://localhost:${PORT}`,
  );
  console.log(`[HaqDaari Backend] Endpoints:`);
  console.log(`  POST /api/eligibility      — Zero-Touch Eligibility Engine`);
  console.log(`  POST /api/applications      — Submit application`);
  console.log(`  GET  /api/applications      — List applications`);
  console.log(`  POST /api/transcribe        — Amazon Transcribe (Hindi STT)`);
  console.log(`  POST /api/form-fill         — Bedrock Auto Form Filler`);
  console.log(`  POST /api/knowledge-base    — Bedrock Knowledge Base (RAG)`);
  console.log(`  GET  /api/audit             — Audit trail`);
});
