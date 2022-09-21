const fs = require('fs');

function someAsyncOperation(callback) {
  const startCallback = Date.now();
  // giả sử đọc file hết 98ms
  fs.readFile('/path/to/file', callback);
}

const timeoutScheduled = Date.now();

setTimeout(function logInfo() {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);


// đọc file xong sẽ tiếp tục chờ thêm 10ms
someAsyncOperation(function readFileAsync() {
  // chờ 10ms
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});