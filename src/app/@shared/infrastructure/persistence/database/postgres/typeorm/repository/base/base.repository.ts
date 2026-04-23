import { ClsService } from 'nestjs-cls';
import { ObjectLiteral, QueryRunner, Repository } from 'typeorm';
import { txKey } from "@shared/domain/port/transaction.port";

export abstract class BaseRepository<T extends ObjectLiteral> {
    protected constructor(
        protected readonly repo: Repository<T>,
        protected readonly cls: ClsService,
    ) {}

    protected get repository(): Repository<T> {
        const tx = this.cls.get<QueryRunner>(txKey);

        if (tx)
            return tx.manager.getRepository<T>(this.repo.target);

        return this.repo;
    }
}