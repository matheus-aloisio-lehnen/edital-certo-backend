import { QueryRunner, ObjectLiteral } from 'typeorm';
import { createBaseRepositoryMock, createClsServiceMock, createManagedQueryRunnerMock, createRepositoryMock } from "@mock/tests.mock";
import { txKey } from "@shared/domain/port/transaction.port";

type Entity = ObjectLiteral;

describe('BaseRepository', () => {
    it('getRepository should return default repository when transaction does not exist', () => {
        const repo = createRepositoryMock<Entity>();
        const cls = createClsServiceMock();

        const sut = createBaseRepositoryMock(repo, cls);

        const result = sut.getRepository();

        expect(cls.get).toHaveBeenCalledWith(txKey);
        expect(result).toBe(repo);
    });

    it('getRepository should return transaction repository when transaction exists', () => {
        const repo = createRepositoryMock<Entity>({ target: 'EntityMock' });
        const txRepo = createRepositoryMock<Entity>();
        const tx = createManagedQueryRunnerMock(txRepo) as QueryRunner;
        const cls = createClsServiceMock(tx);

        const sut = createBaseRepositoryMock(repo, cls);

        const result = sut.getRepository();

        expect(cls.get).toHaveBeenCalledWith(txKey);
        expect(tx.manager.getRepository).toHaveBeenCalledWith(repo.target);
        expect(result).toBe(txRepo);
    });
});