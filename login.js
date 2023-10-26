const express = require('express');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

const users = [
  { id: 1, username: 'alice', password: 'password' },
  { id: 2, username: 'bob', password: 'password' },
];

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup',
  [
    check('username').isLength({ min: 4 }).withMessage('Kullanıcı adı en az 4 karakter olmalı'),
    check('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('signup', { errors: errors.array() });
    }

    const { username, password } = req.body;
    users.push({ id: users.length + 1, username, password });

    res.redirect('/login');
  }
);

ı
app.get('/login', (req, res) => {
  res.render('login');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.status(401).render('login', { error: 'Geçersiz kullanıcı adı veya şifre' });
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});
