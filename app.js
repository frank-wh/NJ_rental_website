const express      = require('express'),
      session      = require('express-session'),
      exphbs  	   = require('express-handlebars'),
      app          = express(),
      static  	   = express.static(__dirname + '/public'),
      configRoutes = require('./routes');

const rewriteUnsuppBrowserMethods = (req, res, next) => {
	if (req.body && req.body._method) {
		req.method = req.body._method;
		delete req.body._method;
	}
	next();
};

const handlebarsInstance = exphbs.create({
	defaultLayout: 'main',
	helpers: {
		toJson : context => JSON.stringify(context).replace(/[\']/g, "&apos;"),
		ifCond : function(v1, v2, options) {
			return v1 === v2 ? options.fn(this) : options.inverse(this);
		}
	}, 
	partialsDir: [ 'views/partials/' ]
});

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsuppBrowserMethods);

app.use(
	session({
		name: 'AuthCookie',
		secret: 'some secret string!',
		resave: false,
		saveUninitialized: true
	})
);

app.use(async (req, res, next) => {
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 1);
	req.session.cookie.expires = expiresAt;
	next();
});

app.use(async (req, res, next) => {
	const now = new Date().toUTCString();
	let userText = req.session.user ? "Authenticated User" : "Non-Authenticated User" ;
	console.log(`[${now}]: ${req.method} ${req.originalUrl} (${userText})`);
	next();
});

app.use(async (req, res, next) => {
	res.locals.currentUser = req.session.user;
	next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
