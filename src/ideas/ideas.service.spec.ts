import { IdeasService } from "./ideas.service";
import { Idea } from "./schemas/idea.schema";
import { NotFoundException } from "@nestjs/common";
import { CreateIdeaDto } from "./dto/create-idea.dto";
import { UpdateIdeaDto } from "./dto/update-idea.dto";

class MockIdeasRepository {
    public findAll = jest.fn();
    public findById = jest.fn();
    public save = jest.fn();
    public update = jest.fn();
    public deleteAll = jest.fn();
    public deleteById = jest.fn();
}

describe('IdeasService Unit Tests', () => {

    let service: IdeasService;
    let mockIdeasRepository: MockIdeasRepository;

    beforeEach(() => {
        mockIdeasRepository = new MockIdeasRepository();
        service = new IdeasService(mockIdeasRepository as any);
    });

    describe('getAll() method', () => {

        describe('Happy Path', () => {
            it('should return an array of ideas when repository returns data', async () => {
                // Arrange
                const mockIdeas: Idea[] = [
                    {id: 1, title: 'Idea 1', description: 'Description 1'},
                    {id: 2, title: 'Idea 2', description: 'Description 2'},
                ] as any;
                mockIdeasRepository.findAll.mockResolvedValue(mockIdeas as any as never);

                // Act
                const result = await service.getAll();

                // Assert
                expect(result).toEqual(mockIdeas);
                expect(mockIdeasRepository.findAll).toHaveBeenCalledTimes(1);
            });
        });

        describe('Edge Cases', () => {
            it('should return an empty array when repository returns no data', async () => {
                // Arrange
                mockIdeasRepository.findAll.mockResolvedValue([] as any as never);

                // Act
                const result = await service.getAll();

                // Assert
                expect(result).toEqual([]);
                expect(mockIdeasRepository.findAll).toHaveBeenCalledTimes(1);
            });

            it('should handle errors thrown by the repository', async () => {
                // Arrange
                const error = new Error('Database error');
                mockIdeasRepository.findAll.mockRejectedValue(error as never);

                // Act & Assert
                await expect(service.getAll()).rejects.toThrow('Database error');
                expect(mockIdeasRepository.findAll).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('getById() method', () => {

        describe('Happy Path', () => {
            it('should return an idea when a valid ID is provided', async () => {
                // Arrange
                const idea: Idea = {
                    id: 1,
                    title: 'Test Idea',
                    description: 'Test Description',
                } as any;
                mockIdeasRepository.findById.mockResolvedValue(idea as any as never);

                // Act
                const result = await service.getById(1);

                // Assert
                expect(result).toEqual(idea);
                expect(mockIdeasRepository.findById).toHaveBeenCalledWith(1);
            });
        });

        describe('Edge Cases', () => {
            it('should throw NotFoundException when an idea with the given ID does not exist', async () => {
                // Arrange
                mockIdeasRepository.findById.mockRejectedValue(
                    new NotFoundException() as never,
                );

                // Act & Assert
                await expect(service.getById(999)).rejects.toThrow(NotFoundException);
                expect(mockIdeasRepository.findById).toHaveBeenCalledWith(999);
            });

            it('should handle non-numeric ID gracefully', async () => {
                // Arrange
                const invalidId: any = 'abc';
                mockIdeasRepository.findById.mockRejectedValue(
                    new NotFoundException() as never,
                );

                // Act & Assert
                await expect(service.getById(invalidId)).rejects.toThrow(
                    NotFoundException,
                );
                expect(mockIdeasRepository.findById).toHaveBeenCalledWith(invalidId);
            });
        });
    });

    describe('create() method', () => {

        describe('Happy Path', () => {
            it('should successfully create an idea', async () => {
                // Arrange: Set up the expected behavior and inputs
                const createIdeaDto: CreateIdeaDto = {
                    title: 'New Idea',
                    description: 'This is a new idea',
                };
                const expectedIdea: Idea = {
                    id: 1,
                    title: 'New Idea',
                    description: 'This is a new idea',
                } as any;

                mockIdeasRepository.save.mockResolvedValue(expectedIdea as any as never);

                // Act: Call the method under test
                const result = await service.create(createIdeaDto);

                // Assert: Verify the expected outcome
                expect(result).toEqual(expectedIdea);
                expect(mockIdeasRepository.save).toHaveBeenCalledWith(createIdeaDto);
            });
        });

        describe('Edge Cases', () => {
            it('should handle empty title gracefully', async () => {
                // Arrange: Set up the expected behavior and inputs
                const createIdeaDto: CreateIdeaDto = {
                    title: '',
                    description: 'This is a new idea',
                };

                mockIdeasRepository.save.mockResolvedValue(null as any as never);

                // Act: Call the method under test
                const result = await service.create(createIdeaDto);

                // Assert: Verify the expected outcome
                expect(result).toBeNull();
                expect(mockIdeasRepository.save).toHaveBeenCalledWith(createIdeaDto);
            });

            it('should handle empty description gracefully', async () => {
                // Arrange: Set up the expected behavior and inputs
                const createIdeaDto: CreateIdeaDto = {
                    title: 'New Idea',
                    description: '',
                };

                mockIdeasRepository.save.mockResolvedValue(null as any as never);

                // Act: Call the method under test
                const result = await service.create(createIdeaDto);

                // Assert: Verify the expected outcome
                expect(result).toBeNull();
                expect(mockIdeasRepository.save).toHaveBeenCalledWith(createIdeaDto);
            });

            it('should handle null input gracefully', async () => {
                // Arrange: Set up the expected behavior and inputs
                const createIdeaDto: CreateIdeaDto = null as any;

                mockIdeasRepository.save.mockResolvedValue(null as any as never);

                // Act: Call the method under test
                const result = await service.create(createIdeaDto);

                // Assert: Verify the expected outcome
                expect(result).toBeNull();
                expect(mockIdeasRepository.save).toHaveBeenCalledWith(createIdeaDto);
            });
        });
    });

    describe('updateById() method', () => {

        describe('Happy Path', () => {
            it('should update an idea successfully', async () => {
                // Arrange
                const id = 1;
                const updateIdeaDto: UpdateIdeaDto = {
                    title: 'Updated Title',
                    description: 'Updated Description',
                };
                const updatedIdea: Idea = {id, ...updateIdeaDto} as any;
                mockIdeasRepository.update.mockResolvedValue(updatedIdea as any as never);

                // Act
                const result = await service.updateById(id, updateIdeaDto);

                // Assert
                expect(result).toEqual(updatedIdea);
                expect(mockIdeasRepository.update).toHaveBeenCalledWith(
                    id,
                    updateIdeaDto,
                );
            });
        });

        describe('Edge Cases', () => {
            it('should handle updating an idea with only a title', async () => {
                // Arrange
                const id = 2;
                const updateIdeaDto: UpdateIdeaDto = {title: 'Title Only'};
                const updatedIdea: Idea = {
                    id,
                    title: 'Title Only',
                    description: 'Existing Description',
                } as any;
                mockIdeasRepository.update.mockResolvedValue(updatedIdea as any as never);

                // Act
                const result = await service.updateById(id, updateIdeaDto);

                // Assert
                expect(result).toEqual(updatedIdea);
                expect(mockIdeasRepository.update).toHaveBeenCalledWith(
                    id,
                    updateIdeaDto,
                );
            });

            it('should handle updating an idea with only a description', async () => {
                // Arrange
                const id = 3;
                const updateIdeaDto: UpdateIdeaDto = {description: 'Description Only'};
                const updatedIdea: Idea = {
                    id,
                    title: 'Existing Title',
                    description: 'Description Only',
                } as any;
                mockIdeasRepository.update.mockResolvedValue(updatedIdea as any as never);

                // Act
                const result = await service.updateById(id, updateIdeaDto);

                // Assert
                expect(result).toEqual(updatedIdea);
                expect(mockIdeasRepository.update).toHaveBeenCalledWith(
                    id,
                    updateIdeaDto,
                );
            });

            it('should throw NotFoundException if the idea does not exist', async () => {
                // Arrange
                const id = 4;
                const updateIdeaDto: UpdateIdeaDto = {title: 'Non-existent Idea'};
                mockIdeasRepository.update.mockRejectedValue(
                    new NotFoundException() as never,
                );

                // Act & Assert
                await expect(service.updateById(id, updateIdeaDto)).rejects.toThrow(
                    NotFoundException,
                );
                expect(mockIdeasRepository.update).toHaveBeenCalledWith(
                    id,
                    updateIdeaDto,
                );
            });
        });
    });

    describe('deleteAll() method', () => {

        describe('Happy Path', () => {
            it('should successfully delete all ideas', async () => {
                // Arrange: Set up the mock to resolve successfully
                mockIdeasRepository.deleteAll.mockResolvedValue(
                    undefined as any as never,
                );

                // Act: Call the deleteAll method
                await service.deleteAll();

                // Assert: Ensure the deleteAll method of the repository was called
                expect(mockIdeasRepository.deleteAll).toHaveBeenCalled();
            });
        });

        describe('Edge Cases', () => {
            it('should handle errors thrown by the repository', async () => {
                // Arrange: Set up the mock to reject with an error
                const error = new Error('Database error');
                mockIdeasRepository.deleteAll.mockRejectedValue(error as never);

                // Act & Assert: Call the deleteAll method and expect it to throw
                await expect(service.deleteAll()).rejects.toThrow('Database error');
            });
        });
    });

    describe('deleteById() method', () => {

        describe('Happy Path', () => {
            it('should delete an idea by id successfully', async () => {
                // Arrange
                const ideaId = 1;
                mockIdeasRepository.deleteById.mockResolvedValue(
                    undefined as any as never,
                );

                // Act
                await service.deleteById(ideaId);

                // Assert
                expect(mockIdeasRepository.deleteById).toHaveBeenCalledWith(ideaId);
            });
        });

        describe('Edge Cases', () => {
            it('should throw NotFoundException if the idea does not exist', async () => {
                // Arrange
                const ideaId = 999;
                mockIdeasRepository.deleteById.mockRejectedValue(
                    new NotFoundException() as never,
                );

                // Act & Assert
                await expect(service.deleteById(ideaId)).rejects.toThrow(
                    NotFoundException,
                );
                expect(mockIdeasRepository.deleteById).toHaveBeenCalledWith(ideaId);
            });

            it('should handle invalid id gracefully', async () => {
                // Arrange
                const invalidId = -1;
                mockIdeasRepository.deleteById.mockRejectedValue(
                    new Error('Invalid ID') as never,
                );

                // Act & Assert
                await expect(service.deleteById(invalidId)).rejects.toThrow('Invalid ID');
                expect(mockIdeasRepository.deleteById).toHaveBeenCalledWith(invalidId);
            });
        });
    });
});