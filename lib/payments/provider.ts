export type CheckoutInput = {
  designId: string;
  userId: string;
  amountPaise: number;
  currency: string;
  successPath: string;
  cancelPath: string;
};

export type CheckoutResult = {
  checkoutUrl: string;
  provider: string;
  providerRef?: string;
};

export interface PaymentProvider {
  id: string;
  name: string;
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
}

export class PlaceholderPaymentProvider implements PaymentProvider {
  id = "placeholder";
  name = "Coming soon";
  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    return {
      checkoutUrl: `/unlock/${input.designId}?provider=placeholder`,
      provider: this.id,
      providerRef: `placeholder:${input.designId}`,
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  // When a real gateway is added, switch on process.env.PAYMENT_PROVIDER.
  return new PlaceholderPaymentProvider();
}
