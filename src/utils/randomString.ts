
import * as randomstring from 'randomstring';

export function generateRandomString( charset: string = 'alphabetic',length?: number): string {
  const randomString: string = randomstring.generate({ length, charset });
  return randomString;
}

