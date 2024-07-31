// sum.test.js
import { expect, test } from 'vitest';
import { getTierInfo } from './create';

test('parses tier info from form data', () => {
	const data = new FormData();
	data.set('name', 'Test Pool');
	data.set('tier-1-players', 'scottie scheffler\nrory mcilroy\n');
	data.set('tier-1-required', '1');
	data.set('tier-2-players', 'max homa\nbryson dechambeau');
	data.set('tier-2-required', '2');

	expect(getTierInfo(data)).toStrictEqual([
		{ tier_num: 1, players: ['scottie scheffler', 'rory mcilroy'], required_picks: 1 },
		{ tier_num: 2, players: ['max homa', 'bryson dechambeau'], required_picks: 2 }
	]);
});
