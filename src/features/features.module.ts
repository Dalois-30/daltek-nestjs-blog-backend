import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [
        UsersModule,
        CategoriesModule,
        PostsModule,
        CommentsModule,
        AdminModule,
    ]
})
export class FeaturesModule {}
