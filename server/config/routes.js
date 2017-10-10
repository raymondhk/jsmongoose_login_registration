const users = require('../controllers/users.js')
module.exports = function(app) {
    app.get('/', (req, res) => {
        users.log_reg(req, res)
    })
    app.post('/register', (req, res) => {
        users.create(req, res)
    })
    app.post('/login', (req, res) => {
        users.login(req, res)
    })
    app.get('/main', (req, res) => {
        users.main(req, res)
    })
    app.get('/show', (req, res) => {
        users.show(req, res)
    })
    app.get('/logout', (req, res) => {
        users.logout(req, res)
    })
}