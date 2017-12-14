# Leetcode 測驗

* [Add Two Numbers](https://leetcode.com/problems/add-two-numbers/?tab=Description)

我的解答：

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    var l0=new ListNode(0), i0 = l0, carry=0, sum=0;
    for (var i1=l1, i2=l2; i1 !== null || i2 !== null; ) {
        sum = (sum-sum%10)/10;
        if (i1 !== null) {
            sum += i1.val;
            i1 = i1.next;
        }
        if (i2 !== null) {
            sum += i2.val;
            i2 = i2.next;
        }
        i0.next = new ListNode(sum % 10);
        i0 = i0.next;
    }
    if (sum >= 10)
        i0.next = new ListNode(1);
    return l0.next;
};

```