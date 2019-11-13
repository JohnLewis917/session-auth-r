const bcrypt = require('bcrypt')
saltRounds = 10

module.exports ={
    async register(req, res){
        const db = req.app.get('db')
        const {email, password, isAdmin} = req.body
        let newUser = await db.get_user_username(email)
        newUser = newUser[0]
        if(newUser) return res.status(400).send('email already in use. Try logging in')
        const salt = bcrypt.genSaltSync(saltRounds)
        const hash = bcrypt.hashSync(password, salt)
        newUser = await db.register([email, password, isAdmin])
        newUser = newUser[0]
        req.session.user = {
            loggedIn: true,
            id: newUser.id,
            isAdmin: newUser.isAdmin

        }
        console.log(hash)
        res.status(200).send
   
    },
    async login(req, res){
        const db = req.app.get('db')
        const {email, password} = req.body;
        const sessionUser = await db.get_user_username(email)
        if (!sessionUser[0]){
            return res.status(404).send('this user does not exist')
        }
            const passwordCheck = bcrypt.compareSync(password, sessionUser[0].password)
            if (!passwordCheck) {
                return res.status(404).send('password incorrect')
            }
            req.session.user = {
                id: sessionUser[0].id,
                isAdmin: sessionUser[0].isadmin
            }
            res.status(200).send(req.session.user)
    },

    logout(req, res){
        
        req.session.destroy()
        res.sendStatus(200)
}
}