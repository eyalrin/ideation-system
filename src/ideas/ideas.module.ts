import { Module } from '@nestjs/common';
import { IdeasController } from './ideas.controller';
import { IdeasService } from './ideas.service';
import { IdeasRepository } from "./ideas.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Idea, IdeaSchema } from "./schemas/idea.schema";
import { Counter, CounterSchema } from "./schemas/counter.schema";

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Idea.name, schema: IdeaSchema }]),
      MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }])
  ],
  controllers: [IdeasController],
  providers: [IdeasService, IdeasRepository]
})
export class IdeasModule {}
