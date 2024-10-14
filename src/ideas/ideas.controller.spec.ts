import { Test, TestingModule } from '@nestjs/testing';
import { IdeasController } from './ideas.controller';
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateIdeaDto } from "./dto/create-idea.dto";
import { UpdateIdeaDto } from "./dto/update-idea.dto";

class MockIdeasService {
    getAll = jest.fn().mockResolvedValue([
        { id: 1, title: 'Idea 1', description: 'Description 1' },
        { id: 2, title: 'Idea 2', description: 'Description 2' },
    ] as any as never);

    getById = jest.fn();
    create = jest.fn();
    updateById = jest.fn();
    deleteAll = jest.fn();
    deleteById = jest.fn();
}

describe('IdeasController Unit Tests', () => {

    describe('getIdeas() method', () => {
        let ideasController: IdeasController;
        let mockIdeasService: MockIdeasService;

        beforeEach(() => {
            mockIdeasService = new MockIdeasService();
            ideasController = new IdeasController(mockIdeasService as any);
        });

        describe('Happy Path', () => {
            it('should return a list of ideas with a success message', async () => {
                // Arrange
                const expectedResponse = {
                    message: 'Listing all ideas',
                    ideas: [
                        { id: 1, title: 'Idea 1', description: 'Description 1' },
                        { id: 2, title: 'Idea 2', description: 'Description 2' },
                    ],
                };

                // Act
                const result = await ideasController.getIdeas();

                // Assert
                expect(result).toEqual(expectedResponse);
                expect(mockIdeasService.getAll).toHaveBeenCalledTimes(1);
            });
        });

        describe('Edge Cases', () => {
            it('should handle the case when no ideas are available', async () => {
                // Arrange
                mockIdeasService.getAll.mockResolvedValueOnce([] as any as never);

                const expectedResponse = {
                    message: 'Listing all ideas',
                    ideas: [],
                };

                // Act
                const result = await ideasController.getIdeas();

                // Assert
                expect(result).toEqual(expectedResponse);
                expect(mockIdeasService.getAll).toHaveBeenCalledTimes(1);
            });

            it('should handle the case when the service throws an error', async () => {
                // Arrange
                const errorMessage = 'Service error';
                mockIdeasService.getAll.mockRejectedValueOnce(
                    new Error(errorMessage) as never,
                );

                // Act & Assert
                await expect(ideasController.getIdeas()).rejects.toThrow(
                    NotFoundException,
                );
                expect(mockIdeasService.getAll).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('getIdeaById() method', () => {
        let ideasController: IdeasController;
        let mockIdeasService: MockIdeasService;

        beforeEach(() => {
            mockIdeasService = new MockIdeasService() as any;
            ideasController = new IdeasController(mockIdeasService as any);
        });

        describe('Happy Path', () => {
            it('should return an idea when a valid ID is provided', async () => {
                // Arrange
                const ideaId = 1;
                const mockIdea = {
                    id: ideaId,
                    title: 'Test Idea',
                    description: 'Test Description',
                };
                mockIdeasService.getById.mockResolvedValue(mockIdea as any as never);

                // Act
                const result = await ideasController.getIdeaById(ideaId);

                // Assert
                expect(result).toEqual({
                    message: `Found an idea with id ${ideaId}`,
                    idea: mockIdea,
                });
                expect(mockIdeasService.getById).toHaveBeenCalledWith(ideaId);
            });
        });

        describe('Edge Cases', () => {
            it('should throw NotFoundException when the idea is not found', async () => {
                // Arrange
                const ideaId = 999;
                mockIdeasService.getById.mockRejectedValue(
                    new Error('Idea not found') as never,
                );

                // Act & Assert
                await expect(ideasController.getIdeaById(ideaId)).rejects.toThrow(
                    NotFoundException,
                );
                expect(mockIdeasService.getById).toHaveBeenCalledWith(ideaId);
            });

            it('should handle invalid ID format gracefully', async () => {
                // Arrange
                const invalidId = 'invalid' as any;
                mockIdeasService.getById.mockRejectedValue(
                    new Error('Idea not found') as never,
                );

                // Act & Assert
                await expect(ideasController.getIdeaById(invalidId)).rejects.toThrow();
            });
        });
    });

    describe('createIdea() method', () => {
        let ideasController: IdeasController;
        let mockIdeasService: MockIdeasService;

        beforeEach(() => {
            mockIdeasService = new MockIdeasService();
            ideasController = new IdeasController(mockIdeasService as any);
        });

        describe('Happy Path', () => {
            it('should create an idea successfully', async () => {
                // Arrange
                const createIdeaDto: CreateIdeaDto = {
                    title: 'New Idea',
                    description: 'This is a new idea',
                };
                const createdIdea = { id: 1, ...createIdeaDto };
                mockIdeasService.create.mockResolvedValue(createdIdea as any as never);

                // Act
                const result = await ideasController.createIdea(createIdeaDto);

                // Assert
                expect(result).toEqual({
                    message: `Created an idea with id ${createdIdea.id}`,
                    idea: createdIdea,
                });
                expect(mockIdeasService.create).toHaveBeenCalledWith(createIdeaDto);
            });
        });

        describe('Edge Cases', () => {
            it('should handle validation errors', async () => {
                // Arrange
                const createIdeaDto: CreateIdeaDto = {
                    title: 'No',
                    description: 'Short',
                };

                // Act & Assert
                await expect(ideasController.createIdea(createIdeaDto)).rejects.toThrow();
            });

            it('should handle service errors gracefully', async () => {
                // Arrange
                const createIdeaDto: CreateIdeaDto = {
                    title: 'Valid Title',
                    description: 'Valid Description',
                };
                mockIdeasService.create.mockRejectedValue(
                    new Error('Service Error') as never,
                );

                // Act & Assert
                await expect(ideasController.createIdea(createIdeaDto)).rejects.toThrow(
                    'Service Error',
                );
            });
        });
    });

    describe('updateIdeaById() method', () => {
        let ideasController: IdeasController;
        let mockIdeasService: MockIdeasService;

        beforeEach(() => {
            mockIdeasService = new MockIdeasService();
            ideasController = new IdeasController(mockIdeasService as any);
        });

        describe('Happy Path', () => {
            it('should update an idea successfully', async () => {
                // Arrange
                const id = 1;
                const updateIdeaDto: UpdateIdeaDto = {
                    title: 'Updated Title',
                    description: 'Updated Description',
                };
                const updatedIdea = { id, ...updateIdeaDto };
                mockIdeasService.updateById.mockResolvedValue(
                    updatedIdea as any as never,
                );

                // Act
                const result = await ideasController.updateIdeaById(id, updateIdeaDto);

                // Assert
                expect(result).toEqual({
                    message: `Updated the idea with id ${id}`,
                    idea: updatedIdea,
                });
                expect(mockIdeasService.updateById).toHaveBeenCalledWith(
                    id,
                    updateIdeaDto,
                );
            });
        });

        describe('Edge Cases', () => {
            it('should throw NotFoundException if the idea does not exist', async () => {
                // Arrange
                const id = 999;
                const updateIdeaDto: UpdateIdeaDto = {
                    title: 'Non-existent Title',
                    description: 'Non-existent Description',
                };
                mockIdeasService.updateById.mockRejectedValue(
                    new Error('Idea not found') as never,
                );

                // Act & Assert
                await expect(
                    ideasController.updateIdeaById(id, updateIdeaDto),
                ).rejects.toThrow(NotFoundException);
                expect(mockIdeasService.updateById).toHaveBeenCalledWith(
                    id,
                    updateIdeaDto,
                );
            });

            it('should handle partial updates', async () => {
                // Arrange
                const id = 2;
                const updateIdeaDto: UpdateIdeaDto = { title: 'Partial Update' }; // Only title is updated
                const updatedIdea = {
                    id,
                    title: 'Partial Update',
                    description: 'Existing Description',
                };
                mockIdeasService.updateById.mockResolvedValue(
                    updatedIdea as any as never,
                );

                // Act
                const result = await ideasController.updateIdeaById(id, updateIdeaDto);

                // Assert
                expect(result).toEqual({
                    message: `Updated the idea with id ${id}`,
                    idea: updatedIdea,
                });
                expect(mockIdeasService.updateById).toHaveBeenCalledWith(
                    id,
                    updateIdeaDto,
                );
            });

            it('should handle empty update data gracefully', async () => {
                // Arrange
                const id = 3;
                const updateIdeaDto: UpdateIdeaDto = {}; // No fields to update
                const updatedIdea = {
                    id,
                    title: 'Existing Title',
                    description: 'Existing Description',
                };
                mockIdeasService.updateById.mockResolvedValue(
                    updatedIdea as any as never,
                );

                // Act
                const result = await ideasController.updateIdeaById(id, updateIdeaDto);

                // Assert
                expect(result).toEqual({
                    message: `Updated the idea with id ${id}`,
                    idea: updatedIdea,
                });
                expect(mockIdeasService.updateById).toHaveBeenCalledWith(
                    id,
                    updateIdeaDto,
                );
            });
        });
    });

    describe('deleteIdeas() method', () => {
        let ideasController: IdeasController;
        let mockIdeasService: MockIdeasService;

        beforeEach(() => {
            mockIdeasService = new MockIdeasService();
            ideasController = new IdeasController(mockIdeasService as any);
        });

        describe('Happy Path', () => {
            it('should delete all ideas and return a success message', async () => {
                // Arrange
                mockIdeasService.deleteAll.mockResolvedValue(undefined as any as never);

                // Act
                const result = await ideasController.deleteIdeas();

                // Assert
                expect(mockIdeasService.deleteAll).toHaveBeenCalled();
                expect(result).toEqual({
                    message: 'Deleted all ideas',
                });
            });
        });

        describe('Edge Cases', () => {
            it('should handle errors thrown by the service gracefully', async () => {
                // Arrange
                const errorMessage = 'Error deleting ideas';
                mockIdeasService.deleteAll.mockRejectedValue(
                    new Error(errorMessage) as never,
                );

                // Act & Assert
                await expect(ideasController.deleteIdeas()).rejects.toThrow(
                    InternalServerErrorException,
                );
                expect(mockIdeasService.deleteAll).toHaveBeenCalled();
            });
        });
    });

    describe('deleteIdeaById() method', () => {
        let ideasController: IdeasController;
        let mockIdeasService: MockIdeasService;

        beforeEach(() => {
            mockIdeasService = new MockIdeasService() as any;
            ideasController = new IdeasController(mockIdeasService as any);
        });

        describe('Happy Path', () => {
            it('should delete an idea by id successfully', async () => {
                // Arrange
                const ideaId = 1;
                mockIdeasService.deleteById.mockResolvedValue(undefined as any as never);

                // Act
                const result = await ideasController.deleteIdeaById(ideaId);

                // Assert
                expect(mockIdeasService.deleteById).toHaveBeenCalledWith(ideaId);
                expect(result).toEqual({
                    message: `Deleted an idea with id ${ideaId}`,
                });
            });
        });

        describe('Edge Cases', () => {
            it('should throw NotFoundException if idea does not exist', async () => {
                // Arrange
                const ideaId = 999;
                mockIdeasService.deleteById.mockRejectedValue(
                    new Error('Idea not found') as never,
                );

                // Act & Assert
                await expect(ideasController.deleteIdeaById(ideaId)).rejects.toThrow(
                    NotFoundException,
                );
                expect(mockIdeasService.deleteById).toHaveBeenCalledWith(ideaId);
            });
        });
    });
});
