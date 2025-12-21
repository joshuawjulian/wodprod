import { db } from '../src/lib/server/db';
import { movementPatternsTable, websiteRolesTable } from '../src/lib/server/db/schema';

await db.insert(websiteRolesTable).values({ name: 'user' });
await db.insert(websiteRolesTable).values({ name: 'super' });
await db.insert(websiteRolesTable).values({ name: 'admin' });

await db.insert(movementPatternsTable).values([
	{
		name: 'Squat',
		description:
			'Bilateral hip and knee flexion where the torso remains relatively upright. This covers heavy loading (Back Squat), high-repetition endurance (Air Squat), and jumping mechanics (Box Jump) where landing absorbs force in this pattern.'
	},
	{
		name: 'Hinge',
		description:
			'Hip-dominant movement with minimal knee flexion, loading the posterior chain (glutes/hamstrings). This includes heavy static lifts (Deadlift) and explosive hip extension movements (Kettlebell Swing, Power Clean initiation).'
	},
	{
		name: 'Lunge',
		description:
			'Unilateral knee and hip flexion. This pattern targets imbalances and stability. It encompasses static split squats, dynamic walking lunges, and step-ups.'
	},
	{
		name: 'Push (Horizontal)',
		description:
			'Moving a load away from the chest perpendicular to the torso. This includes fixed path movements (Bench Press) and bodyweight progressions (Push-up, Burpee ground-phase).'
	},
	{
		name: 'Push (Vertical)',
		description:
			'Moving a load vertically overhead relative to the torso. This covers strict pressing strength (Military Press), dynamic overhead stability (Handstand), and explosive overhead drive (Push Jerk, Thruster extension).'
	},
	{
		name: 'Pull (Horizontal)',
		description:
			'Drawing a load toward the torso perpendicular to the spine. Crucial for scapular retraction and counteracting daily posture issues. Includes rows (Barbell/Dumbbell) and horizontal bodyweight pulling (Ring Row).'
	},
	{
		name: 'Pull (Vertical)',
		description:
			'Drawing a load down relative to the torso or pulling the body up. This primarily targets the latissimus dorsi. Includes Pull-ups, Rope Climbs, and Lat Pulldowns.'
	},
	{
		name: 'Rotation / Anti-Rotation',
		description:
			'Generating or resisting torque through the transverse plane. This covers explosive rotation (Medball Toss) and resisting external rotational forces (Pallof Press, Sandbag holds).'
	},
	{
		name: 'Core (Flexion & Stability)',
		description:
			'Movements focusing on spinal flexion (Toes-to-Bar, GHD Sit-up) or isometric stability against gravity (Plank, L-Sit). Distinct from rotation, this targets the ability to brace and flex the trunk linearly.'
	},
	{
		name: 'Gait / Carry',
		description:
			'Locomotion with or without a load. This integrates all patterns into movement over distance. Includes unloaded cyclical work (Run, Bike, Row) and heavy structural loading (Farmer Carry, Yoke Walk).'
	}
]);
