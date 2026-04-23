import { Module } from "@nestjs/common";

import { transactionPort } from "@shared/domain/port/transaction.port";
import { ObservabilityModule } from "@shared/infrastructure/observability/observability.module";
import { TransactionManager } from "@shared/infrastructure/persistence/database/postgres/typeorm/transaction/transaction.service";

@Module({
    imports: [
        ObservabilityModule,
    ],
    providers: [
        TransactionManager,
        { provide: transactionPort, useExisting: TransactionManager },
    ],
    exports: [
        transactionPort,
    ],
})
export class SharedPersistenceModule {}
