-- CreateTable
CREATE TABLE `mentor_profiles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `company` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `experience_years` INTEGER NULL,
    `bio` VARCHAR(191) NULL,
    `linkedin_url` VARCHAR(191) NULL,
    `hourly_rate` DECIMAL(65, 30) NULL,
    `rating_avg` DOUBLE NOT NULL DEFAULT 0,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `mentor_profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mentor_profiles` ADD CONSTRAINT `mentor_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
