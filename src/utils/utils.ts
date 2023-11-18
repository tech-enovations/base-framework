// import { customAlphabet } from 'nanoid';
import { compareSync, hashSync } from 'bcrypt';

export enum UnitTime {
  Seconds = 'seconds',
  Milliseconds = 'milliseconds',
}

export type Dictionary<T> = {
  [key: string]: T;
};

export const getRandomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const excludeNull = <T>(array: T[]): T[] => {
  return array.filter((el) => el);
};

export const uniqueArray = <T>(
  array: Array<T>,
  isExcludeNull = true,
): Array<T> => {
  return [...new Set(isExcludeNull ? excludeNull(array) : array)];
};

export const randomElement = <T>(array: Array<T>): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const asyncMap = <T, K>(
  arr: Array<T>,
  fn: (value: T, index?: number, array?: Array<T>) => Promise<K>,
) => {
  const promises = arr.map(fn);
  return Promise.all(promises);
};

export const convertUnitTime = (time: number, targetUnit: UnitTime) => {
  if (targetUnit === UnitTime.Seconds) {
    return time >= 1000 ? time / 1000 : time;
  }
  if (targetUnit === UnitTime.Milliseconds) {
    return time < 1000 ? time * 1000 : time;
  }
};

export const getBucketCacheKey = (key: string, id: number) => {
  return `${key.toLowerCase()}bucket:${Math.floor(id / 1000)}`;
};

export const generateRandomId = () => {
  // const nanoid = customAlphabet(
  //   'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  //   6,
  // );
  // return `${new Date().getTime()}-${nanoid()}`;
  return `${new Date().getTime()}`;
};

export const textToSlug = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') //remove diacritics
    .toLowerCase()
    .replace(/\s+/g, '_') //spaces to dashes
    .replace(/&/g, '-and-') //ampersand to and
    .replace(/[^\w\-]+/g, '') //remove non-words
    .replace(/\-\-+/g, '_') //collapse multiple dashes
    .replace(/^-+/, '') //trim starting dash
    .replace(/-+$/, ''); //trim ending dash
};

export const hashPassword = (password: string) => {
  return hashSync(password, 12);
};

export const comparePasswords = (
  password: string,
  storedPasswordHash: string,
) => {
  return compareSync(password, storedPasswordHash);
};
