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

const db = {
	users,
	comments,
	posts
};

export { db as default };
