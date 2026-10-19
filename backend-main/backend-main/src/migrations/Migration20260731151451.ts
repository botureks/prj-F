import { Migration } from '@mikro-orm/migrations';

export class Migration20260731151451 extends Migration {

  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter472` (`id` text NOT NULL, `username` varchar NOT NULL, `password` varchar NOT NULL, `picture` varchar NULL, `credentials_version` integer NOT NULL DEFAULT 0, `credentials_last_password` text NOT NULL DEFAULT \'\', `credentials_password_updated_at` integer NOT NULL DEFAULT 1785510891, `credentials_updated_at` integer NOT NULL DEFAULT 1785510891, `credentials_picture_version` int NOT NULL DEFAULT 0, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`));');
    this.addSql('INSERT INTO "_knex_temp_alter472" SELECT * FROM "users";;');
    this.addSql('DROP TABLE "users";');
    this.addSql('ALTER TABLE "_knex_temp_alter472" RENAME TO "users";');
    this.addSql('PRAGMA foreign_keys = ON;');
  }

}
