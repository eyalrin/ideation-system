import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdeasModule } from './ideas/ideas.module';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      IdeasModule,
      MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/ideation-system'),
      ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
