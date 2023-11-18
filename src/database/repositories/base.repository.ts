import {
  ClientSession,
  CreateOptions,
  FilterQuery,
  FlattenMaps,
  InsertManyOptions,
  Model,
  Query,
  QueryOptions,
  Require_id,
  Types,
  UpdateQuery,
} from 'mongoose';
import { BaseModel } from 'src/database/models';
import { BaseFilter } from 'src/shared';

export abstract class BaseRepository<T extends BaseModel> {
  constructor(private readonly _model: Model<T>) {
    this._model = _model;
  }

  public createQueryBuilder() {
    return this.baseModel.find();
  }

  public buildQuery(baseFilter: BaseFilter, query = this.createQueryBuilder()) {
    const { filter } = new BaseFilter(baseFilter);
    for (const key in filter) {
      const value = filter[key];
      if (key && value) {
        const condition = Array.isArray(value)
          ? { $in: value }
          : { $eq: value };
        query.where(key, condition);
      }
    }
    return query.setOptions({ strictQuery: true });
  }

  public buildQueryRef(baseFilter: BaseFilter) {
    const { filter } = new BaseFilter(baseFilter);
    const query = this.baseModel.find();
    for (const key in filter) {
      const value = filter[key];
      if (key && value) {
        query.where(key, value);
      }
    }
    return query;
  }

  public async queryAndCount(
    query: Query<T[], T>,
    filter: BaseFilter,
  ): Promise<BaseResponse.List<Require_id<FlattenMaps<T>>>> {
    const { limit = 10, skip = 0 } = new BaseFilter(filter);
    const count = this._model.find().merge(query).count();
    const [items, total] = await Promise.all([
      query.limit(limit).skip(skip).lean(),
      count,
    ]);
    return {
      total,
      items,
    };
  }

  public async insert(dto: Partial<T>[], options: InsertManyOptions = {}) {
    return this.baseModel.insertMany(dto, options);
  }

  public async create(dto: Partial<T>): Promise<T> {
    return this._model.create(dto);
  }

  public createMany(
    dto: T[] | any[],
    options: CreateOptions = {},
  ): Promise<T[]> {
    return this._model.create(dto, options);
  }

  public findOneById(
    id: Types.ObjectId | string,
    options: QueryOptions<T> = {},
  ) {
    options['lean'] = true;
    return this._model.findById(id, options?.projection, options);
  }

  public async findOneBy(
    condition: FilterQuery<T> = {},
    options: QueryOptions<T> = {},
  ) {
    options['lean'] = true;
    return this._model.findOne(condition, options?.projection, options);
  }

  public findBy(condition: FilterQuery<T>, options: QueryOptions<T> = {}) {
    options['lean'] = true;
    return this._model.find(condition, options?.projection, options);
  }

  public countBy(condition: FilterQuery<T>) {
    return this._model.count(condition);
  }

  public async findAndCount(
    condition: FilterQuery<T> = {},
    options: QueryOptions<T> = {},
  ): Promise<BaseResponse.List<T>> {
    options['lean'] = true;
    const [total, items] = await Promise.all([
      this._model.count(condition),
      this._model.find(condition, options?.projection, options),
    ]);
    return {
      total,
      items,
    };
  }

  public updateById(
    id: Types.ObjectId | string,
    dto: Partial<T> | UpdateQuery<T>,
    options: QueryOptions<T> = {},
  ): Promise<T> {
    options['new'] = true;
    return this._model.findOneAndUpdate({ _id: id }, dto, options);
  }
  public updateBy(
    condition: FilterQuery<T>,
    dto: UpdateQuery<T>,
    options: QueryOptions<T> = {},
  ): Promise<T> {
    options['new'] = true;
    return this._model.findOneAndUpdate(condition, dto, options);
  }
  public updateMany(
    condition: FilterQuery<T>,
    dto: UpdateQuery<T>,
    options: QueryOptions<T> = {},
  ) {
    options['new'] = true;
    options['multi'] = true;
    return this._model.updateMany(condition, dto, options);
  }

  public async delete(
    id: Types.ObjectId | string,
    options: QueryOptions<T> = {},
  ): Promise<boolean> {
    const deleted = await this._model.findByIdAndDelete(id, options).exec();
    return Boolean(deleted);
  }

  public async deleteMany(
    condition: FilterQuery<T>,
    options: QueryOptions<T> = {},
  ) {
    await this._model.deleteMany(condition, options);
  }

  public async removeMany(models: T[]) {
    await this._model.deleteMany({ _id: models.map((el) => el._id) });
  }

  public async remove(model: T) {
    await this._model.deleteOne({ _id: model._id });
  }

  public async deleteOne(
    condition: FilterQuery<T>,
    options: QueryOptions<T> = {},
  ) {
    await this._model.deleteOne(condition, options);
  }

  get baseModel() {
    return this._model;
  }

  public async executeTransaction<T>(
    fn: (session: ClientSession) => Promise<T>,
    handleError?: (error: unknown) => void,
  ) {
    const session = await this._model.db.startSession();
    session.startTransaction();
    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      handleError?.(error);
    } finally {
      await session.endSession();
    }
  }

  public async existsWithCondition(condition: FilterQuery<T> = {}) {
    const data = await this._model.exists(condition).lean().exec();
    return Boolean(data);
  }
}
