import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
	type Query {
		hello: String!
		name: String!
	}
`;

// Resolvers
const resolvers = {
	Query: {
		hello() {
			return 'First query';
		},
		name() {
			return 'Mikke MAkke :D';
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
