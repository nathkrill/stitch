const counterEl = document.querySelector('.counter');

const data = {
    count: 0
};

class Counter extends Stitch.Component {
    constructor(element,data,options) {
        super(element,data,options);
    }

    decrement() {
        this.data.count--;
    }

    increment() {
        this.data.count++;
    }
}

const counter = new Counter(counterEl,data,{});

const todoEl = document.querySelector('.todo');

const todoData = {
    items: [
        'do this',
        'do that'
    ],
    charCount: 0
};

class Todo extends Stitch.Component {
    constructor(element,data,options) {
        super(element,data,options);
    }

    addItem() {
        let value = this?.itemInput?.value;
        if (value) {
            this.data.items.push(value);
        }
    }
}

const todo = new Todo(todoEl,todoData,{});