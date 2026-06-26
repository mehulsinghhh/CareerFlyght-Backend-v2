-- AlterTable
ALTER TABLE `mentor_profiles` DROP COLUMN `is_verified`,
    ADD COLUMN `approval_status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `review_notes` TEXT NULL,
    ADD COLUMN `reviewed_at` DATETIME(3) NULL,
    ADD COLUMN `reviewed_by` BIGINT NULL;
