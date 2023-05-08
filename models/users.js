class User {
    constructor(id, name, email, password) {
        this.id = id
        this.name = name;
        this.email = email;
        this.password = password;
    }

    setDetails(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    getDetails() {
        return {id: this.id, name: this.name, email: this.email, password: this.password};
    }
}


const data = [];

module.exports = {User, data};