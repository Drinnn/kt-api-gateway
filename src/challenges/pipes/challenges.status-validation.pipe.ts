import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../enums/challenges.status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.allowedStatus.includes(status)) {
      throw new BadRequestException(
        `Invalid status. Available status for update: ACCEPTED, DENIED, CANCELED`,
      );
    }

    return value;
  }
}
