# PostgreSQL

* https://www.postgresql.org/
  * PostgreSQL的官網
* https://www.pgadmin.org/
  * PostgreSQL 的前端管理員
* https://node-postgres.com/
  * 套件 pg 的官網


## JSON/JSONB

* https://node-postgres.com/features/types

```js
const createTableText = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TEMP TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB
);
`
// create our temp table
await client.query(createTableText)

const newUser = { email: 'brian.m.carlson@gmail.com' }
// create a new user
await client.query('INSERT INTO users(data) VALUES($1)', [newUser])

const { rows } = await client.query('SELECT * FROM users')

console.log(rows)
/*
output:
[{
  id: 'd70195fd-608e-42dc-b0f5-eee975a621e9',
  data: { email: 'brian.m.carlson@gmail.com' }
}]
*/
```

## 參考文獻
* [再见MongoDB，你好PostgreSQL](http://www.infoq.com/cn/articles/byebye-mongodb-hello-postgresql)
* [超越MongoDB, PostgreSQL引領開發新未來](https://itw01.com/AFXE8IY.html)
* [PostgreSQL中文全文检索](https://www.jianshu.com/p/01631cafe120)
* [使用PostgreSQL进行中文全文检索](http://www.cnblogs.com/zhenbianshu/p/7795247.html)
* [PostgreSQL 入門 : Json、Jsonb 操作](http://lolikitty.pixnet.net/blog/post/205346878-postgresql-%E5%85%A5%E9%96%80-%3A-json%E3%80%81jsonb-%E6%93%8D%E4%BD%9C)
* [PostgreSQL JSON](http://www.postgresqltutorial.com/postgresql-json/)