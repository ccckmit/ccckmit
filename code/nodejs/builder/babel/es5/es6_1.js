'use strict';

var main = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var text, p;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return ESP6.scriptLoad('test.js');

                    case 2:
                        _context.next = 4;
                        return ESP6.ajax({ method: 'GET', url: 'test.html' });

                    case 4:
                        text = _context.sent;

                        alert(text);
                        // test ES6 template string
                        p = { name: 'ccc', age: 48 };
                        text = 'Hello ! I am ' + p.name + '. I am ' + p.age + ' years old.';

                        console.log(text);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function main() {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

main();