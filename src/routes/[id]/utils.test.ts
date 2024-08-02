import { expect, test } from 'vitest';
import { getPicks } from './utils';

test('parses tier info from form data', () => {
	const data = new FormData();
	data.set('name', 'Test Pool');
	data.set('tier-1-players', '["scottie scheffler","rory mcilroy"]');
	data.set('tier-2-players', 'max homa');

	expect(getPicks(data)).toStrictEqual(['scottie scheffler', 'rory mcilroy', 'max homa']);
});
