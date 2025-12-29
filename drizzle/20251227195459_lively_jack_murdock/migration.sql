ALTER TABLE "equipment" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "equipment_to_movements" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "gym_roles" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "gyms" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "modalities" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "movement_patterns" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "parent_movement_id" text;--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "movements_to_movement_patterns" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
CREATE INDEX "equipment_deleted_at_idx" ON "equipment" ("deleted_at");--> statement-breakpoint
CREATE INDEX "equipment_to_movements_deleted_at_idx" ON "equipment_to_movements" ("deleted_at");--> statement-breakpoint
CREATE INDEX "equipment_to_movements_equipment_id_idx" ON "equipment_to_movements" ("equipment_id");--> statement-breakpoint
CREATE INDEX "equipment_to_movements_movement_id_idx" ON "equipment_to_movements" ("movement_id");--> statement-breakpoint
CREATE INDEX "equipment_to_movements_composite_idx" ON "equipment_to_movements" ("equipment_id","movement_id");--> statement-breakpoint
CREATE INDEX "gym_roles_deleted_at_idx" ON "gym_roles" ("deleted_at");--> statement-breakpoint
CREATE INDEX "gyms_deleted_at_idx" ON "gyms" ("deleted_at");--> statement-breakpoint
CREATE INDEX "gyms_owner_id_idx" ON "gyms" ("owner_id");--> statement-breakpoint
CREATE INDEX "modalities_deleted_at_idx" ON "modalities" ("deleted_at");--> statement-breakpoint
CREATE INDEX "movement_patterns_deleted_at_idx" ON "movement_patterns" ("deleted_at");--> statement-breakpoint
CREATE INDEX "movements_deleted_at_idx" ON "movements" ("deleted_at");--> statement-breakpoint
CREATE INDEX "movements_modality_id_idx" ON "movements" ("modality_id");--> statement-breakpoint
CREATE INDEX "movements_parent_movement_id_idx" ON "movements" ("parent_movement_id");--> statement-breakpoint
CREATE INDEX "movements_to_patterns_deleted_at_idx" ON "movements_to_movement_patterns" ("deleted_at");--> statement-breakpoint
CREATE INDEX "movements_to_patterns_movement_id_idx" ON "movements_to_movement_patterns" ("movement_id");--> statement-breakpoint
CREATE INDEX "movements_to_patterns_pattern_id_idx" ON "movements_to_movement_patterns" ("movement_pattern_id");--> statement-breakpoint
CREATE INDEX "movements_to_patterns_composite_idx" ON "movements_to_movement_patterns" ("movement_id","movement_pattern_id");--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_parent_movement_id_movements_id_fkey" FOREIGN KEY ("parent_movement_id") REFERENCES "movements"("id");