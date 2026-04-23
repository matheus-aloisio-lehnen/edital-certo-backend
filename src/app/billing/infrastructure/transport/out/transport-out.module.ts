import { Module } from "@nestjs/common";

import { BillingGatewayService } from "@billing/application/gateway/service/billing-gateway.service";
import { billingGatewayClientPort, billingGatewayServicePort } from "@billing/application/gateway/port/billing-gateway.port";
import { StripeBillingGatewayClient } from "@billing/infrastructure/transport/out/gateway/stripe/billing/billing-gateway.client";

@Module({
    providers: [
        StripeBillingGatewayClient,
        BillingGatewayService,
        { provide: billingGatewayClientPort, useExisting: StripeBillingGatewayClient },
        {
            provide: billingGatewayServicePort,
            useFactory: (gatewayClient: StripeBillingGatewayClient) => new BillingGatewayService(gatewayClient),
            inject: [StripeBillingGatewayClient],
        },
    ],
    exports: [
        billingGatewayClientPort,
        billingGatewayServicePort,
    ],
})
export class BillingTransportOutModule {}
