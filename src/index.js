import { GraphQLServer } from 'graphql-yoga';

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
const posts = [
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
const comments = [
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
	},
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
		author: User
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
