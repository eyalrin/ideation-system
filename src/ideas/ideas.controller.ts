import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateIdeaDto } from "./dto/create-idea.dto";
import { UpdateIdeaDto } from "./dto/update-idea.dto";
import { IdeasService } from "./ideas.service";

@Controller('ideas')
export class IdeasController {

    constructor(private readonly ideasService: IdeasService) {}

    @Get()
    getIdeas() {
        const ideas = this.ideasService.getIdeas();

        return {
            message: `Listing all ideas`,
            ideas: ideas
        }
    }

    @Get(':id')
    getIdeaById(@Param('id') id: string) {
        const idea = this.ideasService.getIdeaById(id);

        return {
            message: `Found an idea with id ${id}`,
            idea: idea
        }
    }

    @Post()
    createIdea(@Body() createIdeaDto: CreateIdeaDto) {
        const createdIdea = this.ideasService.createIdea(createIdeaDto);

        return {
            message: `Created an idea with id ${createdIdea.id}`,
            idea: createdIdea
        }
    }

    @Put(':id')
    updateIdeaById(@Param('id') id: string, @Body() updateIdeaDto: UpdateIdeaDto) {
        const updatedIdea = this.ideasService.updateIdeaById(id, updateIdeaDto);

        return {
            message: `Updated the idea with id ${id}`,
            idea: updatedIdea
        }
    }

    @Delete()
    deleteIdeas() {
        this.ideasService.deleteIdeas();

        return {
            message: `Deleted all ideas`,
        }
    }

    @Delete(':id')
    deleteIdeaById(@Param('id') id: string) {
        this.ideasService.deleteIdeaById(id);

        return {
            message: `Deleted an idea with id ${id}`,
        }
    }
}
