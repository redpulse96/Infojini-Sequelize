import crypto from 'crypto';

export const hash = (string) => crypto.createHash('md5').update(string).digest('base64');
export const hashCompare = (first_item, second_item) => Object.is(first_item, second_item);
