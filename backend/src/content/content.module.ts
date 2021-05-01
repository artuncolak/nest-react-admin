import { forwardRef, Module } from '@nestjs/common';

import { CourseModule } from '../course/course.module';
import { ContentService } from './content.service';

@Module({
  imports: [forwardRef(() => CourseModule)],
  controllers: [],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
