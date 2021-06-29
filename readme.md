将swagger的接口批量转成js文件

```
  const swaggerJs = require("./src/swagger.js")
  // swagger url 地址
  const url = "**.**.**.**"
  // swagger-resources 可以不传
  const resources = "/swagger-resources";

  swaggerJs(url, resources);
```
TODO: TS
