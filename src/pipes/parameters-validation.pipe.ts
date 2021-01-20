import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import capitalizeFirstLetter from 'src/helpers/capitalize-first-letter.helper';

export class ParametersValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value)
      throw new BadRequestException(
        `${capitalizeFirstLetter(metadata.data)} cannot be empty.`,
      );

    return value;
  }
}
