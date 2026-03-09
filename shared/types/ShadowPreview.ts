export interface ShadowAction {
  readonly description: string;
  readonly descriptionHindi: string;
}

export interface ShadowPreview {
  readonly previewId: string;
  readonly citizenId: string;
  readonly actions: ShadowAction[];
  readonly status: "pending" | "approved" | "cancelled";
  readonly timestamp: string;
  readonly expiresAt: string;
}
