import { CacheModuleAsyncOptions, ModuleMetadata } from '@nestjs/common';
import { Cache, Store } from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ChainableCommander, Redis } from 'ioredis';
export interface RedisCache extends Cache {
  store: RedisStore;
}

export interface RedisStore extends Store {
  name: 'redis';
  getClient: () => Redis;
  isCacheableValue: (value: any) => boolean;
}

export type RedisModuleOptions = CacheModuleAsyncOptions & {
  store: typeof redisStore;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  url?: string;
};

export type RedisModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
  inject?: any[];
  useFactory?: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
};
export interface ICachingService {
  get<T>(key: string): Promise<T>;
  hset<T>(
    key: string,
    field: string,
    value: T,
    expireTime?: number,
  ): Promise<void>;
  hget<T>(key: string, field: string): Promise<T>;
  hgetall(key: string): Promise<Record<string, string>>;
  multiExec(
    fn: (multi: ChainableCommander) => void | ChainableCommander,
  ): Promise<[error: Error, result: unknown][]>;
}
