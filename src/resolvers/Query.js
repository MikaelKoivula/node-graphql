const Query = {
	me() {
		return {
			id: 1,
			name: 'Teppo',
			email: 'Matti@Teppo.fi',
			age: 12
		};
	},

	users(parent, args, { db }, info) {
		if (!args.query) {
			return db.users;
		}
		return db.users.filter((user) => {
			return user.name.toLowerCase().includes(args.query.toLowerCase());
		});
	},

	comments(parents, args, { db }, info) {
		return db.comments;
	},

	posts(parent, args, { db }, info) {
		if (!args.query) {
			return db.posts;
		}
		return db.posts.filter((post) => {
			return (
				post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
			);
		});
	},

	post() {
		return {
			id: 1,
			title: 'Post title',
			body: 'Body title',
			published: true
		};
	},

	add(parent, args, ctx, info) {
		if (args.numbers.length === 0) {
			return 0;
		}
		return args.numbers.reduce((accummulator, currentValue) => {
			return accummulator + currentValue;
		}, 0);
	}
};

export { Query as default };
