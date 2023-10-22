import { Inject, Injectable } from '@nestjs/common';
import { ChainableCommander, Redis } from 'ioredis';
import { ICachingService, RedisCache } from './redis.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { promisify } from 'util';
import { convertUnitTime, UnitTime } from '../../utils';

@Injectable()
export class RedisService implements ICachingService {
  private _redisClient: Redis;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {
    this._redisClient = this.cacheManager.store.getClient();
  }

  get cacheClient() {
    return this._redisClient;
  }

  public async set<T>(key: string, value: T, ttl?: number) {
    const params = [];
    if (ttl && ttl > 0) {
      const ttlInMilliseconds = convertUnitTime(ttl, UnitTime.Milliseconds);
      params.push(...['PX', ttlInMilliseconds]);
    }
    return this.cacheClient.set(key, JSON.stringify(value), ...params);
  }

  public async get<T>(key: string): Promise<T> {
    const data = await promisify(this.cacheClient.get)(key);
    try {
      return JSON.parse(data);
    } catch (error) {
      return data as T;
    }
  }

  public async hset<T>(
    key: string,
    field: string,
    value: T,
    expireTime?: number,
  ): Promise<void> {
    await this.multiExec((multi) => {
      multi.hset(key, field, JSON.stringify(value));
      if (expireTime) {
        const expireInSeconds = convertUnitTime(expireTime, UnitTime.Seconds);
        multi.expire(key, expireInSeconds);
      }
    });
  }
  public async hget<T>(key: string, field: string): Promise<T> {
    const data = await promisify(this.cacheClient.hget)(key, field);
    try {
      return JSON.parse(data);
    } catch (error) {
      return data as T;
    }
  }

  public async hgetall(key: string) {
    return promisify(this.cacheClient.hgetall)(key);
  }

  async multiExec(
    fn: (multi: ChainableCommander) => void | ChainableCommander,
  ) {
    const initMulti = this.cacheClient.multi();
    fn(initMulti);
    return initMulti.exec();
  }

  public async setExpire(key: string, ttl: number) {
    const ttlInSeconds = convertUnitTime(ttl, UnitTime.Seconds);
    await this.cacheClient.expire(key, ttlInSeconds);
  }
}
