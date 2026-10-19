import { Migration } from '@mikro-orm/migrations';

export class Migration20260319012157 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `users` (`id` text not null, `username` varchar not null, `password` varchar not null, `picture` varchar null, `credentials_version` integer not null default 0, `credentials_last_password` text not null default \'\', `credentials_password_updated_at` integer not null default 1773883316, `credentials_updated_at` integer not null default 1773883316, `credentials_picture_version` int not null default 0, `created_at` datetime not null, `updated_at` datetime not null, primary key (`id`));');

    this.addSql('create table `posts` (`id` text not null, `author_id` text not null, `title` text not null, `topic` varchar not null, `content` text not null, `created_at` datetime not null, `updated_at` datetime not null, constraint `posts_author_id_foreign` foreign key(`author_id`) references `users`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `posts_author_id_index` on `posts` (`author_id`);');

    this.addSql('create table `comments` (`id` text not null, `post_id` text not null, `author_id` text not null, `reply_to` text null, `content` text not null, `views` int not null default 0, `created_at` datetime not null, `updated_at` datetime not null, constraint `comments_author_id_foreign` foreign key(`author_id`) references `users`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `comments_author_id_index` on `comments` (`author_id`);');
  }

}
