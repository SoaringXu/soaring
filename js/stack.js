class Stack {
    constructor() {
        this.items = [];
    }

    // 入栈操作
    push(element) {
        this.items.push(element);
    }

    // 出栈操作
    pop() {
        if (this.isEmpty()) {
            return "栈已空";
        }
        return this.items.pop();
    }

    // 查看栈顶元素
    peek() {
        return this.items[this.items.length - 1];
    }

    // 判断栈是否为空
    isEmpty() {
        return this.items.length === 0;
    }

    // 清空栈
    clear() {
        this.items = [];
    }

    // 返回栈的大小
    size() {
        return this.items.length;
    }

    // 输出栈中的元素
    print() {
        console.log(this.items.toString());
    }
}