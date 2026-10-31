export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface BusinessSettings {
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  whatsappNumber?: string;
  address?: string;
  responseMessage?: string;
  businessHours?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  swiftCode?: string;
  paymentInstructions?: string;
}
