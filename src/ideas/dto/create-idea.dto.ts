import { Length } from "class-validator";

export class CreateIdeaDto {
    @Length(3, 100)
    title: string;

    @Length(3, 250)
    description: string;
}