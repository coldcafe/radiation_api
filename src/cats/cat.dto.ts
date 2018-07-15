import { ApiModelProperty } from '@nestjs/swagger';

export class CatDto {
  @ApiModelProperty()
  readonly name: string;

  @ApiModelProperty()
  readonly age: number;

  @ApiModelProperty({ type: String })
  readonly breed: string;
}