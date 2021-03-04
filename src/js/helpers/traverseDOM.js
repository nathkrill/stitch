function traverseDOM(parent,callback) {
    callback(parent);
    if (parent.children) {
        for (let i = 0;i<parent.childElementCount;i++) {
            traverseDOM(parent.children[i],callback);
        }
    }
}

export default traverseDOM