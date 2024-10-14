import {
    Body,
    Controller,
    Delete,
    Get, InternalServerErrorException,
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
    async getIdeas() {
        try {
            const ideas = await this.ideasService.getAll();

            return {
                message: `Listing all ideas`,
                ideas: ideas
            }
        }
        catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Get(':id')
    async getIdeaById(@Param('id', ParseIntPipe) id: number) {
        try {
            const idea = await this.ideasService.getById(id);

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
    async createIdea(@Body(new ValidationPipe()) createIdeaDto: CreateIdeaDto) {
        const createdIdea = await this.ideasService.create(createIdeaDto);

        return {
            message: `Created an idea with id ${createdIdea.id}`,
            idea: createdIdea
        }
    }

    @Put(':id')
    async updateIdeaById(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) updateIdeaDto: UpdateIdeaDto) {
        try {
            const updatedIdea = await this.ideasService.updateById(id, updateIdeaDto);

            return {
                message: `Updated the idea with id ${id}`,
                idea: updatedIdea
            }
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Delete()
    async deleteIdeas() {
        try {
            await this.ideasService.deleteAll();

            return {
                message: `Deleted all ideas`,
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Delete(':id')
    async deleteIdeaById(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.ideasService.deleteById(id);

            return {
                message: `Deleted an idea with id ${id}`,
            }
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}
