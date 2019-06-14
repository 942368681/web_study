/**
 * 编译器实现
 * 处理指令，插值，事件等等
 * 调用方式 new Compile(el, vm)
 */

class Compile {
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = document.querySelector(el);
        if (this.$el) {
            // 提取宿主元素中的全部模板元素到Fragment标签，dom操作更高效
            /**
             * DocumentFragments 是DOM节点。它们不是主DOM树的一部分。通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到DOM树。在DOM树中，文档片段被其所有的子元素所代替。因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。因此，使用文档片段通常会带来更好的性能。
             */
            this.$fragment = this.node2Fragment(this.$el);
            // 对this.$fragment编译，同时进行依赖收集
            this.compile(this.$fragment);
            // 将编译好的dom插入宿主元素中
            this.$el.appendChild(this.$fragment);
        }
    };

    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        let child;
        // appendChild剪切节点，这里相当于做一次搬家
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    };

    compile(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            // 判断节点类型
            if (node.nodeType === 1) {
                // element节点
                this.compileElement(node);
            } else if (this.isInterpolation(node)) {
                // 检验是否是插值表达式
                this.compileText(node);
            }
            // 递归子节点
            if (node.childNodes && node.childNodes.length) {
                this.compile(node);
            }
        });
    };

    isInterpolation(node) {
        // 是文本节点并且符合{{}}这个正则
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    };

    compileElement(node) {
        let nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr => {
            const attrName = attr.name;
            const exp = attr.value;
            if (this.isDirective(attrName)) {
                // 对于指令的处理
                const dir = attrName.substring(2);
                this[dir] && this[dir](node, this.$vm, exp);
            }
            if (this.isEvent(attrName)) {
                // 对于事件的处理
                const dir = attrName.substring(1);
                this.eventHandler(node, this.$vm, exp, dir);
            }
        });
    };

    isDirective(attr) {
        return attr.indexOf("k-") === 0;
    }

    isEvent(attr) {
        return attr.indexOf("@") === 0;
    }

    compileText(node) {
        this.update(node, this.$vm, RegExp.$1, 'text');
    }

    update(node, vm, exp, dir) {
        let updatrFn = this[dir + "Updater"];
        updatrFn && updatrFn(node, vm[exp]);
        // 依赖收集
        new Watcher(vm, exp, function (value) {
            updatrFn && updatrFn(node, value);
        });
    }

    text(node, vm, exp) {
        this.update(node, vm, exp, "text");
    }

    textUpdater(node, val) {
        node.textContent = val;
    }

    eventHandler(node, vm, exp, dir) {
        const fn = vm.$options.methods && vm.$options.methods[exp];
        if (dir && fn) {
            node.addEventListener(dir, fn.bind(vm));
        }
    }

    html(node, vm, exp) {
        this.update(node, vm, exp, "html");
    }

    model(node, vm, exp) {
        // data -> view
        this.update(node, vm, exp, "model");
        // view -> data
        node.addEventListener("input", e => {
            vm[exp] = e.target.value;
        });
    }

    htmlUpdater(node, value) {
        node.innerHTML = value;
    }

    modelUpdater(node, value) {
        node.value = value;
    }
};