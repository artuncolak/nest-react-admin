import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';

@Injectable()
export class CourseService {
  async save(createCourseDto: CreateCourseDto): Promise<void> {
    await Course.create({ ...createCourseDto, dateCreated: new Date() }).save();
  }

  async findAll(): Promise<Course[]> {
    return await Course.find();
  }

  async findById(id: string): Promise<Course> {
    const course = await Course.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<void> {
    const course = await this.findById(id);
    await Course.update(course, updateCourseDto);
  }

  async delete(id: string): Promise<void> {
    const course = await this.findById(id);
    await Course.delete(course);
  }

  async count(): Promise<number> {
    return await Course.count();
  }
}
