import { IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  titulo: string;

  @MinLength(10)
  contenido: string;

  @IsNotEmpty()
  userId: number; // para asociar el post al usuario
}
