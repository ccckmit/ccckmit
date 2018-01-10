var App = Vue.extend({});

// Keeping the testing data spoiler-sh free. Cause I'm just that kinda guy.
var family = {
    lannisters: [{
        name: 'Tyrion Lannister',
        attributes: [{
            attribute: 'Well versed in the art of diplomacy and consumption'
        }, {
            attribute: 'Killed his father'
        }, {
            attribute: 'Interesting connection with dragons'
        }]
    }, {
        name: 'Jaime Lannister',
        attributes: [{
            attribute: 'Killed the Mad King'
        }, {
            attribute: 'Former commander of the King\'s Guard'
        }, {
            attribute: 'Father to all \"legitimate\" Baratheon children'
        }, {
            attribute: 'Thinks it\'s ok to make sexy time with sister'
        }]
    }, {
        name: 'Cersei Lannister',
        attributes: [{
            attribute: 'Poisoned King Robert Baratheon'
        }, {
            attribute: 'Makes sexy time with brother. And cousin(s).'
        }]
    }],

    starks: [{
        name: 'Jon Snow',
        attributes: [{
            attribute: 'Knows nothing'
        }, {
            attribute: 'Bastard'
        }, {
            attribute: 'Has a Valyrian Steel sword'
        }]
    }, {
        name: 'Arya Stark',
        attributes: [{
            attribute: 'A girl has no name'
        }, {
            attribute: 'Has a sword named Needle'
        }, {
            attribute: 'Has a hit list and means to fulfill it'
        }]
    }, {
        name: 'Sansa Stark',
        attributes: [{
            attribute: 'Starting to play the game'
        }]
    }, {
        name: 'Bran Stark',
        attributes: [{
            attribute: 'Can see into the past and future'
        }, {
            attribute: 'Is a Warg'
        }]
    }]
}


Vue.filter('name', function(value, name) {
    return value.filter(function(attributes) {
        return attributes.name == name;
    })
});


var lannisters = Vue.extend({
    template: '#lannisters-template',

    data: function() {
        return {
            itemTitle: '',
            lannisters: family.lannisters,
        }
    },

    methods: {
        createLannister: function() {
            var itemTitle = this.itemTitle.trim();
            // add new item to FIRST list
            this.lannisters.push({
                name: itemTitle
            });
            this.itemTitle = '';
        }
    }
});

var starks = Vue.extend({
    template: '#starks-template',

    data: function() {
        return {
            itemTitle: '',
            starks: family.starks,
            lannisters: family.lannisters
        }
    },

    methods: {
        createStark: function() {
            var itemTitle = this.itemTitle.trim();
            // add new item to SECOND list
            this.starks.push({
                name: itemTitle
            });
            this.itemTitle = '';
        },
        createLannister: function() {
            var itemTitle = this.itemTitle.trim();
            // add new item to FIRST list
            this.lannisters.push({
                name: itemTitle
            });
            this.itemTitle = '';
        },
        createBoth: function() {
            var itemTitle = this.itemTitle.trim();
            // add new item to BOTH lists
            this.starks.push({
                name: itemTitle
            });
            this.lannisters.push({
                name: itemTitle
            });
            this.itemTitle = '';
        }
    }
})

var stark = Vue.extend({
    template: '#stark-template',

    data: function() {
        return {
            text: 'More Info',
            starks: family.starks
        }
    },
})

var lannister = Vue.extend({
    template: '#lannister-template',

    data: function() {
        return {
            text: 'More Info',
            lannisters: family.lannisters
        }
    },
})


var router = new VueRouter(
    
);


router.alias({
    // Start here
    '/': '/starks'
})

router.map({
    '/starks': {
        component: starks
    },
    '/lannisters': {
        component: lannisters
    },
    '/starks/:name': {
        component: stark
    },
    '/lannisters/:name': {
        component: lannister
    }
});

router.start(App, '#app');