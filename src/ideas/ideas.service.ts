import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIdeaDto } from "./dto/create-idea.dto";
import { UpdateIdeaDto } from "./dto/update-idea.dto";
import { IdeasRepository } from "./ideas.repository";
import { Idea } from "./schemas/idea.schema";

@Injectable()
export class IdeasService {

    constructor(private readonly ideasRepository: IdeasRepository) {}

    async getAll(): Promise<Idea[]> {
        return this.ideasRepository.findAll();
    }

    async getById(id: number): Promise<Idea> {
        return this.ideasRepository.findById(id);
    }

    async create(createIdeaDto: CreateIdeaDto): Promise<Idea> {
        return this.ideasRepository.save(createIdeaDto);
    }

    async updateById(id: number, updateIdeaDto: UpdateIdeaDto): Promise<Idea> {
        return this.ideasRepository.update(id, updateIdeaDto);
    }

    async deleteAll(): Promise<void> {
        return this.ideasRepository.deleteAll();
    }

    async deleteById(id: number): Promise<void> {
        return this.ideasRepository.deleteById(id);
    }
}
