# stitch
Small JS Library for handling DOM Updates.

## Usage

Include all files from `dist/js/` in your build. The entry point is `stitch.min.js`.
### Extending a Component

In order to use stitch bindings in your DOM, you first need to set up a class which extends a Stitch component. In it's constructor it needs to take a HTML Element or css selector, your data in a JS Object, and any options. (Currently there are no supported options).

```
const counterEl = document.querySelector('.counter');

const data = {
    count: 0
};

class Counter extends Stitch.Component {
    constructor(element,data,options) {
        super(element,data,options);
    }
}

const counter = new Counter(counterEl,data,{});
```

Next, we want to add some data manipulation, so we create some new methods in our class:

```
    constructor() {...}

    decrement() {
        this.data.count--;
    }

    increment() {
        this.data.count++;
    }
```

All set. Now we need some HTML template to work with.

## Template Syntax

First, we need our element we passed into the Component class:

```
    <div class='counter'>
    </div>
```

Next, we need somewhere to put our data. Place an element whose content contains a curly brace pair with a data reference inside:

```
    <div class='counter'>
        <p>{this.data.count}</p>
    <div>
```

We may also want some conditional rendering, where elements show/hide based on the data:

 > `s-for` Contains an expression that returns a count. The element will show that many times. Use `index` inside a data binding to access data based on the index of the element.

 > `s-if` Will show the element if it's condition is met.

```
    <div class='counter'>
        <p>{this.data.count}</p>
        <p s-if='this.data.count > 10'>Woah, slow down!</p>
        <p s-if='this.data.count < -10'>Going down...</p>
        <ul>
            <li s-for='this.data.count'>😊</li>
            <li s-for='-this.data.count'>😨</li>
        </ul>
    </div>
```

Finally, we need to add some way to manipulate the data using `s-event`.

> `s-event` Let's us listen for events on this element. `s-event-*` is the event type to listen for, and our class method to run on the event fire.

```
    <div class='counter'>
        <button s-event s-event-click='increment'>+</button>
        <p>{this.data.count}</p>
        <button s-event s-event-click='decrement'>-</button>
        <p s-if='this.data.count > 10'>Woah, slow down!</p>
        <p s-if='this.data.count < -10'>Going down...</p>
        <ul>
            <li s-for='this.data.count'>😊</li>
            <li s-for='-this.data.count'>😨</li>
        </ul>
    </div>
```

See the `demo` folder for the full demo, as well as a todo component demo.