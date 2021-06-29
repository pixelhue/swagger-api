const swaggerJs = require("./src/swagger.js")
// swagger url 地址
const url = "http://10.131.101.56:8081/bdp_api"
// swagger-resources 可以不传
const resources = "/swagger-resources";

swaggerJs(url, resources);
