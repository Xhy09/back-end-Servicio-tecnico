export const QuotationStatus = {
  PENDING: 'pending',
  SENT: 'sent',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type QuotationStatus = typeof QuotationStatus[keyof typeof QuotationStatus];