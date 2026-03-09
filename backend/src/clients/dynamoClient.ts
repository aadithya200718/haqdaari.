// DynamoDB audit trail — real DynamoDB when DYNAMO_TABLE is set, else in-memory
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const AUDIT_TABLE = process.env.DYNAMO_AUDIT_TABLE || "";
const APP_TABLE = process.env.DYNAMO_APP_TABLE || "";
const REGION = process.env.AWS_REGION || "ap-south-1";

let docClient: DynamoDBDocumentClient | null = null;
if (AUDIT_TABLE || APP_TABLE) {
  const client = new DynamoDBClient({ region: REGION });
  docClient = DynamoDBDocumentClient.from(client);
}

export interface AuditEvent {
  eventId: string;
  citizenId: string;
  action: string;
  timestamp: string;
  details: Record<string, any>;
  source:
    | "eligibility"
    | "arbitrage"
    | "shadow_mode"
    | "form_fill"
    | "consent"
    | "applications"
    | "transcribe";
}

// In-memory fallback
const localAuditLog: AuditEvent[] = [];
const localApps: Record<string, any> = {};

export async function recordAuditEvent(event: AuditEvent): Promise<void> {
  if (docClient && AUDIT_TABLE) {
    await docClient.send(
      new PutCommand({
        TableName: AUDIT_TABLE,
        Item: event,
      }),
    );
  } else {
    localAuditLog.push(event);
  }
}

export async function getAuditTrail(citizenId: string): Promise<AuditEvent[]> {
  if (docClient && AUDIT_TABLE) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: AUDIT_TABLE,
        KeyConditionExpression: "citizenId = :cid",
        ExpressionAttributeValues: { ":cid": citizenId },
      }),
    );
    return (result.Items || []) as AuditEvent[];
  }
  return localAuditLog.filter((e) => e.citizenId === citizenId);
}

export async function getAllAuditEvents(): Promise<AuditEvent[]> {
  if (docClient && AUDIT_TABLE) {
    const result = await docClient.send(
      new ScanCommand({ TableName: AUDIT_TABLE }),
    );
    return (result.Items || []) as AuditEvent[];
  }
  return [...localAuditLog];
}

// Application storage
export async function putApplication(appId: string, app: any): Promise<void> {
  if (docClient && APP_TABLE) {
    await docClient.send(
      new PutCommand({
        TableName: APP_TABLE,
        Item: { applicationId: appId, ...app },
      }),
    );
  } else {
    localApps[appId] = app;
  }
}

export async function getApplications(citizenId?: string): Promise<any[]> {
  if (docClient && APP_TABLE) {
    if (citizenId) {
      const result = await docClient.send(
        new QueryCommand({
          TableName: APP_TABLE,
          IndexName: "citizenId-index",
          KeyConditionExpression: "citizenId = :cid",
          ExpressionAttributeValues: { ":cid": citizenId },
        }),
      );
      return (result.Items || []) as any[];
    }
    const result = await docClient.send(
      new ScanCommand({ TableName: APP_TABLE }),
    );
    return (result.Items || []) as any[];
  }
  return Object.values(localApps).filter(
    (a: any) => !citizenId || a.citizenId === citizenId,
  );
}
