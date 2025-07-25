import { IsEnum, IsBoolean, IsOptional } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class UpdateUserDto {
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
