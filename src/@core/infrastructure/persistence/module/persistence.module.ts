import { Module } from "@nestjs/common";
import { TransactionManager } from "@app/@core/infrastructure/persistence/database/postgres/typeorm/transaction/transaction.service";
import { transactionPort } from "@domain/@shared/port/transaction.port";

@Module({
    imports: [
        // Aqui entra a configuração do TypeORM (TypeOrmModule.forRoot)
    ],
    providers: [
        TransactionManager,
        {
            provide: transactionPort,
            useExisting: TransactionManager
        },
    ],
    exports: [ transactionPort ]
})
export class PersistenceModule {}