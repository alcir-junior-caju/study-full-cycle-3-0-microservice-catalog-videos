import { CategoryOutputMapper } from "../../application";
import { CategoryEntity } from "../../domain";

describe('CategoryOutputMapper Unit Tests', () => {
  it('should be convert a category in output', () => {
    const entity = CategoryEntity.create({
      name: 'Movie',
      description: 'some description',
      isActive: true,
    });
    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = CategoryOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.categoryId.value,
      name: 'Movie',
      description: 'some description',
      isActive: true,
      createdAt: entity.createdAt,
    });
  });
});
