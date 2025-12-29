import {
	modalitiesTable,
	movementPatternsTable,
	websiteRolesTable
} from '../src/lib/server/db/schema';

import { auth } from '../src/lib/server/auth';

// path to a file with schema you want to reset
import { db } from '../src/lib/server/db';
import { setWebsiteRole } from '../src/lib/server/modules/auth';

//await reset(db, schema);
await db.insert(websiteRolesTable).values({ name: 'user' }).onConflictDoNothing();
await db.insert(websiteRolesTable).values({ name: 'super' }).onConflictDoNothing();
await db.insert(websiteRolesTable).values({ name: 'admin' }).onConflictDoNothing();

// if dev create admin user
if (process.env.NODE_ENV === 'development') {
	try {
		const returnedUser = await auth.api.signUpEmail({
			body: {
				email: 'admin@admin.com',
				password: 'password',
				name: 'Admin User'
			}
		});
		const adminUser = await db.query.usersTable.findFirst({
			where: {
				email: 'admin@admin.com'
			}
		});

		if (adminUser) {
			const result = await setWebsiteRole(db, adminUser.id, 'admin');
			if (result.isErr()) {
				console.error('Failed to set admin role for admin user:', result.error);
			} else {
				console.log('Admin role set for admin user.');
			}
		}
	} catch (error) {
		console.error('Error creating admin user:', error);
	}
}

await db
	.insert(modalitiesTable)
	.values([
		{
			code: 'M',
			name: 'Monostructural',
			intent: 'Cardio / Metabolic conditioning'
		},
		{
			code: 'G',
			name: 'Gymnastics',
			intent: 'Body control / Relative strength'
		},
		{
			code: 'W',
			name: 'Weightlifting',
			intent: 'Structural load / Absolute strength'
		},
		{
			code: 'S',
			name: 'Stretching / Mobility',
			intent: 'Flexibility / Range of motion'
		},
		{
			code: 'O',
			name: 'Strongman / Odd Objects',
			intent: 'Functional load / Real-world strength'
		},
		{
			code: 'P',
			name: 'Plyometrics',
			intent: 'Explosive power / Reactive strength'
		}
	])
	.onConflictDoNothing();

await db
	.insert(movementPatternsTable)
	.values([
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
	])
	.onConflictDoNothing();

// seed movement

console.log('Seeding complete.');
