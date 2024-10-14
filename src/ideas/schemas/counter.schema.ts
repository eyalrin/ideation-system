import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Counter extends Document {
    @Prop({ required: true })
    entity: string;

    @Prop({ required: true })
    seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);