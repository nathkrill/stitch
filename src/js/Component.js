class Component {
    /**
     * 
     * @param {HTMLElement|String} element 
     * @param {Object} options
     */
    constructor(element, data = {}, options = {}) {
        this.init(element).then(() => {
            this.data = data;
            this.renderCallback = options?.onRender || function () {};
            this._firstRender();
        });
    }
    
    init(element) {
        return new Promise(async (res,rej) => {
            try {
                await this._setupContainingElement(element);
                res();
            } catch(e) {
                rej(e);
            }
        })
    }

    async _setupContainingElement(element) {
        if (typeof element === "string") {
            element = document.querySelector(element)
        }
        const {default: isElement} = await import('./helpers/isElement.js')
        if (isElement(element)) {
            this.element = element;
            return;
        } else {
            throw new TypeError('Parameter "element" was not of type String or HTMLElement');
        }
    }

    /**
     * setupData
     * 
     * Replaces any references inside curly braces with data.
     */
    _setupData() {
        let innerString = this._renderTemplate.innerHTML;
        const dataPoints = this._renderTemplate.innerHTML.match(/(\{.*?\})*/g);
        if (dataPoints) {
            dataPoints.forEach(point => {
                point = point.substring(1,point.length - 1);
                innerString = innerString.replace(`{${point}}`,eval(point));
            });
        }
        this._renderTemplate.innerHTML = innerString;
    }

    /**
     * eventCallback
     * 
     * Fires after a component handled event is run. Causes a re-render
     */
    _eventCallback() {
        this.render();
    }

    /**
     * setupConditions
     * 
     * Looks for any conditional or iterative elements in the component and matches them to data.
     */
    _setupConditions() {
        const conditionalElements = [].slice.call(this._renderTemplate.content.querySelectorAll('[s-if]'));
        if (conditionalElements) {
            conditionalElements.forEach(element => {
                if (element.getAttribute && element.getAttribute('s-if')) {
                    if (!eval(element.getAttribute('s-if'))) {
                        element.parentNode.removeChild(element);
                    }
                }
            });
        }

        const iterativeElements = [].slice.call(this._renderTemplate.content.querySelectorAll('[s-for]'));
        if (iterativeElements) {
            iterativeElements.forEach(element => {
                if (element.getAttribute && element.getAttribute('s-for')) {
                    for(let i = 0;i < eval(element.getAttribute('s-for'));i++) {
                        let clone = element.cloneNode(true);
                        let matches = clone.innerHTML.match(/(?<=\{).*(?=\})/g);
                        if (matches) {
                            matches.forEach(match => {
                                let replace = match.replace('index', i);
                                clone.innerHTML = clone.innerHTML.replace(match,replace);
                            });
                        }
                        element.parentElement.insertBefore(clone,element);
                    }
                    element.parentNode.removeChild(element);
                }
            })
        }
    }

    /**
     * setupListeners
     * 
     * Finds any elements with s-event attributes and runs the component method specified for any s-event-* attributes.
     */
    _setupListeners() {
        const eventElements = [].slice.call(this.element.querySelectorAll('[s-event]'));
        if (eventElements) {
            eventElements.forEach(element => {
                for (const attribute of element.attributes) {
                    if (attribute.name.match('s-event-')) {
                        let events = attribute.name.match(/(?<=s-event-)(.*)/g);
                        events.forEach(event => {
                            element.addEventListener(event, e => {
                                if (this[attribute.value]) {
                                    this[attribute.value](e);
                                }
                                this._eventCallback();
                            })
                        })
                    }
                }
            })
        }
    }

    /**
     * setupBindings
     * 
     * Finds any elements with the attribute s-bind and binds them to the component instance (this).
     */
    _setupBindings() {
        const boundElements = [].slice.call(this.element.querySelectorAll('[s-bind]'));
        if (boundElements) {
            boundElements.forEach(element => {
                if (element.getAttribute && element.getAttribute('s-bind')) {
                    this[element.getAttribute('s-bind')] = element;
                }
            });
        }
    }

    /**
     * render
     * 
     * updates the DOM Component with new data.
     */
    async render() {
        this._renderTemplate.innerHTML = this._template.innerHTML;
        this._setupConditions();
        this._setupData();
        let clone = this._renderTemplate.content.cloneNode(true);
        this.element.innerHTML = null;
        this.element.appendChild(clone);
        this._setupBindings();
        this._setupListeners();
        this.renderCallback();
    }

    /**
     * firstRender
     * 
     * Sets up the templates used to handle DOM updates.
     */
    _firstRender() {
        this._template = document.createElement('template');
        this._renderTemplate = document.createElement('template');
        this._template.innerHTML = this.element.innerHTML;
        this.render();
    }
}

export default Component;