import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    ValidationPipe
} from '@nestjs/common';
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
    getIdeaById(@Param('id', ParseIntPipe) id: number) {
        try {
            const idea = this.ideasService.getIdeaById(id);

            return {
                message: `Found an idea with id ${id}`,
                idea: idea
            }
        }
        catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Post()
    createIdea(@Body(new ValidationPipe()) createIdeaDto: CreateIdeaDto) {
        const createdIdea = this.ideasService.createIdea(createIdeaDto);

        return {
            message: `Created an idea with id ${createdIdea.id}`,
            idea: createdIdea
        }
    }

    @Put(':id')
    updateIdeaById(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) updateIdeaDto: UpdateIdeaDto) {
        try {
            const updatedIdea = this.ideasService.updateIdeaById(id, updateIdeaDto);

            return {
                message: `Updated the idea with id ${id}`,
                idea: updatedIdea
            }
        } catch (error) {
            throw new NotFoundException(error.message);
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
    deleteIdeaById(@Param('id', ParseIntPipe) id: number) {
        try {
            this.ideasService.deleteIdeaById(id);

            return {
                message: `Deleted an idea with id ${id}`,
            }
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}
