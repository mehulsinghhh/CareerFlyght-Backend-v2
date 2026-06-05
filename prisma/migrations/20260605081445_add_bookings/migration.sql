-- CreateTable
CREATE TABLE `bookings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `student_id` BIGINT NOT NULL,
    `mentor_id` BIGINT NOT NULL,
    `booking_date` DATETIME(3) NOT NULL,
    `booking_time` VARCHAR(191) NOT NULL,
    `session_type` ENUM('online', 'offline') NOT NULL,
    `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `amount` DECIMAL(65, 30) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_mentor_id_fkey` FOREIGN KEY (`mentor_id`) REFERENCES `mentor_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
