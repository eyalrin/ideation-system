import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Document } from "mongoose";

export type IdeaDocument = HydratedDocument<Idea>;

@Schema()
export class Idea extends Document {
    @Prop({ required: true, unique: true })
    id: number;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;
}

export const IdeaSchema = SchemaFactory.createForClass(Idea);