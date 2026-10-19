import { Migration } from '@mikro-orm/migrations';

export class Migration20260730170651 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `tags` (`id` text not null, `name` text not null, `slug` text not null, `color` text null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`id`));');
    this.addSql('create unique index `tags_name_unique` on `tags` (`name`);');
    this.addSql('create unique index `tags_slug_unique` on `tags` (`slug`);');

    this.addSql('create table `posts_tags` (`post_entity_id` text not null, `tag_entity_id` text not null, constraint `posts_tags_post_entity_id_foreign` foreign key(`post_entity_id`) references `posts`(`id`) on delete cascade on update cascade, constraint `posts_tags_tag_entity_id_foreign` foreign key(`tag_entity_id`) references `tags`(`id`) on delete cascade on update cascade, primary key (`post_entity_id`, `tag_entity_id`));');
    this.addSql('create index `posts_tags_post_entity_id_index` on `posts_tags` (`post_entity_id`);');
    this.addSql('create index `posts_tags_tag_entity_id_index` on `posts_tags` (`tag_entity_id`);');

    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter303` (`id` text NOT NULL, `username` varchar NOT NULL, `password` varchar NOT NULL, `picture` varchar NULL, `credentials_version` integer NOT NULL DEFAULT 0, `credentials_last_password` text NOT NULL DEFAULT \'\', `credentials_password_updated_at` integer NOT NULL DEFAULT 1785431211, `credentials_updated_at` integer NOT NULL DEFAULT 1785431211, `credentials_picture_version` int NOT NULL DEFAULT 0, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`));');
    this.addSql('INSERT INTO "_knex_temp_alter303" SELECT * FROM "users";;');
    this.addSql('DROP TABLE "users";');
    this.addSql('ALTER TABLE "_knex_temp_alter303" RENAME TO "users";');
    this.addSql('PRAGMA foreign_keys = ON;');

    this.addSql('alter table `posts` add column `edited_at` datetime null;');
    this.addSql('alter table `posts` add column `is_edited` integer not null default false;');

    this.addSql('alter table `comments` add column `edited_at` datetime null;');
    this.addSql('alter table `comments` add column `is_edited` integer not null default false;');
  }

}