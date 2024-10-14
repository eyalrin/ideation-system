import { Test, TestingModule } from '@nestjs/testing';
import { IdeasRepository } from "./ideas.repository";

describe('IdeasRepositort', () => {
    let repository: IdeasRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [IdeasRepository],
        }).compile();

        repository = module.get<IdeasRepository>(IdeasRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });
});
