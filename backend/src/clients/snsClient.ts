// Mock SNS client - swap with @aws-sdk/client-sns when ready

export interface SmsNotification {
  messageId: string;
  phoneNumber: string;
  message: string;
  status: "SENT" | "QUEUED" | "FAILED";
  timestamp: string;
}

let messageCounter = 0;

export async function sendSmsNotification(
  phoneNumber: string,
  message: string,
): Promise<SmsNotification> {
  messageCounter++;
  return {
    messageId: `sns_msg_${Date.now()}_${messageCounter}`,
    phoneNumber,
    message,
    status: "SENT",
    timestamp: new Date().toISOString(),
  };
}

export async function notifyEligibilityResult(
  phoneNumber: string,
  citizenName: string,
  schemeCount: number,
  totalBenefit: number,
): Promise<SmsNotification> {
  const message = `HaqDaari: Namaste ${citizenName}! Aapke liye ${schemeCount} sarkari yojnaein mil gayi hain. Kul laabh: Rs ${totalBenefit.toLocaleString("en-IN")}/saal. App kholein: https://haqdaari.in`;
  return sendSmsNotification(phoneNumber, message);
}

export async function notifyApplicationStatus(
  phoneNumber: string,
  schemeName: string,
  status: string,
): Promise<SmsNotification> {
  const message = `HaqDaari: Aapka ${schemeName} aavedan ${status} ho gaya hai. Status dekhein: https://haqdaari.in/tracking`;
  return sendSmsNotification(phoneNumber, message);
}
