import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';

import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.entity';

@Injectable()
export class ContentService {
  constructor(private readonly courseService: CourseService) {}

  async save(
    courseId: string,
    createContentDto: CreateContentDto,
  ): Promise<void> {
    const { name, description } = createContentDto;
    const course = await this.courseService.findById(courseId);
    await Content.create({
      name,
      description,
      course,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(): Promise<Content[]> {
    return await Content.find();
  }

  async findById(id: string): Promise<Content> {
    const content = await Content.findOne(id);

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return content;
  }

  async findByCourseIdAndId(courseId: string, id: string): Promise<Content> {
    const content = await Content.findOne({ where: { courseId, id } });
    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return content;
  }

  async findAllByCourseId(courseId: string): Promise<Content[]> {
    return await Content.find({ where: { courseId } });
  }

  async update(
    courseId: string,
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<void> {
    const content = await this.findByCourseIdAndId(courseId, id);
    await Content.update(content, updateContentDto);
  }

  async delete(courseId: string, id: string): Promise<void> {
    const content = await this.findByCourseIdAndId(courseId, id);
    await Content.delete(content);
  }
}
