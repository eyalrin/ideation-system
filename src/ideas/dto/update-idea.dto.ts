import { Length } from "class-validator";

export class UpdateIdeaDto {
    @Length(3, 100)
    title?: string;

    @Length(3, 250)
    description?: string;
}