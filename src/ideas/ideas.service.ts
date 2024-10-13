import { Injectable, NotFoundException } from '@nestjs/common';
import { IdeaEntity } from "./entities/idea.entity";
import { CreateIdeaDto } from "./dto/create-idea.dto";
import { UpdateIdeaDto } from "./dto/update-idea.dto";

@Injectable()
export class IdeasService {
    private ideas: IdeaEntity[] = [
        { id: 1, title: 'title 1', description: 'description 1' },
        { id: 2, title: 'title 2', description: 'description 2' }
    ]

    getIdeas(): IdeaEntity[] {
        return this.ideas;
    }

    getIdeaById(id: number): IdeaEntity {
        const idea = this.ideas.find(idea => idea.id === id);

        if (!idea) {
            throw new Error(`Idea with id ${id} not found`);
        }

        return idea;
    }

    createIdea(createIdeaDto: CreateIdeaDto): IdeaEntity {
        const newIdea = { ...createIdeaDto, id: Date.now() };
        this.ideas.push(newIdea);

        return newIdea;
    }

    updateIdeaById(id: number, updateIdeaDto: UpdateIdeaDto): IdeaEntity {
        const idea = this.ideas.find(idea => idea.id === id);

        if (!idea) {
            throw new Error(`Idea with id ${id} not found`);
        }

        let updatedIdea: IdeaEntity = undefined;

        this.ideas = this.ideas.map((idea) => {
            if (idea.id === id) {
                updatedIdea =  {
                    ...idea,
                    ...updateIdeaDto
                };

                return updatedIdea;
            }
            return idea;
        });

        return updatedIdea;
    }

    deleteIdeas(): void {
        this.ideas = [];
    }

    deleteIdeaById(id: number): void {
        const idea = this.ideas.find(idea => idea.id === id);

        if (!idea) {
            throw new Error(`Idea with id ${id} not found`);
        }

        this.ideas = this.ideas.filter(idea => idea.id !== id);
    }
}
