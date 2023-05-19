import Lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import mkdirp from 'mkdirp'
import {resolve} from 'path'

mkdirp(resolve(__dirname, '../../live'))

export const db = new Lowdb(new FileSync(resolve(__dirname, '../../live/db.json')))
export const backup = new Lowdb(new FileSync(resolve(__dirname, '../../live/backup.json')))

// Seed an empty DB
db.defaults({
    data:{
        tasks: [
            {
                id: "tMI7-Xio9",
                name: "Do something nice for someone I care about"
            },
            {
                id: "dGebzVkk9",
                name: "Memorize the fifty states and their capitals"
            },
            {
                id: "KNl8GvI0Y",
                name: "Watch a classic movie"
            },
            {
                id: "yGHJMbwez",
                name: "Contribute code or a monetary donation to an open-source software project"
            },
            {
                id: "NUybcwFAd",
                name: "Bake pastries for me and neighbor"
            },
            {
                id: "eMvR7cyZw",
                name: "Write a thank you letter to an influential person in my life"
            },
            {
                id: "MnXqVFBTR",
                name: "Invite some friends over for a game night"
            },
            {
                id: "2Mgi0OlVY",
                name: "Have a football scrimmage with some friends"
            },
            {
                id: "SsadaVGdQ",
                name: "Organize pantry"
            },
            {
                id: "INhXuF0qY",
                name: "Buy a new house decoration"
            }
        ],
        sub_tasks: [
            {
                id: "-OfaFlQ4t",
                text: "Buy flowers for Nate",
                taskID: "tMI7-Xio9",
                completed: true
            },
            {
                id: "5JiMEgkKM",
                text: "Call your parents",
                taskID: "tMI7-Xio9",
                completed: false
            },
            {
                id: "0A3GdqdWb",
                text: "Buy a beer for a neighbor",
                taskID: "tMI7-Xio9",
                completed: false
            },
            {
                id: "LO6CGxwth",
                text: "Joker",
                taskID: "KNl8GvI0Y",
                completed: false
            },
            {
                id: "iNw-czpgM",
                text: "Hobbit",
                taskID: "KNl8GvI0Y",
                completed: false
            },
            {
                id: "0k96donEm",
                text: "Home alone",
                taskID: "KNl8GvI0Y",
                completed: true
            },
            {
                id: "AMVJ8AiD2",
                text: "Harry Potter",
                taskID: "KNl8GvI0Y",
                completed: false
            },
            {
                id: "irKuuuE3T",
                text: "Titanic",
                taskID: "KNl8GvI0Y",
                completed: false
            },
            {
                id: "DYWMM4leo",
                text: "Avengers",
                taskID: "KNl8GvI0Y",
                completed: true
            },
            {
                id: "bmLB2VHvB",
                text: "Table",
                taskID: "INhXuF0qY",
                completed: false
            },
            {
                id: "fsLL_OzWt",
                text: "Christmas tree",
                taskID: "INhXuF0qY",
                completed: false
            },
            {
                id: "6seNMVdWm",
                text: "Angry Cats",
                taskID: "MnXqVFBTR",
                completed: false
            },
            {
                id: "Oa6nKii23",
                text: "Socks",
                taskID: "SsadaVGdQ",
                completed: false
            },
            {
                id: "WD5LskS8g",
                text: "Cookies",
                taskID: "NUybcwFAd",
                completed: false
            }
        ]
    }
}).write();

backup.defaults({
    data: {
        tasks: [],
        sub_tasks: []
    }
}).write();
