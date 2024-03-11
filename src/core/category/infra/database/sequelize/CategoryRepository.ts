import { Op } from 'sequelize';
import { UUIDValueObject, NotFoundError } from '../../../../shared';
import { CategoryEntity } from '../../../domain';
import { CategoryModel } from './CategoryModel';
import { CategoryModelMapper } from './CategoryModelMapper';
import {
  CategoryRepositoryInterface,
  CategorySearchParams,
  CategorySearchResult,
} from '../../../domain/repository';

export class CategoryRepository implements CategoryRepositoryInterface {
  sortableFields: string[] = ['name', 'createdAt'];
  private model: typeof CategoryModel;

  constructor(model: typeof CategoryModel) {
    this.model = model;
  }

  async insert(entity: CategoryEntity): Promise<void> {
    const model = CategoryModelMapper.toModel(entity);
    await this.model.create(model.toJSON());
  }

  async bulkInsert(entities: CategoryEntity[]): Promise<void> {
    const models = entities.map((entity) =>
      CategoryModelMapper.toModel(entity),
    );
    await this.model.bulkCreate(models.map((model) => model.toJSON()));
  }

  async update(entity: CategoryEntity): Promise<void> {
    const id = entity.categoryId.value;
    const data = await this._get(id);
    if (!data) throw new NotFoundError(id, this.getEntity());
    const model = CategoryModelMapper.toModel(entity);
    await this.model.update(model.toJSON(), { where: { categoryId: id } });
  }

  async delete(entityId: UUIDValueObject): Promise<void> {
    const id = entityId.value;
    const data = await this._get(id);
    if (!data) throw new NotFoundError(id, this.getEntity());
    await this.model.destroy({ where: { categoryId: id } });
  }

  async findById(entityId: UUIDValueObject): Promise<CategoryEntity | null> {
    return await this._get(entityId.value);
  }

  async findAll(): Promise<CategoryEntity[]> {
    const data = await this.model.findAll();
    return data.map((item) => CategoryModelMapper.toEntity(item));
  }

  getEntity(): new (...args: any[]) => CategoryEntity {
    return CategoryEntity;
  }

  async search(params: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (params.page - 1) * params.perPage;
    const limit = params.perPage;
    const { rows: models, count } = await this.model.findAndCountAll({
      ...(params.filter && {
        where: {
          name: { [Op.like]: `%${params.filter}%` },
        },
      }),
      ...(params.sort && this.sortableFields.includes(params.sort)
        ? { order: [[params.sort, params.sortDirection]] }
        : { order: [['createdAt', 'desc']] }),
      offset,
      limit,
    });
    const items = models.map((item) => CategoryModelMapper.toEntity(item));
    return new CategorySearchResult({
      items,
      currentPage: params.page,
      perPage: params.perPage,
      total: count,
    });
  }

  private async _get(id: string): Promise<CategoryEntity | null> {
    const data = await this.model.findByPk(id);
    if (!data) return null;
    return CategoryModelMapper.toEntity(data);
  }
}
