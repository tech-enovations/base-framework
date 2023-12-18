import { Injectable } from '@nestjs/common';
import { ChainableCommander, Redis } from 'ioredis';
import { LoggerService } from '../logger';
import { InjectRedis } from './redis.decorators';
import { HincrbyPayload, ICachingService, UnitTime } from './redis.interfaces';
import { convertUnitTime } from './redis.utils';

@Injectable()
export class RedisClientService implements ICachingService {
  private _prefix: string = 'haha:';
  private _logger = new LoggerService(RedisClientService.name);
  constructor(@InjectRedis() private readonly _redis: Redis) {}

  get redis() {
    return this._redis;
  }

  public async hset<T>(
    key: string,
    field: string,
    value: T,
    expireTime?: number,
  ) {
    const cacheKey = this._cacheKey(key);
    await this.multiExec((multi) => {
      multi.hset(cacheKey, field, JSON.stringify(value));
      if (expireTime) {
        const expireInSeconds = convertUnitTime(expireTime, UnitTime.Seconds);
        multi.expire(cacheKey, expireInSeconds);
      }
    });
  }

  public async hget<T>(key: string, field: string) {
    const data = await this.redis.hget(this._cacheKey(key), field);
    try {
      const parsed = JSON.parse(data) as T;
      return parsed;
    } catch (error) {
      return data as T;
    }
  }

  public async hdel(key: string, field: string): Promise<void> {
    await this.redis.hdel(this._cacheKey(key), field);
  }

  public async setEx<T>(key: string, value: T, expireTime: number) {
    const expireInSeconds = convertUnitTime(expireTime, UnitTime.Seconds);
    await this.redis.setex(
      this._cacheKey(key),
      expireInSeconds,
      JSON.stringify(value),
    );
  }

  public async setNx<T>(key: string, value: T, ttl?: number) {
    await this.redis.setnx(
      this._cacheKey(key),
      JSON.stringify(value),
      async (error, result) => {
        if (result === 1 && ttl) {
          await this.setExpire(key, ttl);
        }
        if (error) {
          this._logger.error('ERROR WHEN SETNX', error.message);
        }
      },
    );
  }

  public async setExpire(key: string, ttl: number) {
    const ttlInSeconds = convertUnitTime(ttl, UnitTime.Seconds);
    await this.redis.expire(this._cacheKey(key), ttlInSeconds);
  }

  public async get<T>(key: string) {
    const data = await this.redis.get(this._cacheKey(key));
    try {
      const parsed = JSON.parse(data) as T;
      return parsed;
    } catch (error) {
      return data as T;
    }
  }

  public async set<T>(key: string, value: T, ttl?: number) {
    const params = [];
    if (ttl && ttl > 0) {
      const ttlInMilliseconds = convertUnitTime(ttl, UnitTime.Milliseconds);
      params.push(...['PX', ttlInMilliseconds]);
    }
    return this.redis.set(
      this._cacheKey(key),
      JSON.stringify(value),
      ...params,
    );
  }

  public async keys(pattern = this._cacheKey('*')) {
    return this.redis.keys(pattern);
  }

  public async hgetall(key: string) {
    return this.redis.hgetall(key);
  }

  public async del(keys: string | string[]) {
    if (Array.isArray(keys)) {
      const cacheKeys = keys.map((key) => this._cacheKey(key));
      return this.redis.del(cacheKeys);
    }
    return this.redis.del(this._cacheKey(keys));
  }

  public async hincrby({ key, field, increment = 0 }: HincrbyPayload) {
    return this.redis.hincrby(this._cacheKey(key), field, increment);
  }

  public async multiHincrby(payload: HincrbyPayload[]) {
    const multi = this.redis.multi();
    payload.forEach(({ key, field, increment = 0 }) => {
      multi.hincrby(this._cacheKey(key), field, increment);
    });
    return multi.exec();
  }

  public async multiExec(
    fn: (multi: ChainableCommander) => void | ChainableCommander,
  ) {
    const initMulti = this.redis.multi();
    fn(initMulti);
    return initMulti.exec();
  }

  private _cacheKey(key: string) {
    return this._prefix + key;
  }

  public async getTTL(key: string): Promise<number> {
    const cacheKey = this._cacheKey(key);
    const keys = await this.redis.keys(cacheKey);
    return this._redis.ttl(keys.pop());
  }

  public async bucketGetCachedOrFetch<T>(
    key: string,
    field: string,
    dataFetcher: () => Promise<{ data: T; ttl: number }>,
    errorHandler: (error: Error) => Promise<T>,
  ): Promise<T> {
    try {
      const cachedData = await this.hget<T>(key, field);
      if (cachedData) {
        return cachedData;
      }
      const { data, ttl } = await dataFetcher();

      if (data) {
        await this.hset(key, field, data, ttl);
      }

      return data;
    } catch (error) {
      return errorHandler?.(error);
    }
  }

  public async getCachedOrFetch<T>(
    key: string,
    dataFetcher: () => Promise<{ data: T; ttl: number }>,
    errorHandler: (error: Error) => Promise<T>,
  ): Promise<T> {
    try {
      const cachedData = await this.get<T>(key);
      if (cachedData) {
        return cachedData;
      }
      const { data, ttl } = await dataFetcher();
      if (data && ttl) {
        await this.set(key, data, ttl);
      }
      return data;
    } catch (error) {
      return errorHandler?.(error);
    }
  }
}
