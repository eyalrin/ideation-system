import { Injectable } from "@nestjs/common";

import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateIdeaDto } from "./dto/create-idea.dto";
import { UpdateIdeaDto } from "./dto/update-idea.dto";
import { Counter } from "./schemas/counter.schema";
import { Idea, IdeaDocument } from "./schemas/idea.schema";

@Injectable()
export class IdeasRepository {

    constructor(
        @InjectModel(Idea.name) private ideaModel: Model<IdeaDocument>,
        @InjectModel(Counter.name) private readonly counterModel: Model<Counter>
    ) {}

    async getNextSequenceValue(entity: string): Promise<number> {
        const counter = await this.counterModel.findOneAndUpdate(
            { entity },
            { $inc: { seq: 1 } },
            { new: true, upsert: true },
        );
        return counter.seq;
    }

    async findAll(): Promise<IdeaDocument[]> {
        return await this.ideaModel.find().exec();
    }

    async findById(id: number): Promise<IdeaDocument> {
        const idea = await this.ideaModel.findOne({id: id}).exec();
        if (!idea) {
            throw new Error('Idea not found');
        }
        return idea;
    }

    async save(createIdeaDto: CreateIdeaDto): Promise<IdeaDocument> {
        const newId = await this.getNextSequenceValue('ideas');
        const ideaToCreated = new this.ideaModel({...createIdeaDto, id: newId});
        return await ideaToCreated.save();
    }

    async update(id: number, updateIdeaDto: UpdateIdeaDto): Promise<IdeaDocument> {
        const updatedIdea = await this.ideaModel.findOneAndUpdate({id: id}, updateIdeaDto, {new: true}).exec();
        if (!updatedIdea) {
            throw new Error('Idea not found');
        }

        return updatedIdea;
    }

    async deleteAll(): Promise<void> {
        await this.ideaModel.deleteMany({})
    }

    async deleteById(id: number): Promise<void> {
        const result = await this.ideaModel.findOneAndDelete({id: id}).exec();
        if (!result) {
            throw new Error('Idea not found');
        }
    }
}