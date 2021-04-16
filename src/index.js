import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Demo user data
const users = [
	{
		id: '1',
		name: 'Mikael',
		email: 'mikael@example.fi',
		age: 27
	},
	{
		id: '2',
		name: 'Teppo',
		email: 'teppo@example.fi',
		age: 29
	},
	{
		id: '3',
		name: 'Risto',
		email: 'risto@example.fi',
		age: 33
	}
];

// Demo post data
let posts = [
	{
		id: '4',
		title: 'Mikaelin title zzzz',
		body: 'This is a GQL POST! :D',
		published: true,
		author: '1'
	},
	{
		id: '5',
		title: 'Tepon title xxxx',
		body: 'This is a GQL POST! :D',
		published: true,
		author: '2'
	},
	{
		id: '6',
		title: 'Riston title yyyyy',
		body: 'This is a GQL POST! :D',
		published: true,
		author: '3'
	}
];
let comments = [
	{
		id: '7',
		text: 'la la laaa',
		author: '1',
		post: '4'
	},
	{
		id: '8',
		text: 'tö tö töö',
		author: '2',
		post: '5'
	},
	{
		id: '9',
		text: 'rö rö röö',
		author: '3',
		post: '6'
	},
	{
		id: '10',
		text: 'dö dä dää',
		author: '2',
		post: '6'
	}
];
// Type definitions (schema)
const typeDefs = `
	type Query {
		me: User!
		users(query: String!): [User!]!
		posts(query: String!): [Post!]!
		comments: [Comment!]!
		post: Post!
		grades: [Int!]!
		add(numbers: [Float!]!): Float!
	}

	type Mutation {
		createUser(data: CreateUserInput): User!
		createPost(data: CreatePostInput): Post!
		deleteUser(id: ID!): User!
		deletePost(id: ID!): Post!
		createComment(data: CreateCommentInput): Comment!
		deleteComment(id: ID!): Comment!
	}

	input CreateUserInput {
		name: String!
		email: String!
		age: Int
	}

	input CreatePostInput {
		title: String!
		body: String!
		published: Boolean!
		author: ID!
	}

	input CreateCommentInput {
		text: String!
		author: ID!
		post: ID!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
		posts: [Post!]!
		comments: [Comment!]!
	}

	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
		comments: [Comment!]!
	}

	type Comment {
		id: ID!
		text: String!
		author: User!
		post: Post!
	}
`;

// Resolvers
const resolvers = {
	Query: {
		me() {
			return {
				id: 1,
				name: 'Teppo',
				email: 'Matti@Teppo.fi',
				age: 12
			};
		},

		users(parent, args, ctx, info) {
			if (!args.query) {
				return users;
			}
			return users.filter((user) => {
				return user.name.toLowerCase().includes(args.query.toLowerCase());
			});
		},

		comments(parents, args, ctx, info) {
			return comments;
		},

		posts(parent, args, ctx, info) {
			if (!args.query) {
				return posts;
			}
			return posts.filter((post) => {
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
		},

		grades(parent, args, ctx, info) {
			return [12, 23, 44];
		}
	},
	Mutation: {
		createUser(parent, args, ctx, info) {
			const emailTaken = users.some((user) => user.email === args.data.email);
			if (emailTaken) {
				throw new Error('Email taken');
			}

			const one = {
				name: 'OUlu',
				country: 'Finland'
			};

			const two = {
				population: 300000,
				...one
			};

			const user = {
				id: uuidv4(),
				...args.data
			};

			users.push(user);

			return user;
		},
		deleteUser(parent, args, ctx, info) {
			const userIndex = users.findIndex((user) => user.id === args.id);
			if (userIndex === -1) {
				throw new Error('user not found');
			}
			const deletedUsers = users.splice(userIndex, 1);

			posts = posts.filter((post) => {
				const match = post.author === args.id;
				if (match) {
					comments = comments.filter((comment) => comment.post !== post.id);
				}
				return !match;
			});

			comments = comments.filter((comment) => comment.author !== args.id);

			return deletedUsers[0];
		},
		createPost(parent, args, ctx, info) {
			const userExists = users.some((user) => user.id === args.data.author);
			if (!userExists) {
				throw new Error('User not found');
			}

			const post = {
				id: uuidv4(),
				...args.data
			};

			posts.push(post);

			return post;
		},
		deletePost(parent, args, ctx, info) {
			const postIndex = posts.findIndex((post) => post.id === args.id);
			if (postIndex === -1) {
				throw new Error('Post not found!');
			}

			const deletedPosts = posts.splice(postIndex, 1);

			comments = comments.filter((comment) => comment.post !== args.id);

			return deletedPosts[0];
		},
		createComment(parent, args, ctx, info) {
			const userExists = users.some((user) => user.id === args.data.author);
			const postExists = posts.some(
				(post) => post.id === args.data.post && post.published === true
			);

			if (!userExists || !postExists) {
				throw new Error('Unable to find user and post');
			}

			const comment = {
				id: uuidv4(),
				...args.data
			};

			comments.push(comment);

			return comment;
		},
		deleteComment(parent, args, ctx, info) {
			const commentIndex = comments.findIndex(
				(comment) => comment.id === args.id
			);

			if (commentIndex === -1) {
				throw new Error('Comment not found');
			}

			const deletedComments = comments.splice(commentIndex, 1);

			return deletedComments[0];
		}
	},
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => user.id === parent.author);
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.post === parent.id;
			});
		}
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find((user) => user.id === parent.author);
		},
		post(parent, args, ctx, info) {
			return posts.find((post) => post.id === parent.post);
		}
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter((post) => {
				return post.author === parent.id;
			});
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.author === parent.id;
			});
		}
	}
};

const server = new GraphQLServer({
	typeDefs,
	resolvers
});

server.start(() => {
	console.log('server is up');
});
