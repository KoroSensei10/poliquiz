import { query } from '$app/server';

export const getPosts = query(async () => {
	return [{
        title: 'Post 1',
        slug: 'post-1'
    }];
});